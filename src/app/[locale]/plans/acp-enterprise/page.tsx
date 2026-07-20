import { notFound } from "next/navigation";
import type { Metadata } from "next";
import PlansPage from "@/components/pages/plans/PlansPage";
import { getLocalePath, isLocale, type Locale } from "@/constants/i18n";
import { getPlansPageCopy } from "@/copy/contentPages";
import { withDynamicOgImage } from "@/features/seo/metadata";

type AcpEnterprisePlansRouteProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: AcpEnterprisePlansRouteProps): Promise<Metadata> {
  const { locale } = await params;

  if (!isLocale(locale)) return {};

  const { metadataDescription, metadataTitle } = getPlansPageCopy(locale);

  return withDynamicOgImage({
    title: metadataTitle,
    description: metadataDescription,
    alternates: {
      canonical: getLocalePath(locale, "/plans/acp-enterprise"),
    },
  }, { locale, title: metadataTitle, description: metadataDescription });
}

export default async function AcpEnterprisePlansRoute({ params }: AcpEnterprisePlansRouteProps) {
  const { locale } = await params;

  if (!isLocale(locale)) notFound();

  return (
    <PlansPage
      locale={locale as Locale}
      productHrefOverrides={{ aip: "/plans/aip-enterprise" }}
      productKey="acp"
    />
  );
}
