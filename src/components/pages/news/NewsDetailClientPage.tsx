"use client";

import NewsDetailPage from "./NewsDetailPage";
import type { Locale } from "@/constants/i18n";
import type { DocsDetailPageProps } from "../docs/DocsDetailPage";
import { useManagedContents } from "@/features/content/clientStore";
import { formatPublicDate, getContentThumbnailSrc, getLocalizedContent, getWriterLabel, type ManagedContentEntry } from "@/features/content/data";
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
  const items = useManagedContents("news", initialItems).filter((item) => item.status === "published");
  const isHydrated = useHydrated();

  const currentIndex = items.findIndex((item) => item.id === decodedSlug);
  const currentItem = currentIndex >= 0 ? items[currentIndex] : null;

  if (!isHydrated || !currentItem || currentItem.contentType !== "content") {
    return <NewsDetailPage {...fallbackProps} />;
  }

  const previousItem = currentIndex > 0 ? items[currentIndex - 1] : null;
  const nextItem = currentIndex < items.length - 1 ? items[currentIndex + 1] : null;

  const relatedItems = [
    previousItem
      ? {
          category: "Previous Post",
          href: previousItem.contentType === "outlink"
            ? previousItem.externalUrl
            : `/${locale}/news/${previousItem.id}`,
          imageSrc: getContentThumbnailSrc(previousItem.imageSrc),
          title: getLocalizedContent(previousItem.title, locale),
        }
      : null,
    nextItem
      ? {
          category: "Next post",
          href: nextItem.contentType === "outlink"
            ? nextItem.externalUrl
            : `/${locale}/news/${nextItem.id}`,
          imageSrc: getContentThumbnailSrc(nextItem.imageSrc),
          title: getLocalizedContent(nextItem.title, locale),
        }
      : null,
  ].filter((item): item is NonNullable<typeof item> => !!item);

  return (
    <NewsDetailPage
      {...fallbackProps}
      bodyHtml={getLocalizedContent(currentItem.bodyHtml, locale)}
      bodyMarkdown={getLocalizedContent(currentItem.bodyMarkdown, locale)}
      category="News"
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
