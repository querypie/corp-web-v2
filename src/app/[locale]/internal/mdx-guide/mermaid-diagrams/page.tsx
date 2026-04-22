import { notFound } from "next/navigation";
import type { Metadata } from "next";
import BlogLayout from "@/components/mdx-layout/BlogLayout";
import { isLocale, type Locale } from "@/constants/i18n";
import { buildMdxComponents } from "@/features/mdx/components";
import { extractHeadingsFromMdx } from "@/features/mdx/headings";
import { loadInternalMdxSource } from "@/features/mdx/internalLoader";
import { renderMdx } from "@/features/mdx/renderer";

type Props = {
  params: Promise<{ locale: string }>;
};

const INTERNAL_SEGMENTS = ["mdx-guide", "mermaid-diagrams"] as const;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  const source = await loadInternalMdxSource([...INTERNAL_SEGMENTS], locale as Locale);
  if (!source) return {};

  const { frontmatter } = await renderMdx(source, {});
  return {
    title: frontmatter.title,
    description: frontmatter.description,
    keywords: frontmatter.keywords,
  };
}

export default async function InternalMermaidGuidePage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const source = await loadInternalMdxSource([...INTERNAL_SEGMENTS], locale as Locale);
  if (!source) notFound();

  const { content, frontmatter } = await renderMdx(source, buildMdxComponents());
  const headings = extractHeadingsFromMdx(source);

  return (
    <BlogLayout frontmatter={frontmatter} headings={headings} locale={locale as Locale}>
      {content}
    </BlogLayout>
  );
}
