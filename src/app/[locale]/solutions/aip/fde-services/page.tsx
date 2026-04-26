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
    "title": "QueryPie AIP: AI Transformation Expert at Your Service",
    "description": "Forward Deployed Engineers (FDE) embedded in your organization deliver comprehensive AI transformation—from strategy and development to production operations, ensuring your AI initiatives succeed.",
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
    "title": "QueryPie AIP: AI Transformation Expert at Your Service",
    "description": "Forward Deployed Engineers (FDE) embedded in your organization deliver comprehensive AI transformation—from strategy and development to production operations, ensuring your AI initiatives succeed.",
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
    "title": "QueryPie AIP：あなたのためのAI変革エキスパート",
    "description": "組織に組み込まれたフォワードデプロイドエンジニア（FDE）が、戦略と開発から本番運用まで包括的なAI変革を提供し、AIイニシアチブの成功を保証。",
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
      canonical: getSolutionHref(locale, "aip-fde-services"),
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
