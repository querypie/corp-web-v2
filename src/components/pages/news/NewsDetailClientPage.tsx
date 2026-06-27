"use client";

import NewsDetailPage from "./NewsDetailPage";
import { type Locale } from "@/constants/i18n";
import type { DocsDetailPageProps } from "../documentation/DocumentationDetailPage";
import { useManagedContents } from "@/features/content/clientStore";
import {
  formatPublicDate,
  getAdjacentContentLabel,
  getContentThumbnailSrc,
  getLocalizedContent,
  getNewsFormatLabel,
  getPublicDetailHref,
  getResolvedContentLocale,
  isPublishedContentAccessible,
  type ManagedContentEntry,
} from "@/features/content/data";
import useHydrated from "@/hooks/useHydrated";

type NewsDetailClientPageProps = {
  fallbackProps: DocsDetailPageProps;
  initialItems: ManagedContentEntry[];
  locale: Locale;
  slug: string;
};

export default function NewsDetailClientPage({
  fallbackProps,
  initialItems,
  locale,
  slug,
}: NewsDetailClientPageProps) {
  const decodedSlug = decodeURIComponent(slug);
  const managedItems = useManagedContents("news", initialItems, undefined, "full", { liveSync: false }) ?? [];
  const items = managedItems.filter(isPublishedContentAccessible);
  const isHydrated = useHydrated();

  const currentIndex = items.findIndex((item) => item.id === decodedSlug);
  const currentItem = currentIndex >= 0 ? items[currentIndex] : null;

  if (!isHydrated || !currentItem || currentItem.contentType !== "content") {
    return <NewsDetailPage {...fallbackProps} />;
  }

  const previousItem = currentIndex > 0 ? items[currentIndex - 1] : null;
  const nextItem = currentIndex < items.length - 1 ? items[currentIndex + 1] : null;
  const contentLocale = getResolvedContentLocale(currentItem, locale);

  const relatedItems = [
    previousItem
      ? {
          category: getAdjacentContentLabel("previous", locale),
          href: previousItem.contentType === "outlink"
            ? previousItem.externalUrl
            : getPublicDetailHref("news", locale, previousItem.id),
          imageSrc: getContentThumbnailSrc(previousItem.imageSrc),
          isExternal: previousItem.contentType === "outlink",
          title: getLocalizedContent(previousItem.title, getResolvedContentLocale(previousItem, locale)),
        }
      : null,
    nextItem
      ? {
          category: getAdjacentContentLabel("next", locale),
          href: nextItem.contentType === "outlink"
            ? nextItem.externalUrl
            : getPublicDetailHref("news", locale, nextItem.id),
          imageSrc: getContentThumbnailSrc(nextItem.imageSrc),
          isExternal: nextItem.contentType === "outlink",
          title: getLocalizedContent(nextItem.title, getResolvedContentLocale(nextItem, locale)),
        }
      : null,
  ].filter((item): item is NonNullable<typeof item> => !!item);

  return (
    <NewsDetailPage
      {...fallbackProps}
      bodyHtml={getLocalizedContent(currentItem.bodyHtml, contentLocale) || fallbackProps.bodyHtml}
      category="News"
      contentListItems={relatedItems}
      date={formatPublicDate(locale, currentItem.dateIso)}
      hideHeroImage={currentItem.hideHeroImage}
      heroImageAlt={getLocalizedContent(currentItem.title, contentLocale)}
      heroImageSrc={currentItem.imageSrc}
      title={getLocalizedContent(currentItem.title, contentLocale)}
      writer={getNewsFormatLabel(currentItem, locale)}
    />
  );
}
