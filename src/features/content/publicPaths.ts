import { getLocalePath, type Locale } from "@/constants/i18n";
import { publicCategoryPaths } from "./publicPathConfig";

export { publicCategoryPaths } from "./publicPathConfig";

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
