import { notFound } from "next/navigation";
import { isLocale } from "../../../constants/i18n";
import DemoListClientPage from "../../../components/pages/demo/DemoListClientPage";
import {
  demoCategoryConfigs,
  getCategoryLabel,
  isDemoCategorySlug,
  type DemoCategorySlug,
} from "@/features/content/config";
import {
  formatPublicDate,
  getContentThumbnailSrc,
  getLocalizedContent,
  getPublicDetailHref,
} from "@/features/content/data";
import { readContentState } from "@/features/content/contentState.server";

type DemoPageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string }>;
};

export default async function DemoPage({ params, searchParams }: DemoPageProps) {
  const { locale } = await params;
  const { category } = await searchParams;

  if (!isLocale(locale)) notFound();

  const selectedCategory: DemoCategorySlug =
    isDemoCategorySlug(category) && category !== "all" ? category : "all";

  const copy = { title: "Demo" };

  const demoItems = (await readContentState("demo"))
    .filter((item) => item.status === "published");

  const allItems = demoItems.map((item) => ({
    category: getCategoryLabel(demoCategoryConfigs, item.categorySlug, locale),
    date: item.categorySlug === "webinars" ? formatPublicDate(locale, item.dateIso) : undefined,
    description: getLocalizedContent(item.summary, locale),
    href: item.contentType === "outlink" ? item.externalUrl : getPublicDetailHref("demo", locale, item.id),
    imageSrc: getContentThumbnailSrc(item.imageSrc),
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
      title={copy.title}
    />
  );
}
