import { notFound, redirect } from "next/navigation";
import { isLocale, type Locale } from "@/constants/i18n";
import { getAipDemoHref } from "@/features/demo/aip";

type Props = {
  params: Promise<{ locale: string; id: string; rest?: string[] }>;
};

export default async function LegacyAipDemoRedirectPage({ params }: Props) {
  const { locale, id } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const href = getAipDemoHref(locale as Locale, id);

  if (!href) {
    notFound();
  }

  redirect(href);
}
