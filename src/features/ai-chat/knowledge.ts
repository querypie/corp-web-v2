import type { Locale } from "@/constants/i18n";
import type { ChatTurn } from "./types";

const aliases: Record<string, string[]> = {
  aip: ["aip", "ai platform", "ai플랫폼", "ai 플랫폼", "aiプラットフォーム"],
  acp: ["acp", "access control", "접근 제어", "접근제어", "접근 통제", "アクセス制御", "dac", "sac", "kac", "wac"],
  lingo: ["lingo", "링고", "リンゴ"],
  notepie: ["notepie", "note pie", "노트파이", "ノートパイ"],
  corpnavi: ["corpnavi", "corp navi", "코프나비", "코프내비", "コープナビ"],
};
const concepts = [
  ["가격", "요금", "비용", "플랜", "구독", "크레딧", "price", "pricing", "cost", "billing", "plan", "credits", "料金", "価格", "費用"],
  ["지원 언어", "지원하는 언어", "언어", "language", "languages", "言語"],
  ["보안", "안전", "인증", "security", "secure", "certification", "セキュリティ", "安全"],
  ["회의", "번역", "통역", "전사", "meeting", "translation", "transcription", "会議", "翻訳", "文字起こし"],
  ["연동", "통합", "연결", "integration", "integrations", "connect", "連携", "接続"],
  ["무료", "체험", "시작", "사용법", "free", "trial", "quickstart", "start", "無料", "始め", "使い方"],
  ["설치", "온프레미스", "install", "installation", "on-premise", "インストール", "オンプレミス"],
  ["지식", "문서", "knowledge", "rag", "document", "ナレッジ", "ドキュメント"],
];
const stopWords = new Set(["what", "is", "are", "the", "a", "an", "and", "or", "how", "do", "does", "can", "you", "me", "tell", "about", "it", "please", "this", "that", "무엇", "어떤", "알려줘", "알려주세요", "설명해줘", "있나요", "있어", "뭐야", "무엇인가요"]);
const normalize = (text: string) => text.normalize("NFKC").toLowerCase();

export type KnowledgeChunk = {
  id: string; product: string; locale: string; title: string; url: string;
  text: string; searchable: string; heading: string;
};

export function makeChunk(product: string, locale: string, url: string, title: string, text: string, index = 0): KnowledgeChunk {
  return { id: `${url}#${index}`, product, locale, url, title, text,
    searchable: normalize(`${url} ${title} ${text}`), heading: normalize(title) };
}

function productsIn(text: string) {
  const value = normalize(text);
  return Object.entries(aliases).filter(([, terms]) => terms.some((term) =>
    /^[a-z]+$/.test(term) ? new RegExp(`\\b${term}\\b`).test(value) : value.includes(term),
  )).map(([product]) => product);
}

function searchTerms(text: string) {
  const normalized = normalize(text);
  const words = (normalized.match(/[\p{L}\p{N}]+/gu) ?? []).filter((word) => word.length > 1 && !stopWords.has(word));
  const terms = new Set(words);
  for (const word of words) {
    if (/[\p{Script=Hangul}\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}]/u.test(word)) {
      for (let i = 0; i < word.length - 1; i++) terms.add(word.slice(i, i + 2));
    }
  }
  for (const group of concepts) if (group.some((word) => normalized.includes(word))) group.forEach((word) => terms.add(word));
  return [...terms].slice(0, 100);
}

export function retrieveKnowledge(messages: ChatTurn[], locale: Locale, knowledgeChunks: KnowledgeChunk[], limit = 8): KnowledgeChunk[] {
  const questions = messages.filter((message) => message.role === "user").slice(-3).map((message) => message.content);
  const latest = questions.at(-1) ?? "";
  const explicit = productsIn(latest);
  const products = explicit.length ? explicit : productsIn(questions.slice(0, -1).join(" "));
  const terms = searchTerms(latest);
  const priorTerms = searchTerms(questions.slice(0, -1).join(" "));
  const candidates = knowledgeChunks.filter((chunk) => !products.length || products.includes(chunk.product) ||
    (chunk.product === "site" && products.some((product) => aliases[product].some((alias) => chunk.searchable.includes(alias)))));
  const idf = new Map(terms.map((term) => [term, Math.log(1 + candidates.length / (1 + candidates.filter((chunk) => chunk.searchable.includes(term)).length))]));
  const ranked = candidates.map((chunk) => {
    const matches = terms.filter((term) => chunk.searchable.includes(term));
    const score = matches.reduce((total, term) => total + (idf.get(term) ?? 0) * (chunk.heading.includes(term) ? 2 : 1), 0) +
      priorTerms.filter((term) => chunk.searchable.includes(term)).length * 0.15;
    return { chunk, score: score > 0 ? score + (chunk.locale === locale ? 3 : 0) + (products.includes(chunk.product) ? 1 : 0) : 0 };
  }).filter(({ score }) => score > 0).sort((a, b) => b.score - a.score);

  const selected: KnowledgeChunk[] = [];
  const add = (chunk: KnowledgeChunk) => {
    if (!selected.some((item) => item.id === chunk.id) && selected.filter((item) => item.url === chunk.url).length < 3) selected.push(chunk);
  };
  // Comparisons must have evidence for both products, even if one has more documents.
  for (const product of products) ranked.filter(({ chunk }) => chunk.product === product ||
    (chunk.product === "site" && chunk.searchable.includes(product))).slice(0, 2).forEach(({ chunk }) => add(chunk));
  for (const { chunk } of ranked) { if (selected.length >= limit) break; add(chunk); }
  return selected.slice(0, limit);
}
