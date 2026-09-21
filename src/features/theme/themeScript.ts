import { ADMIN_THEME_STORAGE_KEY } from "@/features/admin/preferences";
import { getJapaneseSiteHostnameCheckScript } from "@/features/routing/siteDomainRouting";

const japaneseSiteHostnameCheck = getJapaneseSiteHostnameCheckScript();

export const themeInitializationScript = `
(() => {
  const isJapaneseSite = ${japaneseSiteHostnameCheck};
  try {
    const isAdmin = /^\\/admin(?:\\/|$)/.test(window.location.pathname);
    const locale = isJapaneseSite
      ? "ja"
      : window.location.pathname.split("/")[1];
    const savedAdminTheme = isAdmin
      ? localStorage.getItem(${JSON.stringify(ADMIN_THEME_STORAGE_KEY)})
      : null;
    const theme = isAdmin
      ? savedAdminTheme === "light" || savedAdminTheme === "dark"
        ? savedAdminTheme
        : "dark"
      : locale === "ja"
        ? "light"
        : "dark";
    const root = document.documentElement;
    const documentLocale = locale === "en" || locale === "ko" || locale === "ja"
      ? locale
      : "en";
    root.lang = documentLocale;
    root.dataset.theme = theme;
    root.style.colorScheme = theme;
    const themeColor = document.querySelector('meta[name="theme-color"]');
    themeColor?.setAttribute("content", theme === "dark" ? "#0F0F0F" : "#FFFFFF");
  } catch {
    const locale = isJapaneseSite
      ? "ja"
      : window.location.pathname.split("/")[1];
    const fallbackTheme = locale === "ja" ? "light" : "dark";
    document.documentElement.lang = locale === "en" || locale === "ko" || locale === "ja"
      ? locale
      : "en";
    document.documentElement.dataset.theme = fallbackTheme;
    document.documentElement.style.colorScheme = fallbackTheme;
  }
})();
`;
