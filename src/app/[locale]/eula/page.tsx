import { notFound } from "next/navigation";
import type { Metadata } from "next";
import EulaPage from "../../../components/pages/legal/EulaPage";
import { getLocalePath, isLocale, type Locale } from "../../../constants/i18n";
import { getEulaContent } from "../../../constants/legalContent";

type EulaRouteProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: EulaRouteProps): Promise<Metadata> {
  const { locale } = await params;

  if (!isLocale(locale)) return {};
  const content = await getEulaContent(locale as Locale);

  return {
    title: content.title,
    alternates: {
      canonical: getLocalePath(locale, "/eula"),
    },
  };
}

export default async function EulaRoute({ params }: EulaRouteProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const content = await getEulaContent(locale as Locale);

  return <EulaPage bodyHtml={content.bodyHtml} title={content.title} />;
}
