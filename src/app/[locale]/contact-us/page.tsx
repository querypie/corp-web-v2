import { notFound } from "next/navigation";
import ContactUsPage from "../../../components/pages/contact/ContactUsPage";
import { isLocale } from "../../../constants/i18n";
import { getContactPageCopy } from "@/features/contact/copy";

type ContactUsRouteProps = {
  params: Promise<{ locale: string }>;
};

export default async function ContactUsRoute({ params }: ContactUsRouteProps) {
  const { locale } = await params;

  if (!isLocale(locale)) notFound();

  return <ContactUsPage {...getContactPageCopy(locale)} />;
}
