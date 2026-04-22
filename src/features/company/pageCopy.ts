import type { Locale } from "@/constants/i18n";

export type CompanyNewsPageCopy = {
  metadataTitle: string;
  title: string;
};

export function getAboutUsMetadataTitle(locale: Locale) {
  return {
    en: "About Us",
    ko: "About Us",
    ja: "会社概要",
  }[locale];
}

export function getCertificationsMetadataTitle(locale: Locale) {
  return {
    en: "QueryPie AI Certifications",
    ko: "QueryPie AI Certifications",
    ja: "QueryPie AI: 認証",
  }[locale];
}

export function getNewsPageCopy(locale: Locale): CompanyNewsPageCopy {
  return {
    en: { metadataTitle: "QueryPie News", title: "News" },
    ko: { metadataTitle: "QueryPie News", title: "뉴스" },
    ja: { metadataTitle: "QueryPie: ニュース", title: "News" },
  }[locale];
}
