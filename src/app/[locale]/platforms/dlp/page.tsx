import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/constants/i18n";
import { getDlpPlatformHref } from "@/features/platforms/routes";
import { isDlpPlatformVisible } from "@/features/platforms/visibility";
import { withDynamicOgImage } from "@/features/seo/metadata";
import ContentEN, { metadata as metadataEN } from "@/components/pages/platforms/dlp/content.en";
import ContentKO, { metadata as metadataKO } from "@/components/pages/platforms/dlp/content.ko";
import ContentJA, { metadata as metadataJA } from "@/components/pages/platforms/dlp/content.ja";

type SolutionStaticMetadata = {
  title: string;
  description: string;
  keywords?: readonly string[];
};

type PageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string }>;
};

const metadataByLocale: Record<Locale, SolutionStaticMetadata> = {
  en: metadataEN,
  ko: metadataKO,
  ja: metadataJA,
};

export async function generateMetadata({ params }: Pick<PageProps, "params">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale) || !isDlpPlatformVisible(locale)) return {};

  const meta = metadataByLocale[locale];

  return withDynamicOgImage({
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords ? [...meta.keywords] : undefined,
    alternates: {
      canonical: getDlpPlatformHref(locale),
    },
  }, { locale, title: meta.title, description: meta.description });
}

export default async function DlpPlatformPage({ params, searchParams }: PageProps) {
  const { locale } = await params;
  if (!isLocale(locale) || !isDlpPlatformVisible(locale)) notFound();

  const Content = {
    en: ContentEN,
    ko: ContentKO,
    ja: ContentJA,
  }[locale];

  return <Content locale={locale} searchParams={await searchParams} />;
}
