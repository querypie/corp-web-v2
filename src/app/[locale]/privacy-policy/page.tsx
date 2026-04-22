import { notFound } from "next/navigation";
import type { Metadata } from "next";
import PrivacyPolicyPage from "../../../components/pages/legal/PrivacyPolicyPage";
import { getLocalePath, isLocale, type Locale } from "../../../constants/i18n";
import {
  getPrivacyPolicyContent,
  getPrivacyPolicyVersionOptions,
  getPrivacyPolicyVersions,
} from "../../../constants/privacyPolicy";

type PrivacyPolicyRouteProps = {
  params: Promise<{ locale: string }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: PrivacyPolicyRouteProps): Promise<Metadata> {
  const { locale } = await params;

  if (!isLocale(locale)) return {};

  const versions = await getPrivacyPolicyVersions(locale as Locale);
  const latestVersion = versions[0];

  if (!latestVersion) {
    return {};
  }

  const content = await getPrivacyPolicyContent(locale as Locale, latestVersion);

  return {
    title: content.title,
    alternates: {
      canonical: getLocalePath(locale as Locale, "/privacy-policy"),
    },
  };
}

export default async function PrivacyPolicyRoute({
  params,
}: PrivacyPolicyRouteProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const versions = await getPrivacyPolicyVersions(locale as Locale);
  const latestVersion = versions[0];

  if (!latestVersion) {
    notFound();
  }

  const content = await getPrivacyPolicyContent(locale as Locale, latestVersion);

  return (
    <PrivacyPolicyPage
      bodyHtml={content.bodyHtml}
      title={content.title}
      versionOptions={await getPrivacyPolicyVersionOptions(locale as Locale)}
      versionValue={latestVersion}
    />
  );
}
