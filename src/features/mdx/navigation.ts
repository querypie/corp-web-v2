import type { DocsCategorySlug } from "@/features/content/config";
import { getDocumentationSidebarMenuItems } from "@/features/content/config";
import type { MdxListCategory } from "./types";

function getActiveDocsCategorySlug(category: MdxListCategory): DocsCategorySlug {
  return category === "white-paper" ? "white-papers" : "blogs";
}

export function getMdxSidebarMenuItems(category: MdxListCategory, locale: "en" | "ko" | "ja") {
  const activeSlug = getActiveDocsCategorySlug(category);

  return getDocumentationSidebarMenuItems(locale, activeSlug);
}
