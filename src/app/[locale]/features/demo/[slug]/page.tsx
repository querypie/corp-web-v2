import type { Metadata } from "next";
import { getLocalePath, isLocale } from "../../../../../constants/i18n";

export { default } from "../../../demo/[slug]/page";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;

  if (!isLocale(locale)) return {};

  return {
    alternates: {
      canonical: getLocalePath(locale, `/features/demo/${decodeURIComponent(slug)}`),
    },
  };
}
