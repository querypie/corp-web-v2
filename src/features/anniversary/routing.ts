import { getLocalePath, type Locale } from "@/constants/i18n";

const path = "/10th";

export const getAnniversaryPath = (locale: Locale) => getLocalePath(locale, path);

export function getAnniversaryHomeHref(locale: Locale) {
  if (locale === "ja") return "https://querypie.ai/";
  return new URL(getLocalePath(locale), "https://www.querypie.com").href;
}
