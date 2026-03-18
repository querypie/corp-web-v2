"use client";

import DocsDetailPage, { type DocsDetailPageProps } from "./DocsDetailPage";
import type { Locale } from "@/constants/i18n";
import { useManagedContents } from "@/features/content/clientStore";
import useHydrated from "@/hooks/useHydrated";
import { docsCategoryConfigs, getCategoryLabel } from "@/features/content/config";
import { formatPublicDate, getContentThumbnailSrc, getLocalizedContent, getPublicDetailHref, getWriterLabel } from "@/features/content/data";

type DocsDetailClientPageProps = {
  fallbackProps: DocsDetailPageProps;
  locale: Locale;
  slug: string;
};

export default function DocsDetailClientPage({
  fallbackProps,
  locale,
  slug,
}: DocsDetailClientPageProps) {
  const items = useManagedContents("documentation").filter((item) => item.status === "published");
  const isHydrated = useHydrated();

  const currentIndex = items.findIndex((item) => item.id === slug);
  const currentItem = currentIndex >= 0 ? items[currentIndex] : null;

  if (!isHydrated) {
    return <DocsDetailPage {...fallbackProps} category="" date="" heroImageSrc="" />;
  }

  if (!currentItem) {
    return <DocsDetailPage {...fallbackProps} />;
  }

  const categoryItems = items.filter(
    (item) => item.categorySlug === currentItem.categorySlug,
  );
  const categoryIndex = categoryItems.findIndex((item) => item.id === slug);

  const previousItem = categoryIndex > 0 ? categoryItems[categoryIndex - 1] : null;
  const nextItem = categoryIndex < categoryItems.length - 1 ? categoryItems[categoryIndex + 1] : null;

  const previousLabel = "Previous Post";
  const nextLabel = "Next post";

  const relatedItems = [
    previousItem
      ? {
          category: previousLabel,
          href: getPublicDetailHref("documentation", locale, previousItem.id),
          imageSrc: getContentThumbnailSrc(previousItem.imageSrc),
          title: getLocalizedContent(previousItem.title, locale),
        }
      : null,
    nextItem
      ? {
          category: nextLabel,
          href: getPublicDetailHref("documentation", locale, nextItem.id),
          imageSrc: getContentThumbnailSrc(nextItem.imageSrc),
          title: getLocalizedContent(nextItem.title, locale),
        }
      : null,
  ].filter((item): item is NonNullable<typeof item> => !!item);

  return (
    <DocsDetailPage
      {...fallbackProps}
      bodyMarkdown={getLocalizedContent(currentItem.bodyMarkdown, locale)}
      category={getCategoryLabel(docsCategoryConfigs, currentItem.categorySlug, locale)}
      contentListItems={relatedItems}
      date={formatPublicDate(locale, currentItem.dateIso)}
      heroImageAlt={getLocalizedContent(currentItem.title, locale)}
      heroImageSrc={currentItem.imageSrc}
      title={getLocalizedContent(currentItem.title, locale)}
      writer={getWriterLabel(currentItem)}
    />
  );
}
