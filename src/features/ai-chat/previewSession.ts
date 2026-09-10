import { isLocale, type Locale } from "@/constants/i18n";
import { isChatSourceUrl, type ChatMessage, type ChatSource } from "./types";

const STORAGE_KEY = "querypie-ai-chat:v1";
export const MAX_MESSAGE_LENGTH = 2000;
export const MAX_PREVIEW_MESSAGES = 20;

export type PreviewMessage = ChatMessage;
export type PreviewSession = { draft: string; messages: PreviewMessage[] };

// Completed conversation history is kept in this tab; the API receives only
// the recent turns needed for the next answer. Old unsent preview sessions are ignored.
export function readPreviewSession(): PreviewSession {
  try {
    const value: unknown = JSON.parse(sessionStorage.getItem(STORAGE_KEY) ?? "null");
    if (value && typeof value === "object" && "draft" in value && "messages" in value) {
      const draft = typeof value.draft === "string" ? value.draft.slice(0, MAX_MESSAGE_LENGTH) : "";
      const messages = Array.isArray(value.messages)
        ? value.messages.filter((message): message is PreviewMessage =>
          message !== null && typeof message === "object" && typeof message.id === "string" &&
          (message.role === "user" || message.role === "assistant") &&
          typeof message.text === "string" && message.text.trim().length > 0 &&
          message.text.length <= (message.role === "user" ? MAX_MESSAGE_LENGTH : 6000) && isLocale(message.locale),
        ).slice(-MAX_PREVIEW_MESSAGES).map((message) => ({
          ...message,
          sources: Array.isArray(message.sources) ? message.sources.filter((source: ChatSource) =>
            source && typeof source.title === "string" && typeof source.url === "string" && isChatSourceUrl(source.url),
          ).slice(0, 8) : [],
        }))
        : [];
      return { draft, messages };
    }
  } catch {
    // Storage may be unavailable or contain an older, invalid session.
  }
  return { draft: "", messages: [] };
}

export function savePreviewSession(session: PreviewSession) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } catch {
    // The chat remains usable in memory when browser storage is unavailable.
  }
}
