import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/constants/i18n";
import { getSolutionStaticMetadata } from "./solutionMetadata";
import { getSolutionHref, getSolutionEntryById, type SolutionEntry } from "./routes";
import { getSolutionStaticContent } from "./staticContent";

type PageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string }>;
};

export function createSolutionMetadata(id: SolutionEntry["id"]) {
  return async function generateMetadata({ params }: Pick<PageProps, "params">): Promise<Metadata> {
    const { locale } = await params;
    if (!isLocale(locale)) return {};

    const entry = getSolutionEntryById(id);
    if (!entry) return {};

    const meta = getSolutionStaticMetadata(entry.id, locale as Locale);
    if (!meta) return {};

    return {
      title: meta.title,
      description: meta.description,
      keywords: meta.keywords,
      alternates: {
        canonical: getSolutionHref(locale as Locale, entry.id),
      },
    };
  };
}

export function createSolutionPage(id: SolutionEntry["id"]) {
  return async function SolutionPage({ params, searchParams }: PageProps) {
    const { locale } = await params;
    if (!isLocale(locale)) notFound();

    const Content = getSolutionStaticContent(id, locale as Locale);
    if (!Content) notFound();

    return (
      <div className="bg-white text-[#111827]">
        <Content locale={locale as Locale} searchParams={await searchParams} />
      </div>
    );
  };
}
