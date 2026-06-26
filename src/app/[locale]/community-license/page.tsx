import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getLocalePath, isLocale } from "@/constants/i18n";
import CommunityLicensePage from "@/components/pages/community-license/CommunityLicensePage";
import { getCommunityLicensePageCopy } from "@/copy/communityLicense";
import { withDynamicOgImage } from "@/features/seo/metadata";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function CommunityLicenseRoute({ params }: Props) {
  const { locale } = await params;

  if (!isLocale(locale)) notFound();

  return <CommunityLicensePage copy={getCommunityLicensePageCopy(locale)} />;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  if (!isLocale(locale)) return {};

  const { description, metadataTitle } = getCommunityLicensePageCopy(locale);

  return withDynamicOgImage({
    title: metadataTitle,
    description,
    alternates: {
      canonical: getLocalePath(locale, "/community-license"),
    },
  }, { locale, title: metadataTitle, description });
}
