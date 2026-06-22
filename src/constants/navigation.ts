import { getLocalePath, type Locale } from "./i18n";
import {
  demoCategoryConfigs,
  docsCategoryConfigs,
  getCategoryHref,
} from "@/features/content/config";
import { getSolutionHref } from "@/features/solutions/routes";

export type NavigationSubItem = {
  href: string;
  label: string;
};

export type FooterSection = {
  items: string[];
  title: string;
};

export type ShellMenuCopy = {
  footerLegalLinks: string[];
  footerSections: FooterSection[];
  navActionLabel: string;
  navItems: string[];
};

export function getShellMenuCopy(locale: string): ShellMenuCopy {
  const footerLegalLinks = {
    en: ["Cookie Preference", "Terms of Service", "Privacy Policy", "EULA"],
    ko: ["쿠키 설정", "이용약관", "개인정보처리방침", "EULA"],
    ja: ["クッキー設定", "利用規約", "プライバシーポリシー", "EULA"],
  }[locale] ?? ["Cookie Preference", "Terms of Service", "Privacy Policy", "EULA"];
  const navItems = {
    en: ["Solutions", "Features", "Company", "Plans"],
    ko: ["솔루션", "기능", "회사", "가격 · 플랜"],
    ja: ["ソリューション", "機能", "会社", "価格・プラン"],
  }[locale] ?? ["Solutions", "Features", "Company", "Plans"];
  const navActionLabel = {
    en: "Free start!",
    ko: "무료로 시작하기",
    ja: "無料で始める",
  }[locale] ?? "Free start!";
  const footerSections = {
    en: [
      { title: "Solutions", items: ["AI Platform (AIP)", "Access Control Platform (ACP)"] },
      { title: "Features", items: ["Demo", "Documentation", "Try AIP Now", "AIP Docs", "ACP Community Edition", "ACP Docs"] },
      { title: "Company", items: ["About Us", "Certifications", "News", "Contact Us"] },
      { title: "Plans", items: ["AIP", "ACP"] },
    ],
    ko: [
      { title: "솔루션", items: ["AI 플랫폼 (AIP)", "접근 제어 플랫폼 (ACP)"] },
      { title: "기능", items: ["데모", "문서", "AIP 시작하기", "AIP 문서", "ACP 커뮤니티 에디션", "ACP 문서"] },
      { title: "회사", items: ["회사 소개", "인증", "뉴스", "문의하기"] },
      { title: "가격 · 플랜", items: ["AIP", "ACP"] },
    ],
    ja: [
      { title: "ソリューション", items: ["AIプラットフォーム (AIP)", "アクセス制御プラットフォーム (ACP)"] },
      { title: "機能", items: ["デモ", "ドキュメント", "AIPを始める", "AIP ドキュメント", "ACP コミュニティエディション", "ACP ドキュメント"] },
      { title: "会社", items: ["会社概要", "認証", "ニュース", "お問い合わせ"] },
      { title: "価格・プラン", items: ["AIP", "ACP"] },
    ],
  }[locale] ?? [
    { title: "Solutions", items: ["AI Platform (AIP)", "Access Control Platform (ACP)"] },
    { title: "Features", items: ["Demo", "Documentation", "Try AIP Now", "AIP Docs", "ACP Community Edition", "ACP Docs"] },
    { title: "Company", items: ["About Us", "Certifications", "News", "Contact Us"] },
    { title: "Plans", items: ["AIP", "ACP"] },
  ];

  return {
    footerLegalLinks,
    footerSections,
    navActionLabel,
    navItems,
  };
}

export function getSolutionsSubItems(locale: string): NavigationSubItem[] {
  const copy = {
    en: ["AI Platform (AIP)", "Access Control Platform (ACP)"],
    ko: ["AI 플랫폼 (AIP)", "접근 제어 플랫폼 (ACP)"],
    ja: ["AIプラットフォーム (AIP)", "アクセス制御プラットフォーム (ACP)"],
  }[locale] ?? ["AI Platform (AIP)", "Access Control Platform (ACP)"];

  return [
    { label: copy[0], href: getSolutionHref(locale as Locale, "aip") },
    { label: copy[1], href: getSolutionHref(locale as Locale, "acp") },
  ];
}

export function getDemoSubItems(locale: string): NavigationSubItem[] {
  const resolvedLocale = locale as Locale;

  return [
    { label: "Use Cases", href: getCategoryHref(demoCategoryConfigs, "use-cases", resolvedLocale) },
    { label: "AIP Features", href: getCategoryHref(demoCategoryConfigs, "aip-features", resolvedLocale) },
    { label: "ACP Features", href: getCategoryHref(demoCategoryConfigs, "acp-features", resolvedLocale) },
  ];
}

export function getFeaturesSubItems(locale: string): NavigationSubItem[] {
  const copy = {
    en: ["Demo", "Documentation"],
    ko: ["데모", "문서"],
    ja: ["デモ", "ドキュメント"],
  }[locale] ?? ["Demo", "Documentation"];

  return [
    { label: copy[0], href: getLocalePath(locale as Locale, "/features/demo") },
    { label: copy[1], href: getLocalePath(locale as Locale, "/features/documentation") },
  ];
}

