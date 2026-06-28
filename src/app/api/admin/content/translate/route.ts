import { NextResponse } from "next/server";
import { isLocale, type Locale } from "@/constants/i18n";
import {
  collectTranslatableTextRefs,
  localeDisplayNames,
  parseTiptapJson,
  type TranslationErrorCode,
} from "@/features/content/translation/tiptap";

type TranslateRequest = {
  bodyRichText?: string;
  locale?: string;
  summary?: string;
  title?: string;
};

type TranslationErrorPayload = {
  code: TranslationErrorCode;
  detail?: string;
  error: string;
};

const MAX_TRANSLATION_CHARACTERS = 60000;
const DEFAULT_TRANSLATION_CHUNK_CHARACTERS = 3000;
const DEFAULT_TRANSLATION_CHUNK_ITEMS = 80;
const DEFAULT_TRANSLATION_PROVIDER_ATTEMPT_TIMEOUT_MS = 60000;
const DEFAULT_TRANSLATION_CHUNK_CONCURRENCY = 1;
const TRANSLATION_PROVIDER_MAX_ATTEMPTS = 3;
const TRANSLATION_PROVIDER_RETRY_DELAY_MS = 700;
const DEFAULT_TRANSLATION_PROVIDER_MAX_OUTPUT_TOKENS = 16000;

function jsonError(
  code: TranslationErrorCode,
  error: string,
  status: number,
  detail?: string,
) {
  return NextResponse.json(
    { code, detail, error } satisfies TranslationErrorPayload,
    { status },
  );
}

function getTargetLanguage(locale: Locale) {
  if (locale === "en") return "English";
  if (locale === "ja") return "Japanese";
  return "Korean";
}

function getPositiveIntegerEnv(name: string, fallback: number) {
  const configuredValue = Number(process.env[name]);

  if (Number.isFinite(configuredValue) && configuredValue > 0) {
    return Math.floor(configuredValue);
  }

  return fallback;
}

function isAbortError(error: unknown) {
  return error instanceof Error && error.name === "AbortError";
}

async function fetchWithTimeout(
  input: RequestInfo | URL,
  init: RequestInit,
  timeoutMs: number,
) {
  const timeoutController = new AbortController();
  let didTimeout = false;
  const timeout = setTimeout(() => {
    didTimeout = true;
    timeoutController.abort();
  }, timeoutMs);
  const parentSignal = init.signal;
  const abortFromParent = () => timeoutController.abort();

  parentSignal?.addEventListener("abort", abortFromParent, { once: true });

  try {
    return await fetch(input, {
      ...init,
      signal: timeoutController.signal,
    });
  } catch (error) {
    if (didTimeout && isAbortError(error)) {
      throw Object.assign(new Error("Translation provider request timed out."), {
        detail: `Provider did not respond within ${Math.round(timeoutMs / 1000)} seconds.`,
        translationCode: "PROVIDER_ERROR" satisfies TranslationErrorCode,
      });
    }

    throw error;
  } finally {
    clearTimeout(timeout);
    parentSignal?.removeEventListener("abort", abortFromParent);
  }
}

function sleep(ms: number, signal: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    if (signal.aborted) {
      reject(Object.assign(new Error("Translation request was aborted."), {
        translationCode: "REQUEST_ABORTED" satisfies TranslationErrorCode,
      }));
      return;
    }

    const timeout = setTimeout(() => {
      signal.removeEventListener("abort", abort);
      resolve();
    }, ms);

    const abort = () => {
      clearTimeout(timeout);
      reject(Object.assign(new Error("Translation request was aborted."), {
        translationCode: "REQUEST_ABORTED" satisfies TranslationErrorCode,
      }));
    };

    signal.addEventListener("abort", abort, { once: true });
  });
}

function getTranslationCode(error: unknown): TranslationErrorCode {
  if (isAbortError(error)) {
    return "REQUEST_ABORTED";
  }

  return (error as { translationCode?: TranslationErrorCode } | null)?.translationCode ?? "UNKNOWN";
}

function isRetryableProviderError(code: TranslationErrorCode) {
  return code === "PROVIDER_ERROR" || code === "INVALID_RESPONSE" || code === "NETWORK_ERROR" || code === "UNKNOWN";
}

