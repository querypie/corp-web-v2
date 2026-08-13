import { describe, expect, it } from "vitest";
import {
  getNextTheme,
  getSystemTheme,
  isTheme,
  isThemePreference,
  resolveTheme,
} from "./theme";

describe("theme", () => {
  it("accepts only supported theme values", () => {
    expect(isTheme("light")).toBe(true);
    expect(isTheme("dark")).toBe(true);
    expect(isTheme("system")).toBe(false);
    expect(isTheme(null)).toBe(false);
  });

  it("resolves the system color scheme", () => {
    expect(getSystemTheme(true)).toBe("dark");
    expect(getSystemTheme(false)).toBe("light");
  });

  it("accepts system as a theme preference", () => {
    expect(isThemePreference("system")).toBe(true);
    expect(isThemePreference("light")).toBe(true);
    expect(isThemePreference("dark")).toBe(true);
    expect(isThemePreference("contrast")).toBe(false);
  });

  it("resolves explicit and system preferences", () => {
    expect(resolveTheme("system", true)).toBe("dark");
    expect(resolveTheme("system", false)).toBe("light");
    expect(resolveTheme("light", true)).toBe("light");
    expect(resolveTheme("dark", false)).toBe("dark");
  });

  it("toggles between light and dark", () => {
    expect(getNextTheme("light")).toBe("dark");
    expect(getNextTheme("dark")).toBe("light");
  });
});
