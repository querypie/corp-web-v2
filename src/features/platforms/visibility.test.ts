import { describe, expect, it } from "vitest";
import { isDlpPlatformVisible } from "./visibility";

describe("isDlpPlatformVisible", () => {
  it.each(["en", "ko"] as const)("%s 제품 소개를 노출한다", (locale) => {
    expect(isDlpPlatformVisible(locale)).toBe(true);
  });

  it("일본어 제품 소개는 숨긴다", () => {
    expect(isDlpPlatformVisible("ja")).toBe(false);
  });
});
