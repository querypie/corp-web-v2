import type { Locale } from "@/constants/i18n";

export type ChatSource = { title: string; url: string };
export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
  locale: Locale;
  sources?: ChatSource[];
  answered?: boolean;
};
export type ChatReply = { answer: string; sources: ChatSource[]; answered: boolean };
export type ChatTurn = { role: "user" | "assistant"; content: string };

export function isChatSourceUrl(value: string) {
  if (/^\/(en|ko|ja)(\/|$)/.test(value)) return true;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && !url.username && !url.password && !url.port &&
      ["aip-docs.app.querypie.com", "docs.querypie.com", "lingo.querypie.ai"].includes(url.hostname);
  } catch { return false; }
}

export function isChatReply(value: unknown): value is ChatReply {
  if (!value || typeof value !== "object") return false;
  const reply = value as Partial<ChatReply>;
  return typeof reply.answer === "string" && reply.answer.trim().length > 0 && reply.answer.length <= 6000 &&
    typeof reply.answered === "boolean" && Array.isArray(reply.sources) && reply.sources.length <= 8 &&
    reply.sources.every((source) => source && typeof source.title === "string" &&
      typeof source.url === "string" && isChatSourceUrl(source.url));
}
