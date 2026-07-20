import { notFound } from "next/navigation";
import type { Metadata } from "next";
import PlansPage from "@/components/pages/plans/PlansPage";
import { getLocalePath, isLocale, type Locale } from "@/constants/i18n";
import { getPlansPageCopy } from "@/copy/contentPages";
import { withDynamicOgImage } from "@/features/seo/metadata";

type AipEnterprisePlansRouteProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: AipEnterprisePlansRouteProps): Promise<Metadata> {
  const { locale } = await params;

  if (!isLocale(locale)) return {};

  const { metadataDescription, metadataTitle } = getPlansPageCopy(locale);

  return withDynamicOgImage({
    title: metadataTitle,
    description: metadataDescription,
    alternates: {
      canonical: getLocalePath(locale, "/plans/aip-enterprise"),
    },
  }, { locale, title: metadataTitle, description: metadataDescription });
}

export default async function AipEnterprisePlansRoute({ params }: AipEnterprisePlansRouteProps) {
  const { locale } = await params;

  if (!isLocale(locale)) notFound();

  return (
    <PlansPage
      enterpriseOnly
      locale={locale as Locale}
      productKey="aip"
    />
  );
}
