import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { isLocale, type Locale } from "@/constants/i18n";
import { loadMdxSource } from "@/features/mdx/loader";
import { renderMdx } from "@/features/mdx/renderer";
import { buildMdxComponents } from "@/features/mdx/components";
import { extractHeadingsFromMdx } from "@/features/mdx/headings";
import ArticleLayout from "@/components/mdx-layout/ArticleLayout";
import { getContactPageCopy } from "@/features/contact/copy";
import { getContentUnlockCookieName, hasUnlockedContentAccess } from "@/features/content/gating";

type Props = {
  params: Promise<{ locale: string; id: string; rest?: string[] }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, id } = await params;
  if (!isLocale(locale)) return {};

  const source = await loadMdxSource("white-paper", id, locale as Locale);
  if (!source) return {};

  const { frontmatter } = await renderMdx(source, {});
  return {
    title: frontmatter.title,
    description: frontmatter.description,
    keywords: frontmatter.keywords,
  };
}

export default async function WhitepaperMdxPage({ params }: Props) {
  const { locale, id } = await params;
  if (!isLocale(locale)) notFound();

  const source = await loadMdxSource("white-paper", id, locale as Locale);
  if (!source) notFound();

  const cookieStore = await cookies();
  const unlockCookieName = getContentUnlockCookieName(id);
  const isUnlocked = hasUnlockedContentAccess(cookieStore.get(unlockCookieName)?.value);
  const contactCopy = getContactPageCopy(locale as Locale);

  // Step 1: parse frontmatter only (to get title for gating form)
  const { frontmatter } = await renderMdx(source, {});

  // Step 2: render with full components including gating
  const components = buildMdxComponents({
    locale: locale as Locale,
    isUnlocked,
    unlockCookieName,
    title: frontmatter.title,
    contactCopy,
  });
  const { content } = await renderMdx(source, components);

  const headings = extractHeadingsFromMdx(source);

  return (
    <ArticleLayout frontmatter={frontmatter} headings={headings} locale={locale as Locale}>
      {content}
    </ArticleLayout>
  );
}
