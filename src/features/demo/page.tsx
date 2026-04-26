import { notFound } from "next/navigation";
import type { Metadata } from "next";
import BlogLayout from "@/components/mdx-layout/BlogLayout";
import { isLocale, type Locale } from "@/constants/i18n";
import { buildMdxComponents } from "@/features/mdx/components";
import { extractHeadingsFromMdx } from "@/features/mdx/headings";
import { loadMdxSource } from "@/features/mdx/loader";
import { renderMdx } from "@/features/mdx/renderer";
import { getDemoMdxSlug, resolveDemoMdxRoute, type DemoPublicSegment } from "./catalog";

type DemoMdxRouteParams = Promise<{ locale: string; id: string; rest?: string[] }>;

export async function generateDemoMdxPageMetadata(
  params: DemoMdxRouteParams,
  segment: DemoPublicSegment,
): Promise<Metadata> {
  const { locale, id, rest } = await params;

  if (!isLocale(locale)) {
    return {};
  }

  const route = resolveDemoMdxRoute(locale as Locale, segment, id, rest);
  const mdxSlug = getDemoMdxSlug(segment, id);

  if (!route.entry || !mdxSlug) {
    return {};
  }

  const source = await loadMdxSource("demo", mdxSlug, locale as Locale);

  if (!source) {
    return {};
  }

  const { frontmatter } = await renderMdx(source, {});

  return {
    title: frontmatter.title,
    description: frontmatter.description,
    keywords: frontmatter.keywords,
    alternates: {
      canonical: route.canonicalHref ?? undefined,
    },
  };
}

export async function renderDemoMdxPage(params: DemoMdxRouteParams, segment: DemoPublicSegment) {
  const { locale, id, rest } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const route = resolveDemoMdxRoute(locale as Locale, segment, id, rest);

  if (!route.entry) {
    notFound();
  }

  const mdxSlug = getDemoMdxSlug(segment, id);

  if (!mdxSlug) {
    notFound();
  }

  const source = await loadMdxSource("demo", mdxSlug, locale as Locale);

  if (!source) {
    notFound();
  }

  const { content, frontmatter } = await renderMdx(source, buildMdxComponents());
  const headings = extractHeadingsFromMdx(source);

  return (
    <BlogLayout frontmatter={frontmatter} headings={headings} locale={locale as Locale}>
      {content}
    </BlogLayout>
  );
}
