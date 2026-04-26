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
    "title": "QueryPie Access Control Platform (ACP)",
    "description": "The platform that delivers comprehensive access management across data and infrastructure—optimized for AI agent connectivity and automated governance capabilities.",
    "keywords": [
      "QueryPie ACP",
      "Access Control Platform",
      "database access control",
      "data access control",
      "system access control",
      "kubernetes access control",
      "web access control",
      "data protection",
      "SQL editor",
      "AI Agent connectivity",
      "RBAC",
      "ABAC",
      "audit"
    ]
  },
  "ko": {
    "title": "QueryPie Access Control Platform (ACP)",
    "description": "The platform that delivers comprehensive access management across data and infrastructure—optimized for AI agent connectivity and automated governance capabilities.",
    "keywords": [
      "QueryPie ACP",
      "Access Control Platform",
      "database access control",
      "data access control",
      "system access control",
      "kubernetes access control",
      "web access control",
      "data protection",
      "SQL editor",
      "AI Agent connectivity",
      "RBAC",
      "ABAC",
      "audit"
    ]
  },
  "ja": {
    "title": "QueryPie アクセス制御プラットフォーム (ACP)",
    "description": "アクセス制御プラットフォームはデータベースとインフラ全体にわたる包括的なアクセス管理を提供するプラットフォームです。",
    "keywords": [
      "クエリパイ ACP",
      "Access Control Platform",
      "ACP",
      "データベースアクセス制御",
      "システムアクセス制御",
      "Kubernetesアクセス制御",
      "Webアクセス制御",
      "SQLエディター",
      "AIエージェント",
      "RBAC",
      "ABAC",
      "リアルタイム監視"
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
      canonical: getSolutionHref(locale, "acp"),
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
