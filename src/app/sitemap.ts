import type { MetadataRoute } from "next";
import { locales, type Locale } from "@/constants/i18n";
import { getLocalePath } from "@/constants/i18n";
import { siteUrl } from "@/constants/site";
import { readContentState } from "@/features/content/contentState.server";
import { getPublicDetailHref, getPublicListHref, isPublishedContentVisible } from "@/features/content/data";

function absolute(path: string) {
  return new URL(path, siteUrl).toString();
}

function perLocale(pathname: string) {
  return locales.map((locale) => ({
    url: absolute(getLocalePath(locale, pathname)),
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [demoItems, docsItems, newsItems] = await Promise.all([
    readContentState("demo", { includeBodies: false }),
    readContentState("documentation", { includeBodies: false }),
    readContentState("news", { includeBodies: false }),
  ]);

  const staticEntries = [
    ...perLocale("/"),
    ...perLocale("/demo"),
    ...perLocale("/demo/use-cases"),
    ...perLocale("/demo/aip"),
    ...perLocale("/demo/acp"),
    ...perLocale("/documentation"),
    ...perLocale("/introduction-deck"),
    ...perLocale("/glossary"),
    ...perLocale("/manuals"),
    ...perLocale("/whitepapers"),
    ...perLocale("/blog"),
    ...perLocale("/events"),
    ...locales.map((locale) => ({
      url: absolute(getPublicListHref("news", locale)),
    })),
    ...perLocale("/company/certifications"),
    ...perLocale("/company/about-us"),
    ...perLocale("/company/contact-us"),
    ...perLocale("/apps/slack"),
    ...perLocale("/plans/aip"),
    ...perLocale("/plans/acp"),
  ];

  const demoEntries = locales.flatMap((locale) =>
    demoItems
      .filter((item) => isPublishedContentVisible(item, locale as Locale) && item.contentType !== "outlink")
      .map((item) => ({
        url: absolute(getPublicDetailHref("demo", locale as Locale, item.id, item.categorySlug)),
        lastModified: item.dateIso || undefined,
      })),
  );

  const docsEntries = locales.flatMap((locale) =>
    docsItems
      .filter((item) => isPublishedContentVisible(item, locale as Locale) && item.contentType !== "outlink")
      .map((item) => ({
        url: absolute(getPublicDetailHref("documentation", locale as Locale, item.id, item.categorySlug)),
        lastModified: item.dateIso || undefined,
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
