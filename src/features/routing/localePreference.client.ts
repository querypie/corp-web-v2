import type { Locale } from "@/constants/i18n";
import {
  LOCALE_PREFERENCE_COOKIE,
  LOCALE_PREFERENCE_MAX_AGE_SECONDS,
} from "./localePreference";

export function setLocalePreferenceCookie(locale: Locale) {
  const secure = window.location.protocol === "https:" ? "; secure" : "";
  document.cookie = `${LOCALE_PREFERENCE_COOKIE}=${locale}; max-age=${LOCALE_PREFERENCE_MAX_AGE_SECONDS}; path=/; samesite=lax${secure}`;
}
