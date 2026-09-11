import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import process from "node:process";
import postgres from "postgres";
import { reviewEvidenceSection } from "../../src/features/ai-chat/evidencePolicy.ts";

const databaseUrl = process.env.AI_CHAT_DATABASE_URL || process.env.POSTGRES_URL;
const baseUrl = process.env.AI_CHAT_EMBEDDING_BASE_URL?.replace(/\/+$/, "");
const model = process.env.AI_CHAT_EMBEDDING_MODEL;
const apiKey = process.env.AI_CHAT_EMBEDDING_API_KEY;
if (!databaseUrl) throw new Error("AI_CHAT_DATABASE_URL or POSTGRES_URL is required");
if (!baseUrl || !model) throw new Error("AI_CHAT_EMBEDDING_BASE_URL and AI_CHAT_EMBEDDING_MODEL are required");

const readJson = async (path) => JSON.parse(await readFile(new URL(path, import.meta.url), "utf8"));
const [snapshot, curated, approved] = await Promise.all([
  readJson("../../src/features/ai-chat/knowledge.snapshot.json"),
  readJson("../../src/features/ai-chat/curated-product-facts.json"),
  readJson("../../src/features/ai-chat/approved-knowledge.json"),
]);

function splitText(text, size = 800, overlap = 120) {
  if (text.length <= size) return [text];
  const parts = [];
  let start = 0;
  while (start < text.length) {
    let end = Math.min(start + size, text.length);
    if (end < text.length) {
      const boundary = Math.max(text.lastIndexOf("\n", end), text.lastIndexOf(" ", end));
      if (boundary > start + size * 0.6) end = boundary;
    }
    parts.push(text.slice(start, end).trim());
    if (end === text.length) break;
    start = Math.max(end - overlap, start + 1);
  }
  return parts.filter(Boolean);
}

function makeChunks(source, visibility) {
  return source.documents.flatMap((document) => document.chunks.flatMap((chunk, sectionIndex) =>
    splitText(reviewEvidenceSection(document, chunk).text).filter(Boolean).map((content, partIndex) => ({
      chunkId: `${document.id}-${sectionIndex}-${partIndex}`,
      documentId: document.id,
      product: document.product,
      locale: document.locale,
      title: `${document.title} — ${chunk.heading}`,
      heading: chunk.heading,
      sourceUrl: document.url,
      visibility,
      content,
      embeddingInput: `${document.product}\n${document.title}\n${chunk.heading}\n${content}`,
      contentHash: createHash("sha256").update(content).digest("hex"),
      collectedAt: source.collectedAt ?? null,
    })),
  ));
}

const chunks = [
  ...makeChunks(snapshot, "public"),
  ...makeChunks(curated, "approved"),
  ...makeChunks(approved, "approved"),
];
const corpusVersion = createHash("sha256").update(JSON.stringify(chunks.map(({ chunkId, contentHash }) => [chunkId, contentHash]))).digest("hex");

async function embedBatch(input) {
  const response = await fetch(`${baseUrl}/embeddings`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}) },
    body: JSON.stringify({ model, input }),
  });
  if (!response.ok) throw new Error(`Embedding provider returned ${response.status}: ${await response.text()}`);
  const payload = await response.json();
  const vectors = [...(payload.data ?? [])].sort((left, right) => left.index - right.index).map((item) => item.embedding);
  if (vectors.length !== input.length || vectors.some((vector) => !Array.isArray(vector) || vector.length !== 1024)) {
    throw new Error("Embedding provider must return one 1024-dimensional vector per input");
  }
  return vectors;
}

const sql = postgres(databaseUrl, { max: 5, prepare: false });
try {
  const existingRows = await sql`
    SELECT chunk_id, content_hash, embedding_model, embedding::text AS embedding
    FROM ai_chat_knowledge_chunks
  `;
  const existing = new Map(existingRows.map((row) => [row.chunk_id, row]));
  const vectors = new Array(chunks.length);
  const pending = [];
  chunks.forEach((chunk, index) => {
    const saved = existing.get(chunk.chunkId);
    if (saved?.content_hash === chunk.contentHash && saved.embedding_model === model) {
      vectors[index] = JSON.parse(saved.embedding);
    } else {
      pending.push(index);
    }
  });
  console.log(`Reused ${chunks.length - pending.length}/${chunks.length} existing embeddings.`);
  const batchSize = 16;
  for (let start = 0; start < pending.length; start += batchSize) {
    const indices = pending.slice(start, start + batchSize);
    const embedded = await embedBatch(indices.map((index) => chunks[index].embeddingInput));
    indices.forEach((index, offset) => { vectors[index] = embedded[offset]; });
    process.stdout.write(`\rEmbedded ${Math.min(start + batchSize, pending.length)}/${pending.length} changed chunks`);
  }
  if (pending.length) process.stdout.write("\n");

  // Publish the reviewed corpus atomically, including pruning old held chunks.
  await sql.begin(async (tx) => {
    for (let start = 0; start < chunks.length; start += 100) {
      const rows = chunks.slice(start, start + 100).map((chunk, offset) => ({
        chunk_id: chunk.chunkId,
        document_id: chunk.documentId,
        product: chunk.product,
        locale: chunk.locale,
        title: chunk.title,
        heading: chunk.heading,
        source_url: chunk.sourceUrl,
        source_visibility: chunk.visibility,
        content: chunk.content,
        content_hash: chunk.contentHash,
        embedding_model: model,
        embedding: `[${vectors[start + offset].join(",")}]`,
        corpus_version: corpusVersion,
        source_collected_at: chunk.collectedAt,
      }));
      await tx`
        INSERT INTO ai_chat_knowledge_chunks ${tx(rows)}
        ON CONFLICT (chunk_id) DO UPDATE SET
          document_id = EXCLUDED.document_id,
          product = EXCLUDED.product,
          locale = EXCLUDED.locale,
          title = EXCLUDED.title,
          heading = EXCLUDED.heading,
          source_url = EXCLUDED.source_url,
          source_visibility = EXCLUDED.source_visibility,
          content = EXCLUDED.content,
          content_hash = EXCLUDED.content_hash,
          embedding_model = EXCLUDED.embedding_model,
          embedding = EXCLUDED.embedding,
          corpus_version = EXCLUDED.corpus_version,
          source_collected_at = EXCLUDED.source_collected_at,
          indexed_at = NOW()
      `;
    }
    await tx`DELETE FROM ai_chat_knowledge_chunks WHERE corpus_version <> ${corpusVersion}`;
  });
  const [{ count }] = await sql`SELECT COUNT(*)::integer AS count FROM ai_chat_knowledge_chunks`;
  console.log(`Knowledge index ready: ${count} chunks (${model}).`);
} finally {
  await sql.end();
}
