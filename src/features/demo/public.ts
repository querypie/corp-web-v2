import type { Locale } from "@/constants/i18n";
import { demoCategoryConfigs, getCategoryLabel, type DemoCategorySlug } from "@/features/content/config";
import {
  getDemoMdxHref,
  getDemoMdxLocalizedValue,
  getVisibleDemoMdxEntries,
  type DemoMdxCategorySlug,
  type DemoMdxEntry,
} from "./catalog";

export type PublicDemoListItem = {
  category: string;
  categorySlug: DemoMdxCategorySlug;
  date?: string;
  description?: string;
  href: string;
  imageSrc: string;
  title: string;
};

function compareEntries(left: DemoMdxEntry, right: DemoMdxEntry) {
  return right.date.localeCompare(left.date) || Number(right.id) - Number(left.id);
}

export function getSortedVisibleDemoMdxEntries(locale: Locale, categorySlug?: DemoCategorySlug) {
  return getVisibleDemoMdxEntries(locale)
    .filter((entry) => (categorySlug && categorySlug !== "all" ? entry.categorySlug === categorySlug : true))
    .slice()
    .sort(compareEntries);
}

export function toPublicDemoListItem(entry: DemoMdxEntry, locale: Locale): PublicDemoListItem {
  const href = getDemoMdxHref(locale, entry.segment, entry.id);
  const title = getDemoMdxLocalizedValue(entry.title, locale) ?? entry.slug;
  const description = getDemoMdxLocalizedValue(entry.description, locale) ?? undefined;
  const imageSrc = getDemoMdxLocalizedValue(entry.imageSrc, locale) ?? "/images/common/fallback-contents.jpg";

  if (!href) {
    throw new Error(`Missing href for demo entry ${entry.segment}:${entry.id}`);
  }

  return {
    category: getCategoryLabel(demoCategoryConfigs, entry.categorySlug, locale),
    categorySlug: entry.categorySlug,
    date: entry.categorySlug === "webinars" ? entry.date : undefined,
    description,
    href,
    imageSrc,
    title,
  };
}

export function getPublicDemoListItems(locale: Locale, categorySlug?: DemoCategorySlug) {
  return getSortedVisibleDemoMdxEntries(locale, categorySlug).map((entry) =>
    toPublicDemoListItem(entry, locale),
  );
}

export function getLatestPublicDemoEntry(locale: Locale, categorySlug: DemoMdxCategorySlug) {
  return getSortedVisibleDemoMdxEntries(locale, categorySlug)[0] ?? null;
}
