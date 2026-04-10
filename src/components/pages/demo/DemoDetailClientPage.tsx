"use client";

import DemoDetailPage from "./DemoDetailPage";
import type { Locale } from "@/constants/i18n";
import type { DocsDetailPageProps } from "../documentation/DocumentationDetailPage";
import { useManagedContents } from "@/features/content/clientStore";
import useHydrated from "@/hooks/useHydrated";
import { demoCategoryConfigs, getCategoryHref, getCategoryLabel } from "@/features/content/config";
import { formatPublicDate, getContentThumbnailSrc, getLocalizedContent, getPublicDetailHref, getWriterLabel, type ManagedContentEntry } from "@/features/content/data";

type DemoDetailClientPageProps = {
  fallbackProps: DocsDetailPageProps;
  initialItems: ManagedContentEntry[];
  locale: Locale;
  slug: string;
};

export default function DemoDetailClientPage({
  fallbackProps,
  initialItems,
  locale,
  slug,
}: DemoDetailClientPageProps) {
  const resolvedSlug = decodeURIComponent(slug);
  const managedItems = useManagedContents("demo", initialItems) ?? [];
  const items = managedItems.filter((item) => item.status === "published");
  const isHydrated = useHydrated();

  const currentIndex = items.findIndex((item) => item.id === resolvedSlug);
  const currentUseCase = currentIndex >= 0 ? items[currentIndex] : null;

  if (!isHydrated) {
    return <DemoDetailPage {...fallbackProps} />;
  }

  if (!currentUseCase) {
    return <DemoDetailPage {...fallbackProps} />;
  }

  const categoryItems = items.filter(
    (item) => item.categorySlug === currentUseCase.categorySlug,
  );
  const categoryIndex = categoryItems.findIndex((item) => item.id === resolvedSlug);

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
      bodyHtml={getLocalizedContent(currentUseCase.bodyHtml, locale)}
      bodyMarkdown={getLocalizedContent(currentUseCase.bodyMarkdown, locale)}
      category={getCategoryLabel(demoCategoryConfigs, currentUseCase.categorySlug, locale)}
      contentFormat={currentUseCase.contentFormat}
      contentListItems={relatedPublishedItems}
      docsHref={getCategoryHref(demoCategoryConfigs, currentUseCase.categorySlug, locale)}
      date={formatPublicDate(locale, currentUseCase.dateIso)}
      hideHeroImage={currentUseCase.hideHeroImage}
      heroImageAlt={getLocalizedContent(currentUseCase.title, locale)}
      heroImageSrc={currentUseCase.imageSrc}
      title={getLocalizedContent(currentUseCase.title, locale)}
      writer={getWriterLabel(currentUseCase)}
    />
  );
}
