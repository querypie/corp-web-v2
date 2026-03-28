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
  const copy = {
    en: {
      footerLegalLinks: ["Cookie Preference", "Terms of Use", "Privacy Policy", "EULA"],
      footerSections: [
        { title: "Solutions", items: ["AI Platform (AIP)", "Access Control Platform (ACP)", "Forward Deployed Engineer Service (FDES)"] },
        { title: "Features", items: ["Demo", "Documentation"] },
        { title: "Company", items: ["About Us", "Certifications", "News", "Contact Us", "Plans"] },
      ],
      navActionLabel: "Free start!",
      navItems: ["Solutions", "Features", "Company", "Plans"],
    },
    ko: {
      footerLegalLinks: ["쿠키 설정", "이용약관", "개인정보처리방침", "EULA"],
      footerSections: [
        { title: "솔루션", items: ["AI Platform (AIP)", "Access Control Platform (ACP)", "Forward Deployed Engineer 서비스 (FDES)"] },
        { title: "기능", items: ["데모", "문서"] },
        { title: "회사", items: ["회사 소개", "인증", "뉴스", "문의하기", "요금제"] },
      ],
      navActionLabel: "시작하기",
      navItems: ["솔루션", "기능", "회사", "요금제"],
    },
    ja: {
      footerLegalLinks: ["クッキー設定", "利用規約", "プライバシーポリシー", "EULA"],
      footerSections: [
        { title: "ソリューション", items: ["AI Platform (AIP)", "Access Control Platform (ACP)", "Forward Deployed Engineer サービス (FDES)"] },
        { title: "機能", items: ["デモ", "ドキュメント"] },
        { title: "会社", items: ["会社概要", "認証", "ニュース", "お問い合わせ", "プラン"] },
      ],
      navActionLabel: "始める",
      navItems: ["ソリューション", "機能", "会社", "プラン"],
    },
  }[locale];

  return copy ?? {
    footerLegalLinks: ["Cookie Preference", "Terms of Use", "Privacy Policy", "EULA"],
    footerSections: [
      { title: "Solutions", items: ["AI Platform (AIP)", "Access Control Platform (ACP)", "Forward Deployed Engineer Service (FDES)"] },
      { title: "Features", items: ["Demo", "Documentation"] },
      { title: "Company", items: ["About Us", "Certifications", "News", "Contact Us", "Plans"] },
    ],
    navActionLabel: "Free start!",
    navItems: ["Solutions", "Features", "Company", "Plans"],
  };
}

export function getSolutionsSubItems(locale: string): NavigationSubItem[] {
  const copy = {
    en: ["AI Platform (AIP)", "Access Control Platform (ACP)", "Forward Deployed Engineer Service (FDES)"],
    ko: ["AI 플랫폼 (AIP)", "접근제어 플랫폼 (ACP)", "Forward Deployed Engineer 서비스 (FDES)"],
    ja: ["AI Platform (AIP)", "Access Control Platform (ACP)", "Forward Deployed Engineer サービス (FDES)"],
  }[locale] ?? ["AI Platform (AIP)", "Access Control Platform (ACP)", "Forward Deployed Engineer Service (FDES)"];

  return [
    { label: copy[0], href: `/${locale}/aip-not-found` },
    { label: copy[1], href: `/${locale}/acp-not-found` },
    { label: copy[2], href: `/${locale}/fdes-not-found` },
  ];
}

export function getFeaturesSubItems(locale: string): NavigationSubItem[] {
  const copy = {
    en: ["Demo", "Documentation"],
    ko: ["데모", "문서"],
    ja: ["デモ", "ドキュメント"],
  }[locale] ?? ["Demo", "Documentation"];

  return [
    { label: copy[0], href: `/${locale}/demo` },
    { label: copy[1], href: `/${locale}/docs` },
  ];
}

export function getCompanySubItems(locale: string): NavigationSubItem[] {
  const copy = {
    en: ["About Us", "Certifications", "News", "Contact Us"],
    ko: ["회사 소개", "인증", "뉴스", "문의하기"],
    ja: ["会社概要", "認証", "ニュース", "お問い合わせ"],
  }[locale] ?? ["About Us", "Certifications", "News", "Contact Us"];

  return [
    { label: copy[0], href: `/${locale}/about-us` },
    { label: copy[1], href: `/${locale}/certifications` },
    { label: copy[2], href: `/${locale}/news` },
    { label: copy[3], href: `/${locale}/contact-us` },
  ];
}

export function getPrimaryNavHref(item: string, locale: string) {
  if (item === "Plans" || item === "요금제" || item === "プラン") {
    return `/${locale}/plans`;
  }

  return "/";
}

export function getFooterHref(item: string, locale: string) {
  if (item === "AI Platform (AIP)") {
    return `/${locale}/aip-not-found`;
  }

  if (item === "Access Control Platform (ACP)") {
    return `/${locale}/acp-not-found`;
  }

  if (
    item === "Forward Deployed Engineer Service (FDES)" ||
    item === "Forward Deployed Engineer 서비스 (FDES)" ||
    item === "Forward Deployed Engineer サービス (FDES)"
  ) {
    return `/${locale}/fdes-not-found`;
  }

  if (item === "About Us" || item === "회사 소개" || item === "会社概要") {
    return `/${locale}/about-us`;
  }

  if (item === "Certifications" || item === "인증" || item === "認証") {
    return `/${locale}/certifications`;
  }

  if (item === "Demo" || item === "데모" || item === "デモ") {
    return `/${locale}/demo`;
  }

  if (item === "Contact Us" || item === "문의하기" || item === "お問い合わせ") {
    return `/${locale}/contact-us`;
  }

  if (item === "News" || item === "뉴스" || item === "ニュース") {
    return `/${locale}/news`;
  }

  if (item === "Documentation" || item === "문서" || item === "ドキュメント") {
    return `/${locale}/docs`;
  }

  if (item === "Plans" || item === "요금제" || item === "プラン") {
    return `/${locale}/plans`;
  }

  return "/";
}

export function getLegalHref(item: string, locale: string) {
  if (item === "Cookie Preference" || item === "쿠키 설정" || item === "クッキー設定") {
    return `/${locale}/cookie-preference`;
  }

  if (item === "EULA") {
    return `/${locale}/eula`;
  }

  if (item === "Privacy Policy" || item === "개인정보처리방침" || item === "プライバシーポリシー") {
    return `/${locale}/privacy-policy`;
  }

  if (item === "Terms of Use" || item === "이용약관" || item === "利用規約") {
    return `/${locale}/terms-of-service`;
  }

  return "/";
}
