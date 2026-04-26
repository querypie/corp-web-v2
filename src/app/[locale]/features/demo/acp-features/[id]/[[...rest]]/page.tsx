import { notFound, redirect } from "next/navigation";
import { isLocale, type Locale } from "@/constants/i18n";
import { getAcpDemoHref } from "@/features/demo/acp";

type Props = {
  params: Promise<{ locale: string; id: string; rest?: string[] }>;
};

export default async function LegacyAcpDemoRedirectPage({ params }: Props) {
  const { locale, id } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const href = getAcpDemoHref(locale as Locale, id);

  if (!href) {
    notFound();
  }

  redirect(href);
}
