import { describe, expect, it } from "vitest";
import { isDlpPlatformVisible } from "./visibility";

describe("isDlpPlatformVisible", () => {
  it.each(["en", "ko"] as const)("Preview의 %s 제품 소개를 노출한다", (locale) => {
    expect(isDlpPlatformVisible(locale, { VERCEL_TARGET_ENV: "preview" })).toBe(true);
  });

  it("Preview에서도 일본어 제품 소개는 숨긴다", () => {
    expect(isDlpPlatformVisible("ja", { VERCEL_TARGET_ENV: "preview" })).toBe(false);
  });

  it.each(["en", "ko", "ja"] as const)("%s 제품 소개를 Production에서는 숨긴다", (locale) => {
    expect(isDlpPlatformVisible(locale, { VERCEL_TARGET_ENV: "production" })).toBe(false);
    expect(isDlpPlatformVisible(locale, { VERCEL_TARGET_ENV: "staging" })).toBe(false);
    expect(isDlpPlatformVisible(locale, {})).toBe(false);
  });
});
