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

  const title = {
    en: "License Request Form",
    ko: "라이선스 발급 신청",
    ja: "ライセンス発行の申請",
  }[locale];

  return {
    title,
    alternates: {
      canonical: getLocalePath(locale, "/community-license"),
    },
  };
}
