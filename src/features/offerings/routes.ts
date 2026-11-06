import { getLocalePath, type Locale } from "@/constants/i18n";
import { offerings, type OfferingId } from "@/constants/offerings";

export function getOfferingHref(locale: Locale, id: OfferingId): string {
  return getLocalePath(locale, offerings[id].path);
}

export function getAiGatewayManualHref(locale: Locale): string {
  return `https://ai-gateway.dev.querypie.io/manual/${locale === "en" ? "" : `${locale}/`}`;
}
