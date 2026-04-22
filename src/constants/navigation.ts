import { getLocalePath, type Locale } from "./i18n";

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

  return {
    footerLegalLinks,
    footerSections: [
      { title: "Solutions", items: ["AI Platform (AIP)", "Access Control Platform (ACP)", "Forward Deployed Engineer Service (FDES)"] },
      { title: "Features", items: ["Demo", "Documentation", "Try AIP Now", "AIP Docs", "ACP Community Edition", "ACP Docs"] },
      { title: "Company", items: ["About Us", "Certifications", "News", "Contact Us"] },
      { title: "Plans", items: ["AIP", "ACP"] },
    ],
    navActionLabel: "Free start!",
    navItems: ["Solutions", "Features", "Company", "Plans"],
  };
}

export function getSolutionsSubItems(locale: string): NavigationSubItem[] {
  const copy = ["AI Platform (AIP)", "Access Control Platform (ACP)", "Forward Deployed Engineer Service (FDES)"];

  return [
    { label: copy[0], href: getLocalePath(locale as Locale, "/aip-not-found") },
    { label: copy[1], href: getLocalePath(locale as Locale, "/acp-not-found") },
    { label: copy[2], href: getLocalePath(locale as Locale, "/fdes-not-found") },
  ];
}

export function getFeaturesSubItems(locale: string): NavigationSubItem[] {
  const copy = ["Demo", "Documentation"];

  return [
    { label: copy[0], href: getLocalePath(locale as Locale, "/features/demo") },
    { label: copy[1], href: getLocalePath(locale as Locale, "/features/documentation") },
  ];
}

export function getCompanySubItems(locale: string): NavigationSubItem[] {
  const copy = ["About Us", "Certifications", "News", "Contact Us"];

  return [
    { label: copy[0], href: getLocalePath(locale as Locale, "/company/about-us") },
    { label: copy[1], href: getLocalePath(locale as Locale, "/company/certifications") },
    { label: copy[2], href: getLocalePath(locale as Locale, "/company/news") },
    { label: copy[3], href: getLocalePath(locale as Locale, "/company/contact-us") },
  ];
}

export function getPlansSubItems(locale: string): NavigationSubItem[] {
  return [
    { label: "AIP", href: getLocalePath(locale as Locale, "/plans") },
    { label: "ACP", href: `${getLocalePath(locale as Locale, "/plans")}?acp` },
  ];
}

export function getPrimaryNavHref(item: string, locale: string) {
  if (item === "Plans" || item === "요금제" || item === "プラン") {
    return getLocalePath(locale as Locale, "/plans");
  }

  if (item === "AIP") {
    return getLocalePath(locale as Locale, "/plans");
  }

  if (item === "ACP") {
    return `${getLocalePath(locale as Locale, "/plans")}?acp`;
  }

  return getLocalePath(locale as Locale, "/");
}

export function getFooterHref(item: string, locale: string) {
  if (item === "AIP") {
    return getLocalePath(locale as Locale, "/plans");
  }

  if (item === "ACP") {
    return `${getLocalePath(locale as Locale, "/plans")}?acp`;
  }

  if (item === "AI Platform (AIP)") {
    return getLocalePath(locale as Locale, "/aip-not-found");
  }

  if (item === "Access Control Platform (ACP)") {
    return getLocalePath(locale as Locale, "/acp-not-found");
  }

  if (
    item === "Forward Deployed Engineer Service (FDES)" ||
    item === "Forward Deployed Engineer 서비스 (FDES)" ||
    item === "Forward Deployed Engineer サービス (FDES)"
  ) {
    return getLocalePath(locale as Locale, "/fdes-not-found");
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

  if (item === "Try AIP Now") {
    return "https://app.querypie.com/";
  }

  if (item === "AIP Docs") {
    return "https://aip-docs.app.querypie.com/ko/user-guide";
  }

  if (item === "ACP Community Edition") {
    return "https://docs.querypie.com/ko/installation/querypie-acp-community-edition";
  }

  if (item === "ACP Docs") {
    return "https://docs.querypie.com/ko";
  }

  if (item === "Plans" || item === "요금제" || item === "プラン") {
    return getLocalePath(locale as Locale, "/plans");
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
