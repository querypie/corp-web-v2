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
    "title": "QueryPie WAC, Web Access Controller",
    "description": "QueryPie WAC secures access and log activities for web applications including admin portals and SaaS platforms.",
    "keywords": [
      "QueryPie WAC",
      "web access controller",
      "SaaS",
      "sensitive data",
      "data protection",
      "integrated access control",
      "permission management",
      "HTTP request",
      "web application compliance",
      "SIEM integration"
    ]
  },
  "ko": {
    "title": "QueryPie WAC, Web Access Controller",
    "description": "QueryPie WAC는 사내 관리자 사이트 및 SaaS 플랫폼을 포함한 웹 애플리케이션의 접근을 보호하고 로그 활동을 관리합니다.",
    "keywords": [
      "QueryPie WAC",
      "웹 접근 제어기",
      "SaaS",
      "민감 데이터",
      "데이터 보호",
      "통합 접근 제어",
      "권한 관리",
      "HTTP 요청",
      "웹 애플리케이션 준수",
      "SIEM 통합"
    ]
  },
  "ja": {
    "title": "QueryPie KAC:  Kubernetes Access Controller",
    "description": "QueryPie WACは、管理者ポータルや SaaS プラットフォームを含む Web アプリケーションのアクセスおよびログアクティビティを保護します。",
    "abstract": "QueryPie WACは、管理者ポータルや SaaS プラットフォームを含む Web アプリケーションのアクセスおよびログアクティビティを保護します。",
    "keywords": [
      "QueryPie WAC",
      "Webアプリケーションアクセスコントローラ",
      "SaaS",
      "機密データ",
      "データ保護",
      "統合アクセス制御権限管理",
      "HTTP要求",
      "Webアプリケーションコンプライアンス",
      "SIEM統合"
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
      canonical: getSolutionHref(locale, "acp-web-access-controller"),
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
