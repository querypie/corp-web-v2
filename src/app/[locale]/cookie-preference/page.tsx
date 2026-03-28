import { notFound } from "next/navigation";
import CookiePreferencePage from "../../../components/pages/legal/CookiePreferencePage";
import { isLocale, type Locale } from "../../../constants/i18n";
import { cookiePreferenceCopy } from "../../../constants/legal";

type CookiePreferenceRouteProps = {
  params: Promise<{ locale: string }>;
};

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
