import { notFound } from "next/navigation";
import type { Metadata } from "next";
import TermsOfServicePage from "../../../components/pages/legal/TermsOfServicePage";
import { getLocalePath, isLocale, type Locale } from "../../../constants/i18n";
import { termsOfServiceBodyHtml } from "../../../constants/termsOfService";

type TermsOfServiceRouteProps = {
  params: Promise<{ locale: string }>;
};

type TermsOfServiceContent = {
  bodyHtml: string;
  title: string;
};

function getTermsSourceLocale(locale: Locale) {
  return locale === "ko" ? "ko" : "en";
}

async function getTermsOfServiceContent(locale: Locale): Promise<TermsOfServiceContent> {
  const sourceLocale = getTermsSourceLocale(locale);
  const bodyHtml = termsOfServiceBodyHtml[sourceLocale];

  if (sourceLocale === "ko") {
    return {
      bodyHtml,
      title: "서비스 이용약관",
    };
  }

  return {
    bodyHtml,
    title: "Terms of Service",
  };
}

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
