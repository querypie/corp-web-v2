import { notFound } from "next/navigation";
import { isLocale } from "../../../constants/i18n";
import DemoListClientPage from "../../../components/pages/demo/DemoListClientPage";
import { isDemoCategorySlug, type DemoCategorySlug } from "@/features/content/config";

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

  const copy = {
    en: { title: "Demo" },
    ko: { title: "데모" },
    ja: { title: "Demo" },
  }[locale];

  return <DemoListClientPage locale={locale} selectedCategory={selectedCategory} title={copy.title} />;
}
