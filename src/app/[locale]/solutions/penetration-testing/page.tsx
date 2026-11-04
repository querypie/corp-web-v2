import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PenetrationTestingPage from "@/components/pages/solutions/japan/PenetrationTestingPage";
import { penetrationTestingCopy } from "@/copy/penetrationTesting";
import { withDynamicOgImage } from "@/features/seo/metadata";
import { getSolutionHref } from "@/features/solutions/routes";

type PageProps = { params: Promise<{ locale: string }> };

export function generateStaticParams() { return [{ locale: "ja" }]; }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (locale !== "ja") notFound();
  const copy = penetrationTestingCopy.metadata;
  return withDynamicOgImage({ ...copy, alternates: { canonical: getSolutionHref("ja", "penetration-testing") } }, { locale, ...copy });
}

export default async function Page({ params }: PageProps) {
  const { locale } = await params;
  if (locale !== "ja") notFound();
  return <PenetrationTestingPage />;
}
