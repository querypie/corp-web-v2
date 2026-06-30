import DocsListPage from "./DocumentationListPage";
import type { Locale } from "@/constants/i18n";
import {
  getDocumentationSidebarMenuItems,
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
      menu={getDocumentationSidebarMenuItems(locale, selectedCategory, visibleCategorySlugs)}
      showCategory={selectedCategory === "all"}
      title={title}
    />
  );
}
