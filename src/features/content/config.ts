import type { Locale } from "@/constants/i18n";
import { getPublicCategoryHref } from "@/features/content/publicPaths";

export type DemoCategorySlug =
  | "all"
  | "aip-features"
  | "acp-features";

export type DocsCategorySlug =
  | "all"
  | "introduction"
  | "glossary"
  | "manuals"
  | "white-papers"
  | "blogs"
  | "voc"
  | "events";

export type NewsCategorySlug = "news";

type CategoryConfig<TSlug extends string> = {
  href: (locale: Locale) => string;
  label: Record<Locale, string>;
  slug: TSlug;
};

export type PublicMenuLinkItem<TSlug extends string = string> = {
  href: string;
  isActive: boolean;
  kind: "link";
  label: string;
  slug: TSlug;
};

export type PublicMenuSectionItem = {
  kind: "section";
  label: string;
};

export type PublicMenuDividerItem = {
  kind: "divider";
};

export type PublicMenuItem<TSlug extends string = string> =
  | PublicMenuLinkItem<TSlug>
  | PublicMenuSectionItem
  | PublicMenuDividerItem;

type AdminCategoryConfig<TSlug extends string> = {
  description: string;
  href: string;
  label: string;
  slug: TSlug;
  title: string;
};

export const demoCategoryConfigs: CategoryConfig<DemoCategorySlug>[] = [
  {
    href: (locale) => getPublicCategoryHref("demo", locale, "all"),
    label: { en: "All", ko: "전체", ja: "すべて" },
    slug: "all",
  },
  {
    href: (locale) => getPublicCategoryHref("demo", locale, "aip-features"),
    label: { en: "AIP Use Cases", ko: "AIP 활용", ja: "AIP機能" },
    slug: "aip-features",
  },
  {
    href: (locale) => getPublicCategoryHref("demo", locale, "acp-features"),
    label: { en: "ACP Use Cases", ko: "ACP 활용", ja: "ACP機能" },
    slug: "acp-features",
  },
];

export const docsCategoryConfigs: CategoryConfig<DocsCategorySlug>[] = [
  {
    href: (locale) => getPublicCategoryHref("resources", locale, "all"),
    label: { en: "All", ko: "전체", ja: "すべて" },
    slug: "all",
  },
  {
    href: (locale) => getPublicCategoryHref("resources", locale, "introduction"),
    label: { en: "Introduction Decks", ko: "제품 소개", ja: "製品紹介" },
    slug: "introduction",
  },
  {
    href: (locale) => getPublicCategoryHref("resources", locale, "glossary"),
    label: { en: "Glossary", ko: "용어집", ja: "用語集" },
    slug: "glossary",
  },
  {
    href: (locale) => getPublicCategoryHref("resources", locale, "manuals"),
    label: { en: "Manuals", ko: "매뉴얼", ja: "マニュアル" },
    slug: "manuals",
  },
  {
    href: (locale) => getPublicCategoryHref("resources", locale, "white-papers"),
    label: { en: "White Papers", ko: "화이트페이퍼", ja: "ホワイトペーパー" },
    slug: "white-papers",
  },
  {
    href: (locale) => getPublicCategoryHref("resources", locale, "blogs"),
    label: { en: "Blog", ko: "블로그", ja: "ブログ" },
    slug: "blogs",
  },
  {
    href: (locale) => getPublicCategoryHref("resources", locale, "voc"),
    label: { en: "VOC", ko: "고객의 목소리", ja: "お客様の声" },
    slug: "voc",
  },
  {
    href: (locale) => getPublicCategoryHref("resources", locale, "events"),
    label: { en: "Events", ko: "이벤트", ja: "イベント" },
    slug: "events",
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
    description: "AIP 기능 데모 콘텐츠와 문구, 노출 순서를 관리합니다.",
    href: "/admin/demo/aip-features",
    label: "AIP Use Cases",
    slug: "aip-features",
    title: "AIP Use Cases",
  },
  {
    description: "ACP 기능 데모 콘텐츠와 문구, 노출 순서를 관리합니다.",
    href: "/admin/demo/acp-features",
    label: "ACP Use Cases",
    slug: "acp-features",
    title: "ACP Use Cases",
  },
];

