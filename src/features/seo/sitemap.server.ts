import type { MetadataRoute } from "next";

import { getLocalePath, type Locale } from "@/constants/i18n";
import { readContentState } from "@/features/content/contentState.server";
import { getPublicDetailHref, getPublicListHref, isPublishedContentVisible } from "@/features/content/data";
import { getPublicSitePathname } from "@/features/routing/siteDomainRouting";
import { getRequestSiteOrigin } from "@/features/seo/requestUrl.server";
import { getSolutionHref } from "@/features/solutions/routes";

function absolute(path: string, origin: URL) {
  const url = new URL(path, origin);
  url.pathname = getPublicSitePathname(origin.hostname, url.pathname);
  return url.toString();
}

function perLocale(pathname: string, origin: URL, sitemapLocales: readonly Locale[]) {
  return sitemapLocales.map((locale) => ({
    url: absolute(getLocalePath(locale, pathname), origin),
  }));
}

export async function createSiteSitemap(
  sitemapLocales: readonly Locale[],
): Promise<MetadataRoute.Sitemap> {
  const [origin, demoItems, docsItems, newsItems] = await Promise.all([
    getRequestSiteOrigin(),
    readContentState("demo", { includeBodies: false }),
    readContentState("documentation", { includeBodies: false }),
    readContentState("news", { includeBodies: false }),
  ]);

  const staticEntries = [
    ...perLocale("/", origin, sitemapLocales),
    ...perLocale("/demo", origin, sitemapLocales),
    ...perLocale("/demo/aip", origin, sitemapLocales),
    ...perLocale("/demo/acp", origin, sitemapLocales),
    ...perLocale("/documentation", origin, sitemapLocales),
    ...perLocale("/introduction-deck", origin, sitemapLocales),
    ...perLocale("/glossary", origin, sitemapLocales),
    ...perLocale("/manuals", origin, sitemapLocales),
    ...perLocale("/whitepapers", origin, sitemapLocales),
    ...perLocale("/blog", origin, sitemapLocales),
    ...perLocale("/events", origin, sitemapLocales),
    ...sitemapLocales.map((locale) => ({
      url: absolute(getPublicListHref("news", locale), origin),
    })),
    ...perLocale("/company/certifications", origin, sitemapLocales),
    ...perLocale("/company/about-us", origin, sitemapLocales),
    ...perLocale("/company/contact-us", origin, sitemapLocales),
    ...perLocale("/apps/slack", origin, sitemapLocales),
    ...perLocale("/plans/aip", origin, sitemapLocales),
    ...perLocale("/plans/acp", origin, sitemapLocales),
    ...(sitemapLocales.includes("ja")
      ? [{ url: absolute(getSolutionHref("ja", "as400-cobol"), origin) }]
      : []),
  ];

  const demoEntries = sitemapLocales.flatMap((locale) =>
    demoItems
      .filter((item) => isPublishedContentVisible(item, locale) && item.contentType !== "outlink")
      .map((item) => ({
        url: absolute(getPublicDetailHref("demo", locale, item.id, item.categorySlug), origin),
        lastModified: item.dateIso || undefined,
      })),
  );

  const docsEntries = sitemapLocales.flatMap((locale) =>
    docsItems
      .filter((item) => isPublishedContentVisible(item, locale) && item.contentType !== "outlink")
      .map((item) => ({
        url: absolute(getPublicDetailHref("documentation", locale, item.id, item.categorySlug), origin),
        lastModified: item.dateIso || undefined,
      })),
  );

  const newsEntries = sitemapLocales.flatMap((locale) =>
    newsItems
      .filter((item) => isPublishedContentVisible(item, locale) && item.contentType !== "outlink")
      .map((item) => ({
        url: absolute(getPublicDetailHref("news", locale, item.id), origin),
        lastModified: item.dateIso || undefined,
      })),
  );

  return [...staticEntries, ...docsEntries, ...demoEntries, ...newsEntries];
}
