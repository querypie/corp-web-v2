"use client";

import DemoDetailPage from "./DemoDetailPage";
import type { Locale } from "@/constants/i18n";
import type { DocsDetailPageProps } from "../docs/DocsDetailPage";
import { useManagedContents } from "@/features/content/clientStore";
import useHydrated from "@/hooks/useHydrated";
import { demoCategoryConfigs, getCategoryLabel } from "@/features/content/config";
import { formatPublicDate, getContentThumbnailSrc, getLocalizedContent, getPublicDetailHref, getWriterLabel } from "@/features/content/data";

type DemoDetailClientPageProps = {
  fallbackProps: DocsDetailPageProps;
  locale: Locale;
  slug: string;
};

export default function DemoDetailClientPage({
  fallbackProps,
  locale,
  slug,
}: DemoDetailClientPageProps) {
  const items = useManagedContents("demo").filter((item) => item.status === "published");
  const isHydrated = useHydrated();

  const currentIndex = items.findIndex((item) => item.id === slug);
  const currentUseCase = currentIndex >= 0 ? items[currentIndex] : null;

  if (!isHydrated) {
    return <DemoDetailPage {...fallbackProps} category="" date="" heroImageSrc="" />;
  }

  if (!currentUseCase) {
    return <DemoDetailPage {...fallbackProps} />;
  }

  const categoryItems = items.filter(
    (item) => item.categorySlug === currentUseCase.categorySlug,
  );
  const categoryIndex = categoryItems.findIndex((item) => item.id === slug);

  const previousItem = categoryIndex > 0 ? categoryItems[categoryIndex - 1] : null;
  const nextItem = categoryIndex < categoryItems.length - 1 ? categoryItems[categoryIndex + 1] : null;

  const previousLabel = "Previous Post";
  const nextLabel = "Next post";

  const relatedPublishedItems = [
    previousItem
      ? {
          category: previousLabel,
          href: getPublicDetailHref("demo", locale, previousItem.id),
          imageSrc: getContentThumbnailSrc(previousItem.imageSrc),
          title: getLocalizedContent(previousItem.title, locale),
        }
      : null,
    nextItem
      ? {
          category: nextLabel,
          href: getPublicDetailHref("demo", locale, nextItem.id),
          imageSrc: getContentThumbnailSrc(nextItem.imageSrc),
          title: getLocalizedContent(nextItem.title, locale),
        }
      : null,
  ].filter((item): item is NonNullable<typeof item> => !!item);

  return (
    <DemoDetailPage
      {...fallbackProps}
      bodyMarkdown={getLocalizedContent(currentUseCase.bodyMarkdown, locale)}
      category={getCategoryLabel(demoCategoryConfigs, currentUseCase.categorySlug, locale)}
      contentListItems={relatedPublishedItems}
      date={formatPublicDate(locale, currentUseCase.dateIso)}
      heroImageAlt={getLocalizedContent(currentUseCase.title, locale)}
      heroImageSrc={currentUseCase.imageSrc}
      title={getLocalizedContent(currentUseCase.title, locale)}
      writer={getWriterLabel(currentUseCase)}
    />
  );
}
