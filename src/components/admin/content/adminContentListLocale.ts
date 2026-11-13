import type { Locale } from "@/constants/i18n";
import type { ManagedContentEntry } from "@/features/content/data";
import { adminContentLocales } from "@/features/admin/preferences";

export function getOrderedVisibleLocales(visibleLocales: Locale[]): Locale[] {
  return adminContentLocales.filter((locale) => visibleLocales.includes(locale));
}

export function getAdminContentListDisplayLocale(
  item: Pick<ManagedContentEntry, "title" | "visibleLocales">,
  preferredLocale: Locale = "en",
): Locale {
  const localeOrder = [preferredLocale, ...adminContentLocales.filter((locale) => locale !== preferredLocale)];

  return (
    localeOrder.find((locale) => item.visibleLocales.includes(locale) && item.title[locale].trim()) ??
    localeOrder.find((locale) => item.title[locale].trim()) ??
    preferredLocale
  );
}
