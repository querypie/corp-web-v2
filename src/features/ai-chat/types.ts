import type { Locale } from "@/constants/i18n";

export type ChatSource = { title: string; url: string };
export type ChatAnswerStatus = "answered" | "insufficient_evidence" | "out_of_scope";
export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
  locale: Locale;
  sources?: ChatSource[];
  answered?: boolean;
  status?: ChatAnswerStatus;
};
export type ChatReply = {
  answer: string;
  sources: ChatSource[];
  answered: boolean;
  status: ChatAnswerStatus;
};
export type ChatTurn = { role: "user" | "assistant"; content: string };

export function isChatSourceUrl(value: string) {
  if (/^\/(en|ko|ja)(\/|$)/.test(value)) return true;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && !url.username && !url.password && !url.port &&
      [
        "aip-docs.app.querypie.com", "docs.querypie.com", "lingo.querypie.ai",
        "querypie.com", "www.querypie.com", "www-v2.querypie.com", "stage-v2.querypie.com",
      ].includes(url.hostname);
  } catch { return false; }
}

export function isChatReply(value: unknown): value is ChatReply {
  if (!value || typeof value !== "object") return false;
  const reply = value as Partial<ChatReply>;
  return typeof reply.answer === "string" && reply.answer.trim().length > 0 && reply.answer.length <= 6000 &&
    typeof reply.answered === "boolean" &&
    (reply.status === "answered" || reply.status === "insufficient_evidence" || reply.status === "out_of_scope") &&
    reply.answered === (reply.status === "answered") && Array.isArray(reply.sources) && reply.sources.length <= 8 &&
    (reply.status === "answered" || reply.sources.length === 0) &&
    reply.sources.every((source) => source && typeof source.title === "string" &&
      typeof source.url === "string" && isChatSourceUrl(source.url));
}
