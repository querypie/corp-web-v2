import { describe, expect, it } from "vitest";
import { getLanguageAlternates, getPageSeoLocales, isPreviewSeoHost } from "./languages";

describe("언어별 검색 URL", () => {
  it("운영 사이트에서 실제 언어별 도메인으로 상호 연결한다", () => {
    const expected = {
      en: "https://www.querypie.com/en/ai-gateway",
      ko: "https://www.querypie.com/ko/ai-gateway",
      ja: "https://querypie.ai/ai-gateway",
      "x-default": "https://www.querypie.com/en/ai-gateway",
    };
    for (const host of ["www.querypie.com", "querypie.ai"]) {
      expect(getLanguageAlternates(new URL(`https://${host}`), "/ja/ai-gateway", ["en", "ko", "ja"])).toEqual(expected);
    }
  });
  it("제공되지 않는 번역을 alternate에 포함하지 않는다", () => {
    expect(getLanguageAlternates(new URL("https://querypie.ai"), "/local-llm", ["ja"])).toEqual({
      ja: "https://querypie.ai/local-llm", "x-default": "https://querypie.ai/local-llm",
    });
    expect(getPageSeoLocales("/ja/plans/aip")).toEqual(["en", "ko"]);
    expect(getPageSeoLocales("/ko/dlp")).toEqual(["en", "ko"]);
  });
  it("일본어 Stage에서는 같은 호스트의 일본어 URL만 제공한다", () => {
    expect(getLanguageAlternates(new URL("https://stage-v2.querypie.ai"), "/ja/acp", ["en", "ko", "ja"])).toEqual({
      ja: "https://stage-v2.querypie.ai/acp", "x-default": "https://stage-v2.querypie.ai/acp",
    });
  });
  it("Preview와 로컬의 검색 노출을 구분한다", () => {
    for (const host of ["localhost", "127.0.0.1", "example.vercel.app", "stage.querypie.com", "stage-v2.querypie.ai"]) expect(isPreviewSeoHost(host)).toBe(true);
    expect(isPreviewSeoHost("www.querypie.com")).toBe(false);
    expect(isPreviewSeoHost("querypie.ai")).toBe(false);
  });
});
