import type { Locale } from "@/constants/i18n";
import {
  demoCategoryConfigs,
  getPublicMenuItems,
  type DemoCategorySlug,
  type PublicMenuItem,
} from "@/features/content/config";

const demoCmsCategorySlugs = {
  en: ["all", "acp-features", "aip-features"],
  ko: ["all", "acp-features", "aip-features"],
  ja: ["all", "aip-features", "acp-features"],
} satisfies Record<Locale, DemoCategorySlug[]>;

export function getDemoSidebarMenuItems(
  locale: Locale,
  activeSlug: DemoCategorySlug,
): PublicMenuItem<DemoCategorySlug>[] {
  const cmsLinkItemsBySlug = new Map(
    getPublicMenuItems(demoCategoryConfigs, locale, activeSlug).map((item) => [item.slug, item]),
  );

  return demoCmsCategorySlugs[locale].flatMap((slug) => {
    const item = cmsLinkItemsBySlug.get(slug);
    return item ? [item] : [];
  });
}
