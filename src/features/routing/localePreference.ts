import { defaultLocale, isLocale, type Locale } from "@/constants/i18n";

export const LOCALE_PREFERENCE_COOKIE = "querypie_locale_preference";
export const LOCALE_PREFERENCE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

export function getLocaleFromAcceptLanguage(acceptLanguage: string | null): Locale | null {
  const languageRanges = (acceptLanguage?.split(",") ?? [])
    .map((range, index) => {
      const [languageRange, ...parameters] = range.trim().split(";");
      const qualityParameter = parameters.find((parameter) => parameter.trim().startsWith("q="));
      const parsedQuality = qualityParameter
        ? Number.parseFloat(qualityParameter.trim().slice(2))
        : 1;

      return {
        index,
        language: languageRange?.toLowerCase(),
        quality: Number.isFinite(parsedQuality) ? parsedQuality : 0,
      };
    })
    .filter(({ language, quality }) => Boolean(language) && quality > 0)
    .sort((first, second) => second.quality - first.quality || first.index - second.index);

  for (const { language } of languageRanges) {
    if (!language) continue;

    const baseLanguage = language.split("-")[0];
    if (baseLanguage && isLocale(baseLanguage)) return baseLanguage;
  }

  return null;
}

export function getRecommendedLocale(acceptLanguage: string | null): Locale {
  return getLocaleFromAcceptLanguage(acceptLanguage) ?? defaultLocale;
}

export function resolveRootLocale(
  savedLocale: string | undefined,
  acceptLanguage: string | null,
): Locale {
  return savedLocale && isLocale(savedLocale)
    ? savedLocale
    : getRecommendedLocale(acceptLanguage);
}
