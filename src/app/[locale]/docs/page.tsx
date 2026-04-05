import { notFound } from "next/navigation";
import { isLocale } from "../../../constants/i18n";
import DocsListClientPage from "../../../components/pages/docs/DocsListClientPage";
import {
  docsCategoryConfigs,
  getCategoryLabel,
  getPublicMenuItems,
  isDocsCategorySlug,
  type DocsCategorySlug,
} from "@/features/content/config";
import {
  formatPublicDate,
  getContentThumbnailSrc,
  getLocalizedContent,
  getPublicDetailHref,
} from "@/features/content/data";
import { readContentState } from "@/features/content/contentState.server";

type DocsPageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string }>;
};

export default async function DocsPage({ params, searchParams }: DocsPageProps) {
  const { locale } = await params;
  const { category } = await searchParams;

  if (!isLocale(locale)) notFound();

  const selectedCategory: DocsCategorySlug =
    isDocsCategorySlug(category) && category !== "all" ? category : "all";

  const copy = {
    en: { title: "Documentation" },
    ko: { title: "도큐먼트" },
    ja: { title: "Documentation" },
  }[locale];

  const docsItems = (await readContentState("documentation"))
    .filter((item) => item.status === "published");

  const allItems = docsItems.map((item) => ({
    category: getCategoryLabel(docsCategoryConfigs, item.categorySlug, locale),
    date: item.categorySlug === "blogs" ? formatPublicDate(locale, item.dateIso) : undefined,
    description: getLocalizedContent(item.summary, locale),
    href: item.contentType === "outlink" ? item.externalUrl : getPublicDetailHref("documentation", locale, item.id),
    imageSrc: getContentThumbnailSrc(item.imageSrc),
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

  return (
    <DocsListClientPage
      fallbackItems={fallbackItems}
      locale={locale}
      selectedCategory={selectedCategory}
      title={copy.title}
    />
  );
}
