import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getLocalePath, isLocale } from "@/constants/i18n";
import AboutUsPage from "@/components/pages/company/AboutUsPage";
import {
  getAboutUsPageCopy,
  getAboutUsMetadataDescription,
  getAboutUsMetadataTitle,
} from "@/copy/company";
import { withDynamicOgImage } from "@/features/seo/metadata";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function AboutUsRoute({ params }: Props) {
  const { locale } = await params;

  if (!isLocale(locale)) notFound();

  const copy = getAboutUsPageCopy(locale);
  return <AboutUsPage {...copy} locale={locale} />;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  if (!isLocale(locale)) return {};

  const title = getAboutUsMetadataTitle(locale);
  const description = getAboutUsMetadataDescription(locale);

  return withDynamicOgImage({
    title,
    description,
    alternates: {
      canonical: getLocalePath(locale, "/company/about-us"),
    },
  }, { locale, title, description });
}
