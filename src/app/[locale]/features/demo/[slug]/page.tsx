import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { isLocale } from "@/constants/i18n";
import DemoDetailPage from "@/components/pages/demo/DemoDetailPage";
import ContentGateOverlay from "@/components/pages/documentation/ContentGateOverlay";
import type { DocsDetailPageProps } from "@/components/pages/documentation/DocumentationDetailPage";
import { getContactPageCopy } from "@/copy/contact";
import { getDemoPageCopy } from "@/copy/contentPages";
import { getAbsolutePublicUrl } from "@/constants/site";
import { demoCategoryConfigs, getCategoryHref } from "@/features/content/config";
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
import {
  buildContentPreviewHtml,
  getContentUnlockCookieName,
  hasUnlockedContentAccess,
  isContentGatingEnabled,
} from "@/features/content/gating";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

const CONTENT_GATE_FORM_ID = "content-gate-form";

export async function generateStaticParams() {
  const demoItems = await readContentState("demo", { includeBodies: false });

  return demoItems
    .filter((item) => isPublishedContentAccessible(item) && item.contentType !== "outlink")
    .filter((item) => !isContentGatingEnabled(item))
    .map((item) => ({ slug: item.id }));
}

export default async function DemoDetailRoute({ params }: Props) {
  const { locale, slug } = await params;
  const resolvedSlug = decodeURIComponent(slug);

  if (!isLocale(locale)) notFound();

  const [allDemoItems, currentEntry] = await Promise.all([
    readContentState("demo", { includeBodies: false }),
    readContentItem("demo", resolvedSlug, { includeBodies: true }),
  ]);
  const accessibleDemoItems = allDemoItems.filter(isPublishedContentAccessible);

  if (!currentEntry || !isPublishedContentAccessible(currentEntry)) {
    notFound();
  }

  if (currentEntry.contentType === "outlink") {
    redirect(currentEntry.externalUrl);
  }

  const contentLocale = getResolvedContentLocale(currentEntry, locale);

  const categoryItems = accessibleDemoItems.filter((item) => item.categorySlug === currentEntry.categorySlug);
  const categoryIndex = categoryItems.findIndex((item) => item.id === resolvedSlug);
  const previousItem = categoryIndex > 0 ? categoryItems[categoryIndex - 1] : null;
  const nextItem = categoryIndex < categoryItems.length - 1 ? categoryItems[categoryIndex + 1] : null;

  const relatedItems = [
    previousItem
      ? {
          category: getAdjacentContentLabel("previous", locale),
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
          category: getAdjacentContentLabel("next", locale),
          href: nextItem.contentType === "outlink"
            ? nextItem.externalUrl
            : getPublicDetailHref("demo", locale, nextItem.id, nextItem.categorySlug),
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
        cookieStore.get(getContentUnlockCookieName(currentEntry.id, "demo"))?.value ??
          cookieStore.get(getContentUnlockCookieName(currentEntry.id))?.value,
      )
    : false;
  const isGateActive = isGateEnabled && !isContentUnlocked;
  const copy = getDemoPageCopy(locale);
  const detailHref = getPublicDetailHref("demo", locale, resolvedSlug, currentEntry.categorySlug);
  const downloadHref = getContentDownloadPdfSrc(currentEntry, locale);

  return (
    <DemoDetailPage
      {...({
        docsHref: getCategoryHref(demoCategoryConfigs, currentEntry.categorySlug, locale),
        slug: resolvedSlug,
        bodyHtml: isGateActive
          ? buildContentPreviewHtml(getLocalizedContent(currentEntry.bodyHtml, contentLocale), currentEntry.gatingLevel)
          : getLocalizedContent(currentEntry.bodyHtml, contentLocale),
        category: getManagedCategoryLabel("demo", currentEntry.categorySlug, locale),
        contentListDescription: "",
        contentListItems: relatedItems,
        contentListLinks: [],
        contentListTitle: "Demo List",
        date: formatPublicDate(locale, currentEntry.dateIso),
        downloadFormTargetId: CONTENT_GATE_FORM_ID,
        downloadHref: downloadHref || undefined,
        downloadRequiresUnlock: isGateActive,
        hideHeroImage: currentEntry.hideHeroImage,
        heroImageAlt: getLocalizedContent(currentEntry.title, contentLocale),
        heroImageSrc: currentEntry.imageSrc,
        locale,
        parentLabel: copy.title,
        shareUrl: getAbsolutePublicUrl(detailHref),
        title: getLocalizedContent(currentEntry.title, contentLocale),
        unlockCookieName: getContentUnlockCookieName(currentEntry.id, "demo"),
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
          section="demo"
          title={getLocalizedContent(currentEntry.title, contentLocale)}
          unlockCookieName={getContentUnlockCookieName(currentEntry.id, "demo")}
        />
      ) : undefined}
    />
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const resolvedSlug = decodeURIComponent(slug);

  if (!isLocale(locale)) return {};

  const currentEntry = await readContentItem("demo", resolvedSlug, { includeBodies: false });

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
      canonical: getPublicDetailHref("demo", locale, resolvedSlug, currentEntry.categorySlug),
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
