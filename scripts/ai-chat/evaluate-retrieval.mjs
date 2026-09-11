import { readFile } from "node:fs/promises";
import { reviewEvidenceSection } from "../../src/features/ai-chat/evidencePolicy.ts";

const variants = [
  { name: "section", size: Infinity, overlap: 0 },
  { name: "section-1200-overlap-160", size: 1200, overlap: 160 },
  { name: "section-800-overlap-120", size: 800, overlap: 120 },
];
const aliases = {
  aip: ["aip", "ai platform", "ai플랫폼", "ai 플랫폼", "aiプラットフォーム", "fde", "forward deployed engineer", "forward deployed engineers", "fde 서비스", "fde service", "fdeサービス"],
  acp: ["acp", "access control", "접근 제어", "접근제어", "접근 통제", "アクセス制御", "dac", "sac", "kac", "wac"],
  lingo: ["lingo", "lingo voice", "링고", "링고 보이스", "リンゴ", "リンゴボイス"],
  notepie: ["notepie", "note pie", "노트파이", "ノートパイ"],
  linkpie: ["linkpie", "link pie", "링크파이", "リンクパイ"],
  corpnavi: ["corpnavi", "corp navi", "코프나비", "코프내비", "コープナビ"],
};
const sourceProducts = { linkpie: ["aip"] };
const conceptTerms = ["가격", "요금", "비용", "플랜", "크레딧", "price", "pricing", "cost", "plan", "credits", "料金", "価格", "費用"];
const stopWords = new Set(["what", "is", "are", "the", "a", "an", "and", "or", "how", "do", "does", "can", "you", "me", "tell", "about", "it", "please", "this", "that", "무엇", "어떤", "알려줘", "알려주세요", "설명해줘", "있나요", "있어", "뭐야", "무엇인가요"]);
const normalize = (value) => value.normalize("NFKC").toLowerCase();

function productsIn(text) {
  const value = normalize(text);
  return Object.entries(aliases).filter(([, terms]) => terms.some((term) =>
    /^[a-z]+$/.test(term) ? new RegExp(`\\b${term}\\b`).test(value) : value.includes(term),
  )).map(([product]) => product);
}

function searchTerms(text) {
  const value = normalize(text);
  const words = (value.match(/[\p{L}\p{N}]+/gu) ?? []).filter((word) => word.length > 1 && !stopWords.has(word));
  const terms = new Set(words);
  for (const word of words) {
    if (/[\p{Script=Hangul}\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}]/u.test(word)) {
      for (let index = 0; index < word.length - 1; index += 1) terms.add(word.slice(index, index + 2));
    }
  }
  if (conceptTerms.some((term) => value.includes(term))) conceptTerms.forEach((term) => terms.add(term));
  return [...terms].slice(0, 100);
}

