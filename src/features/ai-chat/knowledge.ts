import snapshot from "./knowledge.snapshot.json";
import approvedKnowledge from "./approved-knowledge.json";
import curatedProductFacts from "./curated-product-facts.json";
import type { Locale } from "@/constants/i18n";
import { isChatSourceUrl, type ChatTurn } from "./types";
import { reviewEvidenceSection } from "./evidencePolicy";

const aliases: Record<string, string[]> = {
  aip: ["aip", "ai platform", "ai플랫폼", "ai 플랫폼", "aiプラットフォーム", "fde", "forward deployed engineer", "forward deployed engineers", "fde 서비스", "fde service", "fdeサービス"],
  acp: ["acp", "access control", "접근 제어", "접근제어", "접근 통제", "アクセス制御", "dac", "sac", "kac", "wac", "mac", "mcp access control", "mcp 액세스 제어", "mcp 접근 제어", "mcpアクセス制御", "ai chat", "ai 챗", "ai 채팅"],
  lingo: ["lingo", "lingo voice", "링고", "링고 보이스", "リンゴ", "リンゴボイス"],
  notepie: ["notepie", "note pie", "노트파이", "ノートパイ"],
  linkpie: ["linkpie", "link pie", "링크파이", "リンクパイ"],
  corpnavi: ["corpnavi", "corp navi", "코프나비", "코프내비", "コープナビ"],
};
const sourceProducts: Record<string, string[]> = {
  // LinkPie is documented as an AIP App, not in a standalone LinkPie document set.
  linkpie: ["aip"],
};
const concepts = [
  ["가격", "요금", "비용", "플랜", "구독", "크레딧", "price", "pricing", "cost", "billing", "plan", "credits", "料金", "価格", "費用", "プラン", "クレジット", "有料"],
  ["지원 언어", "지원하는 언어", "언어", "language", "languages", "言語"],
  ["보안", "안전", "인증", "security", "secure", "certification", "セキュリティ", "安全"],
  ["회의", "번역", "통역", "전사", "meeting", "translation", "transcription", "会議", "翻訳", "文字起こし"],
  ["lingo voice", "링고 보이스", "보이스", "음성 통역", "실시간 통역", "발표", "voice", "real-time interpreter", "live interpretation", "presentation", "リンゴボイス", "音声通訳", "リアルタイム通訳", "発表"],
  ["연동", "통합", "연결", "integration", "integrations", "connect", "連携", "接続"],
  ["무료", "체험", "시작", "사용법", "free", "trial", "quickstart", "start", "無料", "始め", "使い方"],
  ["설치", "온프레미스", "install", "installation", "on-premise", "インストール", "オンプレミス"],
  ["지식", "문서", "knowledge", "rag", "document", "ナレッジ", "ドキュメント"],
  ["dac", "database access control", "데이터베이스 접근 제어", "db 접근 제어", "データベースアクセス制御"],
  ["mac", "mcp access control", "remote mcp", "remote mcp server", "mcp 접근 제어", "mcp 액세스 제어", "リモートmcp", "mcpアクセス制御"],
];
const stopWords = new Set(["what", "is", "are", "the", "a", "an", "and", "or", "how", "do", "does", "can", "you", "me", "tell", "about", "it", "please", "this", "that", "무엇", "어떤", "알려줘", "알려주세요", "설명해줘", "있나요", "있어", "뭐야", "무엇인가요"]);
const normalize = (text: string) => text.normalize("NFKC").toLowerCase();
const portfolioQuestionTerms = [
  "다른 제품", "전체 제품", "제품 간", "제품간", "제품 관계", "제품군", "포트폴리오",
  "other product", "all product", "product relationship", "product portfolio",
  "他の製品", "全製品", "製品間", "製品の関係", "製品群",
];
const portfolioSearchTerms = ["aip", "acp", "lingo", "notepie", "linkpie", "aip apps", "fde", "mcp", "플랫폼", "앱", "연계"];

export const knowledgeCollectedAt = snapshot.collectedAt;
const knowledgeDocuments = [...snapshot.documents, ...curatedProductFacts.documents, ...approvedKnowledge.documents];

