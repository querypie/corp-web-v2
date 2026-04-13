import { notFound } from "next/navigation";
import PlansPage from "../../../components/pages/plans/PlansPage";
import { isLocale, type Locale } from "../../../constants/i18n";

type PlansRouteProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ acp?: string }>;
};

export default async function PlansRoute({ params, searchParams }: PlansRouteProps) {
  const { locale } = await params;
  const { acp } = await searchParams;

  if (!isLocale(locale)) notFound();

  return <PlansPage initialProductKey={acp !== undefined ? "acp" : undefined} locale={locale as Locale} />;
}
