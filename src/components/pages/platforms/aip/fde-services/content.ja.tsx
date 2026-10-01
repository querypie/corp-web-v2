import type { Locale } from "@/constants/i18n";
import { fdeCopy } from "@/copy/fde";
import FdeServicesPage from "./FdeServicesPage";

export const metadata = fdeCopy.ja.metadata;

export default function FdeServicesJASolutionContent({ locale }: { locale: Locale; searchParams?: { category?: string } }) {
  return <FdeServicesPage locale={locale} />;
}
