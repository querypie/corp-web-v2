import { isLocale, type Locale } from "@/constants/i18n";
import { MAX_CHAT_MESSAGES, isChatSourceUrl, isSlackThreadToken, isConversationToken, isChatTurnId, type ChatMessage, type ChatSource } from "./types";

const STORAGE_KEY = "querypie-ai-chat:v1";
export const MAX_MESSAGE_LENGTH = 2000;
export const MAX_PREVIEW_MESSAGES = MAX_CHAT_MESSAGES;

export type PreviewMessage = ChatMessage;
export type PreviewSession = {
  draft: string; messages: PreviewMessage[]; slackThreadToken?: string; conversationToken?: string;
  pendingTurn?: { id: string; text: string; locale: Locale };
};

// Messages restore this tab's display; Hermes owns the conversation history.
// A pending turn survives navigation so a retry keeps its idempotency key.
export function readPreviewSession(): PreviewSession {
  try {
    const value: unknown = JSON.parse(sessionStorage.getItem(STORAGE_KEY) ?? "null");
    if (value && typeof value === "object" && "draft" in value && "messages" in value) {
      const session = value as { draft?: unknown; messages?: unknown; slackThreadToken?: unknown; conversationToken?: unknown; pendingTurn?: unknown };
      const draft = typeof value.draft === "string" ? value.draft.slice(0, MAX_MESSAGE_LENGTH) : "";
      // Legacy histories have no independently addressable Native session.
      if (!isConversationToken(session.conversationToken)) return { draft, messages: [] };
      const messages = Array.isArray(value.messages)
        ? value.messages.filter((message): message is PreviewMessage =>
          message !== null && typeof message === "object" && typeof message.id === "string" &&
          (message.role === "user" || message.role === "assistant") &&
          typeof message.text === "string" && message.text.trim().length > 0 &&
          message.text.length <= (message.role === "user" ? MAX_MESSAGE_LENGTH : 6000) && isLocale(message.locale),
        ).slice(-MAX_PREVIEW_MESSAGES).map((message) => ({
          id: message.id,
          role: message.role,
          text: message.text,
          locale: message.locale,
          sources: Array.isArray(message.sources) ? message.sources.filter((source: ChatSource) =>
            source && typeof source.title === "string" && typeof source.url === "string" && isChatSourceUrl(source.url),
          ).slice(0, 8) : [],
        }))
        : [];
      const restored: PreviewSession = { draft, messages, conversationToken: session.conversationToken };
      if (isSlackThreadToken(session.slackThreadToken)) restored.slackThreadToken = session.slackThreadToken;
      const pending = session.pendingTurn as Partial<NonNullable<PreviewSession["pendingTurn"]>> | undefined;
      if (pending && isChatTurnId(pending.id) && typeof pending.text === "string" && pending.text.length > 0 &&
        pending.text.length <= MAX_MESSAGE_LENGTH && typeof pending.locale === "string" && isLocale(pending.locale)) {
        restored.pendingTurn = { id: pending.id, text: pending.text, locale: pending.locale };
      }
      return restored;
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
