import DocsListPage from "./DocsListPage";
import type { Locale } from "@/constants/i18n";
import {
  docsCategoryConfigs,
  getPublicMenuItems,
  type DocsCategorySlug,
} from "@/features/content/config";

type DocsListClientPageProps = {
  fallbackItems: Array<{
    category: string;
    date?: string;
    description?: string;
    href: string;
    imageSrc: string;
    title: string;
  }>;
  locale: Locale;
  selectedCategory: DocsCategorySlug;
  title: string;
};

export default function DocsListClientPage({
  fallbackItems,
  locale,
  selectedCategory,
  title,
}: DocsListClientPageProps) {
  return (
    <DocsListPage
      items={fallbackItems}
      locale={locale}
      menu={getPublicMenuItems(docsCategoryConfigs, locale, selectedCategory)}
      showCategory={selectedCategory === "all"}
      title={title}
    />
  );
}
