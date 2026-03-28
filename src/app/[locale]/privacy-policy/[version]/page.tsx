import { notFound } from "next/navigation";
import PrivacyPolicyPage from "../../../../components/pages/legal/PrivacyPolicyPage";
import { isLocale, type Locale } from "../../../../constants/i18n";
import {
  getPrivacyPolicyContent,
  getPrivacyPolicyVersionOptions,
  getPrivacyPolicyVersions,
} from "../../../../constants/privacyPolicy";

type PrivacyPolicyVersionRouteProps = {
  params: Promise<{ locale: string; version: string }>;
};

export const dynamic = "force-dynamic";

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
