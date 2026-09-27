import { describe, expect, it } from "vitest";
import { isDlpPlatformPreviewEnabled } from "./visibility";

describe("isDlpPlatformPreviewEnabled", () => {
  it("Preview 배포에서만 DLP 제품 소개를 노출한다", () => {
    expect(isDlpPlatformPreviewEnabled({ VERCEL_TARGET_ENV: "preview" })).toBe(true);
    expect(isDlpPlatformPreviewEnabled({ VERCEL_TARGET_ENV: "production" })).toBe(false);
    expect(isDlpPlatformPreviewEnabled({ VERCEL_TARGET_ENV: "staging" })).toBe(false);
    expect(isDlpPlatformPreviewEnabled({})).toBe(false);
  });
});
