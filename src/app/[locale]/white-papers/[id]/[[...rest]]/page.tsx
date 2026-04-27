import { notFound, redirect } from "next/navigation";
import { getLocalePath, isLocale } from "@/constants/i18n";

type Props = {
  params: Promise<{ locale: string; id: string; rest?: string[] }>;
};

export default async function LegacyWhitePaperDetailRedirect({ params }: Props) {
  const { locale, id, rest } = await params;

  if (!isLocale(locale)) notFound();

  const suffix = [id, ...(rest ?? [])].join("/");
  redirect(getLocalePath(locale, `/whitepapers/${suffix}`));
}
