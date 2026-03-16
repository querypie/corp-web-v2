import { notFound } from "next/navigation";
import { isLocale } from "../../../constants/i18n";
import DocsListClientPage from "../../../components/pages/docs/DocsListClientPage";
import {
  isDocsCategorySlug,
  type DocsCategorySlug,
} from "@/features/content/config";

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

  return <DocsListClientPage locale={locale} selectedCategory={selectedCategory} title={copy.title} />;
}
