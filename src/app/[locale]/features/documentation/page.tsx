import { notFound, permanentRedirect } from "next/navigation";
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

const legacyCategoryRedirects: Partial<Record<string, DocsCategorySlug>> = {
  blog: "blogs",
  whitepaper: "white-papers",
  "white-paper": "white-papers",
};

export default async function DocumentationPage({ params, searchParams }: DocsPageProps) {
  const { locale } = await params;
  const { category } = await searchParams;

  if (!isLocale(locale)) notFound();

  const legacyCategory = category ? legacyCategoryRedirects[category] : undefined;
  if (locale !== "ja" && legacyCategory) {
    permanentRedirect(getPublicListHref("documentation", locale, legacyCategory));
  }

  const normalizedCategory = category;
  const selectedCategory: DocsCategorySlug =
    normalizedCategory && normalizedCategory !== "all" && docsCategoryConfigs.some((config) => config.slug === normalizedCategory)
      ? normalizedCategory as DocsCategorySlug
      : "all";

  const publicDocsItems = (await readContentState("documentation", { includeBodies: false }))
    .filter((item) => isPublishedContentVisible(item, locale));
  const visibleCategorySlugs = Array.from(
    new Set(publicDocsItems.map((item) => item.categorySlug as DocsCategorySlug)),
  );
  const docsItems = publicDocsItems
    .filter((item) => selectedCategory === "all" || item.categorySlug === selectedCategory);

  const fallbackItems = docsItems.map((item) => ({
    category: getCategoryLabel(docsCategoryConfigs, item.categorySlug, locale),
    date: item.categorySlug === "blogs" || item.categorySlug === "voc" || item.categorySlug === "events"
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
      visibleCategorySlugs={visibleCategorySlugs}
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
