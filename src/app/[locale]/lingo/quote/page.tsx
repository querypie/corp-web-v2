import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getLocalePath, isLocale, type Locale } from "@/constants/i18n";
import LingoQuotePage from "@/components/pages/lingo-quote/LingoQuotePage";
import { getLingoQuotePageCopy } from "@/copy/lingoQuote";
import { getLingoQuotePlan } from "@/features/lingo-quote/catalog";
import { withDynamicOgImage } from "@/features/seo/metadata";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function LingoQuoteRoute({ params, searchParams }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const query = await searchParams;
  const rawPlan = Array.isArray(query.plan) ? query.plan[0] : query.plan;
  return (
    <LingoQuotePage
      copy={getLingoQuotePageCopy(locale)}
      initialPlan={getLingoQuotePlan(rawPlan)}
      locale={locale as Locale}
    />
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  const copy = getLingoQuotePageCopy(locale);
  return withDynamicOgImage({
    title: copy.metadataTitle,
    description: copy.description,
    robots: { index: false, follow: false },
    alternates: { canonical: getLocalePath(locale, "/lingo/quote") },
  }, { locale, title: copy.metadataTitle, description: copy.description });
}
