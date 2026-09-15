"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
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
  const Icon = theme === "dark" ? Sun : Moon;
  return <Icon aria-hidden="true" className="h-5 w-5" />;
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
