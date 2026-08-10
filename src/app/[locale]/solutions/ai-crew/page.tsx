import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AiCrewPage, { metadata as pageMetadata } from "@/components/pages/solutions/japan/AiCrewPage";
import AiCrewLocalizedPage from "@/components/pages/solutions/japan/AiCrewLocalizedPage";
import { getAiCrewCopy } from "@/components/pages/solutions/japan/aiCrewCopy";
import { isLocale } from "@/constants/i18n";
import { getSolutionHref } from "@/features/solutions/routes";
import { withDynamicOgImage } from "@/features/seo/metadata";

type PageProps = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "ko" }, { locale: "ja" }];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const metadata = locale === "ja" ? pageMetadata : getAiCrewCopy(locale)?.metadata;
  if (!metadata) return {};

  return withDynamicOgImage({
    ...metadata,
    keywords: [...metadata.keywords],
    alternates: { canonical: getSolutionHref(locale, "ai-crew") },
  }, { locale, title: metadata.title, description: metadata.description });
}

export default async function Page({ params }: PageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  if (locale === "ja") return <AiCrewPage />;
  return <AiCrewLocalizedPage locale={locale} />;
}
