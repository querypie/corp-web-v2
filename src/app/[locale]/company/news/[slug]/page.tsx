import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { isLocale } from "@/constants/i18n";
import NewsDetailPage from "@/components/pages/news/NewsDetailPage";
import type { DocsDetailPageProps } from "@/components/pages/documentation/DocumentationDetailPage";
import {
  formatPublicDate,
  getAdjacentContentLabel,
  getContentThumbnailSrc,
  getLocalizedContent,
  getNewsFormatLabel,
  getPublicDetailHref,
  getPublicListHref,
  getResolvedContentLocale,
  isPublishedContentAccessible,
} from "@/features/content/data";
import { readContentItem, readContentState } from "@/features/content/contentState.server";
import { withDynamicOgImage } from "@/features/seo/metadata";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateStaticParams() {
  const newsItems = await readContentState("news", { includeBodies: false });

  return newsItems
    .filter((item) => isPublishedContentAccessible(item) && item.contentType !== "outlink")
    .map((item) => ({ slug: item.id }));
}

export default async function NewsDetailRoute({ params }: Props) {
  const { locale, slug } = await params;
  const decodedSlug = decodeURIComponent(slug);

  if (!isLocale(locale)) notFound();

  const [allNewsItems, currentEntry] = await Promise.all([
    readContentState("news", { includeBodies: false }),
    readContentItem("news", decodedSlug, { includeBodies: true }),
  ]);
  const accessibleNewsItems = allNewsItems.filter(isPublishedContentAccessible);
  const currentIndex = accessibleNewsItems.findIndex((item) => item.id === decodedSlug);

  if (!currentEntry || !isPublishedContentAccessible(currentEntry)) {
    notFound();
  }

  if (currentEntry.contentType === "outlink") {
    redirect(currentEntry.externalUrl);
  }

  const contentLocale = getResolvedContentLocale(currentEntry, locale);

  const previousItem = currentIndex > 0 ? accessibleNewsItems[currentIndex - 1] : null;
  const nextItem = currentIndex < accessibleNewsItems.length - 1 ? accessibleNewsItems[currentIndex + 1] : null;

  const relatedItems = [
    previousItem
      ? {
          category: getAdjacentContentLabel("previous", locale),
          href: previousItem.contentType === "outlink"
            ? previousItem.externalUrl
            : getPublicDetailHref("news", locale, previousItem.id),
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
            : getPublicDetailHref("news", locale, nextItem.id),
          imageSrc: getContentThumbnailSrc(nextItem.imageSrc),
          isExternal: nextItem.contentType === "outlink",
          title: getLocalizedContent(nextItem.title, getResolvedContentLocale(nextItem, locale)),
        }
      : null,
  ].filter((item): item is NonNullable<typeof item> => !!item);

  return (
    <NewsDetailPage
      {...({
        docsHref: getPublicListHref("news", locale),
        slug: decodedSlug,
        bodyHtml: getLocalizedContent(currentEntry.bodyHtml, contentLocale),
        category: "News",
        contentListDescription: "",
        contentListItems: relatedItems,
        contentListLinks: [],
        contentListTitle: "News",
        date: formatPublicDate(locale, currentEntry.dateIso),
        hideHeroImage: currentEntry.hideHeroImage,
        heroImageAlt: getLocalizedContent(currentEntry.title, contentLocale),
        heroImageSrc: currentEntry.imageSrc,
        locale,
        title: getLocalizedContent(currentEntry.title, contentLocale),
        writer: getNewsFormatLabel(currentEntry, locale),
      } satisfies DocsDetailPageProps)}
    />
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const decodedSlug = decodeURIComponent(slug);

  if (!isLocale(locale)) return {};

  const currentEntry = await readContentItem("news", decodedSlug, { includeBodies: false });

  if (!currentEntry || !isPublishedContentAccessible(currentEntry)) {
    return {};
  }

  const title = getLocalizedContent(currentEntry.title, getResolvedContentLocale(currentEntry, locale));
  const description = getLocalizedContent(currentEntry.summary, getResolvedContentLocale(currentEntry, locale));

  return withDynamicOgImage({
    title,
    description,
    alternates: {
      canonical: getPublicDetailHref("news", locale, decodedSlug),
    },
  }, { locale, title, description });
}
