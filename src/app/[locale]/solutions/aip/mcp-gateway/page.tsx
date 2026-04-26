import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/constants/i18n";
import { getSolutionHref } from "@/features/solutions/routes";
import ContentEN from "./content.en";
import ContentKO from "./content.ko";
import ContentJA from "./content.ja";

type SolutionStaticMetadata = {
  title: string;
  description: string;
  keywords?: string[];
  abstract?: string;
};

type PageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string }>;
};

const metadataByLocale: Record<Locale, SolutionStaticMetadata> = {
  "en": {
    "title": "QueryPie AIP: MCP Hub That Connects Everything",
    "description": "Single platform centrally managing all MCP servers and tools—no fragmentation, no complexity, no limits. Streamline AI workflows across your entire tech stack while we handle the complexity behind the scenes.",
    "keywords": [
      "QueryPie AI",
      "AI Platform",
      "MCP management",
      "access control",
      "QueryPie",
      "streamlined operations",
      "MCP servers",
      "Usage-based Enterprise AI",
      "MCP Gateway",
      "FDE Service"
    ]
  },
  "ko": {
    "title": "QueryPie AIP: MCP Hub That Connects Everything",
    "description": "Single platform centrally managing all MCP servers and tools—no fragmentation, no complexity, no limits. Streamline AI workflows across your entire tech stack while we handle the complexity behind the scenes.",
    "keywords": [
      "QueryPie AI",
      "AI Platform",
      "MCP management",
      "access control",
      "QueryPie",
      "streamlined operations",
      "MCP servers",
      "Usage-based Enterprise AI",
      "MCP Gateway",
      "FDE Service"
    ]
  },
  "ja": {
    "title": "QueryPie AIP：すべてを接続するMCPハブ",
    "description": "すべてのMCPサーバーとツールを一元管理する単一プラットフォーム—分散なし、複雑さなし、制限なし。舞台裏の複雑さは私たちが処理し、技術スタック全体のAIワークフローを効率化。",
    "keywords": [
      "クエリパイ AI",
      "QueryPie AI",
      "AI Platform",
      "AIP",
      "AI",
      "MCPゲートウェイ",
      "アクセス制御",
      "カスタムAIエージェント",
      "インフラ運用",
      "QueryPie AI Agent",
      "使用量ベース",
      "フォワードデプロイドエンジニア",
      "FDE"
    ]
  }
} as const;

export async function generateMetadata({ params }: Pick<PageProps, "params">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  const meta = metadataByLocale[locale];
  if (!meta) return {};

  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    alternates: {
      canonical: getSolutionHref(locale, "aip-mcp-gateway"),
    },
  };
}

export default async function SolutionPage({ params, searchParams }: PageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const Content = {
    en: ContentEN,
    ko: ContentKO,
    ja: ContentJA,
  }[locale];

  if (!Content) notFound();

  return (
    <div className="bg-white text-[#111827]">
      <Content locale={locale} searchParams={await searchParams} />
    </div>
  );
}
