import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ContentDownloadPage from "@/components/pages/documentation/ContentDownloadPage";
import { isLocale } from "@/constants/i18n";
import { getContactPageCopy } from "@/copy/contact";
import {
  getContentDownloadPdfFileName,
  getContentDownloadPdfSrc,
  getLocalizedContent,
  getPublicDetailHref,
  getResolvedContentLocale,
  isPublishedContentAccessible,
} from "@/features/content/data";
import { readContentItem } from "@/features/content/contentState.server";
import { getContentUnlockCookieName } from "@/features/content/gating";
import { withDynamicOgImage } from "@/features/seo/metadata";

type DemoDownloadRouteProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export default async function DemoDownloadRoute({ params }: DemoDownloadRouteProps) {
  const { locale, slug } = await params;
  const resolvedSlug = decodeURIComponent(slug);

  if (!isLocale(locale)) notFound();

  const currentEntry = await readContentItem("demo", resolvedSlug, { includeBodies: false });
  const downloadPdfSrc = currentEntry ? getContentDownloadPdfSrc(currentEntry, locale) : "";
  const downloadPdfFileName = currentEntry ? getContentDownloadPdfFileName(currentEntry, locale) : "";

  if (
    !currentEntry ||
    !isPublishedContentAccessible(currentEntry) ||
    !downloadPdfSrc
  ) {
    notFound();
  }

  return (
    <ContentDownloadPage
      attachmentFileName={downloadPdfFileName}
      attachmentUrl={downloadPdfSrc}
      contactCopy={getContactPageCopy(locale)}
      contentId={currentEntry.id}
      coverImageSrc={currentEntry.downloadCoverImageSrc || currentEntry.imageSrc || "/assets/common/fallback-contents.jpg"}
      locale={locale}
      pdfPreviewUrl={downloadPdfSrc}
      returnUrl={getPublicDetailHref("demo", locale, resolvedSlug, currentEntry.categorySlug)}
      section="demo"
      title={getLocalizedContent(currentEntry.title, getResolvedContentLocale(currentEntry, locale))}
      unlockCookieName={getContentUnlockCookieName(currentEntry.id, "demo")}
    />
  );
}

export async function generateMetadata({ params }: DemoDownloadRouteProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const resolvedSlug = decodeURIComponent(slug);

  if (!isLocale(locale)) return {};

  const currentEntry = await readContentItem("demo", resolvedSlug, { includeBodies: false });
  const downloadPdfSrc = currentEntry ? getContentDownloadPdfSrc(currentEntry, locale) : "";

  if (
    !currentEntry ||
    !isPublishedContentAccessible(currentEntry) ||
    !downloadPdfSrc
  ) {
    return {};
  }

  const title = getLocalizedContent(currentEntry.title, getResolvedContentLocale(currentEntry, locale));
  const description = getLocalizedContent(currentEntry.summary, getResolvedContentLocale(currentEntry, locale));

  return withDynamicOgImage({
    title,
    description,
    alternates: {
      canonical: `${getPublicDetailHref("demo", locale, resolvedSlug, currentEntry.categorySlug)}/download`,
    },
  }, { locale, title, description });
}
