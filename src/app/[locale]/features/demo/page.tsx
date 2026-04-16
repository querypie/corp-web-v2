import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getLocalePath, isLocale } from "../../../../constants/i18n";
import DemoListClientPage from "../../../../components/pages/demo/DemoListClientPage";
import {
  demoCategoryConfigs,
  getCategoryLabel,
  isDemoCategorySlug,
  type DemoCategorySlug,
} from "@/features/content/config";
import {
  formatPublicDate,
  getLocalizedContent,
  isPublishedContentVisible,
  getPublicDetailHref,
} from "@/features/content/data";
import { readContentState } from "@/features/content/contentState.server";

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

  const demoItems = (await readContentState("demo", { includeBodies: false })).filter((item) => isPublishedContentVisible(item, locale));

  const allItems = demoItems.map((item) => ({
    category: getCategoryLabel(demoCategoryConfigs, item.categorySlug, locale),
    date: item.categorySlug === "webinars" ? formatPublicDate(locale, item.dateIso) : undefined,
    description: getLocalizedContent(item.summary, locale),
    href: item.contentType === "outlink" ? item.externalUrl : getPublicDetailHref("demo", locale, item.id),
    imageSrc: item.imageSrc,
    title: getLocalizedContent(item.title, locale),
  }));

  const fallbackItems =
    selectedCategory === "all"
      ? allItems
      : allItems.filter((item) => {
          const matchedCategory = demoCategoryConfigs.find(
            (config) => config.label[locale] === item.category,
          );

          return matchedCategory?.slug === selectedCategory;
        });

  return (
    <DemoListClientPage
      fallbackItems={fallbackItems}
      locale={locale}
      selectedCategory={selectedCategory}
      title="Demo"
    />
  );
}

export async function generateMetadata({ params }: Pick<Props, "params">): Promise<Metadata> {
  const { locale } = await params;

  if (!isLocale(locale)) return {};

  return {
    alternates: {
      canonical: getLocalePath(locale, "/features/demo"),
    },
  };
}
