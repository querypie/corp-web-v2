import { describe, expect, it } from "vitest";
import {
  getBrowserAdminLocale,
  isAdminLocale,
  resolveAdminLocale,
} from "./preferences";

describe("admin preferences", () => {
  it("accepts only supported admin UI locales", () => {
    expect(isAdminLocale("ko")).toBe(true);
    expect(isAdminLocale("ja")).toBe(true);
    expect(isAdminLocale("en")).toBe(false);
    expect(isAdminLocale(null)).toBe(false);
  });

  it("selects Korean or Japanese from the browser language", () => {
    expect(getBrowserAdminLocale("ja-JP,ja;q=0.9,en;q=0.8")).toBe("ja");
    expect(getBrowserAdminLocale("ko-KR,ko;q=0.9")).toBe("ko");
    expect(getBrowserAdminLocale("en-US,en;q=0.9")).toBe("ko");
  });

  it("uses the saved locale before the browser language", () => {
    expect(resolveAdminLocale("ko", "ja-JP")).toBe("ko");
    expect(resolveAdminLocale("ja", "ko-KR")).toBe("ja");
    expect(resolveAdminLocale("invalid", "ja-JP")).toBe("ja");
  });
});
