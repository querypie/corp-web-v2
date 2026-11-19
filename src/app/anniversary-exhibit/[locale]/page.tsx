import { notFound } from "next/navigation";
import { isLocale, locales } from "@/constants/i18n";
import { anniversaryCopy } from "@/copy/anniversary";
import { getAnniversaryHistory } from "@/copy/anniversaryHistory";
import Anniversary from "@/components/pages/anniversary/Anniversary";
import AnniversaryGnb from "@/components/pages/anniversary/AnniversaryGnb";
import ArchiveStarfield from "@/components/pages/anniversary/ArchiveStarfield";
import styles from "@/components/pages/anniversary/anniversary.module.css";
import Footer from "@/components/layout/Footer";
import PublicThemeSync from "@/components/site/PublicThemeSync";
import { getAnniversaryHomeHref, getAnniversaryPath } from "@/features/anniversary/routing";
import { withDynamicOgImage } from "@/features/seo/metadata";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const { title, metaDescription: description } = anniversaryCopy[locale];
  return withDynamicOgImage(
    {
      title,
      description,
      alternates: { canonical: getAnniversaryPath(locale) },
      robots: { index: false, follow: false },
    },
    { title, description, locale, supportedLocales: locales },
  );
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const copy = anniversaryCopy[locale];
  return (
    <div className="theme-dark bg-bg" data-locale={locale} lang={locale}>
      <PublicThemeSync locale={locale} theme="dark" />
      <AnniversaryGnb locale={locale} homeHref={getAnniversaryHomeHref(locale)} />
      <div className={`${styles.field} theme-dark bg-bg`}>
        <ArchiveStarfield />
        <Anniversary
          copy={copy}
          entries={getAnniversaryHistory(locale)}
        />
        <Footer locale={locale} variant="compact" addressLines={[copy.copyright]} />
      </div>
    </div>
  );
}
