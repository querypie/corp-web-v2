import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getLocalePath, isLocale } from "../../../../constants/i18n";
import DocsListClientPage from "../../../../components/pages/documentation/DocumentationListClientPage";
import { getDocumentationPageCopy } from "@/features/content/pageCopy";
import {
  docsCategoryConfigs,
  getCategoryLabel,
  type DocsCategorySlug,
} from "@/features/content/config";
import {
  formatPublicDate,
  getLocalizedContent,
  isPublishedContentVisible,
  getPublicDetailHref,
} from "@/features/content/data";
import { readContentState } from "@/features/content/contentState.server";

type DocsPageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string }>;
};

export default async function DocumentationPage({ params, searchParams }: DocsPageProps) {
  const { locale } = await params;
  const { category } = await searchParams;

  if (!isLocale(locale)) notFound();

  const normalizedCategory = category;
  const selectedCategory: DocsCategorySlug =
    normalizedCategory && normalizedCategory !== "all" && docsCategoryConfigs.some((config) => config.slug === normalizedCategory)
      ? normalizedCategory as DocsCategorySlug
      : "all";

  const docsItems = (await readContentState("documentation", { includeBodies: false })).filter((item) => isPublishedContentVisible(item, locale));

  const allItems = docsItems.map((item) => ({
    category: getCategoryLabel(docsCategoryConfigs, item.categorySlug, locale),
    date: item.categorySlug === "blogs" ? formatPublicDate(locale, item.dateIso) : undefined,
    description: getLocalizedContent(item.summary, locale),
    href: item.contentType === "outlink" ? item.externalUrl : getPublicDetailHref("documentation", locale, item.id),
    imageSrc: item.imageSrc,
    title: getLocalizedContent(item.title, locale),
  }));

  const fallbackItems =
    selectedCategory === "all"
      ? allItems
      : allItems.filter((item) => {
          const matchedCategory = docsCategoryConfigs.find(
            (config) => config.label[locale] === item.category,
          );

          return matchedCategory?.slug === selectedCategory;
        });

  const copy = getDocumentationPageCopy(locale);

  return (
    <DocsListClientPage
      fallbackItems={fallbackItems}
      locale={locale}
      selectedCategory={selectedCategory}
      title={copy.title}
    />
  );
}

export async function generateMetadata({ params }: DocsPageProps): Promise<Metadata> {
  const { locale } = await params;

  if (!isLocale(locale)) return {};

  const { metadataTitle } = getDocumentationPageCopy(locale);

  return {
    title: metadataTitle,
    alternates: {
      canonical: getLocalePath(locale, "/features/documentation"),
    },
  };
}
