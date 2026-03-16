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

type CategoryConfig<TSlug extends string> = {
  href: (locale: Locale) => string;
  label: Record<Locale, string>;
  slug: TSlug;
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
  if (section === "demo") {
    return [
      { href: "/admin/demo", label: "All" },
      { href: "/admin/demo/use-cases", label: "Use Cases" },
      { href: "/admin/demo/aip-features", label: "AIP Features" },
      { href: "/admin/demo/acp-features", label: "ACP Features" },
      { href: "/admin/demo/webinars", label: "Webinars" },
    ];
  }

  return [
    { href: "/admin/documentation", label: "All" },
    { href: "/admin/documentation/introduction-decks", label: "Introduction Decks" },
    { href: "/admin/documentation/glossary", label: "Glossary" },
    { href: "/admin/documentation/manuals", label: "Manuals" },
    { href: "/admin/documentation/blogs", label: "Blogs" },
  ];
}
