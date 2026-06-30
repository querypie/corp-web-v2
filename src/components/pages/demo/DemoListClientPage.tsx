import DemoListPage from "./DemoListPage";
import type { Locale } from "@/constants/i18n";
import { type DemoCategorySlug } from "@/features/content/config";
import { getDemoSidebarMenuItems } from "@/features/demo/navigation";

type DemoListClientPageProps = {
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
  selectedCategory: DemoCategorySlug;
  title: string;
  visibleCategorySlugs: DemoCategorySlug[];
};

export default function DemoListClientPage({
  fallbackItems,
  locale,
  selectedCategory,
  title,
  visibleCategorySlugs,
}: DemoListClientPageProps) {
  return (
    <DemoListPage
      items={fallbackItems}
      locale={locale}
      menu={getDemoSidebarMenuItems(locale, selectedCategory, visibleCategorySlugs)}
      showCategory={selectedCategory === "all"}
      title={title}
    />
  );
}
