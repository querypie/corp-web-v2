import type { Locale } from "@/constants/i18n";
import { isOfficialChatUrl } from "./sources";

export type ChatSource = { title: string; url: string };
export const MAX_SLACK_THREAD_TOKEN_LENGTH = 512;
export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
  locale: Locale;
  sources?: ChatSource[];
  answered?: boolean;
};
export type ChatReply = { answer: string; sources: ChatSource[]; answered: boolean; slackThreadToken?: string };
export type ChatTurn = { role: "user" | "assistant"; content: string };

export function isChatSourceUrl(value: string) {
  return isOfficialChatUrl(value);
}

export function isSlackThreadToken(value: unknown): value is string {
  return typeof value === "string" && value.length > 0 && value.length <= MAX_SLACK_THREAD_TOKEN_LENGTH;
}

export function isChatReply(value: unknown): value is ChatReply {
  if (!value || typeof value !== "object") return false;
  const reply = value as Partial<ChatReply>;
  return typeof reply.answer === "string" && reply.answer.trim().length > 0 && reply.answer.length <= 6000 &&
    typeof reply.answered === "boolean" && Array.isArray(reply.sources) && reply.sources.length <= 8 &&
    reply.sources.every((source) => source && typeof source.title === "string" &&
      typeof source.url === "string" && isChatSourceUrl(source.url));
}
