"use client";

import DocsDetailPage, { type DocsDetailPageProps } from "./DocsDetailPage";
import type { Locale } from "@/constants/i18n";
import { useManagedContents } from "@/features/content/clientStore";
import useHydrated from "@/hooks/useHydrated";
import { formatPublicDate, getContentThumbnailSrc, getLocalizedContent, getPublicDetailHref, getWriterLabel, type ManagedContentEntry } from "@/features/content/data";

type DocsDetailClientPageProps = {
  fallbackProps: DocsDetailPageProps;
  initialItems: ManagedContentEntry[];
  locale: Locale;
  slug: string;
};

export default function DocsDetailClientPage({
  fallbackProps,
  initialItems,
  locale,
  slug,
}: DocsDetailClientPageProps) {
  const resolvedSlug = decodeURIComponent(slug);
  const managedItems = useManagedContents("documentation", initialItems) ?? [];
  const items = managedItems.filter((item) => item.status === "published");
  const isHydrated = useHydrated();

  const currentIndex = items.findIndex((item) => item.id === resolvedSlug);
  const currentItem = currentIndex >= 0 ? items[currentIndex] : null;

  if (!isHydrated || !currentItem) {
    return <DocsDetailPage {...fallbackProps} />;
  }

  const categoryItems = items.filter((item) => item.categorySlug === currentItem.categorySlug);
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

  return (
    <DocsDetailPage
      {...fallbackProps}
      bodyHtml={getLocalizedContent(currentItem.bodyHtml, locale)}
      bodyMarkdown={getLocalizedContent(currentItem.bodyMarkdown, locale)}
      contentFormat={currentItem.contentFormat}
      contentListItems={relatedItems}
      date={formatPublicDate(locale, currentItem.dateIso)}
      hideHeroImage={currentItem.hideHeroImage}
      heroImageAlt={getLocalizedContent(currentItem.title, locale)}
      heroImageSrc={currentItem.imageSrc}
      title={getLocalizedContent(currentItem.title, locale)}
      writer={getWriterLabel(currentItem)}
    />
  );
}
