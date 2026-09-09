import { isChatSourceUrl, type ChatReply, type ChatSource } from "./types";

export type EvidenceReference = ChatSource & { id: string };

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
      const value = result as { answer?: unknown; sourceIds?: unknown; answered?: unknown };
      if (typeof value.answer !== "string" || !value.answer.trim() || value.answer.length > 6000 ||
          typeof value.answered !== "boolean" || !Array.isArray(value.sourceIds)) continue;
      const sourceIds = value.sourceIds;
      const cited = references.filter((source) => sourceIds.includes(source.id) && isChatSourceUrl(source.url));
      if (value.answered && cited.length === 0) continue;
      const sources = cited.filter((source, index) => cited.findIndex((other) => other.url === source.url) === index)
        .map(({ title, url }) => ({ title, url }));
      return { answer: value.answer.trim(), sources, answered: value.answered };
    } catch { /* Try another JSON candidate; never return unparsed content. */ }
  }
  throw new ChatServiceError("INVALID_RESPONSE", 502);
}

export function parseProviderReply(payload: unknown, references: EvidenceReference[]): ChatReply {
  const value = payload as { choices?: { finish_reason?: string; message?: { content?: unknown } }[] } | null;
  const choice = value?.choices?.[0];
  if (choice?.finish_reason === "length" || typeof choice?.message?.content !== "string") throw new ChatServiceError("INVALID_RESPONSE", 502);
  return parseGroundedAnswer(choice.message.content, references);
}