async function retryProviderTranslation(
  runAttempt: () => Promise<string[]>,
  context: { locale: Locale; model: string; provider: string; textCount: number },
  signal: AbortSignal,
) {
  const attemptDetails: string[] = [];

  for (let attempt = 1; attempt <= TRANSLATION_PROVIDER_MAX_ATTEMPTS; attempt += 1) {
    try {
      return await runAttempt();
    } catch (error) {
      const code = getTranslationCode(error);
      const message = error instanceof Error ? error.message : "Unknown error";
      const detail = (error as { detail?: string } | null)?.detail;
      attemptDetails.push(
        `시도 ${attempt}/${TRANSLATION_PROVIDER_MAX_ATTEMPTS}: ${code} - ${detail || message}`,
      );

      if (!isRetryableProviderError(code) || attempt === TRANSLATION_PROVIDER_MAX_ATTEMPTS) {
        throw Object.assign(error instanceof Error ? error : new Error(message), {
          detail: [
            `provider=${context.provider}`,
            `model=${context.model}`,
            `target=${localeDisplayNames[context.locale]}`,
            `texts=${context.textCount}`,
            ...attemptDetails,
          ].join("\n"),
          translationCode: code,
        });
      }

      await sleep(TRANSLATION_PROVIDER_RETRY_DELAY_MS, signal);
    }
  }

  throw Object.assign(new Error("Translation provider failed after retries."), {
    detail: attemptDetails.join("\n"),
    translationCode: "PROVIDER_ERROR" satisfies TranslationErrorCode,
  });
}

function extractOpenAIChoice(payload: unknown) {
  const choices = (payload as { choices?: Array<{ finish_reason?: string; message?: { content?: string } }> }).choices;
  const choice = choices?.[0];

  return {
    finishReason: choice?.finish_reason,
    text: choice?.message?.content ?? "",
  };
}

function extractAnthropicText(payload: unknown) {
  const content = (payload as { content?: Array<{ text?: string; type?: string }> }).content;
  return content?.find((item) => item.type === "text" || typeof item.text === "string")?.text ?? "";
}

function parseTranslations(value: string, expectedLength: number) {
  const trimmedValue = value.trim();
  const jsonValue = extractJsonObject(trimmedValue);

  try {
    const parsed = JSON.parse(jsonValue) as {
      outputFormat?: { translations?: unknown };
      translations?: unknown;
    };
    const translations = parsed.translations ?? parsed.outputFormat?.translations;

    if (!Array.isArray(translations) || translations.length !== expectedLength) {
      return null;
    }

    if (!translations.every((item) => typeof item === "string")) {
      return null;
    }

    return translations as string[];
  } catch {
    return null;
  }
}

function extractJsonObject(value: string) {
  const fencedMatch = value.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);

  if (fencedMatch?.[1]) {
    return fencedMatch[1].trim();
  }

  const firstBrace = value.indexOf("{");
  const lastBrace = value.lastIndexOf("}");

  if (firstBrace >= 0 && lastBrace > firstBrace) {
    return value.slice(firstBrace, lastBrace + 1);
  }

  return value;
}

function createTranslationMessages(texts: string[], locale: Locale) {
  return [
    {
      content:
        "You translate CMS content. Return strict JSON only. Preserve product names, URLs, code, placeholders, and markdown-like tokens. Do not add commentary.",
      role: "system",
    },
    {
      content: JSON.stringify({
        outputFormat: { translations: ["translated text in the same order"] },
        targetLanguage: getTargetLanguage(locale),
        texts,
      }),
      role: "user",
    },
  ];
}

function getTranslationProviderMaxOutputTokens() {
  return getPositiveIntegerEnv(
    "TRANSLATION_PROVIDER_MAX_OUTPUT_TOKENS",
    DEFAULT_TRANSLATION_PROVIDER_MAX_OUTPUT_TOKENS,
  );
}

function getTranslationProviderAttemptTimeoutMs() {
  return getPositiveIntegerEnv(
    "TRANSLATION_PROVIDER_ATTEMPT_TIMEOUT_MS",
    DEFAULT_TRANSLATION_PROVIDER_ATTEMPT_TIMEOUT_MS,
  );
}

