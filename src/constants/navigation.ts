export type NavigationSubItem = {
  href: string;
  label: string;
};

export function getSolutionsSubItems(locale: string): NavigationSubItem[] {
  const copy = {
    en: ["AI Platform (AIP)", "Access Control Platform (ACP)", "Forward Deployed Engineer Service (FDES)"],
    ko: ["AI 플랫폼 (AIP)", "접근제어 플랫폼 (ACP)", "Forward Deployed Engineer Service (FDES)"],
    ja: ["AI Platform (AIP)", "Access Control Platform (ACP)", "Forward Deployed Engineer Service (FDES)"],
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
    ja: ["Demo", "Documentation"],
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
    ja: ["About Us", "Certifications", "News", "Contact Us"],
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

  if (item === "Forward Deployed Engineer Service (FDES)") {
    return `/${locale}/fdes-not-found`;
  }

  if (item === "About Us" || item === "회사 소개") {
    return `/${locale}/about-us`;
  }

  if (item === "Certifications" || item === "인증") {
    return `/${locale}/certifications`;
  }

  if (item === "Demo" || item === "데모") {
    return `/${locale}/demo`;
  }

  if (item === "Contact Us" || item === "문의하기") {
    return `/${locale}/contact-us`;
  }

  if (item === "News" || item === "뉴스") {
    return `/${locale}/news`;
  }

  if (item === "Documentation" || item === "문서") {
    return `/${locale}/docs`;
  }

  if (item === "Plans" || item === "요금제" || item === "プラン") {
    return `/${locale}/plans`;
  }

  return "/";
}
