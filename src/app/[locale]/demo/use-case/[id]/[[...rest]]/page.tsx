import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { getLocalePath, isLocale, type Locale } from "@/constants/i18n";
import DemoDetailClientPage from "@/components/pages/demo/DemoDetailClientPage";
import type { DocsDetailPageProps } from "@/components/pages/documentation/DocumentationDetailPage";
import { getContactPageCopy } from "@/features/contact/copy";
import { demoCategoryConfigs, getCategoryHref } from "@/features/content/config";
import {
  formatPublicDate,
  getManagedCategoryLabel,
  getContentThumbnailSrc,
  getLocalizedContent,
  getPublicDetailHref,
  isPublishedContentAccessible,
} from "@/features/content/data";
import { readContentItem, readContentState } from "@/features/content/contentState.server";
import {
  buildContentPreviewHtml,
  getContentUnlockCookieName,
  hasUnlockedContentAccess,
  isContentGatingEnabled,
} from "@/features/content/gating";
import { getUseCaseDemoHref, resolveUseCaseDemoRoute } from "@/features/demo/useCase";

type Props = {
  params: Promise<{ locale: string; id: string; rest?: string[] }>;
};

export default async function UseCaseDemoDetailRoute({ params }: Props) {
  const { locale, id, rest } = await params;

  if (!isLocale(locale)) notFound();

  const route = resolveUseCaseDemoRoute(locale as Locale, id, rest);
  if (!route.entry) notFound();
  if (route.shouldRedirect && route.canonicalHref) redirect(route.canonicalHref);

  const cookieStore = await cookies();

  const [allDemoItems, currentEntry] = await Promise.all([
    readContentState("demo", { includeBodies: false }),
    readContentItem("demo", route.entry.contentId, { includeBodies: true }),
  ]);
  const accessibleDemoItems = allDemoItems.filter(isPublishedContentAccessible);

  if (!currentEntry || !isPublishedContentAccessible(currentEntry)) notFound();

  const isContentUnlocked = hasUnlockedContentAccess(
    cookieStore.get(getContentUnlockCookieName(currentEntry.id))?.value,
  );

  if (currentEntry.contentType === "outlink") {
    redirect(currentEntry.externalUrl);
  }

  const categoryItems = accessibleDemoItems.filter((item) => item.categorySlug === currentEntry.categorySlug);
  const categoryIndex = categoryItems.findIndex((item) => item.id === currentEntry.id);
  const previousItem = categoryIndex > 0 ? categoryItems[categoryIndex - 1] : null;
  const nextItem = categoryIndex < categoryItems.length - 1 ? categoryItems[categoryIndex + 1] : null;

  const relatedItems = [
    previousItem
      ? {
          category: "Previous Post",
          href: getPublicDetailHref("demo", locale as Locale, previousItem.id),
          imageSrc: getContentThumbnailSrc(previousItem.imageSrc),
          title: getLocalizedContent(previousItem.title, locale as Locale),
        }
      : null,
    nextItem
      ? {
          category: "Next post",
          href: getPublicDetailHref("demo", locale as Locale, nextItem.id),
          imageSrc: getContentThumbnailSrc(nextItem.imageSrc),
          title: getLocalizedContent(nextItem.title, locale as Locale),
        }
      : null,
  ].filter((item): item is NonNullable<typeof item> => !!item);

  const isGateActive = isContentGatingEnabled(currentEntry) && !isContentUnlocked;

  return (
    <DemoDetailClientPage
      fallbackProps={{
        docsHref: getCategoryHref(demoCategoryConfigs, currentEntry.categorySlug, locale as Locale),
        slug: currentEntry.id,
        bodyHtml: isGateActive
          ? buildContentPreviewHtml(getLocalizedContent(currentEntry.bodyHtml, locale as Locale), currentEntry.gatingLevel)
          : getLocalizedContent(currentEntry.bodyHtml, locale as Locale),
        category: getManagedCategoryLabel("demo", currentEntry.categorySlug, locale as Locale),
        contentListDescription: "",
        contentListItems: relatedItems,
        contentListLinks: [],
        contentListTitle: "Demo List",
        date: formatPublicDate(locale as Locale, currentEntry.dateIso),
        downloadHref:
          currentEntry.enableDownloadButton && currentEntry.downloadPdfSrc
            ? getLocalePath(locale as Locale, `/features/demo/${currentEntry.id}/download`)
            : undefined,
        hideHeroImage: currentEntry.hideHeroImage,
        heroImageAlt: getLocalizedContent(currentEntry.title, locale as Locale),
        heroImageSrc: currentEntry.imageSrc,
        title: getLocalizedContent(currentEntry.title, locale as Locale),
        writer: currentEntry.authorRole ? `${currentEntry.authorName} / ${currentEntry.authorRole}` : currentEntry.authorName,
      } satisfies DocsDetailPageProps}
      contactCopy={getContactPageCopy(locale as Locale)}
      initialContentUnlocked={isContentUnlocked}
      initialItems={accessibleDemoItems}
      locale={locale as Locale}
      slug={currentEntry.id}
    />
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, id, rest } = await params;

  if (!isLocale(locale)) return {};

  const route = resolveUseCaseDemoRoute(locale as Locale, id, rest);
  if (!route.entry) return {};

  const currentEntry = await readContentItem("demo", route.entry.contentId, { includeBodies: false });
  if (!currentEntry || !isPublishedContentAccessible(currentEntry)) return {};

  return {
    title: getLocalizedContent(currentEntry.title, locale as Locale),
    alternates: {
      canonical: getUseCaseDemoHref(locale as Locale, id) ?? undefined,
    },
  };
}
