import type { Locale } from "@/constants/i18n";
import type { DocsCategorySlug } from "./config";
import type { ManagedContentEntry } from "./data";

export function sortResourceCategoryItems(
  items: ManagedContentEntry[],
  locale: Locale,
  category: DocsCategorySlug,
) {
  if (locale === "ja" || (category !== "manuals" && category !== "introduction")) {
    return items;
  }

  // ACP 내에서는 CMS의 기존 순서를 유지하고, AIP 등 나머지 콘텐츠 앞에 표시한다.
  return [...items].sort((left, right) =>
    Number(/\bACP\b/i.test(right.title.en)) - Number(/\bACP\b/i.test(left.title.en)),
  );
}
