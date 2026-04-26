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
    "title": "QueryPie Integrations",
    "description": "Connect straight to your data sources and get full visibility across all your systems, apps, and services.",
    "keywords": [
      "QueryPie integrations",
      "integrate data source",
      "system integration",
      "QueryPie"
    ]
  },
  "ko": {
    "title": "QueryPie Integrations",
    "description": "데이터 소스에 직접 연결하여 모든 시스템, 앱, 서비스에 걸쳐 완벽한 가시성을 확보하세요.",
    "keywords": [
      "QueryPie integrations",
      "데이터 소스 연동",
      "시스템 연동",
      "QueryPie"
    ]
  },
  "ja": {
    "title": "QueryPie: インテグレーション",
    "description": "データソースに直接接続し、すべてのシステム、アプリケーション、およびサービスを完全に把握することが可能です。",
    "keywords": [
      "QueryPieの統合",
      "データソースの統合",
      "システムの統合",
      "QueryPie"
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
      canonical: getSolutionHref(locale, "acp-integrations"),
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
