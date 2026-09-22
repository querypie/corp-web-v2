import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { isLocale } from "@/constants/i18n";
import ResourcesDetailClientPage from "@/components/pages/resources/ResourcesDetailClientPage";
import ContentGateOverlay from "@/components/pages/resources/ContentGateOverlay";
import type { DocsDetailPageProps } from "@/components/pages/resources/ResourcesDetailPage";
import { getContactPageCopy } from "@/copy/contact";
import { getResourcesPageCopy } from "@/copy/contentPages";
import { docsCategoryConfigs, getCategoryHref } from "@/features/content/config";
import {
  formatPublicDate,
  getAdjacentContentLabel,
  getContentDownloadPdfSrc,
  getManagedCategoryLabel,
  getContentThumbnailSrc,
  getLocalizedContent,
  getResolvedContentLocale,
  isPublishedContentAccessible,
  getPublicDetailHref,
} from "@/features/content/data";
import { readContentItem, readContentState } from "@/features/content/contentState.server";
import { withDynamicOgImage } from "@/features/seo/metadata";
import { getRequestPublicUrl } from "@/features/seo/requestUrl.server";
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

export default async function ResourcesDetailRoute({ params }: DocsDetailRouteProps) {
  const { locale, slug } = await params;
  const resolvedSlug = decodeURIComponent(slug);

  if (!isLocale(locale)) notFound();

  const [allDocsItems, currentEntry] = await Promise.all([
    readContentState("resources", { includeBodies: false }),
    readContentItem("resources", resolvedSlug, { includeBodies: true }),
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
            : getPublicDetailHref("resources", locale, previousItem.id, previousItem.categorySlug),
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
            : getPublicDetailHref("resources", locale, nextItem.id, nextItem.categorySlug),
          imageSrc: getContentThumbnailSrc(nextItem.imageSrc),
          isExternal: nextItem.contentType === "outlink",
          title: getLocalizedContent(nextItem.title, getResolvedContentLocale(nextItem, locale)),
        }
      : null,
  ].filter((item): item is NonNullable<typeof item> => !!item);

  const downloadHref = getContentDownloadPdfSrc(currentEntry, locale);
  const isGateEnabled = isContentGatingEnabled(currentEntry);
  const requiresLeadCapture = Boolean(downloadHref);
  const cookieStore = isGateEnabled || requiresLeadCapture ? await cookies() : null;
  const isContentUnlocked = cookieStore
    ? hasUnlockedContentAccess(
        cookieStore.get(getContentUnlockCookieName(currentEntry.id, "resources"))?.value,
      )
    : false;
  const isGateActive = isGateEnabled && !isContentUnlocked;
  const localizedBodyHtml = getLocalizedContent(currentEntry.bodyHtml, contentLocale);
  const previewBodyHtml =
    isGateActive
      ? buildContentPreviewHtml(localizedBodyHtml, currentEntry.gatingLevel)
      : localizedBodyHtml;
  const copy = getResourcesPageCopy(locale);
  const detailHref = getPublicDetailHref("resources", locale, resolvedSlug, currentEntry.categorySlug);
  const fallbackProps = {
    docsHref: getCategoryHref(docsCategoryConfigs, currentEntry.categorySlug, locale),
    slug: resolvedSlug,
    bodyHtml: previewBodyHtml,
    category: getManagedCategoryLabel("resources", currentEntry.categorySlug, locale),
    contentListDescription: "",
    contentListItems: relatedItems,
    contentListLinks: [],
    contentListTitle: "Contents List",
    date: formatPublicDate(locale, currentEntry.dateIso),
    downloadFormTargetId: CONTENT_GATE_FORM_ID,
    downloadHref: downloadHref || undefined,
    downloadRequiresLeadCapture: requiresLeadCapture,
    downloadRequiresUnlock: isGateActive,
    hideHeroImage: currentEntry.hideHeroImage,
    heroImageAlt: getLocalizedContent(currentEntry.title, contentLocale),
    heroImageSrc: currentEntry.imageSrc,
    locale,
    parentLabel: copy.title,
    shareUrl: await getRequestPublicUrl(detailHref),
    title: getLocalizedContent(currentEntry.title, contentLocale),
    unlockCookieName: getContentUnlockCookieName(currentEntry.id, "resources"),
    writer: currentEntry.authorRole
      ? `${currentEntry.authorName} / ${currentEntry.authorRole}`
      : currentEntry.authorName,
  } satisfies DocsDetailPageProps;

  return (
    <ResourcesDetailClientPage
      contactCopy={getContactPageCopy(locale)}
      fallbackProps={{
        ...fallbackProps,
        contentOverlay: isGateActive ? (
          <ContentGateOverlay
            contactCopy={getContactPageCopy(locale)}
            contentId={currentEntry.id}
            id={CONTENT_GATE_FORM_ID}
            locale={locale}
            section="resources"
            title={getLocalizedContent(currentEntry.title, contentLocale)}
            unlockCookieName={getContentUnlockCookieName(currentEntry.id, "resources")}
          />
        ) : undefined,
      }}
      initialContentUnlocked={isContentUnlocked}
      initialItems={accessibleDocsItems}
      locale={locale}
      slug={resolvedSlug}
      section="resources"
    />
  );
}

export async function generateMetadata({ params }: DocsDetailRouteProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const resolvedSlug = decodeURIComponent(slug);

  if (!isLocale(locale)) return {};

  const currentEntry = await readContentItem("resources", resolvedSlug, { includeBodies: false });

  if (!currentEntry || !isPublishedContentAccessible(currentEntry)) {
    return {};
  }

  const title = getLocalizedContent(currentEntry.title, getResolvedContentLocale(currentEntry, locale));
  const description = getLocalizedContent(currentEntry.summary, getResolvedContentLocale(currentEntry, locale));
  const imageUrl = getContentThumbnailSrc(currentEntry.imageSrc);

  return withDynamicOgImage({
    title,
    description,
    alternates: {
      canonical: getPublicDetailHref("resources", locale, resolvedSlug, currentEntry.categorySlug),
    },
  }, {
    locale,
    title,
    description,
    image: {
      url: imageUrl,
      alt: title,
    },
  });
}
