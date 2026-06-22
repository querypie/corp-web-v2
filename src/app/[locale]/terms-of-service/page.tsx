import { notFound } from "next/navigation";
import type { Metadata } from "next";
import TermsOfServicePage from "../../../components/pages/legal/TermsOfServicePage";
import { getLocalePath, isLocale, type Locale } from "../../../constants/i18n";
import { getTermsOfServiceContent } from "../../../constants/legalContent";

type TermsOfServiceRouteProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: TermsOfServiceRouteProps): Promise<Metadata> {
  const { locale } = await params;

  if (!isLocale(locale)) return {};

  const content = await getTermsOfServiceContent(locale as Locale);

  return {
    title: content.title,
    alternates: {
      canonical: getLocalePath(locale, "/terms-of-service"),
    },
  };
}

export default async function TermsOfServiceRoute({
  params,
}: TermsOfServiceRouteProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const content = await getTermsOfServiceContent(locale as Locale);

  return (
    <TermsOfServicePage
      bodyHtml={content.bodyHtml}
      title={content.title}
    />
  );
}
