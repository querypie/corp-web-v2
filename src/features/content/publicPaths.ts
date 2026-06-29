import { getLocalePath, type Locale } from "@/constants/i18n";

export const publicCategoryPaths = {
  demo: {
    all: "/demo",
    "use-cases": "/demo/use-cases",
    "aip-features": "/demo/aip",
    "acp-features": "/demo/acp",
  },
  documentation: {
    all: "/documentation",
    introduction: "/introduction-deck",
    glossary: "/glossary",
    manuals: "/manuals",
    "white-papers": "/whitepapers",
    blogs: "/blog",
    events: "/events",
  },
  news: {
    news: "/news",
  },
} as const;

export type PublicContentSection = keyof typeof publicCategoryPaths;
export type PublicCategorySlug<TSection extends PublicContentSection> =
  keyof typeof publicCategoryPaths[TSection];

export function getPublicCategoryPath<TSection extends PublicContentSection>(
  section: TSection,
  categorySlug: PublicCategorySlug<TSection>,
) {
  return publicCategoryPaths[section][categorySlug] as string;
}

export function getPublicCategoryHref<TSection extends PublicContentSection>(
  section: TSection,
  locale: Locale,
  categorySlug: PublicCategorySlug<TSection>,
) {
  return getLocalePath(locale, getPublicCategoryPath(section, categorySlug));
}
