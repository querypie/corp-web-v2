import { notFound } from "next/navigation";
import type { Metadata } from "next";
import WhitePaperDownloadPage from "../../../../../../components/pages/documentation/WhitePaperDownloadPage";
import { isLocale, getLocalePath } from "../../../../../../constants/i18n";
import { getContactPageCopy } from "@/features/contact/copy";
import { getLocalizedContent } from "@/features/content/data";
import { readContentState } from "@/features/content/contentState.server";

type WhitePaperDownloadRouteProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export default async function WhitePaperDownloadRoute({ params }: WhitePaperDownloadRouteProps) {
  const { locale, slug } = await params;
  const resolvedSlug = decodeURIComponent(slug);

  if (!isLocale(locale)) notFound();

  const docsItems = (await readContentState("documentation")).filter((item) => item.status === "published");
  const currentEntry = docsItems.find((item) => item.id === resolvedSlug);

  if (
    !currentEntry ||
    currentEntry.categorySlug !== "white-papers" ||
    !currentEntry.enableDownloadButton ||
    !currentEntry.downloadPdfSrc
  ) {
    notFound();
  }

  return (
    <WhitePaperDownloadPage
      attachmentFileName={currentEntry.downloadPdfFileName || `${currentEntry.id}.pdf`}
      attachmentUrl={currentEntry.downloadPdfSrc}
      contactCopy={getContactPageCopy(locale)}
      coverImageSrc={currentEntry.downloadCoverImageSrc || currentEntry.imageSrc || "/images/common/fallback-contents.jpg"}
      locale={locale}
      pdfPreviewUrl={currentEntry.downloadPdfSrc}
      returnUrl={getLocalePath(locale, `/features/documentation/${resolvedSlug}`)}
      title={getLocalizedContent(currentEntry.title, locale)}
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
