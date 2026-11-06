import type { Locale } from "@/constants/i18n";
import { offerings } from "@/constants/offerings";

export function isDlpPlatformVisible(locale: Locale) {
  return (offerings.dlp.locales as readonly Locale[]).includes(locale);
}
