import "server-only";
import { getAiChatConfig } from "@/features/ai/config.server";
import { safeErrorInfo, safeResponseInfo } from "./diagnostics.server";
import type { AiChatProbeResult, AiChatStatusConfig } from "./status";

const samplePrompt = "Reply with exactly OK and no other text.";
const maxAnswerLength = 2000;

type ProviderPayload = {
  choices?: {
    finish_reason?: unknown;
    message?: { content?: unknown };
  }[];
};

function isProviderPayload(value: unknown): value is ProviderPayload {
  return !!value && typeof value === "object" && (!("choices" in value) || Array.isArray((value as { choices?: unknown }).choices));
}

export function getAiChatStatusConfig(): AiChatStatusConfig {
  const config = getAiChatConfig();
  return {
    enabled: config.enabled,
    keyConfigured: config.apiKey.length > 0,
    baseUrl: config.baseUrl,
    model: config.model,
    samplePrompt,
    environment: process.env.VERCEL_TARGET_ENV ?? process.env.VERCEL_ENV ?? "development",
  };
}

function baseResult(started: number): Omit<AiChatProbeResult, "ok" | "code"> {
  return {
    checkedAt: new Date().toISOString(),
    durationMs: Date.now() - started,
    upstreamStatus: null,
    responseType: null,
    responseServer: null,
    answer: null,
    finishReason: null,
  };
}

function networkCode(error: unknown) {
  const info = safeErrorInfo(error);
  return info.code ?? info.causeCode;
}

function isTimeout(error: unknown) {
  return error instanceof Error && (error.name === "TimeoutError" || error.name === "AbortError");
}

function boundedAnswer(value: unknown) {
  return typeof value === "string" ? value.slice(0, maxAnswerLength) : null;
}

export async function probeAiChat(signal: AbortSignal): Promise<AiChatProbeResult> {
  const started = Date.now();
  const config = getAiChatConfig();
  if (!config.enabled) return { ...baseResult(started), ok: false, code: "DISABLED" };
  if (!config.apiKey) return { ...baseResult(started), ok: false, code: "NOT_CONFIGURED" };

  let response: Response;
  try {
    response = await fetch(`${config.baseUrl}/chat/completions`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${config.apiKey}` },
      signal,
      cache: "no-store",
      body: JSON.stringify({
        model: config.model,
        reasoning_effort: "low",
        max_tokens: 512,
        temperature: 0,
        messages: [{ role: "user", content: samplePrompt }],
      }),
    });
  } catch (cause) {
    return {
      ...baseResult(started),
      ok: false,
      code: isTimeout(cause) ? "TIMEOUT" : "NETWORK_ERROR",
      networkCode: networkCode(cause),
    };
  }

  const responseInfo = safeResponseInfo(response);
  if (!response.ok) {
    return {
      ...baseResult(started),
      ok: false,
      upstreamStatus: response.status,
      responseType: responseInfo.contentType ?? null,
      responseServer: responseInfo.server ?? null,
      code: "UPSTREAM_HTTP_ERROR",
    };
  }

  let payload: ProviderPayload;
  try {
    const decoded: unknown = await response.json();
    if (!isProviderPayload(decoded)) throw new Error("Invalid provider payload");
    payload = decoded;
  } catch (cause) {
    return {
      ...baseResult(started),
      ok: false,
      upstreamStatus: response.status,
      responseType: responseInfo.contentType ?? null,
      responseServer: responseInfo.server ?? null,
      code: isTimeout(cause) ? "TIMEOUT" : "INVALID_RESPONSE",
    };
  }

  const choice = payload.choices?.[0];
  const answer = boundedAnswer(choice?.message?.content);
  const finishReason = typeof choice?.finish_reason === "string" ? choice.finish_reason : null;
  const valid = answer?.trim() === "OK" && finishReason === "stop";
  return {
    ...baseResult(started),
    ok: valid,
    upstreamStatus: response.status,
    responseType: responseInfo.contentType ?? null,
    responseServer: responseInfo.server ?? null,
    answer,
    finishReason,
    code: valid ? "OK" : "INVALID_RESPONSE",
  };
}
