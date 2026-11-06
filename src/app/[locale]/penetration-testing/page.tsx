import { getOfferingHref } from "@/features/offerings/routes";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PenetrationTestingPage from "@/components/pages/services/penetration-testing/PenetrationTestingPage";
import { penetrationTestingLocalizedCopy } from "@/copy/penetrationTestingLocalized";
import { isLocale, locales } from "@/constants/i18n";
import { withDynamicOgImage } from "@/features/seo/metadata";

type PageProps = { params: Promise<{ locale: string }> };

export function generateStaticParams() { return locales.map(locale => ({ locale })); }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const copy = penetrationTestingLocalizedCopy[locale].metadata;
  return withDynamicOgImage({ ...copy, alternates: { canonical: getOfferingHref(locale, "penetration-testing") } }, { locale, ...copy });
}

export default async function Page({ params }: PageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <PenetrationTestingPage locale={locale} />;
}
