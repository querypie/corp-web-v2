import type { ChatReply, ChatSource } from "./types";
import { findHermesLinks } from "./markdown";

export class ChatServiceError extends Error {
  constructor(public code: "NOT_CONFIGURED" | "PROVIDER_ERROR" | "INVALID_RESPONSE" | "INCOMPLETE_RESPONSE" | "TIMEOUT", public status: number) { super(code); }
}

export function parseProviderErrorCode(payload: unknown): ChatServiceError["code"] {
  const code = payload && typeof payload === "object" && "error" in payload
    && payload.error && typeof payload.error === "object" && "code" in payload.error
    ? payload.error.code : null;
  if (code === "upstream_incomplete") return "INCOMPLETE_RESPONSE";
  if (code === "upstream_invalid_response") return "INVALID_RESPONSE";
  if (code === "upstream_timeout") return "TIMEOUT";
  return "PROVIDER_ERROR";
}

const maxAnswerLength = 6000;
const maxSources = 8;
export function extractHermesSources(content: string): ChatSource[] {
  return findHermesLinks(content)
    .filter((source, index, sources) => sources.findIndex((candidate) => candidate.url === source.url) === index)
    .slice(0, maxSources);
}

export function parseProviderReply(payload: unknown): ChatReply {
  const value = payload as { choices?: { finish_reason?: unknown; message?: { content?: unknown } }[]; hermes?: unknown } | null;
  type NativeState = { completed?: unknown; partial?: unknown; failed?: unknown; error?: unknown };
  let state: NativeState | null = null;
  if (value && typeof value === "object" && "hermes" in value) {
    state = value.hermes as NativeState | null;
    if (!state || typeof state !== "object" || Array.isArray(state)
      || typeof state.completed !== "boolean" || typeof state.partial !== "boolean" || typeof state.failed !== "boolean"
      || !(state.error === null || typeof state.error === "string")) {
      throw new ChatServiceError("INVALID_RESPONSE", 502);
    }
  }
  const finishReason = value?.choices?.[0]?.finish_reason;
  if (state?.failed || finishReason === "error") throw new ChatServiceError("PROVIDER_ERROR", 502);
  if (state?.partial || finishReason === "length" || finishReason === "tool_calls") throw new ChatServiceError("INCOMPLETE_RESPONSE", 502);
  if (state?.error) throw new ChatServiceError("PROVIDER_ERROR", 502);
  if (state?.completed === false) throw new ChatServiceError("INCOMPLETE_RESPONSE", 502);
  const content = value?.choices?.[0]?.message?.content;
  if (typeof content !== "string" || !content.trim() || content.length > maxAnswerLength) {
    throw new ChatServiceError("INVALID_RESPONSE", 502);
  }
  const answer = content.trim();
  return { answer, sources: extractHermesSources(answer) };
}
