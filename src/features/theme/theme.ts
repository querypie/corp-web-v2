export const THEME_STORAGE_KEY = "querypie-theme";
export const THEME_CHANGE_EVENT = "querypie-theme-change";

export type Theme = "dark" | "light";
export type ThemePreference = Theme | "system";

export function isTheme(value: unknown): value is Theme {
  return value === "dark" || value === "light";
}

export function isThemePreference(value: unknown): value is ThemePreference {
  return value === "system" || isTheme(value);
}

export function getSystemTheme(prefersDark: boolean): Theme {
  return prefersDark ? "dark" : "light";
}

export function resolveTheme(preference: ThemePreference, prefersDark: boolean): Theme {
  return preference === "system" ? getSystemTheme(prefersDark) : preference;
}

export function getNextTheme(theme: Theme): Theme {
  return theme === "dark" ? "light" : "dark";
}
