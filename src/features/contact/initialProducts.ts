import type { Locale } from "@/constants/i18n";
import { aruProductLabels } from "@/copy/contact";

export function getContactInitialProducts(
  locale: Locale,
  searchParams: Record<string, string | string[] | undefined>,
): string[] {
  return searchParams.utm_source === "aru"
    ? [aruProductLabels[locale]]
    : [];
}
