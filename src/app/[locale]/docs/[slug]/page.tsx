import { notFound, redirect } from "next/navigation";
import { isLocale } from "../../../../constants/i18n";
import DocsDetailClientPage from "../../../../components/pages/docs/DocsDetailClientPage";
import type { DocsDetailPageProps } from "../../../../components/pages/docs/DocsDetailPage";
import {
  formatPublicDate,
  getManagedCategoryLabel,
  getContentThumbnailSrc,
  getLocalizedContent,
  getPublicDetailHref,
} from "@/features/content/data";
import { readContentState } from "@/features/content/contentState.server";

type DocsDetailRouteProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export default async function DocsDetailRoute({ params }: DocsDetailRouteProps) {
  const { locale, slug } = await params;
  const resolvedSlug = decodeURIComponent(slug);

  if (!isLocale(locale)) notFound();
  const docsItems = (await readContentState("documentation")).filter((item) => item.status === "published");
  const currentIndex = docsItems.findIndex((item) => item.id === resolvedSlug);
  const currentEntry = currentIndex >= 0 ? docsItems[currentIndex] : null;

  if (currentEntry?.contentType === "outlink") {
    redirect(currentEntry.externalUrl);
  }
  const categoryItems = currentEntry
    ? docsItems.filter((item) => item.categorySlug === currentEntry.categorySlug)
    : [];
  const categoryIndex = currentEntry
    ? categoryItems.findIndex((item) => item.id === resolvedSlug)
    : -1;

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
    <DocsDetailClientPage
      fallbackProps={{
        docsHref: `/${locale}/docs`,
        slug: resolvedSlug,
        bodyHtml: currentEntry ? getLocalizedContent(currentEntry.bodyHtml, locale) : "",
        bodyMarkdown: currentEntry ? getLocalizedContent(currentEntry.bodyMarkdown, locale) : "",
        category: currentEntry
          ? getManagedCategoryLabel("documentation", currentEntry.categorySlug, locale)
          : "",
        contentFormat: currentEntry?.contentFormat ?? "markdown",
        contentListDescription: "",
        contentListItems: relatedItems,
        contentListLinks: [],
        contentListTitle: "Contents List",
        date: currentEntry ? formatPublicDate(locale, currentEntry.dateIso) : "",
        hideHeroImage: currentEntry?.hideHeroImage ?? false,
        heroImageAlt: currentEntry ? getLocalizedContent(currentEntry.title, locale) : "",
        heroImageSrc: currentEntry?.imageSrc ?? "/uploads/article-01.png",
        title: currentEntry ? getLocalizedContent(currentEntry.title, locale) : "",
        writer: currentEntry
          ? currentEntry.authorRole
            ? `${currentEntry.authorName} / ${currentEntry.authorRole}`
            : currentEntry.authorName
          : "",
      } satisfies DocsDetailPageProps}
      initialItems={docsItems}
      locale={locale}
      slug={resolvedSlug}
    />
  );
}
