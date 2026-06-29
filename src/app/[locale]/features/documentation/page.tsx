import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { isLocale } from "@/constants/i18n";
import DocsListClientPage from "@/components/pages/documentation/DocumentationListClientPage";
import { getDocumentationPageCopy } from "@/copy/contentPages";
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
  getPublicListHref,
} from "@/features/content/data";
import { readContentState } from "@/features/content/contentState.server";
import { withDynamicOgImage } from "@/features/seo/metadata";

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

  const docsItems = (await readContentState("documentation", { includeBodies: false }))
    .filter((item) => isPublishedContentVisible(item, locale))
    .filter((item) => selectedCategory === "all" || item.categorySlug === selectedCategory);

  const fallbackItems = docsItems.map((item) => ({
    category: getCategoryLabel(docsCategoryConfigs, item.categorySlug, locale),
    date: item.categorySlug === "blogs" || item.categorySlug === "events"
      ? formatPublicDate(locale, item.dateIso)
      : undefined,
    description: getLocalizedContent(item.summary, locale),
    href: item.contentType === "outlink" ? item.externalUrl : getPublicDetailHref("documentation", locale, item.id, item.categorySlug),
    imageSrc: item.imageSrc,
    isExternal: item.contentType === "outlink",
    title: getLocalizedContent(item.title, locale),
  }));

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

export async function generateMetadata({ params, searchParams }: DocsPageProps): Promise<Metadata> {
  const { locale } = await params;
  const { category } = await searchParams;

  if (!isLocale(locale)) return {};

  const { metadataDescription, metadataTitle } = getDocumentationPageCopy(locale);
  const selectedCategory: DocsCategorySlug =
    category && category !== "all" && docsCategoryConfigs.some((config) => config.slug === category)
      ? category as DocsCategorySlug
      : "all";

  return withDynamicOgImage({
    title: metadataTitle,
    description: metadataDescription,
    alternates: {
      canonical: getPublicListHref("documentation", locale, selectedCategory),
    },
  }, { locale, title: metadataTitle, description: metadataDescription });
}
