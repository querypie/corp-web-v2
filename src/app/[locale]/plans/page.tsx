import { notFound } from "next/navigation";
import type { Metadata } from "next";
import PlansPage from "../../../components/pages/plans/PlansPage";
import { getLocalePath, isLocale, type Locale } from "../../../constants/i18n";
import { getPlansPageCopy } from "@/features/content/pageCopy";

type PlansRouteProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ acp?: string }>;
};

export async function generateMetadata({ params }: Pick<PlansRouteProps, "params">): Promise<Metadata> {
  const { locale } = await params;

  if (!isLocale(locale)) return {};

  const { metadataTitle } = getPlansPageCopy(locale);

  return {
    title: metadataTitle,
    alternates: {
      canonical: getLocalePath(locale, "/plans"),
    },
  };
}

export default async function PlansRoute({ params, searchParams }: PlansRouteProps) {
  const { locale } = await params;
  const { acp } = await searchParams;

  if (!isLocale(locale)) notFound();

  return <PlansPage initialProductKey={acp !== undefined ? "acp" : undefined} locale={locale as Locale} />;
}
