import { notFound, redirect } from "next/navigation";
import { getLocalePath, isLocale } from "@/constants/i18n";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function AcpEnterpriseContactRoute({ params }: Props) {
  const { locale } = await params;

  if (!isLocale(locale)) notFound();

  redirect(getLocalePath(locale, "/company/contact-us"));
}
