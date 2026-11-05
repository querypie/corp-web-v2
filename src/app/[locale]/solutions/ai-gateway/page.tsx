import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AiSolutionPage from "@/components/pages/solutions/AiSolutionPage";
import { isLocale, locales } from "@/constants/i18n";
import { aiSolutionsCopy } from "@/copy/aiSolutions";
import { withDynamicOgImage } from "@/features/seo/metadata";
import { getSolutionHref } from "@/features/solutions/routes";

type PageProps = { params: Promise<{ locale: string }> };

export function generateStaticParams() { return locales.map(locale => ({ locale })); }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const copy = aiSolutionsCopy[locale]["ai-gateway"];
  return withDynamicOgImage({ ...copy.metadata, alternates: { canonical: getSolutionHref(locale, "ai-gateway") } }, { locale, ...copy.metadata });
}

export default async function Page({ params }: PageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <AiSolutionPage id="ai-gateway" locale={locale} />;
}
