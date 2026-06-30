import { notFound, redirect } from "next/navigation";
import { isLocale } from "@/constants/i18n";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function AcpCommunityInstallationRoute({ params }: Props) {
  const { locale } = await params;

  if (!isLocale(locale)) notFound();

  redirect(
    locale === "ko"
      ? "https://docs.querypie.com/ko/installation/querypie-acp-community-edition"
      : "https://docs.querypie.com/en/installation/querypie-acp-community-edition",
  );
}
