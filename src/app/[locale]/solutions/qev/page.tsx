import type { Metadata } from "next";
import { notFound } from "next/navigation";
import JapanAiSolutionPage from "@/components/pages/solutions/japan/JapanAiSolutionPage";
import { japanAiSolutionsCopy } from "@/copy/japanAiSolutions";
import { withDynamicOgImage } from "@/features/seo/metadata";
import { getSolutionHref } from "@/features/solutions/routes";

type PageProps = { params: Promise<{ locale: string }> };

export function generateStaticParams() { return [{ locale: "ja" }]; }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (locale !== "ja") notFound();
  const copy = japanAiSolutionsCopy.qev;
  return withDynamicOgImage({ ...copy.metadata, alternates: { canonical: getSolutionHref("ja", "qev") } }, { locale, ...copy.metadata });
}

export default async function Page({ params }: PageProps) {
  const { locale } = await params;
  if (locale !== "ja") notFound();
  return <JapanAiSolutionPage id="qev" />;
}
