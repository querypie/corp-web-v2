"use client";

import DemoListPage from "./DemoListPage";
import type { Locale } from "@/constants/i18n";
import { useManagedContents } from "@/features/content/clientStore";
import useHydrated from "@/hooks/useHydrated";
import {
  demoCategoryConfigs,
  getCategoryLabel,
  getPublicMenuItems,
  type DemoCategorySlug,
} from "@/features/content/config";
import { getPublicDetailHref } from "@/features/content/data";

type DemoListClientPageProps = {
  locale: Locale;
  selectedCategory: DemoCategorySlug;
  title: string;
};

export default function DemoListClientPage({
  locale,
  selectedCategory,
  title,
}: DemoListClientPageProps) {
  const items = useManagedContents("demo");
  const isHydrated = useHydrated();

  const allItems = items
    .filter((item) => item.status === "published")
    .map((item) => ({
      category: getCategoryLabel(demoCategoryConfigs, item.categorySlug, locale),
      href: getPublicDetailHref("demo", locale, item.id),
      imageSrc: item.imageSrc,
      title: item.title,
    }));

  const filteredItems =
    selectedCategory === "all"
      ? allItems
      : allItems.filter((item) => {
          const matchedCategory = demoCategoryConfigs.find(
            (config) => config.label[locale] === item.category,
          );

          return matchedCategory?.slug === selectedCategory;
        });

  if (!isHydrated) {
    return (
      <DemoListPage
        emptyMessage=""
        items={[]}
        menu={getPublicMenuItems(demoCategoryConfigs, locale, selectedCategory)}
        showCategory={selectedCategory === "all"}
        title={title}
      />
    );
  }

  return (
    <DemoListPage
      items={filteredItems}
      menu={getPublicMenuItems(demoCategoryConfigs, locale, selectedCategory)}
      showCategory={selectedCategory === "all"}
      title={title}
    />
  );
}
