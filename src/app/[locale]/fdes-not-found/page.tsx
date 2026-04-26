import { notFound, permanentRedirect } from "next/navigation";
import { getLocalePath, isLocale } from "@/constants/i18n";

type Props = { params: Promise<{ locale: string }> };

export default async function FdesPlaceholderRedirect({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  permanentRedirect(getLocalePath(locale, "/solutions/aip/fde-services"));
}
