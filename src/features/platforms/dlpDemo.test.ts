import { describe, expect, it } from "vitest";
import { getDlpDemoUrl } from "./dlpDemo";

describe("getDlpDemoUrl", () => {
  it.each(["en", "ko", "ja"] as const)("홈페이지 %s locale을 데모에 그대로 전달한다", (locale) => {
    expect(getDlpDemoUrl(locale)).toBe(
      `https://querypie--dlp-demo.srv.kpb4r.mlxp.ncloud.com/?lang=${locale}`,
    );
  });
});
