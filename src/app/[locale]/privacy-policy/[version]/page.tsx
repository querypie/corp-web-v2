import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import PrivacyPolicyPage from "../../../../components/pages/legal/PrivacyPolicyPage";
import { getLocalePath, isLocale, type Locale } from "../../../../constants/i18n";
import {
  getPrivacyPolicyContent,
  getPrivacyPolicyVersionOptions,
  getPrivacyPolicyVersions,
  toFullPrivacyPolicyVersion,
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
  const fullVersion = toFullPrivacyPolicyVersion(version);

  if (!versions.includes(fullVersion)) {
    return {};
  }

  const content = await getPrivacyPolicyContent(locale as Locale, fullVersion);

  return {
    title: content.title,
    alternates: {
      canonical: getLocalePath(locale as Locale, `/privacy-policy/${fullVersion}`),
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
  const fullVersion = toFullPrivacyPolicyVersion(version);

  if (fullVersion !== version && versions.includes(fullVersion)) {
    redirect(getLocalePath(locale as Locale, `/privacy-policy/${fullVersion}`));
  }

  if (!versions.includes(fullVersion)) {
    notFound();
  }

  const content = await getPrivacyPolicyContent(locale as Locale, fullVersion);

  return (
    <PrivacyPolicyPage
      bodyHtml={content.bodyHtml}
      title={content.title}
      versionOptions={await getPrivacyPolicyVersionOptions(locale as Locale)}
      versionValue={fullVersion}
    />
  );
}
