import type { Locale } from "@/constants/i18n";

export type SeoPageDefinition = {
  defaultDescription: Record<Locale, string>;
  defaultOgDescription: Record<Locale, string>;
  defaultOgImage: string;
  defaultOgTitle: Record<Locale, string>;
  defaultTitle: Record<Locale, string>;
  description: string;
  key: string;
  label: string;
  matchMode: "detail" | "exact" | "prefix";
  routePattern: string;
};

export type SeoPageKey = string;

export const seoPageDefinitions = [
  {
    key: "home",
    label: "Home",
    description: "퍼블릭 홈 메인 페이지",
    matchMode: "exact",
    routePattern: "",
    defaultTitle: { en: "QueryPie AI", ko: "QueryPie AI", ja: "QueryPie AI" },
    defaultDescription: {
      en: "QueryPie AI helps teams secure and operate AI-driven workflows.",
      ko: "QueryPie AI는 AI 기반 워크플로를 안전하게 운영할 수 있도록 돕습니다.",
      ja: "QueryPie AI は AI ワークフローを安全に運用するための基盤を提供します。",
    },
    defaultOgTitle: { en: "QueryPie AI", ko: "QueryPie AI", ja: "QueryPie AI" },
    defaultOgDescription: {
      en: "Secure and operate AI-driven workflows with QueryPie AI.",
      ko: "QueryPie AI로 AI 기반 워크플로를 안전하게 운영하세요.",
      ja: "QueryPie AI で AI ワークフローを安全に運用しましょう。",
    },
    defaultOgImage: "/images/common/fallback-contents.jpg",
  },
  {
    key: "demo-list",
    label: "Demo List",
    description: "Demo 리스트와 카테고리 페이지",
    matchMode: "exact",
    routePattern: "demo",
    defaultTitle: { en: "Demo", ko: "데모", ja: "Demo" },
    defaultDescription: {
      en: "Browse product demos, use cases, and walkthrough content.",
      ko: "제품 데모, 활용 사례, 워크스루 콘텐츠를 둘러보세요.",
      ja: "製品デモ、ユースケース、ワークスルーを確認できます。",
    },
    defaultOgTitle: { en: "Demo", ko: "데모", ja: "Demo" },
    defaultOgDescription: {
      en: "Explore demo content from QueryPie AI.",
      ko: "QueryPie AI의 데모 콘텐츠를 확인해보세요.",
      ja: "QueryPie AI のデモコンテンツをご覧ください。",
    },
    defaultOgImage: "/images/common/fallback-contents.jpg",
  },
  {
    key: "demo-detail",
    label: "Demo Detail",
    description: "Demo 상세 페이지 기본 SEO",
    matchMode: "detail",
    routePattern: "demo",
    defaultTitle: { en: "Demo Detail", ko: "데모 상세", ja: "Demo Detail" },
    defaultDescription: {
      en: "Read a detailed demo walkthrough from QueryPie AI.",
      ko: "QueryPie AI의 상세 데모 콘텐츠를 읽어보세요.",
      ja: "QueryPie AI の詳細デモコンテンツを確認できます。",
    },
    defaultOgTitle: { en: "Demo Detail", ko: "데모 상세", ja: "Demo Detail" },
    defaultOgDescription: {
      en: "Detailed demo content from QueryPie AI.",
      ko: "QueryPie AI의 상세 데모 콘텐츠입니다.",
      ja: "QueryPie AI の詳細デモコンテンツです。",
    },
    defaultOgImage: "/images/common/fallback-contents.jpg",
  },
  {
    key: "docs-list",
    label: "Documentation List",
    description: "Documentation 리스트와 카테고리 페이지",
    matchMode: "exact",
    routePattern: "docs",
    defaultTitle: { en: "Documentation", ko: "도큐먼트", ja: "Documentation" },
    defaultDescription: {
      en: "Browse guides, manuals, blogs, and documentation content.",
      ko: "가이드, 매뉴얼, 블로그 등 문서 콘텐츠를 둘러보세요.",
      ja: "ガイド、マニュアル、ブログなどの文書コンテンツを確認できます。",
    },
    defaultOgTitle: { en: "Documentation", ko: "도큐먼트", ja: "Documentation" },
    defaultOgDescription: {
      en: "Documentation and guides from QueryPie AI.",
      ko: "QueryPie AI의 문서와 가이드 콘텐츠입니다.",
      ja: "QueryPie AI のドキュメントとガイドです。",
    },
    defaultOgImage: "/images/common/fallback-contents.jpg",
  },
  {
    key: "docs-detail",
    label: "Documentation Detail",
    description: "Documentation 상세 페이지 기본 SEO",
    matchMode: "detail",
    routePattern: "docs",
    defaultTitle: { en: "Documentation Detail", ko: "문서 상세", ja: "Documentation Detail" },
    defaultDescription: {
      en: "Read detailed documentation from QueryPie AI.",
      ko: "QueryPie AI의 상세 문서를 읽어보세요.",
      ja: "QueryPie AI の詳細ドキュメントを確認できます。",
    },
    defaultOgTitle: { en: "Documentation Detail", ko: "문서 상세", ja: "Documentation Detail" },
    defaultOgDescription: {
      en: "Detailed documentation from QueryPie AI.",
      ko: "QueryPie AI의 상세 문서입니다.",
      ja: "QueryPie AI の詳細ドキュメントです。",
    },
    defaultOgImage: "/images/common/fallback-contents.jpg",
  },
  {
    key: "news-list",
    label: "News List",
    description: "News 리스트 페이지",
    matchMode: "prefix",
    routePattern: "news",
    defaultTitle: { en: "News", ko: "뉴스", ja: "News" },
    defaultDescription: {
      en: "Read the latest news and announcements from QueryPie AI.",
      ko: "QueryPie AI의 최신 뉴스와 발표를 확인하세요.",
      ja: "QueryPie AI の最新ニュースとお知らせをご覧ください。",
    },
    defaultOgTitle: { en: "News", ko: "뉴스", ja: "News" },
    defaultOgDescription: {
      en: "Latest news from QueryPie AI.",
      ko: "QueryPie AI의 최신 뉴스입니다.",
      ja: "QueryPie AI の最新ニュースです。",
    },
    defaultOgImage: "/images/common/fallback-contents.jpg",
  },
  {
    key: "plans",
    label: "Plans",
    description: "요금제 페이지",
    matchMode: "exact",
    routePattern: "plans",
    defaultTitle: { en: "Pricing", ko: "요금제", ja: "Pricing" },
    defaultDescription: {
      en: "Compare pricing plans for QueryPie AI.",
      ko: "QueryPie AI의 요금제를 비교해보세요.",
      ja: "QueryPie AI の料金プランを比較できます。",
    },
    defaultOgTitle: { en: "Pricing", ko: "요금제", ja: "Pricing" },
    defaultOgDescription: {
      en: "Explore pricing plans from QueryPie AI.",
      ko: "QueryPie AI의 요금제 정보를 확인하세요.",
      ja: "QueryPie AI の料金プランをご覧ください。",
    },
    defaultOgImage: "/images/common/fallback-contents.jpg",
  },
  {
    key: "contact-us",
    label: "Contact Us",
    description: "문의하기 페이지",
    matchMode: "exact",
    routePattern: "contact-us",
    defaultTitle: { en: "Contact Us", ko: "문의하기", ja: "Contact Us" },
    defaultDescription: {
      en: "Contact QueryPie AI for sales, support, and partnership inquiries.",
      ko: "영업, 지원, 파트너십 문의를 위해 QueryPie AI에 연락하세요.",
      ja: "営業・サポート・提携に関するお問い合わせはこちら。",
    },
    defaultOgTitle: { en: "Contact Us", ko: "문의하기", ja: "Contact Us" },
    defaultOgDescription: {
      en: "Get in touch with QueryPie AI.",
      ko: "QueryPie AI에 문의하세요.",
      ja: "QueryPie AI へお問い合わせください。",
    },
    defaultOgImage: "/images/common/fallback-contents.jpg",
  },
] as const satisfies readonly SeoPageDefinition[];

