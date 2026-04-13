"use client";

import { useState } from "react";
import DocsDetailPage, { type DocsDetailPageProps } from "./DocumentationDetailPage";
import ContentGateOverlay from "./ContentGateOverlay";
import type { Locale } from "@/constants/i18n";
import { useManagedContents } from "@/features/content/clientStore";
import type { ContactPageCopy } from "@/features/contact/copy";
import useHydrated from "@/hooks/useHydrated";
import { docsCategoryConfigs, getCategoryHref, getCategoryLabel } from "@/features/content/config";
import { formatPublicDate, getContentThumbnailSrc, getLocalizedContent, getPublicDetailHref, getWriterLabel, isPublishedContentVisible, type ManagedContentEntry } from "@/features/content/data";
import { getContentUnlockCookieName, isContentGatingEnabled } from "@/features/content/gating";

type DocsDetailClientPageProps = {
  contactCopy: ContactPageCopy;
  fallbackProps: DocsDetailPageProps;
  initialContentUnlocked: boolean;
  initialItems: ManagedContentEntry[];
  locale: Locale;
  slug: string;
  section?: "demo" | "documentation";
};

export default function DocsDetailClientPage({
  contactCopy,
  fallbackProps,
  initialContentUnlocked,
  initialItems,
  locale,
  slug,
  section = "documentation",
}: DocsDetailClientPageProps) {
  const resolvedSlug = decodeURIComponent(slug);
  const managedItems = useManagedContents(section, initialItems) ?? [];
  const items = managedItems.filter((item) => isPublishedContentVisible(item, locale));
  const isHydrated = useHydrated();
  const [isUnlocked, setIsUnlocked] = useState(initialContentUnlocked);

  const currentIndex = items.findIndex((item) => item.id === resolvedSlug);
  const currentItem = currentIndex >= 0 ? items[currentIndex] : null;

  if (!isHydrated) {
    return <DocsDetailPage {...fallbackProps} />;
  }

  if (!currentItem) {
    return <DocsDetailPage {...fallbackProps} />;
  }

  const isGateActive = isContentGatingEnabled(currentItem) && !isUnlocked;

  const categoryItems = items.filter(
    (item) => item.categorySlug === currentItem.categorySlug,
  );
  const categoryIndex = categoryItems.findIndex((item) => item.id === resolvedSlug);

  const previousItem = categoryIndex > 0 ? categoryItems[categoryIndex - 1] : null;
  const nextItem = categoryIndex < categoryItems.length - 1 ? categoryItems[categoryIndex + 1] : null;

  const previousLabel = "Previous Post";
  const nextLabel = "Next post";

  const relatedItems = [
    previousItem
      ? {
          category: previousLabel,
          href: getPublicDetailHref(section, locale, previousItem.id),
          imageSrc: getContentThumbnailSrc(previousItem.imageSrc),
          title: getLocalizedContent(previousItem.title, locale),
        }
      : null,
    nextItem
      ? {
          category: nextLabel,
          href: getPublicDetailHref(section, locale, nextItem.id),
          imageSrc: getContentThumbnailSrc(nextItem.imageSrc),
          title: getLocalizedContent(nextItem.title, locale),
        }
      : null,
  ].filter((item): item is NonNullable<typeof item> => !!item);

  return (
    <DocsDetailPage
      {...fallbackProps}
      bodyHtml={isGateActive ? fallbackProps.bodyHtml : getLocalizedContent(currentItem.bodyHtml, locale)}
      category={getCategoryLabel(docsCategoryConfigs, currentItem.categorySlug, locale)}
      contentOverlay={isGateActive ? (
        <ContentGateOverlay
          contactCopy={contactCopy}
          locale={locale}
          onUnlock={() => setIsUnlocked(true)}
          title={getLocalizedContent(currentItem.title, locale)}
          unlockCookieName={getContentUnlockCookieName(currentItem.id)}
        />
      ) : undefined}
      contentListItems={relatedItems}
      downloadHref={
        currentItem.section !== "news" &&
        currentItem.enableDownloadButton &&
        currentItem.downloadPdfSrc
          ? getPublicDetailHref(section, locale, `${currentItem.id}/download`)
          : undefined
      }
      docsHref={getCategoryHref(docsCategoryConfigs, currentItem.categorySlug, locale)}
      date={formatPublicDate(locale, currentItem.dateIso)}
      hideHeroImage={currentItem.hideHeroImage}
      heroImageAlt={getLocalizedContent(currentItem.title, locale)}
      heroImageSrc={currentItem.imageSrc}
      title={getLocalizedContent(currentItem.title, locale)}
      writer={getWriterLabel(currentItem)}
    />
  );
}
