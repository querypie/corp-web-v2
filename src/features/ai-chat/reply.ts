import type { ChatReply, ChatSource } from "./types";

export class ChatServiceError extends Error {
  constructor(public code: "NOT_CONFIGURED" | "PROVIDER_ERROR" | "INVALID_RESPONSE", public status: number) { super(code); }
}

const maxAnswerLength = 6000;
const maxSources = 8;
const markdownLinkPattern = /\[([^\]\n]*)\]\((https?:\/\/[^\s)]+)\)/gi;
const plainUrlPattern = /https?:\/\/[^\s<>"']+/gi;

export type HermesLink = ChatSource & { start: number; end: number };

function normalizeUrl(value: string) {
  const candidate = value.replace(/[.,!?;:]+$/g, "");
  try {
    const url = new URL(candidate);
    return url.protocol === "http:" || url.protocol === "https:" ? url.href : null;
  } catch {
    return null;
  }
}

export function findHermesLinks(content: string): HermesLink[] {
  const links: HermesLink[] = [];
  for (const match of content.matchAll(markdownLinkPattern)) {
    const url = normalizeUrl(match[2]);
    if (!url || match.index === undefined) continue;
    links.push({ title: match[1].trim() || url, url, start: match.index, end: match.index + match[0].length });
  }
  for (const match of content.matchAll(plainUrlPattern)) {
    if (match.index === undefined || links.some((link) => match.index! >= link.start && match.index! < link.end)) continue;
    const url = normalizeUrl(match[0]);
    if (!url) continue;
    const rawUrl = match[0].replace(/[.,!?;:]+$/g, "");
    links.push({ title: rawUrl, url, start: match.index, end: match.index + rawUrl.length });
  }
  return links.sort((left, right) => left.start - right.start);
}

export function extractHermesSources(content: string): ChatSource[] {
  return findHermesLinks(content)
    .map(({ title, url }) => ({ title: normalizeUrl(title) === url ? url : title, url }))
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
