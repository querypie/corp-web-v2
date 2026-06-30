"use client";

import { useEffect, useState } from "react";
import DemoDetailPage from "./DemoDetailPage";
import type { Locale } from "@/constants/i18n";
import type { DocsDetailPageProps } from "../documentation/DocumentationDetailPage";
import ContentGateOverlay from "../documentation/ContentGateOverlay";
import ContentLeadForm from "../documentation/ContentLeadForm";
import { useManagedContents } from "@/features/content/clientStore";
import type { ContactPageCopy } from "@/copy/contact";
import useHydrated from "@/hooks/useHydrated";
import { demoCategoryConfigs, getCategoryHref, getCategoryLabel } from "@/features/content/config";
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

type DemoDetailClientPageProps = {
  contactCopy: ContactPageCopy;
  fallbackProps: DocsDetailPageProps;
  initialContentUnlocked: boolean;
  initialItems: ManagedContentEntry[];
  locale: Locale;
  slug: string;
};

const CONTENT_GATE_FORM_ID = "content-gate-form";

export default function DemoDetailClientPage({
  contactCopy,
  fallbackProps,
  initialContentUnlocked,
  initialItems,
  locale,
  slug,
}: DemoDetailClientPageProps) {
  const resolvedSlug = decodeURIComponent(slug);
  const managedItems = useManagedContents("demo", initialItems, undefined, "full", { liveSync: false }) ?? [];
  const items = managedItems.filter(isPublishedContentAccessible);
  const isHydrated = useHydrated();
  const [isUnlocked, setIsUnlocked] = useState(initialContentUnlocked);

  const currentIndex = items.findIndex((item) => item.id === resolvedSlug);
  const currentUseCase = currentIndex >= 0 ? items[currentIndex] : null;

  useEffect(() => {
    setIsUnlocked(initialContentUnlocked);
  }, [initialContentUnlocked, resolvedSlug]);

  if (!isHydrated) {
    return <DemoDetailPage {...fallbackProps} />;
  }

  if (!currentUseCase) {
    return <DemoDetailPage {...fallbackProps} />;
  }

  const isGateActive = isContentGatingEnabled(currentUseCase) && !isUnlocked;
  const contentLocale = getResolvedContentLocale(currentUseCase, locale);
  const currentBodyHtml = getLocalizedContent(currentUseCase.bodyHtml, contentLocale);
  const fallbackBodyHtml = fallbackProps.bodyHtml || "";
  const localizedBodyHtml = fallbackBodyHtml || currentBodyHtml;
  const visibleBodyHtml = isGateActive
    ? fallbackBodyHtml || (currentBodyHtml
      ? buildContentPreviewHtml(currentBodyHtml, currentUseCase.gatingLevel)
      : localizedBodyHtml)
    : localizedBodyHtml;

  const categoryItems = items.filter(
    (item) => item.categorySlug === currentUseCase.categorySlug,
  );
  const categoryIndex = categoryItems.findIndex((item) => item.id === resolvedSlug);

  const previousItem = categoryIndex > 0 ? categoryItems[categoryIndex - 1] : null;
  const nextItem = categoryIndex < categoryItems.length - 1 ? categoryItems[categoryIndex + 1] : null;

  const previousLabel = getAdjacentContentLabel("previous", locale);
  const nextLabel = getAdjacentContentLabel("next", locale);

  const relatedPublishedItems = [
    previousItem
      ? {
          category: previousLabel,
          href: previousItem.contentType === "outlink"
            ? previousItem.externalUrl
            : getPublicDetailHref("demo", locale, previousItem.id, previousItem.categorySlug),
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
            : getPublicDetailHref("demo", locale, nextItem.id, nextItem.categorySlug),
          imageSrc: getContentThumbnailSrc(nextItem.imageSrc),
          isExternal: nextItem.contentType === "outlink",
          title: getLocalizedContent(nextItem.title, getResolvedContentLocale(nextItem, locale)),
        }
      : null,
 ].filter((item): item is NonNullable<typeof item> => !!item);
  const downloadHref = getContentDownloadPdfSrc(currentUseCase, locale);

  return (
    <DemoDetailPage
      {...fallbackProps}
      bodyHtml={visibleBodyHtml}
      category={getCategoryLabel(demoCategoryConfigs, currentUseCase.categorySlug, locale)}
      contentOverlay={isGateActive ? (
        <ContentGateOverlay
          contactCopy={contactCopy}
          contentId={currentUseCase.id}
          id={CONTENT_GATE_FORM_ID}
          locale={locale}
          onUnlock={() => setIsUnlocked(true)}
          section="demo"
          title={getLocalizedContent(currentUseCase.title, contentLocale)}
          unlockCookieName={getContentUnlockCookieName(currentUseCase.id, "demo")}
        />
      ) : undefined}
      contentListItems={relatedPublishedItems}
      downloadHref={downloadHref || undefined}
      downloadFormTargetId={CONTENT_GATE_FORM_ID}
      downloadRequiresLeadCapture={Boolean(downloadHref)}
      downloadRequiresUnlock={isGateActive}
      downloadUnlockForm={({ onDirtyChange, onSuccess }) => (
        <ContentLeadForm
          contactCopy={contactCopy}
          contentId={currentUseCase.id}
          locale={locale}
          mode="unlock"
          onDirtyChange={onDirtyChange}
          onSuccess={() => {
            setIsUnlocked(true);
            onSuccess();
          }}
          section="demo"
          title={getLocalizedContent(currentUseCase.title, contentLocale)}
          unlockCookieName={getContentUnlockCookieName(currentUseCase.id, "demo")}
        />
      )}
      docsHref={getCategoryHref(demoCategoryConfigs, currentUseCase.categorySlug, locale)}
      date={formatPublicDate(locale, currentUseCase.dateIso)}
      hideHeroImage={currentUseCase.hideHeroImage}
      heroImageAlt={getLocalizedContent(currentUseCase.title, contentLocale)}
      heroImageSrc={currentUseCase.imageSrc}
      locale={locale}
      title={getLocalizedContent(currentUseCase.title, contentLocale)}
      unlockCookieName={getContentUnlockCookieName(currentUseCase.id, "demo")}
      writer={getWriterLabel(currentUseCase)}
    />
  );
}
