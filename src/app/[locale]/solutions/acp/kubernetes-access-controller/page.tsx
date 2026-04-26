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
    "title": "QueryPie KAC, Kubernetes Access Controller",
    "description": "QueryPie KAC is for Kubernetes API protection, managing  AWS Eks and on-premises clusters. ",
    "keywords": [
      "QueryPie KAC",
      "Kubernetes access controller",
      "AWS Eks",
      "Kubernetes API protection",
      "automation",
      "ABAC",
      "RBAC",
      "session recording",
      "Kubernetes cluster",
      "SSH connection"
    ]
  },
  "ko": {
    "title": "QueryPie KAC, Kubernetes Access Controller",
    "description": "QueryPie KAC는 AWS EKS와 온프레미스 클러스터를 관리하며, 쿠버네티스 API 보호를 위한 솔루션입니다.",
    "keywords": [
      "QueryPie KAC",
      "쿠버네티스 접근 제어기",
      "AWS EKS",
      "쿠버네티스 API 보호",
      "자동화",
      "ABAC",
      "RBAC",
      "세션 기록",
      "쿠버네티스 클러스터",
      "SSH 연결"
    ]
  },
  "ja": {
    "title": "QueryPie KAC:  Kubernetes Access Controller",
    "description": "QueryPie KAC は、Kubernetes API 保護や AWS EKS、オンプレミスクラスタなどのクーバネティスを管理します。",
    "abstract": "QueryPie KAC は、Kubernetes API 保護や AWS EKS、オンプレミスクラスタなどのクーバネティスを管理します。",
    "keywords": [
      "QueryPie KAC",
      "Kubernetes アクセスコントローラ",
      "AWS Eks",
      "Kubernetes API 保護",
      "自動化",
      "ABAC",
      "RBAC",
      "セッション録音",
      "Kubernetes クラスタ",
      "SSH 接続",
      "クーバネティス",
      "クバネティス"
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
      canonical: getSolutionHref(locale, "acp-kubernetes-access-controller"),
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
