import type { Locale } from "@/constants/i18n";
import {
  demoCategoryConfigs,
  getPublicMenuItems,
  type DemoCategorySlug,
  type PublicMenuItem,
} from "@/features/content/config";

const demoCmsCategorySlugs: DemoCategorySlug[] = [
  "all",
  "use-cases",
  "aip-features",
  "acp-features",
];

export function getDemoSidebarMenuItems(
  locale: Locale,
  activeSlug: DemoCategorySlug,
): PublicMenuItem<DemoCategorySlug>[] {
  const cmsLinkItemsBySlug = new Map(
    getPublicMenuItems(demoCategoryConfigs, locale, activeSlug).map((item) => [item.slug, item]),
  );

  return demoCmsCategorySlugs.flatMap((slug) => {
    const item = cmsLinkItemsBySlug.get(slug);
    return item ? [item] : [];
  });
}
