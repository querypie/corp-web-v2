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
const MAX_TRANSLATION_CHUNK_CHARACTERS = 6000;
const MAX_TRANSLATION_CHUNK_ITEMS = 20;

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

function isAbortError(error: unknown) {
  return error instanceof Error && error.name === "AbortError";
}

function extractOpenAIText(payload: unknown) {
  const choices = (payload as { choices?: Array<{ message?: { content?: string } }> }).choices;
  return choices?.[0]?.message?.content ?? "";
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

async function callOpenAICompatibleTranslation(
  endpoint: string,
  token: string,
  model: string,
  texts: string[],
  locale: Locale,
  signal: AbortSignal,
  useResponseFormat: boolean,
) {
  const response = await fetch(endpoint, {
    body: JSON.stringify({
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
  });

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

    throw Object.assign(new Error("Translation provider failed."), {
      detail: JSON.stringify(payload).slice(0, 500),
      translationCode: "PROVIDER_ERROR" satisfies TranslationErrorCode,
    });
  }

  const providerText = extractOpenAIText(payload);
  return parseProviderTranslations(providerText, texts.length);
}

async function callOpenAITranslation(texts: string[], locale: Locale, signal: AbortSignal) {
  return callOpenAICompatibleTranslation(
    "https://api.openai.com/v1/chat/completions",
    process.env.OPENAI_API_KEY ?? "",
    process.env.OPENAI_TRANSLATION_MODEL ?? "gpt-4o-mini",
    texts,
    locale,
    signal,
    true,
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

  return callOpenAICompatibleTranslation(
    `${baseUrl}/v1/chat/completions`,
    token,
    process.env.ANTHROPIC_TRANSLATION_MODEL ?? process.env.ANTHROPIC_MODEL ?? "glm-5.2-fp8",
    texts,
    locale,
    signal,
    false,
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

  const response = await fetch(`${baseUrl}/v1/messages`, {
    body: JSON.stringify({
      max_tokens: 8192,
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
      model: process.env.ANTHROPIC_TRANSLATION_MODEL ?? process.env.ANTHROPIC_MODEL ?? "glm-5.2-fp8",
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
  });

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

    throw Object.assign(new Error("Translation provider failed."), {
      detail: JSON.stringify(payload).slice(0, 500),
      translationCode: "PROVIDER_ERROR" satisfies TranslationErrorCode,
    });
  }

  const providerText = extractAnthropicText(payload);
  return parseProviderTranslations(providerText, texts.length);
}

function parseProviderTranslations(providerText: string, expectedLength: number) {
  const translations = parseTranslations(providerText, expectedLength);

  if (!translations) {
    throw Object.assign(new Error("Translation provider returned an invalid response."), {
      detail: providerText.slice(0, 500),
      translationCode: "INVALID_RESPONSE" satisfies TranslationErrorCode,
    });
  }

  return translations;
}

function chunkTexts(texts: string[]) {
  const chunks: string[][] = [];
  let currentChunk: string[] = [];
  let currentCharacters = 0;

  for (const text of texts) {
    const shouldStartNextChunk =
      currentChunk.length > 0 &&
      (
        currentChunk.length >= MAX_TRANSLATION_CHUNK_ITEMS ||
        currentCharacters + text.length > MAX_TRANSLATION_CHUNK_CHARACTERS
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

async function translateTexts(texts: string[], locale: Locale, signal: AbortSignal) {
  if (texts.length === 0) {
    return [];
  }

  const chunks = chunkTexts(texts);
  const translatedChunks: string[][] = [];

  if (process.env.ANTHROPIC_BASE_URL) {
    for (const chunk of chunks) {
      translatedChunks.push(await callGlmTranslation(chunk, locale, signal));
    }
    return translatedChunks.flat();
  }

  if (process.env.OPENAI_API_KEY) {
    for (const chunk of chunks) {
      translatedChunks.push(await callOpenAITranslation(chunk, locale, signal));
    }
    return translatedChunks.flat();
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
