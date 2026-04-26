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
    "title": "QueryPie SAC, System Access Controller",
    "description": "QueryPie SAC is designed for cloud instance protection on AWS, GCP, Azure supporting on-premises as well. ",
    "keywords": [
      "QueryPie SAC",
      "system access controller",
      "AWS",
      "GCP",
      "Azure",
      "on-premise",
      "cloud security",
      "web terminal",
      "QueryPie Proxy",
      "web SFTP",
      "access control"
    ]
  },
  "ko": {
    "title": "QueryPie SAC, System Access Controller",
    "description": "QueryPie SAC는 AWS, GCP, Azure와 같은 클라우드 인스턴스 보호를 위해 설계되었으며, 온프레미스 또한 지원합니다.",
    "keywords": [
      "QueryPie SAC",
      "시스템 접근 제어",
      "AWS",
      "GCP",
      "Azure",
      "온프레미스",
      "클라우드 보안",
      "웹 터미널",
      "QueryPie Proxy",
      "웹 SFTP",
      "System Access Controller",
      "접근 제어"
    ]
  },
  "ja": {
    "title": "QueryPie SAC: System Access Controller",
    "description": "QueryPie SAC は、AWS、GCP、Azure上のクラウドインスタンスを保護するように設計されており、オンプレミス環境にも対応しています。",
    "abstract": "QueryPie SAC は、AWS、GCP、Azure上のクラウドインスタンスを保護するように設計されており、オンプレミス環境にも対応しています。",
    "keywords": [
      "QueryPie SAC",
      "システムアクセスコントローラ",
      "AWS",
      "GCP",
      "Azure",
      "オンプレミス",
      "クラウドセキュリティ"
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
      canonical: getSolutionHref(locale, "acp-system-access-controller"),
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
