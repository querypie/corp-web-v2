import { notFound } from "next/navigation";
import { isLocale } from "../../../../constants/i18n";
import DemoDetailClientPage from "../../../../components/pages/demo/DemoDetailClientPage";
import type { DocsDetailPageProps } from "../../../../components/pages/docs/DocsDetailPage";
import {
  getManagedCategoryLabel,
  getPublicDetailHref,
  getSeedManagedContents,
} from "@/features/content/data";

type DemoDetailRouteProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export default async function DemoDetailRoute({ params }: DemoDetailRouteProps) {
  const { locale, slug } = await params;

  if (!isLocale(locale)) notFound();

  const currentEntry = getSeedManagedContents("demo").find((item) => item.id === slug);

  const relatedItems = getSeedManagedContents("demo")
    .filter((entry) => entry.id !== slug && entry.status === "published")
    .map((entry) => ({
      category: getManagedCategoryLabel("demo", entry.categorySlug, locale),
      href: getPublicDetailHref("demo", locale, entry.id),
      imageSrc: entry.imageSrc,
      title: entry.title,
    }));

  return (
    <DemoDetailClientPage
      fallbackProps={{
        docsHref: `/${locale}/demo`,
        slug,
        bodyMarkdown: currentEntry?.bodyMarkdown ?? "",
        category: currentEntry
          ? getManagedCategoryLabel("demo", currentEntry.categorySlug, locale)
          : "",
        contentListDescription: "",
        contentListItems: relatedItems,
        contentListLinks: [],
        contentListTitle: "Demo List",
        date: currentEntry?.dateIso ?? "",
        heroImageAlt: currentEntry?.title ?? "",
        heroImageSrc: currentEntry?.imageSrc ?? "/images/content/article-01.png",
        title: currentEntry?.title ?? "",
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