function getTranslationChunkCharacters() {
  return getPositiveIntegerEnv(
    "TRANSLATION_CHUNK_CHARACTERS",
    DEFAULT_TRANSLATION_CHUNK_CHARACTERS,
  );
}

function getTranslationChunkItems() {
  return getPositiveIntegerEnv(
    "TRANSLATION_CHUNK_ITEMS",
    DEFAULT_TRANSLATION_CHUNK_ITEMS,
  );
}

function getTranslationChunkConcurrency() {
  return getPositiveIntegerEnv(
    "TRANSLATION_CHUNK_CONCURRENCY",
    DEFAULT_TRANSLATION_CHUNK_CONCURRENCY,
  );
}

async function callOpenAICompatibleTranslation(
  endpoint: string,
  token: string,
  model: string,
  texts: string[],
  locale: Locale,
  signal: AbortSignal,
  useResponseFormat: boolean,
  provider: string,
) {
  return retryProviderTranslation(
    async () => {
      const response = await fetchWithTimeout(endpoint, {
        body: JSON.stringify({
          max_tokens: getTranslationProviderMaxOutputTokens(),
          messages: createTranslationMessages(texts, locale),
          model,
          ...(useResponseFormat ? { response_format: { type: "json_object" } } : {}),
          temperature: 0.2,
        }),
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        signal,
      }, getTranslationProviderAttemptTimeoutMs());

      const payload = (await response.json().catch(() => ({}))) as unknown;

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          throw Object.assign(new Error("Translation provider authorization failed."), {
            translationCode: "UNAUTHORIZED" satisfies TranslationErrorCode,
          });
        }

        if (response.status === 429) {
          throw Object.assign(new Error("Translation provider rate limit exceeded."), {
            translationCode: "RATE_LIMITED" satisfies TranslationErrorCode,
          });
        }

        throw Object.assign(new Error(`Translation provider failed with HTTP ${response.status}.`), {
          detail: JSON.stringify(payload).slice(0, 500),
          translationCode: "PROVIDER_ERROR" satisfies TranslationErrorCode,
        });
      }

      const providerChoice = extractOpenAIChoice(payload);
      return parseProviderTranslations(providerChoice.text, texts.length, providerChoice.finishReason);
    },
    {
      locale,
      model,
      provider,
      textCount: texts.length,
    },
    signal,
  );
}

async function callOpenAITranslation(texts: string[], locale: Locale, signal: AbortSignal) {
  const model = process.env.OPENAI_TRANSLATION_MODEL ?? "gpt-4o-mini";

  return callOpenAICompatibleTranslation(
    "https://api.openai.com/v1/chat/completions",
    process.env.OPENAI_API_KEY ?? "",
    model,
    texts,
    locale,
    signal,
    true,
    "OpenAI",
  );
}

async function callGlmTranslation(texts: string[], locale: Locale, signal: AbortSignal) {
  const baseUrl = process.env.ANTHROPIC_BASE_URL?.replace(/\/$/, "");
  const token = process.env.ANTHROPIC_AUTH_TOKEN || process.env.ANTHROPIC_API_KEY;

  if (!baseUrl || !token) {
    throw Object.assign(new Error("GLM translation provider is not configured."), {
      translationCode: "CONFIGURATION_ERROR" satisfies TranslationErrorCode,
    });
  }

  const model = process.env.ANTHROPIC_TRANSLATION_MODEL ?? process.env.ANTHROPIC_MODEL ?? "glm-5.2-fp8";

  return callOpenAICompatibleTranslation(
    `${baseUrl}/v1/chat/completions`,
    token,
    model,
    texts,
    locale,
    signal,
    false,
    "GLM-compatible",
  );
}

