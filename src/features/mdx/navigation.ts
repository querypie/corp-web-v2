import type { Locale } from "@/constants/i18n";
import {
  getDocumentationSidebarMenuItems,
  type DocsCategorySlug,
} from "@/features/content/config";
import type { MdxListCategory } from "./types";

function getActiveDocsCategorySlug(category: MdxListCategory): DocsCategorySlug {
  return category === "white-paper" ? "white-papers" : "blogs";
}

export function getMdxSidebarMenuItems(category: MdxListCategory, locale: Locale) {
  const activeSlug = getActiveDocsCategorySlug(category);

  return getDocumentationSidebarMenuItems(locale, { activeMdxSlug: activeSlug });
}
