import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { getLocalePath, isLocale } from "@/constants/i18n";
import DemoDetailClientPage from "@/components/pages/demo/DemoDetailClientPage";
import type { DocsDetailPageProps } from "@/components/pages/documentation/DocumentationDetailPage";
import { getContactPageCopy } from "@/copy/contact";
import { getDemoPageCopy } from "@/copy/contentPages";
import { demoCategoryConfigs, getCategoryHref } from "@/features/content/config";
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

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export default async function DemoDetailRoute({ params }: Props) {
  const { locale, slug } = await params;
  const resolvedSlug = decodeURIComponent(slug);

  if (!isLocale(locale)) notFound();

  const cookieStore = await cookies();

  const [allDemoItems, currentEntry] = await Promise.all([
    readContentState("demo", { includeBodies: false }),
    readContentItem("demo", resolvedSlug, { includeBodies: true }),
  ]);
  const accessibleDemoItems = allDemoItems.filter(isPublishedContentAccessible);

  if (!currentEntry || !isPublishedContentAccessible(currentEntry)) {
    notFound();
  }

  const isContentUnlocked = hasUnlockedContentAccess(
    cookieStore.get(getContentUnlockCookieName(currentEntry.id, "demo"))?.value ??
      cookieStore.get(getContentUnlockCookieName(currentEntry.id))?.value,
  );

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
          href: getPublicDetailHref("demo", locale, previousItem.id),
          imageSrc: getContentThumbnailSrc(previousItem.imageSrc),
          title: getLocalizedContent(previousItem.title, getResolvedContentLocale(previousItem, locale)),
        }
      : null,
    nextItem
      ? {
          category: getAdjacentContentLabel("next", locale),
          href: getPublicDetailHref("demo", locale, nextItem.id),
          imageSrc: getContentThumbnailSrc(nextItem.imageSrc),
          title: getLocalizedContent(nextItem.title, getResolvedContentLocale(nextItem, locale)),
        }
      : null,
  ].filter((item): item is NonNullable<typeof item> => !!item);

  const isGateActive = isContentGatingEnabled(currentEntry) && !isContentUnlocked;
  const copy = getDemoPageCopy(locale);

  return (
    <DemoDetailClientPage
      fallbackProps={{
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
        downloadHref:
          currentEntry.enableDownloadButton && currentEntry.downloadPdfSrc
            ? getLocalePath(locale, `/features/demo/${resolvedSlug}/download`)
            : undefined,
        hideHeroImage: currentEntry.hideHeroImage,
        heroImageAlt: getLocalizedContent(currentEntry.title, contentLocale),
        heroImageSrc: currentEntry.imageSrc,
        parentLabel: copy.title,
        title: getLocalizedContent(currentEntry.title, contentLocale),
        writer: currentEntry.authorRole
          ? `${currentEntry.authorName} / ${currentEntry.authorRole}`
          : currentEntry.authorName,
      } satisfies DocsDetailPageProps}
      contactCopy={getContactPageCopy(locale)}
      initialContentUnlocked={isContentUnlocked}
      initialItems={accessibleDemoItems}
      locale={locale}
      slug={resolvedSlug}
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

  return withDynamicOgImage({
    title,
    description,
    alternates: {
      canonical: getLocalePath(locale, `/features/demo/${resolvedSlug}`),
    },
  }, { locale, title, description });
}
