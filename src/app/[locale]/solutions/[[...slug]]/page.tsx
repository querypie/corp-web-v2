import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/constants/i18n";
import { renderMdx } from "@/features/mdx/renderer";
import { loadSolutionMeta, loadSolutionMdxSource } from "@/features/solutions/loader";
import { buildSolutionMdxComponents } from "@/features/solutions/mdxComponents";
import { getSolutionEntryBySlug, getSolutionHref } from "@/features/solutions/routes";

type Props = {
  params: Promise<{ locale: string; slug?: string[] }>;
  searchParams: Promise<{ category?: string }>;
};

export async function generateMetadata({ params }: Pick<Props, "params">): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};

  const entry = getSolutionEntryBySlug(slug ?? []);
  if (!entry) return {};

  const meta = await loadSolutionMeta(entry.slug.join("/"), locale as Locale);
  if (!meta) return {};

  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    alternates: {
      canonical: getSolutionHref(locale as Locale, entry.id),
    },
  };
}

export default async function SolutionsPage({ params, searchParams }: Props) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();

  const entry = getSolutionEntryBySlug(slug ?? []);
  if (!entry) notFound();

  const source = await loadSolutionMdxSource(entry.slug.join("/"), locale as Locale);
  if (!source) notFound();

  const { content } = await renderMdx(
    source,
    buildSolutionMdxComponents({ locale: locale as Locale, searchParams: await searchParams }),
  );

  return <div className="bg-white text-[#111827]">{content}</div>;
}
