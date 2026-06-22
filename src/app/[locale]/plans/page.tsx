import { notFound, permanentRedirect } from "next/navigation";
import type { Metadata } from "next";
import { getLocalePath, isLocale } from "../../../constants/i18n";
import { getPlansPageCopy } from "@/features/content/pageCopy";

type PlansRouteProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Pick<PlansRouteProps, "params">): Promise<Metadata> {
  const { locale } = await params;

  if (!isLocale(locale)) return {};

  const { metadataTitle } = getPlansPageCopy(locale);

  return {
    title: metadataTitle,
    alternates: {
      canonical: getLocalePath(locale, "/plans/aip"),
    },
  };
}

export default async function PlansRoute({ params }: PlansRouteProps) {
  const { locale } = await params;

  if (!isLocale(locale)) notFound();

  permanentRedirect(getLocalePath(locale, "/plans/aip"));
}
