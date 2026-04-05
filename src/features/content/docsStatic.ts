import type { Locale } from "@/constants/i18n";
import { docsCategoryConfigs, getCategoryLabel, type DocsCategorySlug } from "./config";

type DocsStaticSource = {
  bodyMarkdown: Record<Locale, string>;
  categorySlug: Exclude<DocsCategorySlug, "all" | "glossary">;
  date: string;
  imageSrc: string;
  slug: string;
  title: Record<Locale, string>;
  writer: string;
};

export type DocsStaticEntry = {
  bodyMarkdown: string;
  category: string;
  categorySlug: Exclude<DocsCategorySlug, "all" | "glossary">;
  date: string;
  href: string;
  imageSrc: string;
  slug: string;
  title: string;
  writer: string;
};

const docsStaticSources: DocsStaticSource[] = [
  {
    bodyMarkdown: {
      en: `This introduction deck explains how teams move from AI prototypes to governed production workflows.`,
      ko: `이 소개 덱은 AI 프로토타입에서 거버넌스가 있는 운영 워크플로로 넘어가는 흐름을 설명합니다.`,
      ja: `この紹介デッキでは、AI プロトタイプから統制された本番ワークフローへ移行する流れを説明します。`,
    },
    categorySlug: "introduction-decks",
    date: "2026-02-20",
    imageSrc: "/uploads/article-01.png",
    slug: "seo-analysis-aip-agent",
    title: {
      en: "SEO analysis, once considered the domain of specialists, can now be handled by an AIP agent.",
      ko: "전문가의 영역으로 여겨지던 SEO 분석도 이제는 AIP 에이전트가 처리할 수 있습니다.",
      ja: "専門家の領域だった SEO 分析も、いまでは AIP エージェントで実行できます。",
    },
    writer: "Brant Hwang / CEO, Founder",
  },
  {
    bodyMarkdown: {
      en: `This manual covers approval design for risky AI actions and MCP-powered automations.`,
      ko: `이 매뉴얼은 고위험 AI 액션과 MCP 자동화를 위한 승인 설계를 다룹니다.`,
      ja: `このマニュアルでは、高リスクな AI アクションと MCP 自動化のための承認設計を扱います。`,
    },
    categorySlug: "manuals",
    date: "2026-02-18",
    imageSrc: "/uploads/article-02.png",
    slug: "guardrail-design-2026",
    title: {
      en: "Guardrail Design in the AI Agent Era (2026 Edition) — Part 1: Philosophy & Design",
      ko: "AI 에이전트 시대의 가드레일 설계 (2026 에디션) — Part 1: 철학과 설계",
      ja: "AI エージェント時代のガードレール設計 (2026 Edition) — Part 1: Philosophy & Design",
    },
    writer: "QueryPie Team / Product Strategy",
  },
  {
    bodyMarkdown: {
      en: `This blog explains why execution-based AI security should be treated as an operational layer, not a checklist.`,
      ko: `이 블로그는 실행 기반 AI 보안을 체크리스트가 아니라 운영 레이어로 봐야 하는 이유를 설명합니다.`,
      ja: `このブログでは、実行ベースの AI セキュリティをチェックリストではなく運用レイヤーとして扱う理由を説明します。`,
    },
    categorySlug: "blogs",
    date: "2026-02-16",
    imageSrc: "/uploads/article-03.png",
    slug: "ai-security-threat-map-2026",
    title: {
      en: "AI Security Threat Map 2026 | 7 Attack Vectors and Practical Defense Framework for CxOs",
      ko: "AI 보안 위협 맵 2026 | 7가지 공격 벡터와 CxO를 위한 실전 방어 프레임워크",
      ja: "AI Security Threat Map 2026 | 7 Attack Vectors and Practical Defense Framework for CxOs",
    },
    writer: "Brant Hwang / CEO, Founder",
  },
];

export function getStaticDocsEntries(locale: Locale): DocsStaticEntry[] {
  return docsStaticSources.map((source) => ({
    bodyMarkdown: source.bodyMarkdown[locale],
    category: getCategoryLabel(docsCategoryConfigs, source.categorySlug, locale),
    categorySlug: source.categorySlug,
    date: source.date,
    href: `/${locale}/docs/${source.slug}`,
    imageSrc: source.imageSrc,
    slug: source.slug,
    title: source.title[locale],
    writer: source.writer,
  }));
}

export function getStaticDocsEntry(locale: Locale, slug: string) {
  return getStaticDocsEntries(locale).find((entry) => entry.slug === slug);
}
