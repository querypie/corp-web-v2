import { notFound, redirect } from "next/navigation";
import { isLocale, type Locale } from "@/constants/i18n";
import { getWebinarDemoHref } from "@/features/demo/webinar";

type Props = {
  params: Promise<{ locale: string; id: string; rest?: string[] }>;
};

export default async function LegacyWebinarDemoRedirectPage({ params }: Props) {
  const { locale, id } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const href = getWebinarDemoHref(locale as Locale, id);

  if (!href) {
    notFound();
  }

  redirect(href);
}
