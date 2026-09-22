import { getLocalePath, type Locale } from "./i18n";
import {
  demoCategoryConfigs,
  docsCategoryConfigs,
  getCategoryHref,
  getCategoryLabel,
} from "@/features/content/config";
import { getPublicCategoryHref } from "@/features/content/publicPaths";
import { getPlatformHref } from "@/features/platforms/routes";
import { getSolutionHref } from "@/features/solutions/routes";
import { as400CobolMenuLabel } from "@/copy/as400Cobol";

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
    en: ["Platform", "Demo", "Resource", "Company", "Plans"],
    ko: ["플랫폼", "데모", "리소스", "회사", "가격 · 플랜"],
    ja: ["プラットフォーム", "ソリューション", "デモ", "リソース", "会社"],
  }[locale] ?? ["Platform", "Demo", "Resource", "Company", "Plans"];
  const navActionLabel = {
    en: "Free start!",
    ko: "무료로 시작하기",
    ja: "無料で始める",
  }[locale] ?? "Free start!";
  const footerSections = {
    en: [
      { title: "Platform", items: getPlatformSubItems("en").map((item) => item.label) },
      { title: "Demo", items: ["AIP Use Cases", "ACP Use Cases"] },
      { title: "Resource", items: ["Introduction Decks", "Glossary", "Manuals", "White Papers", "Blog", "VOC", "Events", "Try AIP Now", "AIP Docs", "ACP Community Edition", "ACP Docs"] },
      { title: "Company", items: ["About Us", "Certifications", "News", "Contact Us"] },
      { title: "Plans", items: ["AIP", "ACP"] },
    ],
    ko: [
      { title: "플랫폼", items: getPlatformSubItems("ko").map((item) => item.label) },
      { title: "데모", items: ["AIP 활용", "ACP 활용"] },
      { title: "리소스", items: ["제품 소개", "용어집", "매뉴얼", "화이트페이퍼", "블로그", "고객의 목소리", "이벤트", "AIP 시작하기", "AIP 문서", "ACP 커뮤니티 에디션", "ACP 문서"] },
      { title: "회사", items: ["회사 소개", "인증", "뉴스", "문의하기"] },
      { title: "가격 · 플랜", items: ["AIP", "ACP"] },
    ],
    ja: [
      { title: "プラットフォーム", items: getPlatformSubItems("ja").map((item) => item.label) },
      { title: "ソリューション", items: getSolutionsSubItems("ja").map((item) => item.label) },
      { title: "デモ", items: ["AIP機能", "ACP機能"] },
      { title: "リソース", items: ["製品紹介", "用語集", "マニュアル", "ホワイトペーパー", "ブログ", "お客様の声", "イベント", "AIPを始める", "AIP ドキュメント", "ACP コミュニティエディション", "ACP ドキュメント"] },
      { title: "会社", items: ["会社概要", "認証", "ニュース", "お問い合わせ"] },
    ],
  }[locale] ?? [
    { title: "Platform", items: getPlatformSubItems("en").map((item) => item.label) },
    { title: "Demo", items: ["AIP Use Cases", "ACP Use Cases"] },
    { title: "Resource", items: ["Introduction Decks", "Glossary", "Manuals", "White Papers", "Blog", "VOC", "Events", "Try AIP Now", "AIP Docs", "ACP Community Edition", "ACP Docs"] },
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

export function getPlatformSubItems(locale: string): NavigationSubItem[] {
  const copy = {
    en: ["AI Platform (AIP)", "Access Control Platform (ACP)", "FDE Services"],
    ko: ["AI 플랫폼 (AIP)", "접근 제어 플랫폼 (ACP)", "FDE 서비스"],
    ja: ["AIプラットフォーム (AIP)", "アクセス制御プラットフォーム (ACP)", "FDEサービス"],
  }[locale] ?? ["AI Platform (AIP)", "Access Control Platform (ACP)", "FDE Services"];

  return [
    { label: copy[0], href: getPlatformHref(locale as Locale, "aip") },
    { label: copy[1], href: getPlatformHref(locale as Locale, "acp") },
    { label: copy[2], href: getPlatformHref(locale as Locale, "fde-services") },
  ];
}

export function getSolutionsSubItems(locale: string): NavigationSubItem[] {
  if (locale !== "ja") return [];

  return [
    { label: "社内業務効率化｜AI Crew", href: getSolutionHref(locale, "ai-crew") },
    { label: "自社サービスAI化｜AI Dashi", href: getSolutionHref(locale, "ai-dashi") },
    { label: as400CobolMenuLabel, href: getSolutionHref(locale, "as400-cobol") },
  ];
}

export function getDemoSubItems(locale: string): NavigationSubItem[] {
  const resolvedLocale = locale as Locale;

  return [
    {
      label: getCategoryLabel(demoCategoryConfigs, "aip-features", resolvedLocale),
      href: getCategoryHref(demoCategoryConfigs, "aip-features", resolvedLocale),
    },
    {
      label: getCategoryLabel(demoCategoryConfigs, "acp-features", resolvedLocale),
      href: getCategoryHref(demoCategoryConfigs, "acp-features", resolvedLocale),
    },
  ];
}

export function getFeaturesSubItems(locale: string): NavigationSubItem[] {
  const copy = {
    en: ["Demo", "Resources"],
    ko: ["데모", "리소스"],
    ja: ["デモ", "リソース"],
  }[locale] ?? ["Demo", "Resources"];

  return [
    { label: copy[0], href: getCategoryHref(demoCategoryConfigs, "all", locale as Locale) },
    { label: copy[1], href: getCategoryHref(docsCategoryConfigs, "all", locale as Locale) },
  ];
}

export function getResourcesSubItems(locale: string): NavigationSubItem[] {
  const resolvedLocale = locale as Locale;

  return [
    {
      label: getCategoryLabel(docsCategoryConfigs, "introduction", resolvedLocale),
      href: getCategoryHref(docsCategoryConfigs, "introduction", resolvedLocale),
    },
    {
      label: getCategoryLabel(docsCategoryConfigs, "glossary", resolvedLocale),
      href: getCategoryHref(docsCategoryConfigs, "glossary", resolvedLocale),
    },
    {
      label: getCategoryLabel(docsCategoryConfigs, "manuals", resolvedLocale),
      href: getCategoryHref(docsCategoryConfigs, "manuals", resolvedLocale),
    },
    {
      label: getCategoryLabel(docsCategoryConfigs, "white-papers", resolvedLocale),
      href: getCategoryHref(docsCategoryConfigs, "white-papers", resolvedLocale),
    },
    {
      label: getCategoryLabel(docsCategoryConfigs, "blogs", resolvedLocale),
      href: getCategoryHref(docsCategoryConfigs, "blogs", resolvedLocale),
    },
    {
      label: getCategoryLabel(docsCategoryConfigs, "voc", resolvedLocale),
      href: getCategoryHref(docsCategoryConfigs, "voc", resolvedLocale),
    },
    {
      label: getCategoryLabel(docsCategoryConfigs, "events", resolvedLocale),
      href: getCategoryHref(docsCategoryConfigs, "events", resolvedLocale),
    },
  ];
}

export function getCompanySubItems(locale: string): NavigationSubItem[] {
  const copy = {
    en: ["About Us", "Certifications", "News", "Contact Us"],
    ko: ["회사 소개", "인증", "뉴스", "문의하기"],
    ja: ["会社概要", "認証", "ニュース", "お問い合わせ"],
  }[locale] ?? ["About Us", "Certifications", "News", "Contact Us"];

  return [
    { label: copy[0], href: getLocalePath(locale as Locale, "/about-us") },
    { label: copy[1], href: getLocalePath(locale as Locale, "/certifications") },
    { label: copy[2], href: getPublicCategoryHref("news", locale as Locale, "news") },
    { label: copy[3], href: getLocalePath(locale as Locale, "/contact-us") },
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
  if (item === "FDE Services" || item === "FDE 서비스" || item === "FDEサービス") {
    return getPlatformHref(locale as Locale, "fde-services");
  }

  if (item === "AIP") {
    return getLocalePath(locale as Locale, "/plans/aip");
  }

  if (item === "ACP") {
    return getLocalePath(locale as Locale, "/plans/acp");
  }

  if (item === "AIP Features" || item === "AIP Use Cases" || item === "AIP 활용" || item === "AIP機能") {
    return getCategoryHref(demoCategoryConfigs, "aip-features", locale as Locale);
  }

  if (item === "ACP Features" || item === "ACP Use Cases" || item === "ACP 활용" || item === "ACP機能") {
    return getCategoryHref(demoCategoryConfigs, "acp-features", locale as Locale);
  }

  if (item === "Introduction Decks" || item === "제품 소개" || item === "製品紹介") {
    return getCategoryHref(docsCategoryConfigs, "introduction", locale as Locale);
  }

  if (item === "Glossary" || item === "용어집" || item === "用語集") {
    return getCategoryHref(docsCategoryConfigs, "glossary", locale as Locale);
  }

  if (item === "Manuals" || item === "매뉴얼" || item === "マニュアル") {
    return getCategoryHref(docsCategoryConfigs, "manuals", locale as Locale);
  }

  if (item === "White Papers" || item === "화이트페이퍼" || item === "ホワイトペーパー") {
    return getCategoryHref(docsCategoryConfigs, "white-papers", locale as Locale);
  }

  if (item === "Blog" || item === "블로그" || item === "ブログ") {
    return getCategoryHref(docsCategoryConfigs, "blogs", locale as Locale);
  }

  if (item === "VOC" || item === "고객의 목소리" || item === "お客様の声") {
    return getCategoryHref(docsCategoryConfigs, "voc", locale as Locale);
  }

  if (item === "Events" || item === "이벤트" || item === "イベント") {
    return getCategoryHref(docsCategoryConfigs, "events", locale as Locale);
  }

  if (item === "AI Platform (AIP)" || item === "AI 플랫폼 (AIP)" || item === "AIプラットフォーム (AIP)") {
    return getPlatformHref(locale as Locale, "aip");
  }

  if (item === "Access Control Platform (ACP)" || item === "접근 제어 플랫폼 (ACP)" || item === "アクセス制御プラットフォーム (ACP)") {
    return getPlatformHref(locale as Locale, "acp");
  }

  if (item === "Workplace Productivity | AI Crew" || item === "사내 업무 효율화 | AI Crew" || item === "社内業務効率化｜AI Crew") {
    return getSolutionHref(locale as Locale, "ai-crew");
  }

  if (item === "AI for Your Service | AI Dashi" || item === "자사 서비스 AI화 | AI Dashi" || item === "自社サービスAI化｜AI Dashi") {
    return getSolutionHref(locale as Locale, "ai-dashi");
  }

  if (item === as400CobolMenuLabel && locale === "ja") {
    return getSolutionHref(locale, "as400-cobol");
  }

  if (item === "About Us" || item === "회사 소개" || item === "会社概要") {
    return getLocalePath(locale as Locale, "/about-us");
  }

  if (item === "Certifications" || item === "인증" || item === "認証") {
    return getLocalePath(locale as Locale, "/certifications");
  }

  if (item === "Demo" || item === "데모" || item === "デモ") {
    return getCategoryHref(demoCategoryConfigs, "all", locale as Locale);
  }

  if (item === "Contact Us" || item === "문의하기" || item === "お問い合わせ") {
    return getLocalePath(locale as Locale, "/contact-us");
  }

  if (item === "News" || item === "뉴스" || item === "ニュース") {
    return getPublicCategoryHref("news", locale as Locale, "news");
  }

  if (item === "Resources" || item === "리소스" || item === "リソース") {
    return getCategoryHref(docsCategoryConfigs, "all", locale as Locale);
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