export type SeoLocalizedFields = {
  description: Record<Locale, string>;
  ogDescription: Record<Locale, string>;
  ogTitle: Record<Locale, string>;
  title: Record<Locale, string>;
};

export type SeoEntry = SeoLocalizedFields & {
  canonicalPath?: string;
  key: SeoPageKey;
  ogImage: string;
  robotsFollow: boolean;
  robotsIndex: boolean;
};

export type SeoDiscoveryCandidate = {
  defaultDescription: Record<Locale, string>;
  defaultOgDescription: Record<Locale, string>;
  defaultOgImage: string;
  defaultOgTitle: Record<Locale, string>;
  defaultTitle: Record<Locale, string>;
  description: string;
  key: string;
  label: string;
  matchMode: "detail" | "exact" | "prefix";
  routePattern: string;
};

export const SEO_STORAGE_KEY = "querypie-admin-seo";
export const SEO_STORE_EVENT = "querypie:seo:changed";
export const SEO_DEFINITIONS_STORAGE_KEY = "querypie-admin-seo-definitions";
export const SEO_DEFINITIONS_STORE_EVENT = "querypie:seo-definitions:changed";

export function buildDefaultSeoEntries(definitions: readonly SeoPageDefinition[] = seoPageDefinitions): SeoEntry[] {
  return definitions.map((definition) => ({
  key: definition.key,
  title: definition.defaultTitle,
  description: definition.defaultDescription,
  ogTitle: definition.defaultOgTitle,
  ogDescription: definition.defaultOgDescription,
  ogImage: definition.defaultOgImage,
  robotsFollow: true,
  robotsIndex: true,
  }));
}

