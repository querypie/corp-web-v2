import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { isLocale, type Locale } from "@/constants/i18n";
import { loadMdxSource } from "@/features/mdx/loader";
import { renderMdx } from "@/features/mdx/renderer";
import { buildMdxComponents } from "@/features/mdx/components";
import { extractHeadingsFromMdx } from "@/features/mdx/headings";
import { resolveMdxDetailRoute } from "@/features/mdx/routes";
import BlogLayout from "@/components/mdx-layout/BlogLayout";

type Props = {
  params: Promise<{ locale: string; id: string; rest?: string[] }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, id, rest } = await params;
  if (!isLocale(locale)) return {};

  const source = await loadMdxSource("blog", id, locale as Locale);
  if (!source) return {};

  const { frontmatter } = await renderMdx(source, {});
  const route = resolveMdxDetailRoute("blog", locale as Locale, id, rest, frontmatter.slug, frontmatter.title);

  return {
    title: frontmatter.title,
    description: frontmatter.description,
    keywords: frontmatter.keywords,
    alternates: {
      canonical: route.canonicalHref,
    },
  };
}

export default async function BlogMdxPage({ params }: Props) {
  const { locale, id, rest } = await params;
  if (!isLocale(locale)) notFound();

  const source = await loadMdxSource("blog", id, locale as Locale);
  if (!source) notFound();

  const { content, frontmatter } = await renderMdx(source, buildMdxComponents());
  const route = resolveMdxDetailRoute("blog", locale as Locale, id, rest, frontmatter.slug, frontmatter.title);

  if (route.shouldRedirect) {
    redirect(route.canonicalHref);
  }

  const headings = extractHeadingsFromMdx(source);

  return (
    <BlogLayout frontmatter={frontmatter} headings={headings} locale={locale as Locale}>
      {content}
    </BlogLayout>
  );
}
