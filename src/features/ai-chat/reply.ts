import { isChatSourceUrl, type ChatAnswerStatus, type ChatReply, type ChatSource } from "./types";

export type EvidenceReference = ChatSource & { id: string; publicSource?: boolean };

export class ChatServiceError extends Error {
  constructor(public code: "NOT_CONFIGURED" | "PROVIDER_ERROR" | "INVALID_RESPONSE", public status: number) { super(code); }
}

export function parseGroundedAnswer(content: string, references: EvidenceReference[]): ChatReply {
  // Only a validated final JSON answer is shown, never raw provider reasoning.
  const starts = [...content.matchAll(/\{/g)].map((match) => match.index!);
  for (const start of starts.reverse()) {
    try {
      const result: unknown = JSON.parse(content.slice(start, content.lastIndexOf("}") + 1));
      if (!result || typeof result !== "object") continue;
      const value = result as { answer?: unknown; sourceIds?: unknown; status?: unknown };
      if (typeof value.answer !== "string" || !value.answer.trim() || value.answer.length > 6000 ||
          !isAnswerStatus(value.status) || !Array.isArray(value.sourceIds)) continue;
      const sourceIds = value.sourceIds;
      const cited = references.filter((source) => sourceIds.includes(source.id) &&
        (source.publicSource === false || isChatSourceUrl(source.url)));
      if (value.status === "answered" && cited.length === 0) continue;
      // Non-answer text is replaced with a localized fixed reply by the service.
      // Discard any source IDs the model attached instead of turning a safe
      // refusal into a user-visible 502 response.
      const sources = (value.status === "answered" ? cited : [])
        .filter((source) => source.publicSource !== false && isChatSourceUrl(source.url))
        .filter((source, index, visible) => visible.findIndex((other) => other.url === source.url) === index)
        .map(({ title, url }) => ({ title, url }));
      return { answer: value.answer.trim(), sources, answered: value.status === "answered", status: value.status };
    } catch { /* Try another JSON candidate; never return unparsed content. */ }
  }
  throw new ChatServiceError("INVALID_RESPONSE", 502);
}

function isAnswerStatus(value: unknown): value is ChatAnswerStatus {
  return value === "answered" || value === "insufficient_evidence" || value === "out_of_scope";
}

export function parseProviderReply(payload: unknown, references: EvidenceReference[]): ChatReply {
  const value = payload as { choices?: { finish_reason?: string; message?: { content?: unknown } }[] } | null;
  const choice = value?.choices?.[0];
  if (choice?.finish_reason === "length" || typeof choice?.message?.content !== "string") throw new ChatServiceError("INVALID_RESPONSE", 502);
  return parseGroundedAnswer(choice.message.content, references);
}
