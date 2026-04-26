import type { Metadata } from "next";
import type { ComponentType } from "react";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/constants/i18n";
import { getSolutionHref } from "@/features/solutions/routes";

export type SolutionStaticMetadata = {
  title: string;
  description: string;
  keywords?: string[];
  abstract?: string;
};

export type SolutionStaticContentProps = {
  locale: Locale;
  searchParams?: { category?: string };
};

export type SolutionStaticContentComponent = ComponentType<SolutionStaticContentProps>;

type PageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string }>;
};

export function createSolutionPage(contentByLocale: Record<Locale, SolutionStaticContentComponent>) {
  return async function SolutionPage({ params, searchParams }: PageProps) {
    const { locale } = await params;
    if (!isLocale(locale)) notFound();

    const Content = contentByLocale[locale as Locale];
    if (!Content) notFound();

    return (
      <div className="bg-white text-[#111827]">
        <Content locale={locale as Locale} searchParams={await searchParams} />
      </div>
    );
  };
}

export function createGenerateMetadata(
  id: string,
  metadataByLocale: Record<Locale, SolutionStaticMetadata>,
) {
  return async function generateMetadata({ params }: Pick<PageProps, "params">): Promise<Metadata> {
    const { locale } = await params;
    if (!isLocale(locale)) return {};

    const meta = metadataByLocale[locale as Locale];
    if (!meta) return {};

    return {
      title: meta.title,
      description: meta.description,
      keywords: meta.keywords,
      alternates: {
        canonical: getSolutionHref(locale as Locale, id as never),
      },
    };
  };
}
