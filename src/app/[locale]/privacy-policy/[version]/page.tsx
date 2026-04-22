import { notFound } from "next/navigation";
import type { Metadata } from "next";
import PrivacyPolicyPage from "../../../../components/pages/legal/PrivacyPolicyPage";
import { getLocalePath, isLocale, type Locale } from "../../../../constants/i18n";
import {
  getPrivacyPolicyContent,
  getPrivacyPolicyVersionOptions,
  getPrivacyPolicyVersions,
} from "../../../../constants/privacyPolicy";

type PrivacyPolicyVersionRouteProps = {
  params: Promise<{ locale: string; version: string }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: PrivacyPolicyVersionRouteProps): Promise<Metadata> {
  const { locale, version } = await params;

  if (!isLocale(locale)) return {};

  const versions = await getPrivacyPolicyVersions(locale as Locale);

  if (!versions.includes(version)) {
    return {};
  }

  const content = await getPrivacyPolicyContent(locale as Locale, version);

  return {
    title: content.title,
    alternates: {
      canonical: getLocalePath(locale as Locale, version === versions[0] ? "/privacy-policy" : `/privacy-policy/${version}`),
    },
  };
}

export default async function PrivacyPolicyVersionRoute({
  params,
}: PrivacyPolicyVersionRouteProps) {
  const { locale, version } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const versions = await getPrivacyPolicyVersions(locale as Locale);

  if (!versions.includes(version)) {
    notFound();
  }

  const content = await getPrivacyPolicyContent(locale as Locale, version);

  return (
    <PrivacyPolicyPage
      bodyHtml={content.bodyHtml}
      title={content.title}
      versionOptions={await getPrivacyPolicyVersionOptions(locale as Locale)}
      versionValue={version}
    />
  );
}
