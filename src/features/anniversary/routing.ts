import { getLocalePath, type Locale } from "@/constants/i18n";
import { isJapaneseSiteHostname } from "@/features/routing/siteDomainRouting";

const path = "/10th";

export const getAnniversaryPath = (locale: Locale) => getLocalePath(locale, path);

export function getAnniversaryLocaleHref(hostname: string, locale: Locale) {
  const localized = getAnniversaryPath(locale);
  if (!isJapaneseSiteHostname(hostname)) return localized;
  if (locale === "ja") return path;

  // The Japanese host normalizes every locale prefix back to Japanese.
  const multilingualOrigin = /^(www\.)?querypie\.ai$/i.test(hostname)
    ? "https://www.querypie.com"
    : "https://stage-v2.querypie.com";
  return new URL(localized, multilingualOrigin).href;
}
