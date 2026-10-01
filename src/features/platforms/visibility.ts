import type { Locale } from "@/constants/i18n";

export function isDlpPlatformVisible(locale: Locale) {
  return locale === "en" || locale === "ko";
}
