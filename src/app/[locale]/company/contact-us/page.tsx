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

  return <ContactUsPage {...getContactPageCopy(locale)} locale={locale as Locale} />;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  if (!isLocale(locale)) return {};

  const title = { en: "QueryPie Contacts", ko: "QueryPie Contacts", ja: "QueryPie: お問い合わせ" }[locale];

  return {
    title,
    alternates: {
      canonical: getLocalePath(locale, "/company/contact-us"),
    },
  };
}
