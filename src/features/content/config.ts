import type { Locale } from "@/constants/i18n";

export type DemoCategorySlug =
  | "all"
  | "use-cases"
  | "aip-features"
  | "acp-features"
  | "webinars";

export type DocsCategorySlug =
  | "all"
  | "introduction-decks"
  | "glossary"
  | "manuals"
  | "blogs";

export type NewsCategorySlug = "news";

type CategoryConfig<TSlug extends string> = {
  href: (locale: Locale) => string;
  label: Record<Locale, string>;
  slug: TSlug;
};

type AdminCategoryConfig<TSlug extends string> = {
  description: string;
  href: string;
  label: string;
  slug: TSlug;
  title: string;
};

export const demoCategoryConfigs: CategoryConfig<DemoCategorySlug>[] = [
  {
    href: (locale) => `/${locale}/demo`,
    label: { en: "All", ko: "전체", ja: "All" },
    slug: "all",
  },
  {
    href: (locale) => `/${locale}/demo?category=use-cases`,
    label: { en: "Use Cases", ko: "Use Cases", ja: "Use Cases" },
    slug: "use-cases",
  },
  {
    href: (locale) => `/${locale}/demo?category=aip-features`,
    label: { en: "AIP Features", ko: "AIP Features", ja: "AIP Features" },
    slug: "aip-features",
  },
  {
    href: (locale) => `/${locale}/demo?category=acp-features`,
    label: { en: "ACP Features", ko: "ACP Features", ja: "ACP Features" },
    slug: "acp-features",
  },
  {
    href: (locale) => `/${locale}/demo?category=webinars`,
    label: { en: "Webinars", ko: "Webinars", ja: "Webinars" },
    slug: "webinars",
  },
];

export const docsCategoryConfigs: CategoryConfig<DocsCategorySlug>[] = [
  {
    href: (locale) => `/${locale}/docs`,
    label: { en: "All", ko: "전체", ja: "All" },
    slug: "all",
  },
  {
    href: (locale) => `/${locale}/docs?category=introduction-decks`,
    label: { en: "Introduction Decks", ko: "소개 덱", ja: "Introduction Decks" },
    slug: "introduction-decks",
  },
  {
    href: (locale) => `/${locale}/docs?category=glossary`,
    label: { en: "Glossary", ko: "용어집", ja: "Glossary" },
    slug: "glossary",
  },
  {
    href: (locale) => `/${locale}/docs?category=manuals`,
    label: { en: "Manuals", ko: "매뉴얼", ja: "Manuals" },
    slug: "manuals",
  },
  {
    href: (locale) => `/${locale}/docs?category=blogs`,
    label: { en: "Blogs", ko: "블로그", ja: "Blogs" },
    slug: "blogs",
  },
];

const demoAdminCategoryConfigs: AdminCategoryConfig<DemoCategorySlug>[] = [
  {
    description: "데모 콘텐츠를 생성하고 순서, 노출 상태, 게시 흐름을 관리합니다.",
    href: "/admin/demo",
    label: "All",
    slug: "all",
    title: "Demo",
  },
  {
    description: "홈페이지 활용 사례 콘텐츠의 노출 상태와 게시 흐름을 관리합니다.",
    href: "/admin/demo/use-cases",
    label: "Use Cases",
    slug: "use-cases",
    title: "Use Cases",
  },
  {
    description: "AIP 기능 데모 콘텐츠와 문구, 노출 순서를 관리합니다.",
    href: "/admin/demo/aip-features",
    label: "AIP Features",
    slug: "aip-features",
    title: "AIP Features",
  },
  {
    description: "ACP 기능 데모 콘텐츠와 문구, 노출 순서를 관리합니다.",
    href: "/admin/demo/acp-features",
    label: "ACP Features",
    slug: "acp-features",
    title: "ACP Features",
  },
  {
    description: "웨비나 데모, 다시보기 링크, 후속 안내 콘텐츠를 관리합니다.",
    href: "/admin/demo/webinars",
    label: "Webinars",
    slug: "webinars",
    title: "Webinars",
  },
];

