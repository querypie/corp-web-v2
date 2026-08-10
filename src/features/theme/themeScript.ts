import { THEME_STORAGE_KEY } from "./theme";

export const themeInitializationScript = `
(() => {
  try {
    const savedTheme = localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});
    const theme = savedTheme === "light" || savedTheme === "dark"
      ? savedTheme
      : window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    const root = document.documentElement;
    root.dataset.theme = theme;
    root.style.colorScheme = theme;
    const themeColor = document.querySelector('meta[name="theme-color"]');
    themeColor?.setAttribute("content", theme === "dark" ? "#0F0F0F" : "#FFFFFF");
  } catch {
    document.documentElement.dataset.theme = "light";
    document.documentElement.style.colorScheme = "light";
  }
})();
`;