export const defaultSeoEntries: SeoEntry[] = buildDefaultSeoEntries();

export function normalizeSeoEntries(entries: Partial<SeoEntry>[], definitions: readonly SeoPageDefinition[] = seoPageDefinitions) {
  return buildDefaultSeoEntries(definitions).map((defaultEntry) => {
    const override = entries.find((entry) => entry.key === defaultEntry.key);
    return {
      ...defaultEntry,
      ...override,
      title: {
        ...defaultEntry.title,
        ...override?.title,
      },
      description: {
        ...defaultEntry.description,
        ...override?.description,
      },
      ogTitle: {
        ...defaultEntry.ogTitle,
        ...override?.ogTitle,
      },
      ogDescription: {
        ...defaultEntry.ogDescription,
        ...override?.ogDescription,
      },
    };
  });
}

function matchesPattern(routePath: string, definition: SeoPageDefinition) {
  if (definition.matchMode === "exact") {
    return routePath === definition.routePattern;
  }

  if (definition.matchMode === "detail") {
    return routePath.startsWith(`${definition.routePattern}/`);
  }

  return routePath === definition.routePattern || routePath.startsWith(`${definition.routePattern}/`);
}

export function resolveSeoPageKey(pathname: string, definitions: readonly SeoPageDefinition[] = seoPageDefinitions): SeoPageKey | null {
  const segments = pathname.split("/").filter(Boolean);
  const routePath = segments.slice(1).join("/");
  return definitions.find((definition) => matchesPattern(routePath, definition))?.key ?? null;
}

function toTitleCase(value: string) {
  return value
    .split("-")
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
}

export function createSeoDefinitionTemplate(routePath: string, matchMode: SeoPageDefinition["matchMode"]): SeoPageDefinition {
  const baseLabel = routePath ? toTitleCase(routePath.split("/").at(-1) ?? routePath) : "Home";
  const label = matchMode === "detail" ? `${baseLabel} Detail` : baseLabel;
  const key = routePath ? `${routePath.replaceAll("/", "-")}${matchMode === "detail" ? "-detail" : ""}` : "home";
  const description =
    matchMode === "detail"
      ? `${label} 상세 페이지 SEO`
      : `${label} 리스트 또는 고정 페이지 SEO`;

  return {
    key,
    label,
    description,
    matchMode,
    routePattern: routePath,
    defaultTitle: {
      en: label,
      ko: label,
      ja: label,
    },
    defaultDescription: {
      en: `${label} page`,
      ko: `${label} 페이지`,
      ja: `${label} ページ`,
    },
    defaultOgTitle: {
      en: label,
      ko: label,
      ja: label,
    },
    defaultOgDescription: {
      en: `${label} page`,
      ko: `${label} 페이지`,
      ja: `${label} ページ`,
    },
    defaultOgImage: "/images/common/fallback-contents.jpg",
  };
}
