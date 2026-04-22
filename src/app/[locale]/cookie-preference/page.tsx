import { notFound } from "next/navigation";
import type { Metadata } from "next";
import CookiePreferencePage from "../../../components/pages/legal/CookiePreferencePage";
import { getLocalePath, isLocale, type Locale } from "../../../constants/i18n";
import { cookiePreferenceCopy } from "../../../constants/legal";

type CookiePreferenceRouteProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: CookiePreferenceRouteProps): Promise<Metadata> {
  const { locale } = await params;

  if (!isLocale(locale)) return {};

  const copy = cookiePreferenceCopy[locale as Locale];

  return {
    title: copy.title,
    alternates: {
      canonical: getLocalePath(locale as Locale, "/cookie-preference"),
    },
  };
}

export default async function CookiePreferenceRoute({
  params,
}: CookiePreferenceRouteProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const copy = cookiePreferenceCopy[locale as Locale];

  return <CookiePreferencePage intro={copy.intro} preferences={copy.preferences} title={copy.title} />;
}
