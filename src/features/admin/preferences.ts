export const ADMIN_LOCALE_COOKIE_KEY = "querypie-admin-locale";
export const ADMIN_THEME_STORAGE_KEY = "querypie-admin-theme";

export const adminLocales = ["ko", "ja"] as const;

export type AdminLocale = (typeof adminLocales)[number];

export function isAdminLocale(value: unknown): value is AdminLocale {
  return value === "ko" || value === "ja";
}

export function getBrowserAdminLocale(acceptLanguage: string | null | undefined): AdminLocale {
  const languages = (acceptLanguage ?? "")
    .split(",")
    .map((entry) => entry.trim().split(";")[0]?.toLowerCase())
    .filter(Boolean);

  for (const language of languages) {
    if (language === "ja" || language?.startsWith("ja-")) return "ja";
    if (language === "ko" || language?.startsWith("ko-")) return "ko";
  }

  return "ko";
}

export function resolveAdminLocale(
  savedLocale: string | null | undefined,
  acceptLanguage: string | null | undefined,
): AdminLocale {
  return isAdminLocale(savedLocale) ? savedLocale : getBrowserAdminLocale(acceptLanguage);
}
