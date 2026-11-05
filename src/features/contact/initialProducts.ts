import type { Locale } from "@/constants/i18n";
import { aruProductLabels } from "@/copy/contact";
import { getContactProductFromQuery } from "./prefill";

export function getContactInitialProducts(
  locale: Locale,
  searchParams: Record<string, string | string[] | undefined>,
): string[] {
  const product = getContactProductFromQuery(locale, searchParams);
  if (product) return [product];
  return searchParams.utm_source === "aru"
    ? [aruProductLabels[locale]]
    : [];
}
