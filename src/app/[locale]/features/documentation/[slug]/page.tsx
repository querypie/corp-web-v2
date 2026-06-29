import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { isLocale } from "@/constants/i18n";
import DocsDetailPage from "@/components/pages/documentation/DocumentationDetailPage";
import ContentGateOverlay from "@/components/pages/documentation/ContentGateOverlay";
import type { DocsDetailPageProps } from "@/components/pages/documentation/DocumentationDetailPage";
import { getContactPageCopy } from "@/copy/contact";
import { getDocumentationPageCopy } from "@/copy/contentPages";
import { docsCategoryConfigs, getCategoryHref } from "@/features/content/config";
import {
  formatPublicDate,
  getAdjacentContentLabel,
  getManagedCategoryLabel,
  getContentThumbnailSrc,
  getLocalizedContent,
  getResolvedContentLocale,
  isPublishedContentAccessible,
  getPublicDetailHref,
} from "@/features/content/data";
import { readContentItem, readContentState } from "@/features/content/contentState.server";
import { withDynamicOgImage } from "@/features/seo/metadata";
import {
  buildContentPreviewHtml,
  getContentUnlockCookieName,
  hasUnlockedContentAccess,
  isContentGatingEnabled,
} from "@/features/content/gating";

type DocsDetailRouteProps = {
  params: Promise<{ locale: string; slug: string }>;
};

const CONTENT_GATE_FORM_ID = "content-gate-form";

export default async function DocumentationDetailRoute({ params }: DocsDetailRouteProps) {
  const { locale, slug } = await params;
  const resolvedSlug = decodeURIComponent(slug);

  if (!isLocale(locale)) notFound();

  const [allDocsItems, currentEntry] = await Promise.all([
    readContentState("documentation", { includeBodies: false }),
    readContentItem("documentation", resolvedSlug, { includeBodies: true }),
  ]);
  const accessibleDocsItems = allDocsItems.filter(isPublishedContentAccessible);

  if (!currentEntry || !isPublishedContentAccessible(currentEntry)) {
    notFound();
  }

  if (currentEntry.contentType === "outlink") {
    redirect(currentEntry.externalUrl);
  }

  const contentLocale = getResolvedContentLocale(currentEntry, locale);

  const categoryItems = accessibleDocsItems.filter((item) => item.categorySlug === currentEntry.categorySlug);
  const categoryIndex = categoryItems.findIndex((item) => item.id === resolvedSlug);

  const previousItem = categoryIndex > 0 ? categoryItems[categoryIndex - 1] : null;
  const nextItem = categoryIndex < categoryItems.length - 1 ? categoryItems[categoryIndex + 1] : null;

  const relatedItems = [
    previousItem
      ? {
          category: getAdjacentContentLabel("previous", locale),
          href: previousItem.contentType === "outlink"
            ? previousItem.externalUrl
            : getPublicDetailHref("documentation", locale, previousItem.id, previousItem.categorySlug),
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
            : getPublicDetailHref("documentation", locale, nextItem.id, nextItem.categorySlug),
          imageSrc: getContentThumbnailSrc(nextItem.imageSrc),
          isExternal: nextItem.contentType === "outlink",
          title: getLocalizedContent(nextItem.title, getResolvedContentLocale(nextItem, locale)),
        }
      : null,
  ].filter((item): item is NonNullable<typeof item> => !!item);

  const isGateEnabled = isContentGatingEnabled(currentEntry);
  const cookieStore = isGateEnabled ? await cookies() : null;
  const isContentUnlocked = cookieStore
    ? hasUnlockedContentAccess(
        cookieStore.get(getContentUnlockCookieName(currentEntry.id, "documentation"))?.value ??
          cookieStore.get(getContentUnlockCookieName(currentEntry.id))?.value,
      )
    : false;
  const isGateActive = isGateEnabled && !isContentUnlocked;
  const localizedBodyHtml = getLocalizedContent(currentEntry.bodyHtml, contentLocale);
  const previewBodyHtml =
    isGateActive
      ? buildContentPreviewHtml(localizedBodyHtml, currentEntry.gatingLevel)
      : localizedBodyHtml;
  const copy = getDocumentationPageCopy(locale);

  return (
    <DocsDetailPage
      {...({
        docsHref: getCategoryHref(docsCategoryConfigs, currentEntry.categorySlug, locale),
        slug: resolvedSlug,
        bodyHtml: previewBodyHtml,
        category: getManagedCategoryLabel("documentation", currentEntry.categorySlug, locale),
        contentListDescription: "",
        contentListItems: relatedItems,
        contentListLinks: [],
        contentListTitle: "Contents List",
        date: formatPublicDate(locale, currentEntry.dateIso),
        downloadFormTargetId: CONTENT_GATE_FORM_ID,
        downloadHref:
          currentEntry.enableDownloadButton && currentEntry.downloadPdfSrc
            ? currentEntry.downloadPdfSrc
            : undefined,
        downloadRequiresUnlock: isGateActive,
        hideHeroImage: currentEntry.hideHeroImage,
        heroImageAlt: getLocalizedContent(currentEntry.title, contentLocale),
        heroImageSrc: currentEntry.imageSrc,
        locale,
        parentLabel: copy.title,
        title: getLocalizedContent(currentEntry.title, contentLocale),
        unlockCookieName: getContentUnlockCookieName(currentEntry.id, "documentation"),
        writer: currentEntry.authorRole
          ? `${currentEntry.authorName} / ${currentEntry.authorRole}`
          : currentEntry.authorName,
      } satisfies DocsDetailPageProps)}
      contentOverlay={isGateActive ? (
        <ContentGateOverlay
          contactCopy={getContactPageCopy(locale)}
          contentId={currentEntry.id}
          id={CONTENT_GATE_FORM_ID}
          locale={locale}
          section="documentation"
          title={getLocalizedContent(currentEntry.title, contentLocale)}
          unlockCookieName={getContentUnlockCookieName(currentEntry.id, "documentation")}
        />
      ) : undefined}
    />
  );
}

export async function generateMetadata({ params }: DocsDetailRouteProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const resolvedSlug = decodeURIComponent(slug);

  if (!isLocale(locale)) return {};

  const currentEntry = await readContentItem("documentation", resolvedSlug, { includeBodies: false });

  if (!currentEntry || !isPublishedContentAccessible(currentEntry)) {
    return {};
  }

  const title = getLocalizedContent(currentEntry.title, getResolvedContentLocale(currentEntry, locale));
  const description = getLocalizedContent(currentEntry.summary, getResolvedContentLocale(currentEntry, locale));

  return withDynamicOgImage({
    title,
    description,
    alternates: {
      canonical: getPublicDetailHref("documentation", locale, resolvedSlug, currentEntry.categorySlug),
    },
  }, { locale, title, description });
}
