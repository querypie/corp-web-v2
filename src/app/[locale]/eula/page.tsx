import { notFound } from "next/navigation";
import type { Metadata } from "next";
import EulaPage from "../../../components/pages/legal/EulaPage";
import { getLocalePath, isLocale } from "../../../constants/i18n";
import { eulaCopy } from "../../../constants/legal";

type EulaRouteProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: EulaRouteProps): Promise<Metadata> {
  const { locale } = await params;

  if (!isLocale(locale)) return {};

  return {
    title: eulaCopy.title,
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

  return <EulaPage intro={eulaCopy.intro} sections={eulaCopy.sections} title={eulaCopy.title} />;
}
