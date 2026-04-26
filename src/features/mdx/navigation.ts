import { getLocalePath, type Locale } from "@/constants/i18n";
import {
  docsCategoryConfigs,
  getPublicMenuItems,
  type DocsCategorySlug,
} from "@/features/content/config";
import type { MdxListCategory } from "./types";

function getActiveDocsCategorySlug(category: MdxListCategory): DocsCategorySlug {
  return category === "white-paper" ? "white-papers" : "blogs";
}

function getMdxListCategoryHref(categorySlug: DocsCategorySlug, locale: Locale) {
  if (categorySlug === "white-papers") {
    return getLocalePath(locale, "/white-papers");
  }

  if (categorySlug === "blogs") {
    return getLocalePath(locale, "/blog");
  }

  return null;
}

export function getMdxSidebarMenuItems(category: MdxListCategory, locale: Locale) {
  const activeSlug = getActiveDocsCategorySlug(category);

  return getPublicMenuItems(docsCategoryConfigs, locale, activeSlug).map((item) => ({
    href: getMdxListCategoryHref(item.slug, locale) ?? item.href,
    isActive: item.slug === activeSlug,
    label: item.label,
  }));
}