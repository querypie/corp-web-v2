import type { Locale } from "@/constants/i18n";

export type ChatSource = { title: string; url: string };
export const MAX_SLACK_THREAD_TOKEN_LENGTH = 512;
export const MAX_CHAT_MESSAGES = 20;
export const MAX_CHAT_REQUEST_BYTES = 128_000;
export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
  locale: Locale;
  sources?: ChatSource[];
};
export type ChatReply = { answer: string; sources: ChatSource[]; slackThreadToken?: string };
export type ChatTurn = { role: "user" | "assistant"; content: string };

export function isChatSourceUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function isSlackThreadToken(value: unknown): value is string {
  return typeof value === "string" && value.length > 0 && value.length <= MAX_SLACK_THREAD_TOKEN_LENGTH;
}

export function isChatReply(value: unknown): value is ChatReply {
  if (!value || typeof value !== "object") return false;
  const reply = value as Partial<ChatReply>;
  return typeof reply.answer === "string" && reply.answer.trim().length > 0 && reply.answer.length <= 6000 &&
    Array.isArray(reply.sources) && reply.sources.length <= 8 &&
    reply.sources.every((source) => source && typeof source.title === "string" &&
      typeof source.url === "string" && isChatSourceUrl(source.url));
}
