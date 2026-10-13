import type { ChatReply, ChatSource } from "./types";
import { findHermesLinks } from "./markdown";

export class ChatServiceError extends Error {
  constructor(public code: "NOT_CONFIGURED" | "PROVIDER_ERROR" | "INVALID_RESPONSE", public status: number) { super(code); }
}

const maxAnswerLength = 6000;
const maxSources = 8;
export function extractHermesSources(content: string): ChatSource[] {
  return findHermesLinks(content)
    .filter((source, index, sources) => sources.findIndex((candidate) => candidate.url === source.url) === index)
    .slice(0, maxSources);
}

export function parseProviderReply(payload: unknown): ChatReply {
  const value = payload as { choices?: { message?: { content?: unknown } }[] } | null;
  const content = value?.choices?.[0]?.message?.content;
  if (typeof content !== "string" || !content.trim() || content.length > maxAnswerLength) {
    throw new ChatServiceError("INVALID_RESPONSE", 502);
  }
  const answer = content.trim();
  return { answer, sources: extractHermesSources(answer) };
}
