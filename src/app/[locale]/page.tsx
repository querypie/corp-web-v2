import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { isLocale } from "@/constants/i18n";
import HomePage from "@/components/pages/home/HomePage";
import { getHomeMetadataDescription, getHomeMetadataTitle } from "@/copy/homeMetadata";
import { withDynamicOgImage } from "@/features/seo/metadata";
import { getHomePageProps } from "@/features/home/pageData";

type LocalePageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: LocalePageProps): Promise<Metadata> {
  const { locale } = await params;

  if (!isLocale(locale)) return {};

  const title = getHomeMetadataTitle();
  const description = getHomeMetadataDescription();

  return withDynamicOgImage({
    title: getHomeMetadataTitle(),
    description,
    alternates: {
      canonical: locale === "en" ? "/" : `/${locale}`,
    },
  }, { locale, title, description });
}

export default async function LocaleHomePage({ params }: LocalePageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  return <HomePage {...await getHomePageProps(locale)} />;
}
