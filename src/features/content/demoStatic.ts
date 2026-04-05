import type { Locale } from "@/constants/i18n";
import { demoCategoryConfigs, getCategoryLabel, type DemoCategorySlug } from "./config";

type DemoStaticSource = {
  bodyMarkdown: Record<Locale, string>;
  categorySlug: Exclude<DemoCategorySlug, "all" | "use-cases" | "webinars">;
  date: string;
  imageSrc: string;
  slug: string;
  title: Record<Locale, string>;
  writer: string;
};

export type DemoStaticEntry = {
  bodyMarkdown: string;
  category: string;
  categorySlug: Exclude<DemoCategorySlug, "all" | "use-cases" | "webinars">;
  date: string;
  href: string;
  imageSrc: string;
  slug: string;
  title: string;
  writer: string;
};

const demoStaticSources: DemoStaticSource[] = [
  {
    bodyMarkdown: {
      en: `Guardrails need to be visible in the product experience, not hidden as an afterthought.

## What matters

- Teams need clear approval paths for risky actions.
- Users need predictable behavior from AI systems.
- Operators need traceable policy decisions.

### Design principle

Put review, escalation, and execution evidence into the same workflow.`,
      ko: `가드레일은 나중에 붙이는 안전장치가 아니라 제품 경험 안에서 보이는 규칙이어야 합니다.

## 중요한 점

- 위험한 액션에는 명확한 승인 흐름이 필요합니다.
- 사용자는 예측 가능한 AI 동작을 기대합니다.
- 운영자는 정책 판단 근거를 추적할 수 있어야 합니다.

### 설계 원칙

검토, 승인, 실행 근거를 하나의 워크플로 안에 넣어야 합니다.`,
      ja: `ガードレールは後付けの安全装置ではなく、製品体験の中で見えるルールであるべきです。`,
    },
    categorySlug: "aip-features",
    date: "2026-03-12",
    imageSrc: "/uploads/article-02.png",
    slug: "guardrail-design",
    title: {
      en: "Guardrail Design in the AI Agent Era (2026 Edition) — Part 1: Philosophy & Design",
      ko: "AI 에이전트 시대의 가드레일 설계 (2026 에디션) — Part 1: 철학과 설계",
      ja: "AI エージェント時代のガードレール設計 (2026 Edition) — Part 1: Philosophy & Design",
    },
    writer: "QueryPie Team / AI Strategy",
  },
  {
    bodyMarkdown: {
      en: `Execution-based security maps how AI actions move across systems and where policy must intercept.

## Framework

1. Identify execution surfaces.
2. Map approval boundaries.
3. Add evidence and review points.`,
      ko: `실행 기반 보안은 AI 액션이 시스템 사이를 어떻게 이동하는지, 어디에서 정책이 개입해야 하는지를 정리합니다.

## 프레임워크

1. 실행 표면을 식별합니다.
2. 승인 경계를 맵핑합니다.
3. 증적과 검토 지점을 추가합니다.`,
      ja: `実行ベースのセキュリティは、AI アクションがシステム間をどう移動するかと、どこでポリシーが介入すべきかを整理します。`,
    },
    categorySlug: "acp-features",
    date: "2026-03-08",
    imageSrc: "/uploads/article-03.png",
    slug: "ai-security-map",
    title: {
      en: "AI Security Threat Map 2026 | 7 Attack Vectors and Practical Defense Framework for CxOs",
      ko: "AI 보안 위협 맵 2026 | 7가지 공격 벡터와 CxO를 위한 실전 방어 프레임워크",
      ja: "AI Security Threat Map 2026 | 7 Attack Vectors and Practical Defense Framework for CxOs",
    },
    writer: "QueryPie Team / Security Research",
  },
];

export function getStaticDemoEntries(locale: Locale): DemoStaticEntry[] {
  return demoStaticSources.map((source) => ({
    bodyMarkdown: source.bodyMarkdown[locale],
    category: getCategoryLabel(demoCategoryConfigs, source.categorySlug, locale),
    categorySlug: source.categorySlug,
    date: source.date,
    href: `/${locale}/demo/${source.slug}`,
    imageSrc: source.imageSrc,
    slug: source.slug,
    title: source.title[locale],
    writer: source.writer,
  }));
}

export function getStaticDemoEntry(locale: Locale, slug: string) {
  return getStaticDemoEntries(locale).find((entry) => entry.slug === slug);
}