const docsAdminCategoryConfigs: AdminCategoryConfig<DocsCategorySlug>[] = [
  {
    description: "문서 콘텐츠 목록과 상세 페이지, 관련 콘텐츠 흐름을 관리합니다.",
    href: "/admin/resources",
    label: "All",
    slug: "all",
    title: "Resources",
  },
  {
    description: "소개 덱 콘텐츠와 노출 순서를 관리합니다.",
    href: "/admin/resources/introduction",
    label: "Introduction Decks",
    slug: "introduction",
    title: "Introduction Decks",
  },
  {
    description: "용어집 콘텐츠와 게시 노출 상태를 관리합니다.",
    href: "/admin/resources/glossary",
    label: "Glossary",
    slug: "glossary",
    title: "Glossary",
  },
  {
    description: "매뉴얼 문서와 정렬 순서, 관련 콘텐츠 흐름을 관리합니다.",
    href: "/admin/resources/manuals",
    label: "Manuals",
    slug: "manuals",
    title: "Manuals",
  },
  {
    description: "화이트페이퍼 문서와 게시 상태, 노출 순서를 관리합니다.",
    href: "/admin/resources/white-papers",
    label: "White Papers",
    slug: "white-papers",
    title: "White Papers",
  },
  {
    description: "블로그 문서의 게시 상태와 노출 순서를 관리합니다.",
    href: "/admin/resources/blogs",
    label: "Blog",
    slug: "blogs",
    title: "Blog",
  },
  {
    description: "Voice of the Customer 콘텐츠의 게시 상태와 노출 순서를 관리합니다.",
    href: "/admin/resources/voc",
    label: "VOC",
    slug: "voc",
    title: "VOC",
  },
  {
    description: "이벤트, 웨비나, 세미나 콘텐츠와 게시 상태를 관리합니다.",
    href: "/admin/resources/events",
    label: "Events",
    slug: "events",
    title: "Events",
  },
];

function getAdminCategoryConfigs(section: "demo" | "resources") {
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

export function getPublicMenuItems<TSlug extends string>(
  configs: CategoryConfig<TSlug>[],
  locale: Locale,
  activeSlug: TSlug,
): PublicMenuLinkItem<TSlug>[] {
  return configs.map((config) => ({
    href: config.href(locale),
    isActive: config.slug === activeSlug,
    kind: "link",
    label: config.label[locale],
    slug: config.slug,
  }));
}

const docsCmsCategorySlugs: DocsCategorySlug[] = [
  "all",
  "introduction",
  "glossary",
  "manuals",
  "white-papers",
  "blogs",
  "voc",
  "events",
];

export function getResourcesSidebarMenuItems(
  locale: Locale,
  activeSlug: DocsCategorySlug,
  visibleCategorySlugs?: readonly DocsCategorySlug[],
): PublicMenuItem<DocsCategorySlug>[] {
  const visibleCategorySlugSet = visibleCategorySlugs ? new Set<DocsCategorySlug>(visibleCategorySlugs) : null;

  return getPublicMenuItems(
    docsCategoryConfigs.filter((config) => {
      if (!docsCmsCategorySlugs.includes(config.slug)) return false;
      if (config.slug === "all") return true;

      return !visibleCategorySlugSet || visibleCategorySlugSet.has(config.slug);
    }),
    locale,
    activeSlug,
  );
}

export function getAdminSectionMenuItems(section: "demo" | "resources") {
  return getAdminCategoryConfigs(section)
    .filter((item) => section !== "demo" || item.slug !== "all")
    .map(({ href, label, slug }) => ({
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
  section: "resources",
  categorySlug: DocsCategorySlug,
): Pick<AdminCategoryConfig<DocsCategorySlug>, "description" | "title">;
export function getAdminCategoryPageMeta(
  section: "demo" | "resources",
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
  section: "resources",
  categorySlug: string,
): categorySlug is DocsCategorySlug;
export function isAdminSectionCategory(
  section: "demo" | "resources",
  categorySlug: string,
) {
  return getAdminCategoryConfigs(section).some((item) => item.slug === categorySlug);
}
