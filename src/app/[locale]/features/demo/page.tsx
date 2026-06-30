import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { isLocale } from "@/constants/i18n";
import DemoListClientPage from "@/components/pages/demo/DemoListClientPage";
import { getDemoPageCopy } from "@/copy/contentPages";
import {
  demoCategoryConfigs,
  getCategoryLabel,
  isDemoCategorySlug,
  type DemoCategorySlug,
} from "@/features/content/config";
import {
  getLocalizedContent,
  isPublishedContentVisible,
  getPublicDetailHref,
  getPublicListHref,
  sortPublicContentItems,
} from "@/features/content/data";
import { readContentState } from "@/features/content/contentState.server";
import { withDynamicOgImage } from "@/features/seo/metadata";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string }>;
};

export default async function DemoPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { category } = await searchParams;

  if (!isLocale(locale)) notFound();

  const selectedCategory: DemoCategorySlug =
    isDemoCategorySlug(category) && category !== "all" ? category : "all";

  const publicDemoItems = (await readContentState("demo", { includeBodies: false }))
    .filter((item) => isPublishedContentVisible(item, locale));
  const visibleCategorySlugs = Array.from(
    new Set(publicDemoItems.map((item) => item.categorySlug as DemoCategorySlug)),
  );
  const demoItems = publicDemoItems
    .filter((item) => selectedCategory === "all" || item.categorySlug === selectedCategory);
  const sortedDemoItems = sortPublicContentItems(demoItems, {
    preferManualOrder: selectedCategory !== "all",
  });

  const fallbackItems = sortedDemoItems.map((item) => ({
    category: getCategoryLabel(demoCategoryConfigs, item.categorySlug, locale),
    date: undefined,
    description: getLocalizedContent(item.summary, locale),
    href: item.contentType === "outlink" ? item.externalUrl : getPublicDetailHref("demo", locale, item.id, item.categorySlug),
    imageSrc: item.imageSrc,
    isExternal: item.contentType === "outlink",
    title: getLocalizedContent(item.title, locale),
  }));

  const copy = getDemoPageCopy(locale);

  return (
    <DemoListClientPage
      fallbackItems={fallbackItems}
      locale={locale}
      selectedCategory={selectedCategory}
      title={copy.title}
      visibleCategorySlugs={visibleCategorySlugs}
    />
  );
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { locale } = await params;
  const { category } = await searchParams;

  if (!isLocale(locale)) return {};

  const { metadataDescription, metadataTitle } = getDemoPageCopy(locale);
  const selectedCategory: DemoCategorySlug =
    isDemoCategorySlug(category) && category !== "all" ? category : "all";

  return withDynamicOgImage({
    title: metadataTitle,
    description: metadataDescription,
    alternates: {
      canonical: getPublicListHref("demo", locale, selectedCategory),
    },
  }, { locale, title: metadataTitle, description: metadataDescription });
}