function splitText(text, size, overlap) {
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

function makeChunks(documents, variant) {
  return documents.flatMap((document) => document.chunks.flatMap((chunk, index) =>
    splitText(reviewEvidenceSection(document, chunk).text, variant.size, variant.overlap).filter(Boolean).map((text, part) => ({
      id: `${document.id}-${index}-${part}`,
      product: document.product,
      locale: document.locale,
      title: `${document.title} — ${chunk.heading}`,
      url: document.url,
      text,
      searchable: normalize(`${document.title} ${chunk.heading} ${text}`),
      heading: normalize(chunk.heading),
    })),
  ));
}

function retrieve(chunks, testCase) {
  const latest = testCase.question;
  const explicit = productsIn(latest);
  const products = explicit.length ? explicit : productsIn((testCase.history ?? []).join(" "));
  const allowedProducts = new Set(products.flatMap((product) => [product, ...(sourceProducts[product] ?? [])]));
  const terms = [...new Set([...searchTerms(latest), ...products])];
  const normalizedLatest = normalize(latest);
  const asksCertification = ["인증", "인증서", "certification", "certifications", "compliance", "認証"].some((term) => normalizedLatest.includes(term));
  const asksPricing = conceptTerms.some((term) => normalizedLatest.includes(term));
  const asksDefinition = ["뭐야", "무엇", "무슨 제품", "what is", "what's", "とは", "何ですか"].some((term) => normalizedLatest.includes(term));
  const candidates = chunks.filter((chunk) => !products.length || allowedProducts.has(chunk.product) ||
    (chunk.product === "site" && products.some((product) => aliases[product].some((alias) => chunk.searchable.includes(alias)))) ||
    (asksCertification && chunk.url.includes("/company/certifications")));
  const idf = new Map(terms.map((term) => [term, Math.log(1 + candidates.length / (1 + candidates.filter((chunk) => chunk.searchable.includes(term)).length))]));
  const ranked = candidates.map((chunk) => {
    const matches = terms.filter((term) => chunk.searchable.includes(term));
    const score = matches.reduce((total, term) => total + (idf.get(term) ?? 0) * (chunk.heading.includes(term) ? 2 : 1), 0) +
      (asksCertification && chunk.url.includes("/company/certifications") ? 25 : 0) +
      (asksPricing && chunk.url.includes("/plans/") ? 12 : 0) +
      (asksDefinition && /\bwhat is\b|とは|overview/i.test(chunk.title) ? 25 : 0) +
      (chunk.locale === testCase.locale ? 3 : 0) + (products.includes(chunk.product) ? 1 : 0);
    return { chunk, score };
  }).filter(({ score }) => score > 0).sort((left, right) => right.score - left.score);
  return ranked.slice(0, 8).map(({ chunk }) => chunk);
}

function rankOf(chunks, testCase) {
  const index = chunks.findIndex((chunk) => chunk.url.includes(testCase.urlIncludes) && chunk.text.includes(testCase.textIncludes));
  return index < 0 ? null : index + 1;
}

function fuse(keyword, vector) {
  const keyOf = (chunk) => `${chunk.product}\0${chunk.locale}\0${chunk.url}\0${chunk.title}`;
  const selected = [];
  const select = (chunk) => {
    if (!selected.some((item) => keyOf(item) === keyOf(chunk)) && selected.filter((item) => item.url === chunk.url).length < 3) selected.push(chunk);
  };
  keyword.slice(0, 3).forEach(select);
  const combined = new Map();
  const add = (chunks, weight) => chunks.forEach((chunk, index) => {
    const key = keyOf(chunk);
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

function summarize(name, retrievedByCase) {
  const perCase = cases.map((testCase, index) => {
    const retrieved = retrievedByCase[index];
    return { id: testCase.id, rank: rankOf(retrieved, testCase), topSource: retrieved[0]?.title ?? null };
  });
  const ranks = perCase.map(({ rank }) => rank).filter(Boolean);
  return {
    variant: name,
    hitAt1: Number((ranks.filter((rank) => rank === 1).length / cases.length).toFixed(3)),
    hitAt3: Number((ranks.filter((rank) => rank <= 3).length / cases.length).toFixed(3)),
    mrr: Number((ranks.reduce((sum, rank) => sum + 1 / rank, 0) / cases.length).toFixed(3)),
    missed: perCase.filter(({ rank }) => !rank).map(({ id }) => id),
    perCase,
  };
}

const readJson = async (path) => JSON.parse(await readFile(new URL(path, import.meta.url), "utf8"));
const [snapshot, curated, approved, cases] = await Promise.all([
  readJson("../../src/features/ai-chat/knowledge.snapshot.json"),
  readJson("../../src/features/ai-chat/curated-product-facts.json"),
  readJson("../../src/features/ai-chat/approved-knowledge.json"),
  readJson("./retrieval-eval-cases.json"),
]);
const documents = [...snapshot.documents, ...curated.documents, ...approved.documents];
const results = variants.map((variant) => {
  const chunks = makeChunks(documents, variant);
  const perCase = cases.map((testCase) => {
    const retrieved = retrieve(chunks, testCase);
    return { id: testCase.id, rank: rankOf(retrieved, testCase), topSource: retrieved[0]?.title ?? null };
  });
  const ranks = perCase.map(({ rank }) => rank).filter(Boolean);
  return {
    variant: variant.name,
    chunks: chunks.length,
    hitAt1: Number((ranks.filter((rank) => rank === 1).length / cases.length).toFixed(3)),
    hitAt3: Number((ranks.filter((rank) => rank <= 3).length / cases.length).toFixed(3)),
    mrr: Number((ranks.reduce((sum, rank) => sum + 1 / rank, 0) / cases.length).toFixed(3)),
    missed: perCase.filter(({ rank }) => !rank).map(({ id }) => id),
    perCase,
  };
});

const output = { corpus: { documents: documents.length, sourceChunks: documents.reduce((sum, document) => sum + document.chunks.length, 0) }, results };
const databaseUrl = process.env.AI_CHAT_DATABASE_URL || process.env.POSTGRES_URL;
const embeddingBaseUrl = process.env.AI_CHAT_EMBEDDING_BASE_URL?.replace(/\/+$/, "");
const embeddingModel = process.env.AI_CHAT_EMBEDDING_MODEL;
if (databaseUrl && embeddingBaseUrl && embeddingModel) {
  const response = await fetch(`${embeddingBaseUrl}/embeddings`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(process.env.AI_CHAT_EMBEDDING_API_KEY ? { Authorization: `Bearer ${process.env.AI_CHAT_EMBEDDING_API_KEY}` } : {}) },
    body: JSON.stringify({ model: embeddingModel, input: cases.map(({ question }) => question) }),
  });
  if (!response.ok) throw new Error(`Embedding evaluation failed: ${response.status}`);
  const payload = await response.json();
  const vectors = [...payload.data].sort((left, right) => left.index - right.index).map(({ embedding }) => embedding);
  const { default: postgres } = await import("postgres");
  const sql = postgres(databaseUrl, { max: 2, prepare: false });
  const vectorResults = [];
  try {
    for (let index = 0; index < cases.length; index += 1) {
      const testCase = cases[index];
      const explicit = productsIn(testCase.question);
      const products = explicit.length ? explicit : productsIn((testCase.history ?? []).join(" "));
      const allowed = [...new Set(products.flatMap((product) => [product, ...(sourceProducts[product] ?? [])]))];
      const vector = `[${vectors[index].join(",")}]`;
      const rows = allowed.length
        ? await sql`SELECT chunk_id, product, locale, title, source_url, content, embedding <=> ${vector}::vector AS distance FROM ai_chat_knowledge_chunks WHERE locale IN (${testCase.locale}, 'en') AND product IN ${sql(allowed)} ORDER BY embedding <=> ${vector}::vector LIMIT 20`
        : await sql`SELECT chunk_id, product, locale, title, source_url, content, embedding <=> ${vector}::vector AS distance FROM ai_chat_knowledge_chunks WHERE locale IN (${testCase.locale}, 'en') ORDER BY embedding <=> ${vector}::vector LIMIT 20`;
      vectorResults.push(rows.filter(({ distance }) => Number(distance) <= 0.55).map((row) => ({
        id: row.chunk_id, product: row.product, locale: row.locale, title: row.title,
        url: row.source_url, text: row.content,
      })));
    }
  } finally {
    await sql.end();
  }
  const keyword = cases.map((testCase) => retrieve(makeChunks(documents, variants[2]), testCase));
  output.liveVectorResults = [
    summarize("bge-m3-dense", vectorResults),
    summarize("keyword-bge-m3-rrf", keyword.map((chunks, index) => fuse(chunks, vectorResults[index]))),
  ];
}
console.log(JSON.stringify(output, null, 2));
