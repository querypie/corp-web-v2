import { notFound } from "next/navigation";
import PlansPage from "../../../components/pages/plans/PlansPage";
import { isLocale } from "../../../constants/i18n";

type PlansRouteProps = {
  params: Promise<{ locale: string }>;
};

export default async function PlansRoute({ params }: PlansRouteProps) {
  const { locale } = await params;

  if (!isLocale(locale)) notFound();

  return <PlansPage locale={locale} />;
}
