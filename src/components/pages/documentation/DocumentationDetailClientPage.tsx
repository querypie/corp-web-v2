"use client";

import { useEffect, useState } from "react";
import DocsDetailPage, { type DocsDetailPageProps } from "./DocumentationDetailPage";
import ContentGateOverlay from "./ContentGateOverlay";
import type { Locale } from "@/constants/i18n";
import { useManagedContents } from "@/features/content/clientStore";
import type { ContactPageCopy } from "@/copy/contact";
import useHydrated from "@/hooks/useHydrated";
import { docsCategoryConfigs, getCategoryHref, getCategoryLabel } from "@/features/content/config";
import {
  formatPublicDate,
  getAdjacentContentLabel,
  getContentDownloadPdfSrc,
  getContentThumbnailSrc,
  getLocalizedContent,
  getPublicDetailHref,
  getResolvedContentLocale,
  getWriterLabel,
  isPublishedContentAccessible,
  type ManagedContentEntry,
} from "@/features/content/data";
import {
  buildContentPreviewHtml,
  getContentUnlockCookieName,
  isContentGatingEnabled,
} from "@/features/content/gating";

type DocsDetailClientPageProps = {
  contactCopy: ContactPageCopy;
  fallbackProps: DocsDetailPageProps;
  initialContentUnlocked: boolean;
  initialItems: ManagedContentEntry[];
  locale: Locale;
  slug: string;
  section?: "demo" | "documentation";
};

const CONTENT_GATE_FORM_ID = "content-gate-form";

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
  const managedItems = useManagedContents(section, initialItems, undefined, "full", { liveSync: false }) ?? [];
  const items = managedItems.filter(isPublishedContentAccessible);
  const isHydrated = useHydrated();
  const [isUnlocked, setIsUnlocked] = useState(initialContentUnlocked);

  const currentIndex = items.findIndex((item) => item.id === resolvedSlug);
  const currentItem = currentIndex >= 0 ? items[currentIndex] : null;

  useEffect(() => {
    setIsUnlocked(initialContentUnlocked);
  }, [initialContentUnlocked, resolvedSlug]);

  if (!isHydrated) {
    return <DocsDetailPage {...fallbackProps} />;
  }

  if (!currentItem) {
    return <DocsDetailPage {...fallbackProps} />;
  }

  const isGateActive = isContentGatingEnabled(currentItem) && !isUnlocked;
  const contentLocale = getResolvedContentLocale(currentItem, locale);
  const currentBodyHtml = getLocalizedContent(currentItem.bodyHtml, contentLocale);
  const fallbackBodyHtml = fallbackProps.bodyHtml || "";
  const localizedBodyHtml = fallbackBodyHtml || currentBodyHtml;
  const visibleBodyHtml = isGateActive
    ? fallbackBodyHtml || (currentBodyHtml
      ? buildContentPreviewHtml(currentBodyHtml, currentItem.gatingLevel)
      : localizedBodyHtml)
    : localizedBodyHtml;

  const categoryItems = items.filter(
    (item) => item.categorySlug === currentItem.categorySlug,
  );
  const categoryIndex = categoryItems.findIndex((item) => item.id === resolvedSlug);

  const previousItem = categoryIndex > 0 ? categoryItems[categoryIndex - 1] : null;
  const nextItem = categoryIndex < categoryItems.length - 1 ? categoryItems[categoryIndex + 1] : null;

  const previousLabel = getAdjacentContentLabel("previous", locale);
  const nextLabel = getAdjacentContentLabel("next", locale);

  const relatedItems = [
    previousItem
      ? {
          category: previousLabel,
          href: previousItem.contentType === "outlink"
            ? previousItem.externalUrl
            : getPublicDetailHref(section, locale, previousItem.id, previousItem.categorySlug),
          imageSrc: getContentThumbnailSrc(previousItem.imageSrc),
          isExternal: previousItem.contentType === "outlink",
          title: getLocalizedContent(previousItem.title, getResolvedContentLocale(previousItem, locale)),
        }
      : null,
    nextItem
      ? {
          category: nextLabel,
          href: nextItem.contentType === "outlink"
            ? nextItem.externalUrl
            : getPublicDetailHref(section, locale, nextItem.id, nextItem.categorySlug),
          imageSrc: getContentThumbnailSrc(nextItem.imageSrc),
          isExternal: nextItem.contentType === "outlink",
          title: getLocalizedContent(nextItem.title, getResolvedContentLocale(nextItem, locale)),
        }
      : null,
  ].filter((item): item is NonNullable<typeof item> => !!item);
  const downloadHref = getContentDownloadPdfSrc(currentItem, locale);

  return (
    <DocsDetailPage
      {...fallbackProps}
      bodyHtml={visibleBodyHtml}
      category={getCategoryLabel(docsCategoryConfigs, currentItem.categorySlug, locale)}
      contentOverlay={isGateActive ? (
        <ContentGateOverlay
          contactCopy={contactCopy}
          contentId={currentItem.id}
          id={CONTENT_GATE_FORM_ID}
          locale={locale}
          onUnlock={() => setIsUnlocked(true)}
          section={section}
          title={getLocalizedContent(currentItem.title, contentLocale)}
          unlockCookieName={getContentUnlockCookieName(currentItem.id, section)}
        />
      ) : undefined}
      contentListItems={relatedItems}
      downloadHref={downloadHref || undefined}
      downloadFormTargetId={CONTENT_GATE_FORM_ID}
      downloadRequiresUnlock={isGateActive}
      docsHref={getCategoryHref(docsCategoryConfigs, currentItem.categorySlug, locale)}
      date={formatPublicDate(locale, currentItem.dateIso)}
      hideHeroImage={currentItem.hideHeroImage}
      heroImageAlt={getLocalizedContent(currentItem.title, contentLocale)}
      heroImageSrc={currentItem.imageSrc}
      locale={locale}
      title={getLocalizedContent(currentItem.title, contentLocale)}
      unlockCookieName={getContentUnlockCookieName(currentItem.id, section)}
      writer={getWriterLabel(currentItem)}
    />
  );
}
