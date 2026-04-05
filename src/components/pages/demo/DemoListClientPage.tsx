import DemoListPage from "./DemoListPage";
import type { Locale } from "@/constants/i18n";
import {
  demoCategoryConfigs,
  getPublicMenuItems,
  type DemoCategorySlug,
} from "@/features/content/config";

type DemoListClientPageProps = {
  fallbackItems: Array<{
    category: string;
    date?: string;
    description?: string;
    href: string;
    imageSrc: string;
    title: string;
  }>;
  locale: Locale;
  selectedCategory: DemoCategorySlug;
  title: string;
};

export default function DemoListClientPage({
  fallbackItems,
  locale,
  selectedCategory,
  title,
}: DemoListClientPageProps) {
  return (
    <DemoListPage
      items={fallbackItems}
      locale={locale}
      menu={getPublicMenuItems(demoCategoryConfigs, locale, selectedCategory)}
      showCategory={selectedCategory === "all"}
      title={title}
    />
  );
}
