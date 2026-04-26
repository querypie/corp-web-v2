import type { MetadataRoute } from "next";
import { locales, type Locale } from "../constants/i18n";
import { getLocalePath } from "../constants/i18n";
import { siteUrl } from "../constants/site";
import { readContentState } from "../features/content/contentState.server";
import { getPublicDetailHref, isPublishedContentVisible } from "../features/content/data";
import { getDemoMdxHref, getVisibleDemoMdxEntries } from "../features/demo/catalog";

function absolute(path: string) {
  return new URL(path, siteUrl).toString();
}

function perLocale(pathname: string) {
  return locales.map((locale) => ({
    url: absolute(getLocalePath(locale, pathname)),
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const docsItems = await readContentState("documentation");
  const newsItems = await readContentState("news");

  const staticEntries = [
    ...perLocale("/"),
    ...perLocale("/blog"),
    ...perLocale("/white-papers"),
    ...perLocale("/features/demo"),
    ...perLocale("/features/documentation"),
    ...perLocale("/company/news"),
    ...perLocale("/company/certifications"),
    ...perLocale("/company/about-us"),
    ...perLocale("/company/contact-us"),
    ...perLocale("/plans"),
  ];

  const docsEntries = locales.flatMap((locale) =>
    docsItems
      .filter((item) => isPublishedContentVisible(item, locale as Locale) && item.contentType !== "outlink")
      .map((item) => ({
        url: absolute(getPublicDetailHref("documentation", locale as Locale, item.id)),
        lastModified: item.dateIso || undefined,
      })),
  );

  const demoEntries = locales.flatMap((locale) =>
    getVisibleDemoMdxEntries(locale as Locale).map((entry) => ({
      url: absolute(getDemoMdxHref(locale as Locale, entry.segment, entry.id) ?? "/features/demo"),
      lastModified: entry.date || undefined,
    })),
  );

  const newsEntries = locales.flatMap((locale) =>
    newsItems
      .filter((item) => isPublishedContentVisible(item, locale as Locale) && item.contentType !== "outlink")
      .map((item) => ({
        url: absolute(getPublicDetailHref("news", locale as Locale, item.id)),
        lastModified: item.dateIso || undefined,
      })),
  );

  return [...staticEntries, ...docsEntries, ...demoEntries, ...newsEntries];
}
