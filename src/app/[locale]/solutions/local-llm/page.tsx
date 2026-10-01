import type { Metadata } from "next";
import { notFound } from "next/navigation";
import LocalLlmPage from "@/components/pages/solutions/japan/LocalLlmPage";
import { localLlmCopy } from "@/copy/localLlm";
import { withDynamicOgImage } from "@/features/seo/metadata";
import { getSolutionHref } from "@/features/solutions/routes";

type PageProps = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return [{ locale: "ja" }];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (locale !== "ja") notFound();

  return withDynamicOgImage({
    ...localLlmCopy.metadata,
    alternates: { canonical: getSolutionHref(locale, "local-llm") },
  }, { locale, ...localLlmCopy.metadata });
}

export default async function Page({ params }: PageProps) {
  const { locale } = await params;
  if (locale !== "ja") notFound();
  return <LocalLlmPage />;
}
