import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/constants/i18n";
import { getSolutionHref } from "@/features/solutions/routes";
import { withDynamicOgImage } from "@/features/seo/metadata";
import ContentEN, { metadata as metadataEN } from "@/components/pages/solutions/aip/fde-services/content.en";
import ContentKO, { metadata as metadataKO } from "@/components/pages/solutions/aip/fde-services/content.ko";
import ContentJA, { metadata as metadataJA } from "@/components/pages/solutions/aip/fde-services/content.ja";

type SolutionStaticMetadata = {
  title: string;
  description: string;
  keywords?: readonly string[];
  abstract?: string;
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
  if (!isLocale(locale)) return {};

  const meta = metadataByLocale[locale];
  if (!meta) return {};

  return withDynamicOgImage({
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords ? [...meta.keywords] : undefined,
    alternates: {
      canonical: getSolutionHref(locale, "fde-services"),
    },
  }, { locale, title: meta.title, description: meta.description });
}

export default async function SolutionPage({ params, searchParams }: PageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const Content = {
    en: ContentEN,
    ko: ContentKO,
    ja: ContentJA,
  }[locale];

  if (!Content) notFound();

  return (
    <div>
      <Content locale={locale} searchParams={await searchParams} />
    </div>
  );
}
