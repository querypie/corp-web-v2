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

export type BrowserChatRequest = {
  transport: "browser";
  endpoint: string;
  body: {
    model: string;
    max_tokens: number;
    temperature: number;
    response_format: { type: "json_object" };
    messages: { role: string; content: string }[];
  };
  references: (ChatSource & { id: string })[];
};

export function isBrowserChatRequest(value: unknown): value is BrowserChatRequest {
  if (!value || typeof value !== "object") return false;
  const request = value as Partial<BrowserChatRequest>;
  return request.transport === "browser" && request.endpoint === "https://internal-llm.querypie.io/v1/chat/completions" &&
    !!request.body && typeof request.body.model === "string" && request.body.model.length <= 100 &&
    request.body.max_tokens === 4096 && request.body.response_format?.type === "json_object" &&
    Array.isArray(request.body.messages) && request.body.messages.length <= 10 &&
    request.body.messages.every((message) => message && ["system", "user", "assistant"].includes(message.role) &&
      typeof message.content === "string" && message.content.length <= 30000) &&
    Array.isArray(request.references) && request.references.length <= 8 && request.references.every((source) =>
      source && typeof source.id === "string" && typeof source.title === "string" &&
      typeof source.url === "string" && isChatSourceUrl(source.url));
}

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
