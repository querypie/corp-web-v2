import { getLocalePath, type Locale } from "@/constants/i18n";
import {
  demoCategoryConfigs,
  getPublicMenuItems,
  type DemoCategorySlug,
  type PublicMenuItem,
} from "@/features/content/config";

export type PublicDemoListCategory = Exclude<DemoCategorySlug, "all">;

type PublicDemoListPageCopy = {
  metadataTitle: string;
  title: string;
};

const publicDemoListPathByCategory: Record<PublicDemoListCategory, string> = {
  "use-cases": "/demo/use-cases",
  "aip-features": "/demo/aip",
  "acp-features": "/demo/acp",
  webinars: "/webinars",
};

const publicDemoListCopyByCategory: Record<
  PublicDemoListCategory,
  Record<Locale, PublicDemoListPageCopy>
> = {
  "use-cases": {
    en: { metadataTitle: "Use Cases", title: "Use Cases" },
    ja: { metadataTitle: "Use Cases", title: "Use Cases" },
    ko: { metadataTitle: "Use Cases", title: "Use Cases" },
  },
  "aip-features": {
    en: { metadataTitle: "AIP Features", title: "AIP Features" },
    ja: { metadataTitle: "AIP Features", title: "AIP Features" },
    ko: { metadataTitle: "AIP Features", title: "AIP Features" },
  },
  "acp-features": {
    en: { metadataTitle: "ACP Features", title: "ACP Features" },
    ja: { metadataTitle: "ACP Features", title: "ACP Features" },
    ko: { metadataTitle: "ACP Features", title: "ACP Features" },
  },
  webinars: {
    en: { metadataTitle: "Webinars", title: "Webinars" },
    ja: { metadataTitle: "ウェビナー", title: "ウェビナー" },
    ko: { metadataTitle: "Webinars", title: "Webinars" },
  },
};

const publicDemoListCategories: PublicDemoListCategory[] = [
  "use-cases",
  "aip-features",
  "acp-features",
  "webinars",
];

const demoCmsCategorySlugs: DemoCategorySlug[] = [
  "all",
  "use-cases",
  "aip-features",
  "acp-features",
  "webinars",
];

export function getPublicDemoListHref(locale: Locale, category: PublicDemoListCategory) {
  return getLocalePath(locale, publicDemoListPathByCategory[category]);
}

export function getPublicDemoListPageCopy(locale: Locale, category: PublicDemoListCategory) {
  return publicDemoListCopyByCategory[category][locale];
}

export function getPublicDemoMenuItems(locale: Locale, activeCategory: PublicDemoListCategory) {
  return publicDemoListCategories.map((category) => {
    const copy = getPublicDemoListPageCopy(locale, category);

    return {
      href: getPublicDemoListHref(locale, category),
      isActive: category === activeCategory,
      label: copy.title,
    };
  });
}

export function getDemoSidebarMenuItems(
  locale: Locale,
  activeSlug: DemoCategorySlug,
): PublicMenuItem<DemoCategorySlug>[] {
  const cmsLinkItemsBySlug = new Map(
    getPublicMenuItems(demoCategoryConfigs, locale, activeSlug).map((item) => [item.slug, item]),
  );

  return [
    { kind: "section", label: "CMS" },
    ...demoCmsCategorySlugs.flatMap((slug) => {
      const item = cmsLinkItemsBySlug.get(slug);
      return item ? [item] : [];
    }),
    { kind: "divider" },
    { kind: "section", label: "MDX" },
    ...publicDemoListCategories.map((category) => ({
      href: getPublicDemoListHref(locale, category),
      isActive: false,
      kind: "link" as const,
      label: getPublicDemoListPageCopy(locale, category).title,
      slug: category,
    })),
  ];
}
