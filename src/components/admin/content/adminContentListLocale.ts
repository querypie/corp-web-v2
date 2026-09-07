import type { Locale } from "@/constants/i18n";
import type { ManagedContentEntry } from "@/features/content/data";

const ADMIN_CONTENT_LOCALE_ORDER = ["en", "ko", "ja"] as const;

export function getOrderedVisibleLocales(visibleLocales: Locale[]): Locale[] {
  return ADMIN_CONTENT_LOCALE_ORDER.filter((locale) => visibleLocales.includes(locale));
}

export function getAdminContentListDisplayLocale(
  item: Pick<ManagedContentEntry, "title" | "visibleLocales">,
): Locale {
  const [firstVisibleLocale] = getOrderedVisibleLocales(item.visibleLocales);

  return (
    firstVisibleLocale ??
    ADMIN_CONTENT_LOCALE_ORDER.find((locale) => item.title[locale].trim()) ??
    "en"
  );
}
