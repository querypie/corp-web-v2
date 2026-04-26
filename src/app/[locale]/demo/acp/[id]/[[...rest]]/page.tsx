import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { isLocale, type Locale } from "@/constants/i18n";
import BlogLayout from "@/components/mdx-layout/BlogLayout";
import { buildMdxComponents } from "@/features/mdx/components";
import { extractHeadingsFromMdx } from "@/features/mdx/headings";
import { loadMdxSource } from "@/features/mdx/loader";
import { renderMdx } from "@/features/mdx/renderer";
import { getAcpDemoMdxSlug, resolveAcpDemoRoute } from "@/features/demo/acp";

type Props = {
  params: Promise<{ locale: string; id: string; rest?: string[] }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, id, rest } = await params;

  if (!isLocale(locale)) {
    return {};
  }

  const route = resolveAcpDemoRoute(locale as Locale, id, rest);
  const mdxSlug = getAcpDemoMdxSlug(id);

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

export default async function AcpDemoMdxPage({ params }: Props) {
  const { locale, id, rest } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const route = resolveAcpDemoRoute(locale as Locale, id, rest);

  if (!route.entry) {
    notFound();
  }

  if (route.shouldRedirect && route.canonicalHref) {
    redirect(route.canonicalHref);
  }

  const mdxSlug = getAcpDemoMdxSlug(id);

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
