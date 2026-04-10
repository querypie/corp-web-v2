import { getLocalePath, type Locale } from "@/constants/i18n";

export type DemoCategorySlug =
  | "all"
  | "use-cases"
  | "aip-features"
  | "acp-features"
  | "webinars";

export type DocsCategorySlug =
  | "all"
  | "introduction"
  | "glossary"
  | "manuals"
  | "white-papers"
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
    href: (locale) => getLocalePath(locale, "/features/demo"),
    label: { en: "All", ko: "All", ja: "All" },
    slug: "all",
  },
  {
    href: (locale) => `${getLocalePath(locale, "/features/demo")}?category=use-cases`,
    label: { en: "Use Cases", ko: "Use Cases", ja: "Use Cases" },
    slug: "use-cases",
  },
  {
    href: (locale) => `${getLocalePath(locale, "/features/demo")}?category=aip-features`,
    label: { en: "AIP Features", ko: "AIP Features", ja: "AIP Features" },
    slug: "aip-features",
  },
  {
    href: (locale) => `${getLocalePath(locale, "/features/demo")}?category=acp-features`,
    label: { en: "ACP Features", ko: "ACP Features", ja: "ACP Features" },
    slug: "acp-features",
  },
  {
    href: (locale) => `${getLocalePath(locale, "/features/demo")}?category=webinars`,
    label: { en: "Webinars", ko: "Webinars", ja: "Webinars" },
    slug: "webinars",
  },
];

export const docsCategoryConfigs: CategoryConfig<DocsCategorySlug>[] = [
  {
    href: (locale) => getLocalePath(locale, "/features/documentation"),
    label: { en: "All", ko: "All", ja: "All" },
    slug: "all",
  },
  {
    href: (locale) => `${getLocalePath(locale, "/features/documentation")}?category=introduction`,
    label: { en: "Introduction", ko: "Introduction", ja: "Introduction" },
    slug: "introduction",
  },
  {
    href: (locale) => `${getLocalePath(locale, "/features/documentation")}?category=glossary`,
    label: { en: "Glossary", ko: "Glossary", ja: "Glossary" },
    slug: "glossary",
  },
  {
    href: (locale) => `${getLocalePath(locale, "/features/documentation")}?category=manuals`,
    label: { en: "Manuals", ko: "Manuals", ja: "Manuals" },
    slug: "manuals",
  },
  {
<<<<<<< HEAD
    href: (locale) => `${getLocalePath(locale, "/features/documentation")}?category=white-papers`,
    label: { en: "White Papers", ko: "White Papers", ja: "White Papers" },
    slug: "white-papers",
  },
  {
    href: (locale) => `${getLocalePath(locale, "/features/documentation")}?category=blogs`,
    label: { en: "Blogs", ko: "Blogs", ja: "Blogs" },
=======
    href: (locale) => `/${locale}/docs?category=white-papers`,
    label: { en: "White Papers", ko: "화이트페이퍼", ja: "White Papers" },
    slug: "white-papers",
  },
  {
    href: (locale) => `/${locale}/docs?category=blogs`,
    label: { en: "Blogs", ko: "블로그", ja: "Blogs" },
>>>>>>> origin/main
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
    href: "/admin/documentation/introduction",
    label: "Introduction",
    slug: "introduction",
    title: "Introduction",
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
    description: "화이트페이퍼 문서와 게시 상태, 노출 순서를 관리합니다.",
    href: "/admin/documentation/white-papers",
    label: "White Papers",
    slug: "white-papers",
    title: "White Papers",
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

export function getCategoryHref<TSlug extends string>(
  configs: CategoryConfig<TSlug>[],
  slug: TSlug,
  locale: Locale,
) {
  return configs.find((config) => config.slug === slug)?.href(locale) ?? "";
}

export function isDemoCategorySlug(value: string | undefined): value is DemoCategorySlug {
  return !!value && demoCategoryConfigs.some((config) => config.slug === value);
}

export function isDocsCategorySlug(value: string | undefined): value is DocsCategorySlug {
  return !!value && docsCategoryConfigs.some((config) => config.slug === value);
}

export function normalizeDocsCategoryParam(value: string | undefined): DocsCategorySlug | null {
  if (!value) return null;
  if (value === "introduction-decks") return "introduction";
  return isDocsCategorySlug(value) ? value : null;
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
