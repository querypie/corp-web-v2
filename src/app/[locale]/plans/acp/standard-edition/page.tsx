import { notFound, redirect } from "next/navigation";
import { isLocale } from "@/constants/i18n";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function AcpStandardEditionRoute({ params }: Props) {
  const { locale } = await params;

  if (!isLocale(locale)) notFound();

  redirect("https://docs.querypie.com/ko/support/standard-edition");
}
