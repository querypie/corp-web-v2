import { getLocalePath, type Locale } from "@/constants/i18n";
import {
  getDocumentationSidebarMenuItems,
  type DocsCategorySlug,
} from "@/features/content/config";
import type { MdxListCategory } from "./types";

function getActiveDocsCategorySlug(category: MdxListCategory): DocsCategorySlug {
  return category === "white-paper" ? "white-papers" : "blogs";
}

function getMdxListCategoryHref(categorySlug: DocsCategorySlug, locale: Locale) {
  if (categorySlug === "white-papers") {
    return getLocalePath(locale, "/whitepapers");
  }

  if (categorySlug === "blogs") {
    return getLocalePath(locale, "/blog");
  }

  return null;
}

export function getMdxSidebarMenuItems(category: MdxListCategory, locale: Locale) {
  const activeSlug = getActiveDocsCategorySlug(category);

  return getDocumentationSidebarMenuItems(locale, activeSlug, {
    blogs: getMdxListCategoryHref("blogs", locale) ?? undefined,
    "white-papers": getMdxListCategoryHref("white-papers", locale) ?? undefined,
  });
}
