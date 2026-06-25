import { notFound } from "next/navigation";
import type { Metadata } from "next";
import CookiePreferencePage from "../../../components/pages/legal/CookiePreferencePage";
import { getLocalePath, isLocale, type Locale } from "../../../constants/i18n";
import { cookiePreferenceCopy } from "../../../constants/legal";
import { withDynamicOgImage } from "@/features/seo/metadata";
import { getStaticSeoDescription } from "@/features/seo/staticDescriptions";

type CookiePreferenceRouteProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: CookiePreferenceRouteProps): Promise<Metadata> {
  const { locale } = await params;

  if (!isLocale(locale)) return {};

  const copy = cookiePreferenceCopy[locale as Locale];
  const description = getStaticSeoDescription("cookiePreference", locale);

  return withDynamicOgImage({
    title: copy.title,
    description,
    alternates: {
      canonical: getLocalePath(locale as Locale, "/cookie-preference"),
    },
  }, { locale, title: copy.title, description });
}

export default async function CookiePreferenceRoute({
  params,
}: CookiePreferenceRouteProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const copy = cookiePreferenceCopy[locale as Locale];

  return (
    <CookiePreferencePage
      acceptAllLabel={copy.acceptAllLabel}
      declineAllLabel={copy.declineAllLabel}
      intro={copy.intro}
      preferences={copy.preferences}
      title={copy.title}
    />
  );
}
