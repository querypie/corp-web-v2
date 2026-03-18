import { notFound } from "next/navigation";
import { isLocale } from "../../../../constants/i18n";
import DemoDetailClientPage from "../../../../components/pages/demo/DemoDetailClientPage";
import type { DocsDetailPageProps } from "../../../../components/pages/docs/DocsDetailPage";
import {
  getManagedCategoryLabel,
  getContentThumbnailSrc,
  getLocalizedContent,
  getPublicDetailHref,
  getSeedManagedContents,
} from "@/features/content/data";

type DemoDetailRouteProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export default async function DemoDetailRoute({ params }: DemoDetailRouteProps) {
  const { locale, slug } = await params;

  if (!isLocale(locale)) notFound();

  const demoItems = getSeedManagedContents("demo").filter((item) => item.status === "published");
  const currentIndex = demoItems.findIndex((item) => item.id === slug);
  const currentEntry = currentIndex >= 0 ? demoItems[currentIndex] : null;
  const categoryItems = currentEntry
    ? demoItems.filter((item) => item.categorySlug === currentEntry.categorySlug)
    : [];
  const categoryIndex = currentEntry
    ? categoryItems.findIndex((item) => item.id === slug)
    : -1;

  const previousItem = categoryIndex > 0 ? categoryItems[categoryIndex - 1] : null;
  const nextItem = categoryIndex < categoryItems.length - 1 ? categoryItems[categoryIndex + 1] : null;

  const previousLabel = "Previous Post";
  const nextLabel = "Next post";

  const relatedItems = [
    previousItem
      ? {
          category: previousLabel,
          href: getPublicDetailHref("demo", locale, previousItem.id),
          imageSrc: getContentThumbnailSrc(previousItem.imageSrc),
          title: getLocalizedContent(previousItem.title, locale),
        }
      : null,
    nextItem
      ? {
          category: nextLabel,
          href: getPublicDetailHref("demo", locale, nextItem.id),
          imageSrc: getContentThumbnailSrc(nextItem.imageSrc),
          title: getLocalizedContent(nextItem.title, locale),
        }
      : null,
  ].filter((item): item is NonNullable<typeof item> => !!item);

  return (
    <DemoDetailClientPage
      fallbackProps={{
        docsHref: `/${locale}/demo`,
        slug,
        bodyMarkdown: currentEntry ? getLocalizedContent(currentEntry.bodyMarkdown, locale) : "",
        category: currentEntry
          ? getManagedCategoryLabel("demo", currentEntry.categorySlug, locale)
          : "",
        contentListDescription: "",
        contentListItems: relatedItems,
        contentListLinks: [],
        contentListTitle: "Demo List",
        date: currentEntry?.dateIso ?? "",
        heroImageAlt: currentEntry ? getLocalizedContent(currentEntry.title, locale) : "",
        heroImageSrc: currentEntry?.imageSrc ?? "/images/content/article-01.png",
        title: currentEntry ? getLocalizedContent(currentEntry.title, locale) : "",
        writer: currentEntry
          ? currentEntry.authorRole
            ? `${currentEntry.authorName} / ${currentEntry.authorRole}`
            : currentEntry.authorName
          : "",
      } satisfies DocsDetailPageProps}
      locale={locale}
      slug={slug}
    />
  );
}
