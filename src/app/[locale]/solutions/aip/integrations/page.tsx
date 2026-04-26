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
    "title": "QueryPie AIP Integrations",
    "description": "Connect to your favorite business tools through MCP servers and automate workflows across systems, apps, and services.",
    "keywords": [
      "QueryPie AIP integrations",
      "MCP integrations",
      "QueryPie AI"
    ]
  },
  "ko": {
    "title": "QueryPie AIP Integrations",
    "description": "Connect to your favorite business tools through MCP servers and automate workflows across systems, apps, and services.",
    "keywords": [
      "QueryPie AIP integrations",
      "MCP integrations",
      "QueryPie AI"
    ]
  },
  "ja": {
    "title": "QueryPie AI: インテグレーション",
    "description": "MCPサーバーを通じてお気に入りのビジネスツールに接続し、システム、アプリ、サービス全体のワークフローを自動化。",
    "keywords": [
      "QueryPie AIの統合",
      "MCPサーバーの統合",
      "QueryPie AI"
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
      canonical: getSolutionHref(locale, "aip-integrations"),
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
