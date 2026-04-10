import type { MetadataRoute } from "next";
import { locales, type Locale } from "../constants/i18n";
import { getLocalePath } from "../constants/i18n";
import { siteUrl } from "../constants/site";
import { readContentState } from "../features/content/contentState.server";
import { getPublicDetailHref } from "../features/content/data";

function absolute(path: string) {
  return new URL(path, siteUrl).toString();
}

function perLocale(pathname: string) {
  return locales.map((locale) => ({
    url: absolute(getLocalePath(locale, pathname)),
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const docsItems = (await readContentState("documentation")).filter(
    (item) => item.status === "published" && item.contentType !== "outlink",
  );
  const demoItems = (await readContentState("demo")).filter(
    (item) => item.status === "published" && item.contentType !== "outlink",
  );
  const newsItems = (await readContentState("news")).filter(
    (item) => item.status === "published" && item.contentType !== "outlink",
  );

  const staticEntries = [
    ...perLocale("/"),
    ...perLocale("/features/demo"),
    ...perLocale("/features/documentation"),
    ...perLocale("/company/news"),
    ...perLocale("/company/about-us"),
    ...perLocale("/company/contact-us"),
    ...perLocale("/plans"),
  ];

  const docsEntries = locales.flatMap((locale) =>
    docsItems.map((item) => ({
      url: absolute(getPublicDetailHref("documentation", locale as Locale, item.id)),
      lastModified: item.dateIso || undefined,
    })),
  );

  const demoEntries = locales.flatMap((locale) =>
    demoItems.map((item) => ({
      url: absolute(getPublicDetailHref("demo", locale as Locale, item.id)),
      lastModified: item.dateIso || undefined,
    })),
  );

  const newsEntries = locales.flatMap((locale) =>
    newsItems.map((item) => ({
      url: absolute(getLocalePath(locale as Locale, `/company/news/${item.id}`)),
      lastModified: item.dateIso || undefined,
    })),
  );

  return [...staticEntries, ...docsEntries, ...demoEntries, ...newsEntries];
}
