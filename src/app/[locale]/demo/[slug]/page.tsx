import { notFound } from "next/navigation";
import { isLocale } from "../../../../constants/i18n";
import DemoDetailPage from "../../../../components/pages/demo/DemoDetailPage";
import type { DocsDetailPageProps } from "../../../../components/pages/docs/DocsDetailPage";

type DemoDetailRouteProps = {
  params: Promise<{ locale: string; slug: string }>;
};

const slugImageMap: Record<string, string> = {
  "seo-analysis": "/images/content/article-01.png",
  "guardrail-design": "/images/content/article-02.png",
  "ai-security-map": "/images/content/article-03.png",
};

export default async function DemoDetailRoute({ params }: DemoDetailRouteProps) {
  const { locale, slug } = await params;

  if (!isLocale(locale)) notFound();

  const copy = {
    en: {
      bodyMarkdown: `This demo walkthrough shows how AIP and ACP scenarios can be explored with the same execution-based security mindset.

## Overview

Use the demo environment to validate product behavior, explore real workflows, and understand how teams apply QueryPie in practice.

### What you'll learn

1. How the product behaves in a realistic operational context.
2. Which workflows are automated or guarded by default.
3. What teams should validate before rolling out to production.`,
      category: "Use Cases",
      contentListDescription:
        "Explore more demos, walkthroughs, and product-focused examples.",
      contentListItems: [
        {
          category: "Use Cases",
          href: `/${locale}/demo/seo-analysis`,
          imageSrc: "/images/content/article-01.png",
          title: "SEO analysis, once considered the domain of specialists, can now be handled by an AIP agent.",
        },
        {
          category: "AIP Features",
          href: `/${locale}/demo/guardrail-design`,
          imageSrc: "/images/content/article-02.png",
          title: "Guardrail Design in the AI Agent Era (2026 Edition) — Part 1: Philosophy & Design",
        },
        {
          category: "ACP Features",
          href: `/${locale}/demo/ai-security-map`,
          imageSrc: "/images/content/article-03.png",
          title: "AI Security Threat Map 2026 | 7 Attack Vectors and Practical Defense Framework for CxOs",
        },
      ],
      contentListLinks: ["Use Cases", "AIP Features", "ACP Features"],
      contentListTitle: "Demo List",
      date: "February 20, 2026",
      heroImageAlt: "Demo detail hero image",
      heroImageSrc: "/images/content/article-01.png",
      title: "Demo Detail Page",
      writer: "QueryPie Team",
    },
    ko: {
      bodyMarkdown: `이 데모 상세 페이지는 AIP와 ACP 시나리오를 실행 기반 보안 관점으로 살펴볼 수 있도록 구성되었습니다.

## 개요

데모 환경을 통해 실제 업무 흐름 속에서 제품이 어떻게 동작하는지 확인하고, 운영 전 검증 포인트를 빠르게 파악할 수 있습니다.

### 확인할 내용

1. 실제 운영 시나리오에서 제품이 어떻게 동작하는지
2. 기본적으로 자동화되거나 보호되는 흐름이 무엇인지
3. 운영 전 반드시 검증해야 할 항목이 무엇인지`,
      category: "활용 사례",
      contentListDescription:
        "관련 데모와 제품 예제를 더 확인해보세요.",
      contentListItems: [
        {
          category: "활용 사례",
          href: `/${locale}/demo/seo-analysis`,
          imageSrc: "/images/content/article-01.png",
          title: "전문가의 영역으로 여겨지던 SEO 분석도 이제는 AIP 에이전트가 처리할 수 있습니다.",
        },
        {
          category: "AIP 기능",
          href: `/${locale}/demo/guardrail-design`,
          imageSrc: "/images/content/article-02.png",
          title: "AI 에이전트 시대의 가드레일 설계 (2026 에디션) — Part 1: 철학과 설계",
        },
        {
          category: "ACP 기능",
          href: `/${locale}/demo/ai-security-map`,
          imageSrc: "/images/content/article-03.png",
          title: "AI 보안 위협 맵 2026 | 7가지 공격 벡터와 CxO를 위한 실전 방어 프레임워크",
        },
      ],
      contentListLinks: ["활용 사례", "AIP 기능", "ACP 기능"],
      contentListTitle: "데모 리스트",
      date: "2026년 2월 20일",
      heroImageAlt: "데모 상세 대표 이미지",
      heroImageSrc: "/images/content/article-01.png",
      title: "데모 상세 페이지",
      writer: "QueryPie Team",
    },
    ja: {
      bodyMarkdown: `このデモ詳細ページでは、AIP と ACP のシナリオを実行ベースのセキュリティ視点で確認できます。

## 概要

デモ環境を通じて、実際の業務フローで製品がどのように動作するかを確認し、導入前の確認ポイントをすばやく把握できます。

### 確認ポイント

1. 実運用シナリオで製品がどう動くか
2. どのフローが自動化または保護されるか
3. 本番導入前に何を確認すべきか`,
      category: "Use Cases",
      contentListDescription:
        "関連するデモや製品ユースケースもあわせて確認できます。",
      contentListItems: [
        {
          category: "Use Cases",
          href: `/${locale}/demo/seo-analysis`,
          imageSrc: "/images/content/article-01.png",
          title: "専門家の領域だった SEO 分析も、いまでは AIP エージェントで実行できます。",
        },
        {
          category: "AIP Features",
          href: `/${locale}/demo/guardrail-design`,
          imageSrc: "/images/content/article-02.png",
          title: "AI エージェント時代のガードレール設計 (2026 Edition) — Part 1: Philosophy & Design",
        },
        {
          category: "ACP Features",
          href: `/${locale}/demo/ai-security-map`,
          imageSrc: "/images/content/article-03.png",
          title: "AI Security Threat Map 2026 | 7 Attack Vectors and Practical Defense Framework for CxOs",
        },
      ],
      contentListLinks: ["Use Cases", "AIP Features", "ACP Features"],
      contentListTitle: "Demo List",
      date: "2026年2月20日",
      heroImageAlt: "デモ詳細ヒーロー画像",
      heroImageSrc: "/images/content/article-01.png",
      title: "Demo Detail Page",
      writer: "QueryPie Team",
    },
  }[locale];

  const heroImageSrc = slugImageMap[slug] ?? copy.heroImageSrc;

  return (
    <DemoDetailPage
      docsHref={`/${locale}/demo`}
      slug={slug}
      {...(copy as Omit<DocsDetailPageProps, "docsHref" | "slug" | "heroImageSrc">)}
      heroImageSrc={heroImageSrc}
    />
  );
}
