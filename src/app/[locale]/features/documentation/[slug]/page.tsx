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
  isPublishedContentVisible,
  getPublicDetailHref,
} from "@/features/content/data";
import { readContentState } from "@/features/content/contentState.server";
import {
  buildContentPreviewHtml,
  getContentUnlockCookieName,
  hasUnlockedContentAccess,
  isContentGatingEnabled,
} from "@/features/content/gating";

type DocsDetailRouteProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export default async function DocumentationDetailRoute({ params }: DocsDetailRouteProps) {
  const { locale, slug } = await params;
  const resolvedSlug = decodeURIComponent(slug);

  if (!isLocale(locale)) notFound();

  const cookieStore = await cookies();
  const docsItems = (await readContentState("documentation")).filter((item) => isPublishedContentVisible(item, locale));
  const currentIndex = docsItems.findIndex((item) => item.id === resolvedSlug);
  const currentEntry = currentIndex >= 0 ? docsItems[currentIndex] : null;

  if (!currentEntry) {
    notFound();
  }

  const isContentUnlocked = hasUnlockedContentAccess(
    cookieStore.get(getContentUnlockCookieName(currentEntry.id))?.value,
  );

  if (currentEntry.contentType === "outlink") {
    redirect(currentEntry.externalUrl);
  }

  const categoryItems = docsItems.filter((item) => item.categorySlug === currentEntry.categorySlug);
  const categoryIndex = categoryItems.findIndex((item) => item.id === resolvedSlug);

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

  const isGateActive = isContentGatingEnabled(currentEntry) && !isContentUnlocked;
  const localizedBodyHtml = getLocalizedContent(currentEntry.bodyHtml, locale);
  const previewBodyHtml =
    isGateActive
      ? buildContentPreviewHtml(localizedBodyHtml, currentEntry.gatingLevel)
      : localizedBodyHtml;

  return (
    <DocsDetailClientPage
      contactCopy={getContactPageCopy(locale)}
      fallbackProps={{
        docsHref: getCategoryHref(docsCategoryConfigs, currentEntry.categorySlug, locale),
        slug: resolvedSlug,
        bodyHtml: previewBodyHtml,
        category: getManagedCategoryLabel("documentation", currentEntry.categorySlug, locale),
        contentListDescription: "",
        contentListItems: relatedItems,
        contentListLinks: [],
        contentListTitle: "Contents List",
        date: formatPublicDate(locale, currentEntry.dateIso),
        downloadHref:
          currentEntry.enableDownloadButton && currentEntry.downloadPdfSrc
            ? getLocalePath(locale, `/features/documentation/${resolvedSlug}/download`)
            : undefined,
        hideHeroImage: currentEntry.hideHeroImage,
        heroImageAlt: getLocalizedContent(currentEntry.title, locale),
        heroImageSrc: currentEntry.imageSrc || "/images/common/fallback-contents.jpg",
        title: getLocalizedContent(currentEntry.title, locale),
        writer: currentEntry.authorRole
          ? `${currentEntry.authorName} / ${currentEntry.authorRole}`
          : currentEntry.authorName,
      } satisfies DocsDetailPageProps}
      initialContentUnlocked={isContentUnlocked}
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
