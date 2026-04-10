import { notFound, redirect } from "next/navigation";
<<<<<<< HEAD
import { getLocalePath, isLocale } from "../../../../constants/i18n";
import NewsDetailClientPage from "../../../../components/pages/news/NewsDetailClientPage";
import type { DocsDetailPageProps } from "../../../../components/pages/documentation/DocumentationDetailPage";
=======
import { isLocale } from "../../../../constants/i18n";
import NewsDetailClientPage from "../../../../components/pages/news/NewsDetailClientPage";
import type { DocsDetailPageProps } from "../../../../components/pages/docs/DocsDetailPage";
>>>>>>> origin/main
import { formatPublicDate, getContentThumbnailSrc, getLocalizedContent } from "@/features/content/data";
import { readContentState } from "@/features/content/contentState.server";

type NewsDetailRouteProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export default async function NewsDetailRoute({ params }: NewsDetailRouteProps) {
  const { locale, slug } = await params;
  const decodedSlug = decodeURIComponent(slug);

  if (!isLocale(locale)) notFound();

  const newsItems = (await readContentState("news")).filter((item) => item.status === "published");
  const currentIndex = newsItems.findIndex((item) => item.id === decodedSlug);
  const currentEntry = currentIndex >= 0 ? newsItems[currentIndex] : null;

  if (!currentEntry) {
    notFound();
  }

  if (currentEntry.contentType === "outlink") {
    redirect(currentEntry.externalUrl);
  }

  const previousItem = currentIndex > 0 ? newsItems[currentIndex - 1] : null;
  const nextItem = currentIndex < newsItems.length - 1 ? newsItems[currentIndex + 1] : null;

  const relatedItems = [
    previousItem
      ? {
          category: "Previous Post",
          href: previousItem.contentType === "outlink"
            ? previousItem.externalUrl
<<<<<<< HEAD
            : getLocalePath(locale, `/news/${previousItem.id}`),
=======
            : `/${locale}/news/${previousItem.id}`,
>>>>>>> origin/main
          imageSrc: getContentThumbnailSrc(previousItem.imageSrc),
          title: getLocalizedContent(previousItem.title, locale),
        }
      : null,
    nextItem
      ? {
          category: "Next post",
          href: nextItem.contentType === "outlink"
            ? nextItem.externalUrl
<<<<<<< HEAD
            : getLocalePath(locale, `/news/${nextItem.id}`),
=======
            : `/${locale}/news/${nextItem.id}`,
>>>>>>> origin/main
          imageSrc: getContentThumbnailSrc(nextItem.imageSrc),
          title: getLocalizedContent(nextItem.title, locale),
        }
      : null,
  ].filter((item): item is NonNullable<typeof item> => !!item);

  return (
    <NewsDetailClientPage
      fallbackProps={{
<<<<<<< HEAD
        docsHref: getLocalePath(locale, "/company/news"),
=======
        docsHref: `/${locale}/news`,
>>>>>>> origin/main
        slug: decodedSlug,
        bodyHtml: getLocalizedContent(currentEntry.bodyHtml, locale),
        bodyMarkdown: getLocalizedContent(currentEntry.bodyMarkdown, locale),
        category: "News",
        contentFormat: currentEntry.contentFormat,
        contentListDescription: "",
        contentListItems: relatedItems,
        contentListLinks: [],
        contentListTitle: "News",
        date: formatPublicDate(locale, currentEntry.dateIso),
        hideHeroImage: currentEntry.hideHeroImage,
        heroImageAlt: getLocalizedContent(currentEntry.title, locale),
        heroImageSrc: currentEntry.imageSrc,
        title: getLocalizedContent(currentEntry.title, locale),
        writer: currentEntry.authorRole
          ? `${currentEntry.authorName} / ${currentEntry.authorRole}`
          : currentEntry.authorName,
      } satisfies DocsDetailPageProps}
      initialItems={newsItems}
      locale={locale}
      slug={decodedSlug}
    />
  );
}
