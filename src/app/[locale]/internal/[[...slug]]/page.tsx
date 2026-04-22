import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogLayout from "@/components/mdx-layout/BlogLayout";
import { isLocale, type Locale } from "@/constants/i18n";
import { buildMdxComponents } from "@/features/mdx/components";
import { extractHeadingsFromMdx } from "@/features/mdx/headings";
import { loadInternalMdxSource } from "@/features/mdx/internalLoader";
import { getInternalMdxSegments } from "@/features/mdx/internalPaths";
import { renderMdx } from "@/features/mdx/renderer";

type Props = {
  params: Promise<{ locale: string; slug?: string[] }>;
};

async function getInternalPageSource(locale: string, slug?: string[]) {
  if (!isLocale(locale)) return null;

  const segments = getInternalMdxSegments(slug);
  if (!segments) return null;

  return loadInternalMdxSource(segments, locale as Locale);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const source = await getInternalPageSource(locale, slug);
  if (!source) return {};

  const { frontmatter } = await renderMdx(source, {});
  return {
    title: frontmatter.title,
    description: frontmatter.description,
    keywords: frontmatter.keywords,
  };
}

export default async function InternalMdxPage({ params }: Props) {
  const { locale, slug } = await params;
  const segments = getInternalMdxSegments(slug);
  if (!isLocale(locale) || !segments) notFound();

  const source = await loadInternalMdxSource(segments, locale as Locale);
  if (!source) notFound();

  const { content, frontmatter } = await renderMdx(source, buildMdxComponents());
  const headings = extractHeadingsFromMdx(source);

  return (
    <BlogLayout frontmatter={frontmatter} headings={headings} locale={locale as Locale}>
      {content}
    </BlogLayout>
  );
}
