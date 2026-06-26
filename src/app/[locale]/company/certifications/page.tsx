import { notFound } from "next/navigation";
import type { Metadata } from "next";
import CertificationsPage from "@/components/pages/company/CertificationsPage";
import { getLocalePath, isLocale } from "@/constants/i18n";
import {
  getCertificationsMetadataDescription,
  getCertificationsMetadataTitle,
  getCertificationsPageCopy,
} from "@/copy/company";
import { withDynamicOgImage } from "@/features/seo/metadata";

type CertificationsRouteProps = {
  params: Promise<{ locale: string }>;
};

export default async function CertificationsRoute({
  params,
}: CertificationsRouteProps) {
  const { locale } = await params;

  if (!isLocale(locale)) notFound();

  return <CertificationsPage {...getCertificationsPageCopy(locale)} locale={locale} />;
}

export async function generateMetadata({ params }: CertificationsRouteProps): Promise<Metadata> {
  const { locale } = await params;

  if (!isLocale(locale)) return {};

  const title = getCertificationsMetadataTitle(locale);
  const description = getCertificationsMetadataDescription(locale);

  return withDynamicOgImage({
    title,
    description,
    alternates: {
      canonical: getLocalePath(locale, "/company/certifications"),
    },
  }, { locale, title, description });
}
