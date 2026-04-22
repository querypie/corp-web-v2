import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ContentDownloadPage from "../../../../../../components/pages/documentation/ContentDownloadPage";
import { isLocale, getLocalePath } from "../../../../../../constants/i18n";
import { getContactPageCopy } from "@/features/contact/copy";
import { getLocalizedContent, isPublishedContentAccessible } from "@/features/content/data";
import { readContentItem } from "@/features/content/contentState.server";
import { getContentUnlockCookieName } from "@/features/content/gating";

type DemoDownloadRouteProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export default async function DemoDownloadRoute({ params }: DemoDownloadRouteProps) {
  const { locale, slug } = await params;
  const resolvedSlug = decodeURIComponent(slug);

  if (!isLocale(locale)) notFound();

  const currentEntry = await readContentItem("demo", resolvedSlug, { includeBodies: false });

  if (
    !currentEntry ||
    !isPublishedContentAccessible(currentEntry) ||
    !currentEntry.enableDownloadButton ||
    !currentEntry.downloadPdfSrc
  ) {
    notFound();
  }

  return (
    <ContentDownloadPage
      attachmentFileName={currentEntry.downloadPdfFileName || `${currentEntry.id}.pdf`}
      attachmentUrl={currentEntry.downloadPdfSrc}
      contactCopy={getContactPageCopy(locale)}
      coverImageSrc={currentEntry.downloadCoverImageSrc || currentEntry.imageSrc || "/images/common/fallback-contents.jpg"}
      locale={locale}
      pdfPreviewUrl={currentEntry.downloadPdfSrc}
      returnUrl={getLocalePath(locale, `/features/demo/${resolvedSlug}`)}
      title={getLocalizedContent(currentEntry.title, locale)}
      unlockCookieName={getContentUnlockCookieName(currentEntry.id)}
    />
  );
}

export async function generateMetadata({ params }: DemoDownloadRouteProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const resolvedSlug = decodeURIComponent(slug);

  if (!isLocale(locale)) return {};

  const currentEntry = await readContentItem("demo", resolvedSlug, { includeBodies: false });

  if (
    !currentEntry ||
    !isPublishedContentAccessible(currentEntry) ||
    !currentEntry.enableDownloadButton ||
    !currentEntry.downloadPdfSrc
  ) {
    return {};
  }

  return {
    title: getLocalizedContent(currentEntry.title, locale),
    alternates: {
      canonical: getLocalePath(locale, `/features/demo/${resolvedSlug}/download`),
    },
  };
}
