import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/constants/i18n";
import DlpDemoPage from "@/components/pages/platforms/dlp/DlpDemoPage";

type PageProps = {
  params: Promise<{ locale: string }>;
};

const metadataByLocale: Record<Locale, Metadata> = {
  en: { title: "DLP Detection Demo | QueryPie", robots: { index: false, follow: false } },
  ko: { title: "DLP 탐지 데모 | QueryPie", robots: { index: false, follow: false } },
  ja: { title: "DLP検出デモ | QueryPie", robots: { index: false, follow: false } },
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? metadataByLocale[locale] : {};
}

export default async function DlpDemoRoute({ params }: PageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return <DlpDemoPage locale={locale} />;
}
