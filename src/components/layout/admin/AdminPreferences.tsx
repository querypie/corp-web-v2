"use client";

import { useEffect, useState } from "react";
import { getNextTheme, isTheme, type Theme } from "@/features/theme/theme";
import { ADMIN_THEME_STORAGE_KEY, adminLocales } from "@/features/admin/preferences";
import { useAdminLocale } from "./AdminLocaleProvider";

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.dataset.theme = theme;
  root.style.colorScheme = theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute(
    "content",
    theme === "dark" ? "#0F0F0F" : "#FFFFFF",
  );
}

function ThemeIcon({ theme }: { theme: Theme }) {
  if (theme === "dark") {
    return (
      <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="3.25" stroke="currentColor" strokeWidth="1.7" />
        <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.28 5.28 6.7 6.7M17.3 17.3l1.42 1.42M18.72 5.28 17.3 6.7M6.7 17.3l-1.42 1.42" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
      <path d="M19.2 15.2A7.5 7.5 0 0 1 8.8 4.8a7.5 7.5 0 1 0 10.4 10.4Z" fill="currentColor" />
    </svg>
  );
}

export default function AdminPreferences({ compact = false }: { compact?: boolean }) {
  const { locale, setLocale, t } = useAdminLocale();
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const syncTheme = () => {
      const savedTheme = localStorage.getItem(ADMIN_THEME_STORAGE_KEY);
      const nextTheme = isTheme(savedTheme)
        ? savedTheme
        : document.documentElement.dataset.theme === "light"
          ? "light"
          : "dark";
      applyTheme(nextTheme);
      setTheme(nextTheme);
    };

    const handleStorage = (event: StorageEvent) => {
      if (event.key === ADMIN_THEME_STORAGE_KEY) syncTheme();
    };

    syncTheme();
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  return (
    <div className="flex items-center gap-2">
      {compact ? null : (
        <div aria-label={t("관리자 UI 언어")} className="inline-flex h-10 items-center rounded-full bg-bg px-1" role="group">
          {adminLocales.map((item) => (
            <button
              aria-pressed={locale === item}
              className={`inline-flex h-8 min-w-10 items-center justify-center rounded-full px-2.5 text-[13px] font-semibold tracking-[-0.01em] transition-colors ${
                locale === item ? "bg-secondary text-fg" : "text-mute hover:text-fg"
              }`}
              key={item}
              onClick={() => setLocale(item)}
              type="button"
            >
              {item.toUpperCase()}
            </button>
          ))}
        </div>
      )}
      <button
        aria-label={t(theme === "dark" ? "라이트 모드로 전환" : "다크 모드로 전환")}
        className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-mute transition-colors hover:bg-bg-hover hover:text-fg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fg"
        onClick={() => {
          const nextTheme = getNextTheme(theme);
          localStorage.setItem(ADMIN_THEME_STORAGE_KEY, nextTheme);
          applyTheme(nextTheme);
          setTheme(nextTheme);
        }}
        title={t(theme === "dark" ? "라이트 모드로 전환" : "다크 모드로 전환")}
        type="button"
      >
        <ThemeIcon theme={theme} />
      </button>
    </div>
  );
}
