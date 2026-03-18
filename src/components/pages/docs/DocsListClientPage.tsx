"use client";

import DocsListPage from "./DocsListPage";
import type { Locale } from "@/constants/i18n";
import { useManagedContents } from "@/features/content/clientStore";
import useHydrated from "@/hooks/useHydrated";
import {
  docsCategoryConfigs,
  getCategoryLabel,
  getPublicMenuItems,
  type DocsCategorySlug,
} from "@/features/content/config";
import { getContentThumbnailSrc, getLocalizedContent, getPublicDetailHref } from "@/features/content/data";

type DocsListClientPageProps = {
  locale: Locale;
  selectedCategory: DocsCategorySlug;
  title: string;
};

export default function DocsListClientPage({
  locale,
  selectedCategory,
  title,
}: DocsListClientPageProps) {
  const items = useManagedContents("documentation");
  const isHydrated = useHydrated();

  const allItems = items
    .filter((item) => item.status === "published")
    .map((item) => ({
      category: getCategoryLabel(docsCategoryConfigs, item.categorySlug, locale),
      href: getPublicDetailHref("documentation", locale, item.id),
      imageSrc: getContentThumbnailSrc(item.imageSrc),
      title: getLocalizedContent(item.title, locale),
    }));

  const filteredItems =
    selectedCategory === "all"
      ? allItems
      : allItems.filter((item) => {
          const matchedCategory = docsCategoryConfigs.find(
            (config) => config.label[locale] === item.category,
          );

          return matchedCategory?.slug === selectedCategory;
        });

  if (!isHydrated) {
    return (
      <DocsListPage
        emptyMessage=""
        items={[]}
        menu={getPublicMenuItems(docsCategoryConfigs, locale, selectedCategory)}
        showCategory={selectedCategory === "all"}
        title={title}
      />
    );
  }

  return (
    <DocsListPage
      items={filteredItems}
      menu={getPublicMenuItems(docsCategoryConfigs, locale, selectedCategory)}
      showCategory={selectedCategory === "all"}
      title={title}
    />
  );
}
