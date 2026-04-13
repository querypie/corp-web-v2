import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { getLocalePath, isLocale } from "../../../../../constants/i18n";
import DemoDetailClientPage from "../../../../../components/pages/demo/DemoDetailClientPage";
import type { DocsDetailPageProps } from "../../../../../components/pages/documentation/DocumentationDetailPage";
import { getContactPageCopy } from "@/features/contact/copy";
import { demoCategoryConfigs, getCategoryHref } from "@/features/content/config";
import {
  formatPublicDate,
  getManagedCategoryLabel,
  getContentThumbnailSrc,
  getLocalizedContent,
  isPublishedContentVisible,
  getPublicDetailHref,
} from "@/features/content/data";
import { readContentState } from "@/features/content/contentState.server";
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

  const demoItems = (await readContentState("demo")).filter((item) => isPublishedContentVisible(item, locale));
  const currentIndex = demoItems.findIndex((item) => item.id === resolvedSlug);
  const currentEntry = currentIndex >= 0 ? demoItems[currentIndex] : null;

  if (!currentEntry) {
    notFound();
  }

  const isContentUnlocked = hasUnlockedContentAccess(
    cookieStore.get(getContentUnlockCookieName(currentEntry.id))?.value,
  );

  if (currentEntry.contentType === "outlink") {
    redirect(currentEntry.externalUrl);
  }

  const categoryItems = demoItems.filter((item) => item.categorySlug === currentEntry.categorySlug);
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
        heroImageSrc: currentEntry.imageSrc || "/images/common/fallback-contents.jpg",
        title: getLocalizedContent(currentEntry.title, locale),
        writer: currentEntry.authorRole
          ? `${currentEntry.authorName} / ${currentEntry.authorRole}`
          : currentEntry.authorName,
      } satisfies DocsDetailPageProps}
      contactCopy={getContactPageCopy(locale)}
      initialContentUnlocked={isContentUnlocked}
      initialItems={demoItems}
      locale={locale}
      slug={resolvedSlug}
    />
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;

  if (!isLocale(locale)) return {};

  return {
    alternates: {
      canonical: getLocalePath(locale, `/features/demo/${decodeURIComponent(slug)}`),
    },
  };
}