async function callAnthropicTranslation(texts: string[], locale: Locale, signal: AbortSignal) {
  const baseUrl = process.env.ANTHROPIC_BASE_URL?.replace(/\/$/, "");
  const token = process.env.ANTHROPIC_AUTH_TOKEN || process.env.ANTHROPIC_API_KEY;

  if (!baseUrl || !token) {
    throw Object.assign(new Error("Anthropic-compatible translation provider is not configured."), {
      translationCode: "CONFIGURATION_ERROR" satisfies TranslationErrorCode,
    });
  }

  const model = process.env.ANTHROPIC_TRANSLATION_MODEL ?? process.env.ANTHROPIC_MODEL ?? "glm-5.2-fp8";

  return retryProviderTranslation(
    async () => {
      const response = await fetchWithTimeout(`${baseUrl}/v1/messages`, {
        body: JSON.stringify({
          max_tokens: getTranslationProviderMaxOutputTokens(),
          messages: [
            {
              content: JSON.stringify({
                outputFormat: { translations: ["translated text in the same order"] },
                targetLanguage: getTargetLanguage(locale),
                texts,
              }),
              role: "user",
            },
          ],
          model,
          system:
            "You translate CMS content. Return strict JSON only. Preserve product names, URLs, code, placeholders, and markdown-like tokens. Do not add commentary.",
          temperature: 0.2,
        }),
        headers: {
          "Content-Type": "application/json",
          "x-api-key": token,
          Authorization: `Bearer ${token}`,
          "anthropic-version": "2023-06-01",
        },
        method: "POST",
        signal,
      }, getTranslationProviderAttemptTimeoutMs());

      const payload = (await response.json().catch(() => ({}))) as unknown;

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          throw Object.assign(new Error("Translation provider authorization failed."), {
            translationCode: "UNAUTHORIZED" satisfies TranslationErrorCode,
          });
        }

        if (response.status === 429) {
          throw Object.assign(new Error("Translation provider rate limit exceeded."), {
            translationCode: "RATE_LIMITED" satisfies TranslationErrorCode,
          });
        }

        throw Object.assign(new Error(`Translation provider failed with HTTP ${response.status}.`), {
          detail: JSON.stringify(payload).slice(0, 500),
          translationCode: "PROVIDER_ERROR" satisfies TranslationErrorCode,
        });
      }

      const providerText = extractAnthropicText(payload);
      return parseProviderTranslations(providerText, texts.length);
    },
    {
      locale,
      model,
      provider: "Anthropic-compatible",
      textCount: texts.length,
    },
    signal,
  );
}

function parseProviderTranslations(providerText: string, expectedLength: number, finishReason?: string) {
  const translations = parseTranslations(providerText, expectedLength);

  if (!translations) {
    throw Object.assign(new Error("Translation provider returned an invalid response."), {
      detail: [
        finishReason ? `finish_reason=${finishReason}` : null,
        `response=${providerText.slice(0, 500)}`,
      ].filter(Boolean).join("\n"),
      translationCode: "INVALID_RESPONSE" satisfies TranslationErrorCode,
    });
  }

  return translations;
}

function chunkTexts(texts: string[]) {
  const chunks: string[][] = [];
  let currentChunk: string[] = [];
  let currentCharacters = 0;
  const chunkCharacters = getTranslationChunkCharacters();
  const chunkItems = getTranslationChunkItems();

  for (const text of texts) {
    const shouldStartNextChunk =
      currentChunk.length > 0 &&
      (
        currentChunk.length >= chunkItems ||
        currentCharacters + text.length > chunkCharacters
      );

    if (shouldStartNextChunk) {
      chunks.push(currentChunk);
      currentChunk = [];
      currentCharacters = 0;
    }

    currentChunk.push(text);
    currentCharacters += text.length;
  }

  if (currentChunk.length > 0) {
    chunks.push(currentChunk);
  }

  return chunks;
}

async function translateChunks(
  chunks: string[][],
  translateChunk: (chunk: string[]) => Promise<string[]>,
) {
  const translatedChunks: string[][] = Array.from({ length: chunks.length });
  let nextIndex = 0;
  const workerCount = Math.min(getTranslationChunkConcurrency(), chunks.length);

  async function runWorker() {
    while (nextIndex < chunks.length) {
      const index = nextIndex;
      nextIndex += 1;
      const chunk = chunks[index];

      try {
        translatedChunks[index] = await translateChunk(chunk);
      } catch (error) {
        throw Object.assign(error instanceof Error ? error : new Error("Translation chunk failed."), {
          detail: [
            `chunk=${index + 1}/${chunks.length}`,
            (error as { detail?: string } | null)?.detail,
          ].filter(Boolean).join("\n"),
          translationCode: getTranslationCode(error),
        });
      }
    }
  }

  await Promise.all(Array.from({ length: workerCount }, () => runWorker()));
  return translatedChunks.flat();
}

