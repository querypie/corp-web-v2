import "server-only";
import { getAiChatEmbeddingConfig } from "@/features/ai/config.server";

const embeddingDimensions = 1024;

export async function embedTexts(texts: string[], signal: AbortSignal) {
  const { baseUrl, model, apiKey } = getAiChatEmbeddingConfig();
  if (!baseUrl || !model || texts.length === 0) return null;
  const response = await fetch(`${baseUrl}/embeddings`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}) },
    body: JSON.stringify({ model, input: texts }),
    cache: "no-store",
    signal,
  });
  if (!response.ok) throw new Error(`Embedding provider returned ${response.status}`);
  const payload = await response.json() as { data?: { index?: number; embedding?: unknown }[] };
  const embeddings = [...(payload.data ?? [])]
    .sort((left, right) => (left.index ?? 0) - (right.index ?? 0))
    .map(({ embedding }) => embedding);
  if (embeddings.length !== texts.length || embeddings.some((embedding) =>
    !Array.isArray(embedding) || embedding.length !== embeddingDimensions ||
    embedding.some((value) => typeof value !== "number" || !Number.isFinite(value)))) {
    throw new Error("Embedding provider returned an invalid vector");
  }
  return embeddings as number[][];
}
