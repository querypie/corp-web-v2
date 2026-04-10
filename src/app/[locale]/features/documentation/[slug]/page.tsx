import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { getLocalePath, isLocale } from "../../../../../constants/i18n";
import DocsDetailClientPage from "../../../../../components/pages/documentation/DocumentationDetailClientPage";
import type { DocsDetailPageProps } from "../../../../../components/pages/documentation/DocumentationDetailPage";
import { getContactPageCopy } from "@/features/contact/copy";
import { docsCategoryConfigs, getCategoryHref } from "@/features/content/config";
import {
  formatPublicDate,
  getManagedCategoryLabel,
  getContentThumbnailSrc,
  getLocalizedContent,
  getPublicDetailHref,
} from "@/features/content/data";
import { readContentState } from "@/features/content/contentState.server";
import {
  buildWhitePaperPreviewHtml,
  hasUnlockedWhitePaperAccess,
  isWhitePaperGatingEnabled,
  WHITE_PAPER_UNLOCK_COOKIE,
} from "@/features/content/gating";

type DocsDetailRouteProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export default async function DocumentationDetailRoute({ params }: DocsDetailRouteProps) {
  const { locale, slug } = await params;
  const resolvedSlug = decodeURIComponent(slug);

  if (!isLocale(locale)) notFound();

  const cookieStore = await cookies();
  const isWhitePaperUnlocked = hasUnlockedWhitePaperAccess(
    cookieStore.get(WHITE_PAPER_UNLOCK_COOKIE)?.value,
  );

  const docsItems = (await readContentState("documentation")).filter((item) => item.status === "published");
  const currentIndex = docsItems.findIndex((item) => item.id === resolvedSlug);
  const currentEntry = currentIndex >= 0 ? docsItems[currentIndex] : null;

  if (currentEntry?.contentType === "outlink") {
    redirect(currentEntry.externalUrl);
  }

  const categoryItems = currentEntry
    ? docsItems.filter((item) => item.categorySlug === currentEntry.categorySlug)
    : [];
  const categoryIndex = currentEntry
    ? categoryItems.findIndex((item) => item.id === resolvedSlug)
    : -1;

  const previousItem = categoryIndex > 0 ? categoryItems[categoryIndex - 1] : null;
  const nextItem = categoryIndex < categoryItems.length - 1 ? categoryItems[categoryIndex + 1] : null;

  const relatedItems = [
    previousItem
      ? {
          category: "Previous Post",
          href: getPublicDetailHref("documentation", locale, previousItem.id),
          imageSrc: getContentThumbnailSrc(previousItem.imageSrc),
          title: getLocalizedContent(previousItem.title, locale),
        }
      : null,
    nextItem
      ? {
          category: "Next post",
          href: getPublicDetailHref("documentation", locale, nextItem.id),
          imageSrc: getContentThumbnailSrc(nextItem.imageSrc),
          title: getLocalizedContent(nextItem.title, locale),
        }
      : null,
  ].filter((item): item is NonNullable<typeof item> => !!item);

  const isGateActive = currentEntry
    ? isWhitePaperGatingEnabled(currentEntry) && !isWhitePaperUnlocked
    : false;
  const localizedBodyHtml = currentEntry ? getLocalizedContent(currentEntry.bodyHtml, locale) : "";
  const previewBodyHtml =
    currentEntry && isGateActive
      ? buildWhitePaperPreviewHtml(localizedBodyHtml, currentEntry.gatingLevel)
      : localizedBodyHtml;

  return (
    <DocsDetailClientPage
      contactCopy={getContactPageCopy(locale)}
      fallbackProps={{
        docsHref: currentEntry
          ? getCategoryHref(docsCategoryConfigs, currentEntry.categorySlug, locale)
          : getLocalePath(locale, "/features/documentation"),
        slug: resolvedSlug,
        bodyHtml: previewBodyHtml,
        bodyMarkdown: currentEntry ? getLocalizedContent(currentEntry.bodyMarkdown, locale) : "",
        category: currentEntry ? getManagedCategoryLabel("documentation", currentEntry.categorySlug, locale) : "",
        contentFormat: currentEntry?.contentFormat ?? "markdown",
        contentListDescription: "",
        contentListItems: relatedItems,
        contentListLinks: [],
        contentListTitle: "Contents List",
        date: currentEntry ? formatPublicDate(locale, currentEntry.dateIso) : "",
        downloadHref:
          currentEntry?.categorySlug === "white-papers" &&
          currentEntry.enableDownloadButton &&
          currentEntry.downloadPdfSrc
            ? getLocalePath(locale, `/features/documentation/${resolvedSlug}/download`)
            : undefined,
        hideHeroImage: currentEntry?.hideHeroImage ?? false,
        heroImageAlt: currentEntry ? getLocalizedContent(currentEntry.title, locale) : "",
        heroImageSrc: currentEntry?.imageSrc ?? "/images/common/fallback-contents.jpg",
        title: currentEntry ? getLocalizedContent(currentEntry.title, locale) : "",
        writer: currentEntry
          ? currentEntry.authorRole
            ? `${currentEntry.authorName} / ${currentEntry.authorRole}`
            : currentEntry.authorName
          : "",
      } satisfies DocsDetailPageProps}
      initialWhitePaperUnlocked={isWhitePaperUnlocked}
      initialItems={docsItems}
      locale={locale}
      slug={resolvedSlug}
    />
  );
}

export async function generateMetadata({ params }: DocsDetailRouteProps): Promise<Metadata> {
  const { locale, slug } = await params;

  if (!isLocale(locale)) return {};

  return {
    alternates: {
      canonical: getLocalePath(locale, `/features/documentation/${decodeURIComponent(slug)}`),
    },
  };
}
