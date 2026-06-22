import { notFound } from "next/navigation";
import type { Metadata } from "next";
import PlansPage from "../../../../components/pages/plans/PlansPage";
import { getLocalePath, isLocale, type Locale } from "../../../../constants/i18n";
import { getPlansPageCopy } from "@/features/content/pageCopy";

const planProducts = ["aip", "acp"] as const;

type PlanProduct = (typeof planProducts)[number];

type PlansProductRouteProps = {
  params: Promise<{ locale: string; product: string }>;
};

function isPlanProduct(value: string): value is PlanProduct {
  return planProducts.includes(value as PlanProduct);
}

export async function generateStaticParams() {
  return planProducts.map((product) => ({ product }));
}

export async function generateMetadata({ params }: PlansProductRouteProps): Promise<Metadata> {
  const { locale, product } = await params;

  if (!isLocale(locale) || !isPlanProduct(product)) return {};

  const { metadataTitle } = getPlansPageCopy(locale);

  return {
    title: metadataTitle,
    alternates: {
      canonical: getLocalePath(locale, `/plans/${product}`),
    },
  };
}

export default async function PlansProductRoute({ params }: PlansProductRouteProps) {
  const { locale, product } = await params;

  if (!isLocale(locale) || !isPlanProduct(product)) notFound();

  return <PlansPage locale={locale as Locale} productKey={product} />;
}