const docsAdminCategoryConfigs: AdminCategoryConfig<DocsCategorySlug>[] = [
  {
    description: "문서 콘텐츠 목록과 상세 페이지, 관련 콘텐츠 흐름을 관리합니다.",
    href: "/admin/documentation",
    label: "All",
    slug: "all",
    title: "Documentation",
  },
  {
    description: "소개 덱 콘텐츠와 노출 순서를 관리합니다.",
    href: "/admin/documentation/introduction-decks",
    label: "Introduction Decks",
    slug: "introduction-decks",
    title: "Introduction Decks",
  },
  {
    description: "용어집 콘텐츠와 게시 노출 상태를 관리합니다.",
    href: "/admin/documentation/glossary",
    label: "Glossary",
    slug: "glossary",
    title: "Glossary",
  },
  {
    description: "매뉴얼 문서와 정렬 순서, 관련 콘텐츠 흐름을 관리합니다.",
    href: "/admin/documentation/manuals",
    label: "Manuals",
    slug: "manuals",
    title: "Manuals",
  },
  {
    description: "블로그 문서의 게시 상태와 노출 순서를 관리합니다.",
    href: "/admin/documentation/blogs",
    label: "Blogs",
    slug: "blogs",
    title: "Blogs",
  },
];

function getAdminCategoryConfigs(section: "demo" | "documentation") {
  return section === "demo" ? demoAdminCategoryConfigs : docsAdminCategoryConfigs;
}

export function getCategoryLabel<TSlug extends string>(
  configs: CategoryConfig<TSlug>[],
  slug: TSlug,
  locale: Locale,
) {
  return configs.find((config) => config.slug === slug)?.label[locale] ?? "";
}

export function isDemoCategorySlug(value: string | undefined): value is DemoCategorySlug {
  return !!value && demoCategoryConfigs.some((config) => config.slug === value);
}

export function isDocsCategorySlug(value: string | undefined): value is DocsCategorySlug {
  return !!value && docsCategoryConfigs.some((config) => config.slug === value);
}

export function getPublicMenuItems<TSlug extends string>(
  configs: CategoryConfig<TSlug>[],
  locale: Locale,
  activeSlug: TSlug,
) {
  return configs.map((config) => ({
    href: config.href(locale),
    isActive: config.slug === activeSlug,
    label: config.label[locale],
    slug: config.slug,
  }));
}

export function getAdminSectionMenuItems(section: "demo" | "documentation") {
  return getAdminCategoryConfigs(section).map(({ href, label, slug }) => ({
    href,
    label,
    slug,
  }));
}

export function getAdminCategoryPageMeta(
  section: "demo",
  categorySlug: DemoCategorySlug,
): Pick<AdminCategoryConfig<DemoCategorySlug>, "description" | "title">;
export function getAdminCategoryPageMeta(
  section: "documentation",
  categorySlug: DocsCategorySlug,
): Pick<AdminCategoryConfig<DocsCategorySlug>, "description" | "title">;
export function getAdminCategoryPageMeta(
  section: "demo" | "documentation",
  categorySlug: DemoCategorySlug | DocsCategorySlug,
) {
  const config = getAdminCategoryConfigs(section).find((item) => item.slug === categorySlug);

  return {
    description: config?.description ?? "",
    title: config?.title ?? "",
  };
}

export function isAdminSectionCategory(
  section: "demo",
  categorySlug: string,
): categorySlug is DemoCategorySlug;
export function isAdminSectionCategory(
  section: "documentation",
  categorySlug: string,
): categorySlug is DocsCategorySlug;
export function isAdminSectionCategory(
  section: "demo" | "documentation",
  categorySlug: string,
) {
  return getAdminCategoryConfigs(section).some((item) => item.slug === categorySlug);
}
