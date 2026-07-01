import { notFound } from "next/navigation";
import type { Metadata } from "next";
import CommunityLicenseApplyPage from "@/components/pages/community-license/apply/CommunityLicenseApplyPage";
import { getLocalePath, isLocale, type Locale } from "@/constants/i18n";
import { getCommunityLicenseApplyPageCopy } from "@/copy/communityLicense";
import { withDynamicOgImage } from "@/features/seo/metadata";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function QueryPieCommunityLicenseApplyLocaleRoute({ params }: Props) {
  const { locale } = await params;

  if (!isLocale(locale)) notFound();

  return <CommunityLicenseApplyPage {...getCommunityLicenseApplyPageCopy(locale as Locale)} />;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  if (!isLocale(locale)) return {};

  const copy = getCommunityLicenseApplyPageCopy(locale as Locale);

  return withDynamicOgImage({
    title: copy.metadataTitle,
    description: copy.formDescription,
    alternates: {
      canonical: getLocalePath(locale, "/querypie/license/community/apply"),
    },
  }, { locale: locale as Locale, title: copy.metadataTitle, description: copy.formDescription });
}