export function getResourcesSubItems(locale: string): NavigationSubItem[] {
  const resolvedLocale = locale as Locale;

  return [
    { label: "Introduction", href: getCategoryHref(docsCategoryConfigs, "introduction", resolvedLocale) },
    { label: "Glossary", href: getCategoryHref(docsCategoryConfigs, "glossary", resolvedLocale) },
    { label: "Manuals", href: getCategoryHref(docsCategoryConfigs, "manuals", resolvedLocale) },
    { label: "White Papers", href: getCategoryHref(docsCategoryConfigs, "white-papers", resolvedLocale) },
    { label: "Blog", href: getCategoryHref(docsCategoryConfigs, "blogs", resolvedLocale) },
  ];
}

export function getCompanySubItems(locale: string): NavigationSubItem[] {
  const copy = {
    en: ["About Us", "Certifications", "News", "Contact Us"],
    ko: ["회사 소개", "인증", "뉴스", "문의하기"],
    ja: ["会社概要", "認証", "ニュース", "お問い合わせ"],
  }[locale] ?? ["About Us", "Certifications", "News", "Contact Us"];

  return [
    { label: copy[0], href: getLocalePath(locale as Locale, "/company/about-us") },
    { label: copy[1], href: getLocalePath(locale as Locale, "/company/certifications") },
    { label: copy[2], href: getLocalePath(locale as Locale, "/company/news") },
    { label: copy[3], href: getLocalePath(locale as Locale, "/company/contact-us") },
  ];
}

export function getPlansSubItems(locale: string): NavigationSubItem[] {
  return [
    { label: "AIP", href: getLocalePath(locale as Locale, "/plans/aip") },
    { label: "ACP", href: getLocalePath(locale as Locale, "/plans/acp") },
  ];
}

export function getPrimaryNavHref(item: string, locale: string) {
  if (
    item === "Plans" ||
    item === "Pricing & Plans" ||
    item === "요금제" ||
    item === "가격 · 플랜" ||
    item === "プラン" ||
    item === "価格・プラン"
  ) {
    return getLocalePath(locale as Locale, "/plans/aip");
  }

  if (item === "AIP") {
    return getLocalePath(locale as Locale, "/plans/aip");
  }

  if (item === "ACP") {
    return getLocalePath(locale as Locale, "/plans/acp");
  }

  return getLocalePath(locale as Locale, "/");
}

export function getFooterHref(item: string, locale: string) {
  if (item === "AIP") {
    return getLocalePath(locale as Locale, "/plans/aip");
  }

  if (item === "ACP") {
    return getLocalePath(locale as Locale, "/plans/acp");
  }

  if (item === "AI Platform (AIP)" || item === "AI 플랫폼 (AIP)" || item === "AIプラットフォーム (AIP)") {
    return getSolutionHref(locale as Locale, "aip");
  }

  if (item === "Access Control Platform (ACP)" || item === "접근 제어 플랫폼 (ACP)" || item === "アクセス制御プラットフォーム (ACP)") {
    return getSolutionHref(locale as Locale, "acp");
  }

  if (item === "About Us" || item === "회사 소개" || item === "会社概要") {
    return getLocalePath(locale as Locale, "/company/about-us");
  }

  if (item === "Certifications" || item === "인증" || item === "認証") {
    return getLocalePath(locale as Locale, "/company/certifications");
  }

  if (item === "Demo" || item === "데모" || item === "デモ") {
    return getLocalePath(locale as Locale, "/features/demo");
  }

  if (item === "Contact Us" || item === "문의하기" || item === "お問い合わせ") {
    return getLocalePath(locale as Locale, "/company/contact-us");
  }

  if (item === "News" || item === "뉴스" || item === "ニュース") {
    return getLocalePath(locale as Locale, "/company/news");
  }

  if (item === "Documentation" || item === "문서" || item === "ドキュメント") {
    return getLocalePath(locale as Locale, "/features/documentation");
  }

  if (item === "Try AIP Now" || item === "AIP 바로 시작하기" || item === "AIP 시작하기" || item === "AIPを今すぐ試す" || item === "AIPを始める") {
    return "https://app.querypie.com/";
  }

  if (item === "AIP Docs" || item === "AIP 문서" || item === "AIP ドキュメント") {
    return "https://aip-docs.app.querypie.com/ko/user-guide";
  }

  if (item === "ACP Community Edition" || item === "ACP 커뮤니티 에디션" || item === "ACP コミュニティエディション") {
    return "https://docs.querypie.com/ko/installation/querypie-acp-community-edition";
  }

  if (item === "ACP Docs" || item === "ACP 문서" || item === "ACP ドキュメント") {
    return "https://docs.querypie.com/ko";
  }

  if (
    item === "Plans" ||
    item === "Pricing & Plans" ||
    item === "요금제" ||
    item === "가격 · 플랜" ||
    item === "プラン" ||
    item === "価格・プラン"
  ) {
    return getLocalePath(locale as Locale, "/plans/aip");
  }

  return getLocalePath(locale as Locale, "/");
}

export function getLegalHref(item: string, locale: string) {
  if (item === "Cookie Preference" || item === "쿠키 설정" || item === "クッキー設定") {
    return getLocalePath(locale as Locale, "/cookie-preference");
  }

  if (item === "EULA") {
    return getLocalePath(locale as Locale, "/eula");
  }

  if (item === "Privacy Policy" || item === "개인정보처리방침" || item === "プライバシーポリシー") {
    return getLocalePath(locale as Locale, "/privacy-policy");
  }

  if (item === "Terms of Service" || item === "Terms of Use" || item === "이용약관" || item === "利用規約") {
    return getLocalePath(locale as Locale, "/terms-of-service");
  }

  return getLocalePath(locale as Locale, "/");
}
