import { getOfferingHref } from "@/features/offerings/routes";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import LocalLlmPage from "@/components/pages/solutions/local-llm/LocalLlmPage";
import { localLlmCopy } from "@/copy/localLlm";
import { withDynamicOgImage } from "@/features/seo/metadata";

type PageProps = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return [{ locale: "ja" }];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (locale !== "ja") notFound();

  return withDynamicOgImage({
    ...localLlmCopy.metadata,
    alternates: { canonical: getOfferingHref(locale, "local-llm") },
  }, { locale, ...localLlmCopy.metadata });
}

export default async function Page({ params }: PageProps) {
  const { locale } = await params;
  if (locale !== "ja") notFound();
  return <LocalLlmPage />;
}
