import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ContentDownloadPage from "../../../../../../components/pages/documentation/ContentDownloadPage";
import { isLocale, getLocalePath } from "../../../../../../constants/i18n";
import { getContactPageCopy } from "@/features/contact/copy";
import { getLocalizedContent, isPublishedContentAccessible } from "@/features/content/data";
import { readContentItem } from "@/features/content/contentState.server";
import { getContentUnlockCookieName } from "@/features/content/gating";

type WhitePaperDownloadRouteProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export default async function WhitePaperDownloadRoute({ params }: WhitePaperDownloadRouteProps) {
  const { locale, slug } = await params;
  const resolvedSlug = decodeURIComponent(slug);

  if (!isLocale(locale)) notFound();

  const currentEntry = await readContentItem("documentation", resolvedSlug, { includeBodies: false });

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
      returnUrl={getLocalePath(locale, `/features/documentation/${resolvedSlug}`)}
      title={getLocalizedContent(currentEntry.title, locale)}
      unlockCookieName={getContentUnlockCookieName(currentEntry.id)}
    />
  );
}

export async function generateMetadata({ params }: WhitePaperDownloadRouteProps): Promise<Metadata> {
  const { locale, slug } = await params;

  if (!isLocale(locale)) return {};

  return {
    alternates: {
      canonical: getLocalePath(locale, `/features/documentation/${decodeURIComponent(slug)}/download`),
    },
  };
}
