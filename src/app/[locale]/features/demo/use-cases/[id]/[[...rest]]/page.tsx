import { notFound, redirect } from "next/navigation";
import { isLocale, type Locale } from "@/constants/i18n";
import { getUseCaseDemoHref } from "@/features/demo/useCase";

type Props = {
  params: Promise<{ locale: string; id: string; rest?: string[] }>;
};

export default async function LegacyUseCaseDemoRedirectPage({ params }: Props) {
  const { locale, id } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const href = getUseCaseDemoHref(locale as Locale, id);

  if (!href) {
    notFound();
  }

  redirect(href);
}
