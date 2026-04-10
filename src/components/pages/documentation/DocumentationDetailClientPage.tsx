"use client";

import { useState } from "react";
import DocsDetailPage, { type DocsDetailPageProps } from "./DocumentationDetailPage";
import WhitePaperGateOverlay from "./WhitePaperGateOverlay";
import type { Locale } from "@/constants/i18n";
import { useManagedContents } from "@/features/content/clientStore";
import type { ContactPageCopy } from "@/features/contact/copy";
import useHydrated from "@/hooks/useHydrated";
<<<<<<< HEAD:src/components/pages/documentation/DocumentationDetailClientPage.tsx
import { docsCategoryConfigs, getCategoryHref, getCategoryLabel } from "@/features/content/config";
import { formatPublicDate, getContentThumbnailSrc, getLocalizedContent, getPublicDetailHref, getWriterLabel, type ManagedContentEntry } from "@/features/content/data";
import { isWhitePaperGatingEnabled } from "@/features/content/gating";
=======
import { docsCategoryConfigs, getCategoryLabel } from "@/features/content/config";
import { formatPublicDate, getContentThumbnailSrc, getLocalizedContent, getPublicDetailHref, getWriterLabel, type ManagedContentEntry } from "@/features/content/data";
>>>>>>> origin/main:src/components/pages/docs/DocsDetailClientPage.tsx

type DocsDetailClientPageProps = {
  contactCopy: ContactPageCopy;
  fallbackProps: DocsDetailPageProps;
<<<<<<< HEAD:src/components/pages/documentation/DocumentationDetailClientPage.tsx
  initialWhitePaperUnlocked: boolean;
=======
>>>>>>> origin/main:src/components/pages/docs/DocsDetailClientPage.tsx
  initialItems: ManagedContentEntry[];
  locale: Locale;
  slug: string;
};

export default function DocsDetailClientPage({
  contactCopy,
  fallbackProps,
<<<<<<< HEAD:src/components/pages/documentation/DocumentationDetailClientPage.tsx
  initialWhitePaperUnlocked,
=======
>>>>>>> origin/main:src/components/pages/docs/DocsDetailClientPage.tsx
  initialItems,
  locale,
  slug,
}: DocsDetailClientPageProps) {
  const resolvedSlug = decodeURIComponent(slug);
<<<<<<< HEAD:src/components/pages/documentation/DocumentationDetailClientPage.tsx
  const managedItems = useManagedContents("documentation", initialItems) ?? [];
  const items = managedItems.filter((item) => item.status === "published");
=======
  const items = useManagedContents("documentation", initialItems).filter((item) => item.status === "published");
>>>>>>> origin/main:src/components/pages/docs/DocsDetailClientPage.tsx
  const isHydrated = useHydrated();
  const [isUnlocked, setIsUnlocked] = useState(initialWhitePaperUnlocked);

  const currentIndex = items.findIndex((item) => item.id === resolvedSlug);
  const currentItem = currentIndex >= 0 ? items[currentIndex] : null;

  if (!isHydrated) {
    return <DocsDetailPage {...fallbackProps} />;
  }

  if (!currentItem) {
    return <DocsDetailPage {...fallbackProps} />;
  }

  const isGateActive = isWhitePaperGatingEnabled(currentItem) && !isUnlocked;

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
<<<<<<< HEAD:src/components/pages/documentation/DocumentationDetailClientPage.tsx
      bodyHtml={isGateActive ? fallbackProps.bodyHtml : getLocalizedContent(currentItem.bodyHtml, locale)}
      bodyMarkdown={isGateActive ? fallbackProps.bodyMarkdown : getLocalizedContent(currentItem.bodyMarkdown, locale)}
      category={getCategoryLabel(docsCategoryConfigs, currentItem.categorySlug, locale)}
      contentOverlay={isGateActive ? (
        <WhitePaperGateOverlay
          contactCopy={contactCopy}
          locale={locale}
          onUnlock={() => setIsUnlocked(true)}
          title={getLocalizedContent(currentItem.title, locale)}
        />
      ) : undefined}
=======
      bodyHtml={getLocalizedContent(currentItem.bodyHtml, locale)}
      bodyMarkdown={getLocalizedContent(currentItem.bodyMarkdown, locale)}
      category={getCategoryLabel(docsCategoryConfigs, currentItem.categorySlug, locale)}
>>>>>>> origin/main:src/components/pages/docs/DocsDetailClientPage.tsx
      contentFormat={currentItem.contentFormat}
      contentListItems={relatedItems}
      downloadHref={
        currentItem.categorySlug === "white-papers" &&
        currentItem.enableDownloadButton &&
        currentItem.downloadPdfSrc
          ? getPublicDetailHref("documentation", locale, `${currentItem.id}/download`)
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
