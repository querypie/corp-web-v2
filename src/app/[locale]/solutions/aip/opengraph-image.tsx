import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/constants/i18n";
import { createOgImage, ogImageSize } from "@/features/seo/ogImage";
import { metadata as metadataEN } from "./content.en";
import { metadata as metadataJA } from "./content.ja";
import { metadata as metadataKO } from "./content.ko";

type Props = {
  params: Promise<{ locale: string }>;
};

const metadataByLocale: Record<Locale, { description: string }> = {
  en: metadataEN,
  ko: metadataKO,
  ja: metadataJA,
};

export const runtime = "nodejs";

export const size = ogImageSize;

export const contentType = "image/png";

export default async function Image({ params }: Props) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  return createOgImage({
    locale,
    title: "AI Platform",
    description: metadataByLocale[locale].description,
  });
}
