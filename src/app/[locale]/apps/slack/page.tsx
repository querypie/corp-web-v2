import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SlackAppPage from "@/components/pages/apps/SlackAppPage";
import { getLocalePath, isLocale } from "@/constants/i18n";
import { getSlackAppPageCopy } from "@/copy/apps";
import { withDynamicOgImage } from "@/features/seo/metadata";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const copy = getSlackAppPageCopy(locale);
  return withDynamicOgImage({ title: copy.metadataTitle, description: copy.metadataDescription, alternates: { canonical: getLocalePath(locale, "/apps/slack") } }, { locale, title: copy.metadataTitle, description: copy.metadataDescription });
}

export default async function SlackAppRoute({ params }: PageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <SlackAppPage {...getSlackAppPageCopy(locale)} locale={locale} />;
}
