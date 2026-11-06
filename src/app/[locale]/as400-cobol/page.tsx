import { getOfferingHref } from "@/features/offerings/routes";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import As400CobolPage from "@/components/pages/solutions/as400-cobol/As400CobolPage";
import { as400CobolCopy } from "@/copy/as400Cobol";
import { withDynamicOgImage } from "@/features/seo/metadata";

type PageProps = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return [{ locale: "ja" }];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (locale !== "ja") notFound();

  return withDynamicOgImage({
    ...as400CobolCopy.metadata,
    alternates: { canonical: getOfferingHref(locale, "as400-cobol") },
  }, { locale, ...as400CobolCopy.metadata });
}

export default async function Page({ params }: PageProps) {
  const { locale } = await params;
  if (locale !== "ja") notFound();
  return <As400CobolPage />;
}
