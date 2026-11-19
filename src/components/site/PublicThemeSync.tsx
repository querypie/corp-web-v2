"use client";

import { useLayoutEffect } from "react";
import { defaultLocale, isLocale } from "@/constants/i18n";
import { getPublicTheme, type Theme } from "@/features/theme/theme";

type PublicThemeSyncProps = {
  locale: string;
  theme?: Theme;
};

export default function PublicThemeSync({ locale, theme = getPublicTheme(locale) }: PublicThemeSyncProps) {
  useLayoutEffect(() => {
    const root = document.documentElement;

    root.lang = isLocale(locale) ? locale : defaultLocale;
    root.dataset.theme = theme;
    root.style.colorScheme = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute(
      "content",
      theme === "dark" ? "#0F0F0F" : "#FFFFFF",
    );
  }, [locale, theme]);

  return null;
}
