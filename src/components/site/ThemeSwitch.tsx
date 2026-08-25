"use client";

import { useEffect, useId, useState } from "react";
import {
  isTheme,
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
  if (preference === "system") {
    return (
      <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 16 16">
        <rect height="9" rx="1.5" stroke="currentColor" strokeWidth="1.3" width="13" x="1.5" y="2" />
        <path d="M5.5 14h5M8 11v3" stroke="currentColor" strokeLinecap="round" strokeWidth="1.3" />
      </svg>
    );
  }

  if (preference === "dark") {
    return (
      <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 16 16">
        <path d="M11.9 10.3A5 5 0 0 1 5.7 4.1 5 5 0 1 0 11.9 10.3Z" fill="currentColor" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 16 16">
      <circle cx="8" cy="8" r="2.6" fill="currentColor" />
      <path d="M8 1.2v1.4M8 13.4v1.4M1.2 8h1.4M13.4 8h1.4M3.2 3.2l1 1M11.8 11.8l1 1M12.8 3.2l-1 1M4.2 11.8l-1 1" stroke="currentColor" strokeLinecap="round" strokeWidth="1.2" />
    </svg>
  );
}

export default function ThemeSwitch({
  className,
  compact = false,
  locale = "en",
}: ThemeSwitchProps) {
  const [preference, setPreference] = useState<ThemePreference>("system");
  const groupName = useId();

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
  const preferences: ThemePreference[] = ["system", "light", "dark"];

  const selectTheme = (nextPreference: ThemePreference) => {
    if (nextPreference === "system") {
      localStorage.removeItem(THEME_STORAGE_KEY);
    } else {
      localStorage.setItem(THEME_STORAGE_KEY, nextPreference);
    }

    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    applyTheme(resolveTheme(nextPreference, prefersDark));
    setPreference(nextPreference);
    window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
  };

  return (
    <div
      className={cx(
        "inline-flex items-center text-fg",
        compact ? "justify-center" : "justify-start",
        className,
      )}
    >
      <div
        aria-label={copy.selectLabel}
        className={cx(
          "inline-flex rounded-full bg-secondary p-0.5",
          compact ? "flex-col" : "items-center",
        )}
        role="radiogroup"
      >
        {preferences.map((option) => (
          <label
            key={option}
            className="relative cursor-pointer rounded-full"
            title={copy[option]}
          >
            <input
              checked={preference === option}
              className="peer sr-only"
              name={groupName}
              onChange={() => selectTheme(option)}
              type="radio"
              value={option}
            />
            <span
              className={cx(
                "inline-flex h-8 w-9 items-center justify-center rounded-full text-mute transition-[background-color,color,transform] duration-150 hover:text-fg peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-fg active:scale-[0.96]",
                preference === option && "bg-[var(--color-switch-track)] text-fg",
              )}
            >
              <ThemePreferenceIcon preference={option} />
              <span className="sr-only">{copy[option]}</span>
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}
