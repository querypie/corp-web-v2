import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { isLocale, type Locale } from "@/constants/i18n";
import { loadMdxSource } from "@/features/mdx/loader";
import { renderMdx } from "@/features/mdx/renderer";
import { buildMdxComponents } from "@/features/mdx/components";
import { extractHeadingsFromMdx } from "@/features/mdx/headings";
import BlogLayout from "@/components/mdx-layout/BlogLayout";

type Props = {
  params: Promise<{ locale: string; id: string; rest?: string[] }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, id } = await params;
  if (!isLocale(locale)) return {};

  const source = await loadMdxSource("blog", id, locale as Locale);
  if (!source) return {};

  const { frontmatter } = await renderMdx(source, {});
  return {
    title: frontmatter.title,
    description: frontmatter.description,
    keywords: frontmatter.keywords,
  };
}

export default async function BlogMdxPage({ params }: Props) {
  const { locale, id } = await params;
  if (!isLocale(locale)) notFound();

  const source = await loadMdxSource("blog", id, locale as Locale);
  if (!source) notFound();

  const { content, frontmatter } = await renderMdx(source, buildMdxComponents());
  const headings = extractHeadingsFromMdx(source);

  return (
    <BlogLayout frontmatter={frontmatter} headings={headings} locale={locale as Locale}>
      {content}
    </BlogLayout>
  );
}
