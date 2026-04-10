import { Suspense, type ReactNode } from "react";
import { notFound } from "next/navigation";
import { isLocale, locales, type Locale } from "../../constants/i18n";
import { getShellMenuCopy } from "../../constants/navigation";
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
      <SeoRuntime locale={locale as Locale} />
      <Suspense fallback={null}>
        <Gnb actionLabel={shellCopy.navActionLabel} items={shellCopy.navItems} locale={locale} />
      </Suspense>
<<<<<<< HEAD
      <main className="flex-1 pt-[100px] text-fg md:pt-[140px]">
=======
      <main className="flex-1 pt-[120px] text-fg md:pt-[160px]">
>>>>>>> origin/main
        {children}
      </main>
      <Footer className="mt-10 md:mt-20" legalLinks={shellCopy.footerLegalLinks} locale={locale} sections={shellCopy.footerSections} />
    </div>
  );
}
