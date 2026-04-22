import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getLocalePath, isLocale } from "@/constants/i18n";
import CommunityLicensePage from "@/components/pages/community-license/CommunityLicensePage";
import { getCommunityLicensePageCopy } from "@/features/community-license/copy";

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

  const { metadataTitle } = getCommunityLicensePageCopy(locale);

  return {
    title: metadataTitle,
    alternates: {
      canonical: getLocalePath(locale, "/community-license"),
    },
  };
}
