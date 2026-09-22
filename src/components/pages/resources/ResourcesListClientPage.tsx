import DocsListPage from "./ResourcesListPage";
import type { Locale } from "@/constants/i18n";
import {
  getResourcesSidebarMenuItems,
  type DocsCategorySlug,
} from "@/features/content/config";

type DocsListClientPageProps = {
  fallbackItems: Array<{
    category: string;
    date?: string;
    description?: string;
    href: string;
    imageSrc: string;
    isExternal?: boolean;
    title: string;
  }>;
  locale: Locale;
  selectedCategory: DocsCategorySlug;
  title: string;
  visibleCategorySlugs: DocsCategorySlug[];
};

export default function DocsListClientPage({
  fallbackItems,
  locale,
  selectedCategory,
  title,
  visibleCategorySlugs,
}: DocsListClientPageProps) {
  return (
    <DocsListPage
      items={fallbackItems}
      locale={locale}
      menu={getResourcesSidebarMenuItems(locale, selectedCategory, visibleCategorySlugs)}
      showCategory={selectedCategory === "all"}
      title={title}
    />
  );
}
