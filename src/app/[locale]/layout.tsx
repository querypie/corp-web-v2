import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { isLocale, locales, type Locale } from "../../constants/i18n";
import RevealObserver from "../../components/common/RevealObserver";
import Footer from "../../components/layout/Footer";
import Gnb from "../../components/layout/Gnb";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

type LocaleLayoutProps = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const shellCopy = {
    en: {
      footerSections: [
        { title: "Solutions", items: ["AI Platform (AIP)", "Access Control Platform (ACP)"] },
        { title: "Features", items: ["Demo", "Documentation"] },
        { title: "Company", items: ["About Us", "Certifications", "News", "Contact Us"] },
      ],
      legal: ["Cookie Preference", "Terms of Use", "Privacy Policy", "EULA"],
      navActionLabel: "Free start!",
      navItems: ["Solutions", "Features", "Company", "Plans"],
    },
    ko: {
      footerSections: [
        { title: "솔루션", items: ["AI 플랫폼 (AIP)", "접근제어 플랫폼 (ACP)"] },
        { title: "기능", items: ["데모", "문서"] },
        { title: "회사", items: ["회사 소개", "인증", "뉴스", "문의하기"] },
      ],
      legal: ["쿠키 설정", "이용약관", "개인정보처리방침", "EULA"],
      navActionLabel: "시작하기",
      navItems: ["솔루션", "기능", "회사", "요금제"],
    },
    ja: {
      footerSections: [
        { title: "ソリューション", items: ["AI Platform (AIP)", "Access Control Platform (ACP)"] },
        { title: "機能", items: ["Demo", "Documentation"] },
        { title: "会社", items: ["About Us", "Certifications", "News", "Contact Us"] },
      ],
      legal: ["Cookie Preference", "Terms of Use", "Privacy Policy", "EULA"],
      navActionLabel: "始める",
      navItems: ["ソリューション", "機能", "会社", "プラン"],
    },
  }[locale];

  return (
    <div className="flex min-h-screen flex-col bg-bg" data-locale={locale as Locale}>
      <RevealObserver />
      <Gnb actionLabel={shellCopy.navActionLabel} items={shellCopy.navItems} locale={locale} />
      <main className="flex-1 pt-[100px] text-fg md:pt-30">
        {children}
      </main>
      <Footer className="mt-20 md:mt-footer-gap" legalLinks={shellCopy.legal} locale={locale} sections={shellCopy.footerSections} />
    </div>
  );
}
