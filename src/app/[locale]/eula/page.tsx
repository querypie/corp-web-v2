import { notFound } from "next/navigation";
import EulaPage from "../../../components/pages/legal/EulaPage";
import { isLocale } from "../../../constants/i18n";
import { eulaCopy } from "../../../constants/legal";

type EulaRouteProps = {
  params: Promise<{ locale: string }>;
};

export default async function EulaRoute({ params }: EulaRouteProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  return <EulaPage intro={eulaCopy.intro} sections={eulaCopy.sections} title={eulaCopy.title} />;
}
