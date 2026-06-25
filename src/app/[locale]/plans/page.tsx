import { notFound, permanentRedirect } from "next/navigation";
import type { Metadata } from "next";
import { getLocalePath, isLocale } from "../../../constants/i18n";
import { getPlansPageCopy } from "@/features/content/pageCopy";
import { withDynamicOgImage } from "@/features/seo/metadata";

type PlansRouteProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Pick<PlansRouteProps, "params">): Promise<Metadata> {
  const { locale } = await params;

  if (!isLocale(locale)) return {};

  const { metadataDescription, metadataTitle } = getPlansPageCopy(locale);

  return withDynamicOgImage({
    title: metadataTitle,
    description: metadataDescription,
    alternates: {
      canonical: getLocalePath(locale, "/plans/aip"),
    },
  }, { locale, title: metadataTitle, description: metadataDescription });
}

export default async function PlansRoute({ params }: PlansRouteProps) {
  const { locale } = await params;

  if (!isLocale(locale)) notFound();

  permanentRedirect(getLocalePath(locale, "/plans/aip"));
}
