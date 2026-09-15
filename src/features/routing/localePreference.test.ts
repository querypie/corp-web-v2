import { describe, expect, it } from "vitest";
import {
  getLocaleFromAcceptLanguage,
  getRecommendedLocale,
  resolveRootLocale,
} from "./localePreference";

describe("localePreference", () => {
  it("지원 언어 중 브라우저 우선 언어를 선택한다", () => {
    expect(getLocaleFromAcceptLanguage("ko-KR,ko;q=0.9,en-US;q=0.8")).toBe("ko");
    expect(getLocaleFromAcceptLanguage("ja-JP,en;q=0.8")).toBe("ja");
    expect(getLocaleFromAcceptLanguage("en;q=0.4,ja;q=0.9,ko;q=0.7")).toBe("ja");
    expect(getLocaleFromAcceptLanguage("ko;q=0,en;q=0.8")).toBe("en");
  });

  it("지원하지 않는 브라우저 언어는 영어로 대체한다", () => {
    expect(getRecommendedLocale("fr-FR,de;q=0.8")).toBe("en");
    expect(getRecommendedLocale(null)).toBe("en");
  });

  it("사용자가 저장한 언어를 브라우저 언어보다 우선한다", () => {
    expect(resolveRootLocale("en", "ko-KR,ko;q=0.9")).toBe("en");
    expect(resolveRootLocale("invalid", "ko-KR,ko;q=0.9")).toBe("ko");
  });

  it("글로벌 사이트는 일본어 쿠키와 브라우저 언어로 일본어를 선택하지 않는다", () => {
    expect(resolveRootLocale("ja", "ko-KR,ko;q=0.9")).toBe("ko");
    expect(resolveRootLocale("ja", "ja-JP")).toBe("en");
    expect(getRecommendedLocale("ja-JP,ko;q=0.8,en;q=0.7")).toBe("ko");
    expect(getRecommendedLocale("ja-JP")).toBe("en");
  });
});
