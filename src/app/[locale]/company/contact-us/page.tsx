import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getLocalePath, isLocale, type Locale } from "../../../../constants/i18n";
import ContactUsPage from "../../../../components/pages/contact/ContactUsPage";
import { getContactPageCopy } from "@/features/contact/copy";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function ContactUsRoute({ params }: Props) {
  const { locale } = await params;

  if (!isLocale(locale)) notFound();

  const copy = getContactPageCopy(locale);
  return <ContactUsPage {...copy} locale={locale as Locale} />;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  if (!isLocale(locale)) return {};

  const { metadataTitle } = getContactPageCopy(locale);

  return {
    title: metadataTitle,
    alternates: {
      canonical: getLocalePath(locale, "/company/contact-us"),
    },
  };
}
