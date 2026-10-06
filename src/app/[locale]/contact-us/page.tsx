import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getLocalePath, isLocale, type Locale } from "@/constants/i18n";
import ContactUsPage from "@/components/pages/contact/ContactUsPage";
import { getContactPageCopy } from "@/copy/contact";
import { withDynamicOgImage } from "@/features/seo/metadata";
import { getContactInitialProducts } from "@/features/contact/initialProducts";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ContactUsRoute({ params, searchParams }: Props) {
  const { locale } = await params;

  if (!isLocale(locale)) notFound();

  const copy = getContactPageCopy(locale);
  const initialProducts = getContactInitialProducts(locale, await searchParams);
  return <ContactUsPage {...copy} initialProducts={initialProducts} locale={locale as Locale} />;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  if (!isLocale(locale)) return {};

  const { formDescription, metadataTitle } = getContactPageCopy(locale);

  return withDynamicOgImage({
    title: metadataTitle,
    description: formDescription,
    alternates: {
      canonical: getLocalePath(locale, "/contact-us"),
    },
  }, { locale, title: metadataTitle, description: formDescription });
}
