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
    "title": "QueryPie DAC, Database Access Controller",
    "description": "QueryPie DAC is crafted for data protection, seamlessly connectiong various cloud ecosystems. ",
    "keywords": [
      "QueryPie DAC",
      "database access controller",
      "DB access control",
      "data protection",
      "SQL editor",
      "RBAC",
      "ABAC",
      "audit"
    ]
  },
  "ko": {
    "title": "QueryPie DAC, Database Access Controller",
    "description": "QueryPie DAC는 데이터 보호를 위해 설계되었으며, 다양한 클라우드 생태계를 원활하게 연결합니다.",
    "keywords": [
      "QueryPie DAC",
      "데이터베이스 접근 제어기",
      "DB 접근 제어",
      "데이터 보호",
      "SQL 편집기",
      "RBAC",
      "ABAC",
      "감사"
    ]
  },
  "ja": {
    "title": "QueryPie DAC: Database Access Controller",
    "description": "QueryPie DACnはデータ保護のために作られ、様々なクラウドエコシステムにシームレスに接続します。 ",
    "abstract": "QueryPie DACnはデータ保護のために作られ、様々なクラウドエコシステムにシームレスに接続します。 ",
    "keywords": [
      "QueryPie DAC",
      "データベースアクセスコントローラ",
      "DBアクセス制御",
      "データ保護",
      "SQLエディタ",
      "RBAC",
      "ABAC",
      "データ監査"
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
      canonical: getSolutionHref(locale, "acp-database-access-controller"),
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
