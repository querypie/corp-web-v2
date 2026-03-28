import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { isLocale, locales, type Locale } from "../../constants/i18n";
import { getShellMenuCopy } from "../../constants/navigation";
import RevealObserver from "../../components/common/RevealObserver";
import SeoRuntime from "../../components/common/SeoRuntime";
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

  const shellCopy = getShellMenuCopy(locale);

  return (
    <div className="flex min-h-screen flex-col bg-bg" data-locale={locale as Locale}>
      <RevealObserver />
      <SeoRuntime locale={locale as Locale} />
      <Gnb actionLabel={shellCopy.navActionLabel} items={shellCopy.navItems} locale={locale} />
      <main className="flex-1 pt-[100px] text-fg md:pt-30">
        {children}
      </main>
      <Footer className="mt-20 md:mt-footer-gap" legalLinks={shellCopy.footerLegalLinks} locale={locale} sections={shellCopy.footerSections} />
    </div>
  );
}