export const knowledgeChunks = knowledgeDocuments.flatMap((document) => document.chunks.flatMap((chunk, index) => {
  const { text } = reviewEvidenceSection(document, chunk);
  if (!text) return [];
  return [{
    id: `${document.id}-${index}`,
    product: document.product,
    locale: document.locale,
    title: `${document.title} — ${chunk.heading}`,
    url: document.url,
    text,
    searchable: normalize(`${document.title} ${chunk.heading} ${text}`),
    heading: normalize(chunk.heading),
    publicSource: isChatSourceUrl(document.url),
  }];
}));
export type KnowledgeChunk = typeof knowledgeChunks[number];

const evidenceKey = (chunk: Pick<KnowledgeChunk, "product" | "locale" | "url" | "title">) =>
  JSON.stringify([chunk.product, chunk.locale, chunk.url, chunk.title]);
const currentEvidence = new Map<string, string[]>();
for (const chunk of knowledgeChunks) {
  const key = evidenceKey(chunk);
  currentEvidence.set(key, [...(currentEvidence.get(key) ?? []), chunk.text]);
}

// A stale vector index must not reintroduce withheld text. Match against the
// full reviewed section, not a split fragment whose roadmap qualifier was lost.
export function isCurrentKnowledgeEvidence(chunk: Pick<KnowledgeChunk, "product" | "locale" | "url" | "title" | "text">) {
  return chunk.text.trim().length > 0 &&
    (currentEvidence.get(evidenceKey(chunk)) ?? []).some((text) => text.includes(chunk.text));
}

function productsIn(text: string) {
  const value = normalize(text);
  return Object.entries(aliases).filter(([, terms]) => terms.some((term) =>
    /^[a-z]+$/.test(term) ? new RegExp(`\\b${term}\\b`).test(value) : value.includes(term),
  )).map(([product]) => product);
}

function asksPortfolioQuestion(text: string) {
  const value = normalize(text);
  return portfolioQuestionTerms.some((term) => value.includes(term)) || productsIn(text).length >= 3;
}

