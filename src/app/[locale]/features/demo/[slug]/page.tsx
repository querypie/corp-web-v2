import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { getLocalePath, isLocale } from "../../../../../constants/i18n";
import DemoDetailClientPage from "../../../../../components/pages/demo/DemoDetailClientPage";
import type { DocsDetailPageProps } from "../../../../../components/pages/documentation/DocumentationDetailPage";
import { getContactPageCopy } from "@/features/contact/copy";
import { getAipDemoHrefByContentId } from "@/features/demo/aip";
import { getUseCaseDemoHrefByContentId } from "@/features/demo/useCase";
import { demoCategoryConfigs, getCategoryHref } from "@/features/content/config";
import {
  formatPublicDate,
  getManagedCategoryLabel,
  getContentThumbnailSrc,
  getLocalizedContent,
  isPublishedContentAccessible,
  getPublicDetailHref,
} from "@/features/content/data";
import { readContentItem, readContentState } from "@/features/content/contentState.server";
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

  const canonicalShortHref =
    getAipDemoHrefByContentId(locale, currentEntry.id) ??
    getUseCaseDemoHrefByContentId(locale, currentEntry.id);
  if (canonicalShortHref) {
    redirect(canonicalShortHref);
  }

  const isContentUnlocked = hasUnlockedContentAccess(
    cookieStore.get(getContentUnlockCookieName(currentEntry.id))?.value,
  );

  if (currentEntry.contentType === "outlink") {
    redirect(currentEntry.externalUrl);
  }

  const categoryItems = accessibleDemoItems.filter((item) => item.categorySlug === currentEntry.categorySlug);
  const categoryIndex = categoryItems.findIndex((item) => item.id === resolvedSlug);
  const previousItem = categoryIndex > 0 ? categoryItems[categoryIndex - 1] : null;
  const nextItem = categoryIndex < categoryItems.length - 1 ? categoryItems[categoryIndex + 1] : null;

  const relatedItems = [
    previousItem
      ? {
          category: "Previous Post",
          href: getPublicDetailHref("demo", locale, previousItem.id),
          imageSrc: getContentThumbnailSrc(previousItem.imageSrc),
          title: getLocalizedContent(previousItem.title, locale),
        }
      : null,
    nextItem
      ? {
          category: "Next post",
          href: getPublicDetailHref("demo", locale, nextItem.id),
          imageSrc: getContentThumbnailSrc(nextItem.imageSrc),
          title: getLocalizedContent(nextItem.title, locale),
        }
      : null,
  ].filter((item): item is NonNullable<typeof item> => !!item);

  const isGateActive = isContentGatingEnabled(currentEntry) && !isContentUnlocked;

  return (
    <DemoDetailClientPage
      fallbackProps={{
        docsHref: getCategoryHref(demoCategoryConfigs, currentEntry.categorySlug, locale),
        slug: resolvedSlug,
        bodyHtml: isGateActive
          ? buildContentPreviewHtml(getLocalizedContent(currentEntry.bodyHtml, locale), currentEntry.gatingLevel)
          : getLocalizedContent(currentEntry.bodyHtml, locale),
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
        heroImageAlt: getLocalizedContent(currentEntry.title, locale),
        heroImageSrc: currentEntry.imageSrc,
        title: getLocalizedContent(currentEntry.title, locale),
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

  const canonicalShortHref =
    getAipDemoHrefByContentId(locale, currentEntry.id) ??
    getUseCaseDemoHrefByContentId(locale, currentEntry.id);

  return {
    title: getLocalizedContent(currentEntry.title, locale),
    alternates: {
      canonical: canonicalShortHref ?? getLocalePath(locale, `/features/demo/${resolvedSlug}`),
    },
  };
}
