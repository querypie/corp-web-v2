export const locales = ["en", "ko", "ja"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export function stripLocalePrefix(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 0) {
    return "/";
  }

  if (!isLocale(segments[0])) {
    return pathname || "/";
  }

  const nextPath = `/${segments.slice(1).join("/")}`;
  return nextPath === "/" ? "/" : nextPath.replace(/\/+$/, "");
}

export function getLocalePath(locale: Locale, pathname = "/") {
  if (/^https?:\/\//.test(pathname)) {
    return pathname;
  }

  const normalizedPath = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const pathWithoutLocale = stripLocalePrefix(normalizedPath);

  if (locale === defaultLocale) {
    return pathWithoutLocale;
  }

  return pathWithoutLocale === "/"
    ? `/${locale}`
    : `/${locale}${pathWithoutLocale}`;
}
