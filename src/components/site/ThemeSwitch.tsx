"use client";

import { useEffect, useState } from "react";
import { ChevronDown, Monitor, Moon, Sun } from "lucide-react";
import {
  isTheme,
  isThemePreference,
  resolveTheme,
  THEME_CHANGE_EVENT,
  THEME_STORAGE_KEY,
  type Theme,
  type ThemePreference,
} from "@/features/theme/theme";
import type { Locale } from "@/constants/i18n";

type ThemeSwitchProps = {
  className?: string;
  compact?: boolean;
  locale?: Locale;
};

type ThemeCopy = {
  dark: string;
  light: string;
  selectLabel: string;
  system: string;
};

const themeCopy: Record<Locale, ThemeCopy> = {
  en: {
    dark: "Dark mode",
    light: "Light mode",
    selectLabel: "Select color theme",
    system: "System mode",
  },
  ja: {
    dark: "ダークモード",
    light: "ライトモード",
    selectLabel: "カラーテーマを選択",
    system: "システム設定",
  },
  ko: {
    dark: "다크 모드",
    light: "라이트 모드",
    selectLabel: "컬러 테마 선택",
    system: "시스템 모드",
  },
};

function cx(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

function getStoredThemePreference(): ThemePreference {
  const value = localStorage.getItem(THEME_STORAGE_KEY);
  return isTheme(value) ? value : "system";
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.dataset.theme = theme;
  root.style.colorScheme = theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute(
    "content",
    theme === "dark" ? "#0F0F0F" : "#FFFFFF",
  );
}

function ThemePreferenceIcon({ preference }: { preference: ThemePreference }) {
  const Icon = preference === "system" ? Monitor : preference === "dark" ? Moon : Sun;
  return <Icon aria-hidden="true" className="h-4 w-4" />;
}

export default function ThemeSwitch({
  className,
  compact = false,
  locale = "en",
}: ThemeSwitchProps) {
  const [preference, setPreference] = useState<ThemePreference>("system");

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const syncTheme = () => {
      const nextPreference = getStoredThemePreference();
      const nextTheme = resolveTheme(nextPreference, mediaQuery.matches);
      applyTheme(nextTheme);
      setPreference(nextPreference);
    };
    const handleSystemThemeChange = (event: MediaQueryListEvent) => {
      if (getStoredThemePreference() !== "system") {
        return;
      }

      applyTheme(resolveTheme("system", event.matches));
      setPreference("system");
    };
    const handleStorage = (event: StorageEvent) => {
      if (event.key === THEME_STORAGE_KEY) {
        syncTheme();
      }
    };

    syncTheme();
    mediaQuery.addEventListener("change", handleSystemThemeChange);
    window.addEventListener("storage", handleStorage);
    window.addEventListener(THEME_CHANGE_EVENT, syncTheme);

    return () => {
      mediaQuery.removeEventListener("change", handleSystemThemeChange);
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener(THEME_CHANGE_EVENT, syncTheme);
    };
  }, []);

  const copy = themeCopy[locale];

  return (
    <div
      className={cx(
        "group relative inline-flex min-h-11 items-center gap-0 rounded-button text-fg outline-none transition-colors md:gap-2",
        compact ? "justify-center" : "justify-start",
        className,
      )}
      title={copy[preference]}
    >
      {compact ? null : (
        <span className="hidden type-body-md text-mute transition-colors md:inline">
          {copy[preference]}
        </span>
      )}
      <span
        aria-hidden="true"
        className={cx(
          "pointer-events-none inline-flex h-8 shrink-0 items-center justify-center rounded-full bg-secondary text-fg transition-colors group-hover:bg-secondary-hover",
          compact ? "w-9" : "w-14 gap-1.5",
        )}
      >
        <ThemePreferenceIcon preference={preference} />
        {compact ? null : (
          <ChevronDown aria-hidden="true" className="h-3.5 w-3.5 text-mute" />
        )}
      </span>
      <select
        aria-label={copy.selectLabel}
        className="absolute inset-0 h-full w-full cursor-pointer appearance-none opacity-0"
        onChange={(event) => {
          const nextPreference = event.currentTarget.value;

          if (!isThemePreference(nextPreference)) {
            return;
          }

          if (nextPreference === "system") {
            localStorage.removeItem(THEME_STORAGE_KEY);
          } else {
            localStorage.setItem(THEME_STORAGE_KEY, nextPreference);
          }

          const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
          applyTheme(resolveTheme(nextPreference, prefersDark));
          setPreference(nextPreference);
          window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
        }}
        value={preference}
      >
        <option value="system">{copy.system}</option>
        <option value="light">{copy.light}</option>
        <option value="dark">{copy.dark}</option>
      </select>
    </div>
  );
}
