import { getLocalePath, stripLocalePrefix, type Locale } from "@/constants/i18n";
import { offeringEntries } from "@/constants/offerings";
import { publicCategoryPaths } from "@/features/content/publicPathConfig";
import { isJapaneseSiteHostname } from "@/features/routing/siteDomainRouting";

const staticPaths = new Set([
  "/", "/about-us", "/certifications", "/contact-us", "/apps/slack", "/community-license",
  "/querypie/license/community/apply", "/cookie-preference", "/privacy-policy", "/terms-of-service", "/eula",
  ...Object.values(publicCategoryPaths).flatMap(group => Object.values(group)),
]);
const productionHosts = new Set(["www.querypie.com", "querypie.com", "querypie.ai", "www.querypie.ai"]);

export function getPageSeoLocales(pathname: string): readonly Locale[] | undefined {
  const path = stripLocalePrefix(pathname).replace(/\/$/, "") || "/";
  const entry = offeringEntries.find(entry => entry.path === path);
  if (entry) return entry.locales ?? ["en", "ko", "ja"];
  if (path.startsWith("/plans/")) return ["en", "ko"];
  return staticPaths.has(path) ? ["en", "ko", "ja"] : undefined;
}

export function isPreviewSeoHost(hostname: string) {
  return hostname === "localhost" || hostname === "127.0.0.1" || hostname.endsWith(".vercel.app") || /^stage(?:-v2)?\./.test(hostname);
}

/** Only production hreflang crosses domains; canonical and OG always keep the request origin. */
export function getLanguageAlternates(origin: URL, pathname: string, supportedLocales: readonly Locale[]) {
  const path = stripLocalePrefix(pathname);
  const production = productionHosts.has(origin.hostname);
  const available = supportedLocales.filter(locale => production || !isJapaneseSiteHostname(origin.hostname) || locale === "ja");
  const languages: Record<string, string> = {};
  for (const locale of available) {
    if (production) {
      languages[locale] = locale === "ja"
        ? new URL(path, "https://querypie.ai").toString()
        : new URL(getLocalePath(locale, path), "https://www.querypie.com").toString();
    } else {
      languages[locale] = new URL(isJapaneseSiteHostname(origin.hostname) ? path : getLocalePath(locale, path), origin).toString();
    }
  }
  const defaultLocale = available.includes("en") ? "en" : available[0];
  if (defaultLocale) languages["x-default"] = languages[defaultLocale];
  return languages;
}
