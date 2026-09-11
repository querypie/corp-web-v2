import "server-only";
import type { Locale } from "@/constants/i18n";
import { embedTexts } from "./embedding.server";
import { getAiChatDatabase } from "./database.server";
import { isCurrentKnowledgeEvidence, knowledgeProductFilter, retrieveKnowledge, type KnowledgeChunk } from "./knowledge";
import type { ChatTurn } from "./types";
import { isChatSourceUrl } from "./types";

type VectorRow = {
  chunk_id: string;
  product: string;
  locale: Locale;
  title: string;
  source_url: string;
  content: string;
  distance: number;
};

const sourceKey = (chunk: KnowledgeChunk) => `${chunk.product}\0${chunk.locale}\0${chunk.url}\0${chunk.title}`;

export function fuseKnowledge(keyword: KnowledgeChunk[], vector: KnowledgeChunk[]) {
  const selected: KnowledgeChunk[] = [];
  const select = (chunk: KnowledgeChunk) => {
    if (!selected.some((item) => sourceKey(item) === sourceKey(chunk)) && selected.filter((item) => item.url === chunk.url).length < 3) selected.push(chunk);
  };
  keyword.slice(0, 3).forEach(select);
  const combined = new Map<string, { chunk: KnowledgeChunk; score: number }>();
  const add = (chunks: KnowledgeChunk[], weight: number) => chunks.forEach((chunk, index) => {
    const key = sourceKey(chunk);
    const current = combined.get(key);
    combined.set(key, { chunk: current?.chunk ?? chunk, score: (current?.score ?? 0) + weight / (60 + index + 1) });
  });
  add(keyword.slice(3), 1.1);
  add(vector, 1);
  for (const { chunk } of [...combined.values()].sort((left, right) => right.score - left.score)) {
    select(chunk);
    if (selected.length === 8) break;
  }
  return selected;
}

export async function retrieveKnowledgeForAnswer(messages: ChatTurn[], locale: Locale, signal: AbortSignal) {
  const keyword = retrieveKnowledge(messages, locale);
  const sql = getAiChatDatabase();
  if (!sql || !process.env.AI_CHAT_EMBEDDING_BASE_URL || !process.env.AI_CHAT_EMBEDDING_MODEL) return keyword;
  const latest = messages.findLast((message) => message.role === "user")?.content ?? "";
  try {
    const vectors = await embedTexts([latest], signal);
    if (!vectors) return keyword;
    const vectorLiteral = `[${vectors[0].join(",")}]`;
    const products = knowledgeProductFilter(messages);
    const rows = products.length
      ? await sql<VectorRow[]>`
          SELECT chunk_id, product, locale, title, source_url, content,
            embedding <=> ${vectorLiteral}::vector AS distance
          FROM ai_chat_knowledge_chunks
          WHERE locale IN (${locale}, 'en') AND product IN ${sql(products)}
          ORDER BY embedding <=> ${vectorLiteral}::vector
          LIMIT 20
        `
      : await sql<VectorRow[]>`
          SELECT chunk_id, product, locale, title, source_url, content,
            embedding <=> ${vectorLiteral}::vector AS distance
          FROM ai_chat_knowledge_chunks
          WHERE locale IN (${locale}, 'en')
          ORDER BY embedding <=> ${vectorLiteral}::vector
          LIMIT 20
        `;
    const semantic = rows.filter((row) => Number(row.distance) <= 0.55).map((row) => ({
      id: row.chunk_id,
      product: row.product,
      locale: row.locale,
      title: row.title,
      url: row.source_url,
      text: row.content,
      searchable: row.content.normalize("NFKC").toLowerCase(),
      heading: row.title.normalize("NFKC").toLowerCase(),
      publicSource: isChatSourceUrl(row.source_url),
    } satisfies KnowledgeChunk)).filter(isCurrentKnowledgeEvidence);
    return fuseKnowledge(keyword, semantic);
  } catch (error) {
    console.error("[ai-chat] vector retrieval failed; using keyword fallback", error);
    return keyword;
  }
}
