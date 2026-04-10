import type { Metadata } from "next";
import { getLocalePath, isLocale } from "../../../../constants/i18n";

export { default } from "../../about-us/page";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  if (!isLocale(locale)) return {};

  return {
    alternates: {
      canonical: getLocalePath(locale, "/company/about-us"),
    },
  };
}
