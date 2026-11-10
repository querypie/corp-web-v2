import { getOfferingHref } from "@/features/offerings/routes";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AiProductPage from "@/components/pages/products/AiProductPage";
import { isLocale, locales } from "@/constants/i18n";
import { aiProductsCopy } from "@/copy/aiProducts";
import { withDynamicOgImage } from "@/features/seo/metadata";

type PageProps = { params: Promise<{ locale: string }> };

export function generateStaticParams() { return locales.map(locale => ({ locale })); }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const copy = aiProductsCopy[locale].qev;
  return withDynamicOgImage({ ...copy.metadata, robots: { index: false, follow: true }, alternates: { canonical: getOfferingHref(locale, "qev") } }, { locale, ...copy.metadata });
}

export default async function Page({ params }: PageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <AiProductPage id="qev" locale={locale} />;
}