async function translateTexts(texts: string[], locale: Locale, signal: AbortSignal) {
  if (texts.length === 0) {
    return [];
  }

  const chunks = chunkTexts(texts);

  if (process.env.ANTHROPIC_BASE_URL) {
    return translateChunks(chunks, (chunk) => callGlmTranslation(chunk, locale, signal));
  }

  if (process.env.OPENAI_API_KEY) {
    return translateChunks(chunks, (chunk) => callOpenAITranslation(chunk, locale, signal));
  }

  throw Object.assign(new Error("Translation provider is not configured."), {
    translationCode: "CONFIGURATION_ERROR" satisfies TranslationErrorCode,
  });
}

function getErrorCode(error: unknown): TranslationErrorCode {
  if (isAbortError(error)) {
    return "REQUEST_ABORTED";
  }

  const code = (error as { translationCode?: TranslationErrorCode } | null)?.translationCode;
  return code ?? "UNKNOWN";
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as TranslateRequest;
    const locale = payload.locale;

    if (!locale || !isLocale(locale)) {
      return jsonError("INVALID_RESPONSE", "지원하지 않는 언어입니다.", 400);
    }

    const parsedBody = parseTiptapJson(payload.bodyRichText ?? "");
    const bodyRefs = parsedBody ? collectTranslatableTextRefs(parsedBody) : [];
    const texts = [
      payload.title?.trim() ? payload.title : null,
      payload.summary?.trim() ? payload.summary : null,
      ...bodyRefs.map((ref) => ref.text),
    ].filter((text): text is string => Boolean(text?.trim()));

    if (texts.length === 0) {
      return jsonError("EMPTY_CONTENT", "번역할 제목, 요약, 본문이 없습니다.", 400);
    }

    const totalCharacters = texts.reduce((sum, text) => sum + text.length, 0);

    if (totalCharacters > MAX_TRANSLATION_CHARACTERS) {
      return jsonError(
        "CONTENT_TOO_LONG",
        "본문이 너무 길어 한 번에 번역할 수 없습니다.",
        413,
      );
    }

    const translations = await translateTexts(texts, locale, request.signal);
    let index = 0;
    const translatedTitle = payload.title?.trim() ? translations[index++] : payload.title ?? "";
    const translatedSummary = payload.summary?.trim() ? translations[index++] : payload.summary ?? "";

    for (const ref of bodyRefs) {
      ref.update(translations[index++] ?? ref.text);
    }

    return NextResponse.json({
      bodyRichText: parsedBody ? JSON.stringify(parsedBody) : payload.bodyRichText ?? "",
      locale,
      message: `${localeDisplayNames[locale]} 번역이 완료되었습니다. 저장하려면 저장 버튼을 누르세요.`,
      summary: translatedSummary,
      title: translatedTitle,
    });
  } catch (error) {
    const code = getErrorCode(error);

    if (code === "REQUEST_ABORTED") {
      return jsonError(code, "번역이 취소되었습니다.", 499);
    }

    if (code === "CONFIGURATION_ERROR") {
      return jsonError(code, "번역 API 설정이 없습니다.", 503);
    }

    if (code === "UNAUTHORIZED") {
      return jsonError(code, "번역 권한이 없습니다.", 401);
    }

    if (code === "RATE_LIMITED") {
      return jsonError(code, "현재 번역 요청이 많아 처리하지 못했습니다.", 429);
    }

    if (code === "INVALID_RESPONSE") {
      return jsonError(
        code,
        "번역 결과를 적용하지 못했습니다.",
        502,
        (error as { detail?: string }).detail,
      );
    }

    if (code === "PROVIDER_ERROR") {
      return jsonError(
        code,
        "번역 서버에서 오류가 발생했습니다.",
        502,
        (error as { detail?: string }).detail,
      );
    }

    return jsonError("NETWORK_ERROR", "서버에 연결하지 못했습니다.", 500);
  }
}
