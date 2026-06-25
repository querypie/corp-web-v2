import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ContentDownloadPage from "../../../../../../components/pages/documentation/ContentDownloadPage";
import { isLocale, getLocalePath } from "../../../../../../constants/i18n";
import { getContactPageCopy } from "@/features/contact/copy";
import { getLocalizedContent, getResolvedContentLocale, isPublishedContentAccessible } from "@/features/content/data";
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
      contentId={currentEntry.id}
      coverImageSrc={currentEntry.downloadCoverImageSrc || currentEntry.imageSrc || "/images/common/fallback-contents.jpg"}
      locale={locale}
      pdfPreviewUrl={currentEntry.downloadPdfSrc}
      returnUrl={getLocalePath(locale, `/features/demo/${resolvedSlug}`)}
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

  if (
    !currentEntry ||
    !isPublishedContentAccessible(currentEntry) ||
    !currentEntry.enableDownloadButton ||
    !currentEntry.downloadPdfSrc
  ) {
    return {};
  }

  const title = getLocalizedContent(currentEntry.title, getResolvedContentLocale(currentEntry, locale));
  const description = getLocalizedContent(currentEntry.summary, getResolvedContentLocale(currentEntry, locale));

  return withDynamicOgImage({
    title,
    description,
    alternates: {
      canonical: getLocalePath(locale, `/features/demo/${resolvedSlug}/download`),
    },
  }, { locale, title, description });
}