export function knowledgeProductFilter(messages: ChatTurn[]) {
  const userMessages = messages.filter((message) => message.role === "user");
  const latest = userMessages.at(-1)?.content ?? "";
  if (asksPortfolioQuestion(latest)) return [];
  const explicit = productsIn(latest);
  const products = explicit.length ? explicit : productsIn(userMessages.slice(0, -1).map((message) => message.content).join(" "));
  return [...new Set(products.flatMap((product) => [product, ...(sourceProducts[product] ?? [])]))];
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

export function retrieveKnowledge(messages: ChatTurn[], locale: Locale): KnowledgeChunk[] {
  const questions = messages.filter((message) => message.role === "user").slice(-3).map((message) => message.content);
  const latest = questions.at(-1) ?? "";
  const asksPortfolio = asksPortfolioQuestion(latest);
  const explicit = productsIn(latest);
  const latestIndex = messages.findLastIndex((message) => message.role === "user");
  const products = explicit.length ? explicit : asksPortfolio ? [] : productsIn(messages.slice(0, latestIndex).map((message) => message.content).join(" "));
  const allowedProducts = new Set(products.flatMap((product) => [product, ...(sourceProducts[product] ?? [])]));
  // Korean/Japanese particles can attach to a product name (for example, "AIP는").
  // Keep the detected canonical product name as a search term so its overview wins
  // over a narrowly matching feature page for a product-definition question.
  const terms = [...new Set([...searchTerms(latest), ...products, ...(asksPortfolio ? portfolioSearchTerms : [])])];
  const priorTerms = searchTerms(questions.slice(0, -1).join(" "));
  const normalizedLatest = normalize(latest);
  const asksCertification = ["인증", "인증서", "certification", "certifications", "compliance", "認証"].some((term) => normalizedLatest.includes(term));
  const asksPricing = concepts[0].some((term) => normalizedLatest.includes(term));
  const asksLingoWorkflow = !asksPricing && products.includes("lingo") && products.includes("aip") &&
    ["연계", "연동", "연결", "이어", "업무", "connect", "integrat", "workflow", "連携", "接続", "業務"].some((term) => normalizedLatest.includes(term));
  if (asksPricing && products.includes("lingo")) allowedProducts.add("aip");
  const asksProductDefinition = ["뭐야", "무엇", "무슨 제품", "어떤 제품", "제품이야", "what is", "what's", "とは", "何ですか"].some((term) => normalizedLatest.includes(term));
  const asksDac = /\bdac\b/.test(normalizedLatest) || ["database access control", "데이터베이스 접근 제어", "db 접근 제어", "データベースアクセス制御"].some((term) => normalizedLatest.includes(term));
  const asksMac = /\bmac\b/.test(normalizedLatest) || ["mcp access control", "mcp 접근 제어", "mcp 액세스 제어", "リモートmcp", "mcpアクセス制御"].some((term) => normalizedLatest.includes(term));
  const askedAcpModules = ["dac", "sac", "kac", "wac", "mac"].filter((module) => new RegExp(`\\b${module}\\b`).test(normalizedLatest));
  const asksFdeStrength = normalizedLatest.includes("fde") && ["강점", "장점", "strength", "advantage", "強み", "メリット"].some((term) => normalizedLatest.includes(term));
  const candidates = knowledgeChunks.filter((chunk) => !products.length || allowedProducts.has(chunk.product) ||
    (chunk.product === "site" && products.some((product) => aliases[product].some((alias) => chunk.searchable.includes(alias)))) ||
    (asksCertification && chunk.url.includes("/company/certifications")));
  const idf = new Map(terms.map((term) => [term, Math.log(1 + candidates.length / (1 + candidates.filter((chunk) => chunk.searchable.includes(term)).length))]));
  const ranked = candidates.map((chunk) => {
    const matches = terms.filter((term) => chunk.searchable.includes(term));
    const score = matches.reduce((total, term) => total + (idf.get(term) ?? 0) * (chunk.heading.includes(term) ? 2 : 1), 0) +
      priorTerms.filter((term) => chunk.searchable.includes(term)).length * 0.15;
    const canonicalPageBoost =
      (asksCertification && chunk.url.includes("/company/certifications") ? 25 : 0) +
      (asksPricing && chunk.url.includes("/plans/") ? 12 : 0) +
      (asksProductDefinition && /\bwhat is\b|とは|overview|개요/i.test(chunk.title) ? 25 : 0) +
      (asksProductDefinition && products.includes("aip") && chunk.url.includes("/solutions/aip/fde-services") ? 18 : 0) +
      (asksDac && chunk.title.includes("DAC") && chunk.title.includes("AI Chat") ? 40 : 0) +
      (asksMac && chunk.url.includes("/mcp-access-control/using-remote-mcp-servers-through-mac") ? 40 : 0) +
      (askedAcpModules.length && chunk.title.includes("ACP 기능 경계") ? 35 : 0) +
      (asksPortfolio && chunk.url.includes("/user-guide/apps") && /aip apps|アプリ/i.test(chunk.title) && /aip apps|アプリ/i.test(chunk.heading) ? 30 : 0) +
      (asksPortfolio && chunk.url.includes("/apps/lingo/mcp") && /lingo mcp/i.test(chunk.heading) ? 24 : 0) +
      (asksPortfolio && chunk.title.includes("ACP") && chunk.title.includes("FDE") ? 24 : 0);
    return { chunk, score: score > 0 ? score + canonicalPageBoost + (chunk.locale === locale ? 3 : 0) + (products.includes(chunk.product) ? 1 : 0) : 0 };
  }).filter(({ score }) => score > 0).sort((a, b) => b.score - a.score);

  const selected: KnowledgeChunk[] = [];
  const add = (chunk: KnowledgeChunk) => {
    if (!selected.some((item) => item.id === chunk.id) && selected.filter((item) => item.url === chunk.url).length < 3) selected.push(chunk);
  };
  if (asksProductDefinition && products.includes("aip")) {
    ranked.filter(({ chunk }) => chunk.url.endsWith(`/${locale}/user-guide`) && /what is querypie aip|querypie aipとは|querypie aip 개요/i.test(chunk.title)).slice(0, 1).forEach(({ chunk }) => add(chunk));
    ranked.filter(({ chunk }) => chunk.url.includes("/solutions/aip/fde-services")).slice(0, 1).forEach(({ chunk }) => add(chunk));
  }
  if (asksProductDefinition && products.includes("corpnavi")) {
    ranked.filter(({ chunk }) => chunk.title.includes("CorpNavi 제품 개요")).slice(0, 2).forEach(({ chunk }) => add(chunk));
  }
  if (asksLingoWorkflow) {
    // Prefer the existing end-to-end explanation over individual tool tables
    // or generic MCP security documents for a Lingo-to-AIP workflow question.
    ranked.filter(({ chunk }) => chunk.locale === locale && chunk.url.endsWith("/apps/lingo/mcp") &&
      (chunk.heading === "lingo mcp" || chunk.heading.includes("aip"))).slice(0, 2).forEach(({ chunk }) => add(chunk));
  }
  if (askedAcpModules.length) {
    ranked.filter(({ chunk }) => chunk.title.includes("ACP 기능 경계")).slice(0, 1).forEach(({ chunk }) => add(chunk));
  }
  if (asksDac) {
    ranked.filter(({ chunk }) => chunk.title.includes("DAC") && chunk.title.includes("AI Chat")).slice(0, 1).forEach(({ chunk }) => add(chunk));
  }
  if (asksMac) {
    ranked.filter(({ chunk }) => chunk.url.includes("/mcp-access-control/using-remote-mcp-servers-through-mac")).slice(0, 2).forEach(({ chunk }) => add(chunk));
  }
  if (asksPortfolio && !asksPricing) {
    ranked.filter(({ chunk }) => chunk.url.includes("/user-guide/apps") && /aip apps|アプリ/i.test(chunk.heading)).slice(0, 1).forEach(({ chunk }) => add(chunk));
    ranked.filter(({ chunk }) => chunk.url.includes("/apps/lingo/mcp") && /lingo mcp/i.test(chunk.heading)).slice(0, 1).forEach(({ chunk }) => add(chunk));
    ranked.filter(({ chunk }) => chunk.title.includes("FDE") && chunk.title.includes("ACP")).slice(0, 1).forEach(({ chunk }) => add(chunk));
  }
  if (asksFdeStrength) {
    ranked.filter(({ chunk }) => chunk.url.includes("/solutions/aip/fde-services")).slice(0, 1).forEach(({ chunk }) => add(chunk));
    ranked.filter(({ chunk }) => chunk.title.includes("FDE") && chunk.title.includes("ACP")).slice(0, 1).forEach(({ chunk }) => add(chunk));
  }
  if (asksPricing) {
    const pricingMarkers: Record<string, string[]> = { aip: ["$650"], acp: ["$50"], lingo: ["$650", "¥360,000"], notepie: ["$650", "¥360,000"] };
    const pricingProducts = asksPortfolio ? ["aip", "acp", "lingo", "notepie"] : [
      ...products.filter((product) => product in pricingMarkers),
      ...(products.includes("lingo") ? ["aip"] : []),
    ];
    for (const product of pricingProducts) {
      const pricing = ranked.filter(({ chunk }) => chunk.product === product && (chunk.url.includes("pricing") || chunk.url.includes("/plans/")));
      const preferred = pricingMarkers[product].map((marker) => pricing.find(({ chunk }) => chunk.text.includes(marker))).filter((item) => item !== undefined);
      (preferred.length ? preferred : pricing.slice(0, 1)).forEach(({ chunk }) => add(chunk));
    }
  }
  // Comparisons must have evidence for both products, even if one has more documents.
  for (const product of products) ranked.filter(({ chunk }) => chunk.product === product ||
    (chunk.product === "site" && chunk.searchable.includes(product))).slice(0, 2).forEach(({ chunk }) => add(chunk));
  for (const { chunk } of ranked) { if (selected.length >= 8) break; add(chunk); }
  return selected.slice(0, 8);
}
