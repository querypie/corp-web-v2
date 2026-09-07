import { describe, expect, it } from "vitest";
import { getLocalePath, getLocaleSwitchPath, isLocale, stripLocalePrefix } from "./i18n";

describe("isLocale", () => {
  it("supported locales를 인식한다", () => {
    expect(isLocale("en")).toBe(true);
    expect(isLocale("ko")).toBe(true);
    expect(isLocale("ja")).toBe(true);
  });

  it("지원하지 않는 locale을 거부한다", () => {
    expect(isLocale("fr")).toBe(false);
    expect(isLocale("zh")).toBe(false);
    expect(isLocale("")).toBe(false);
  });
});

describe("stripLocalePrefix", () => {
  it("경로 앞의 locale 접두사를 제거한다", () => {
    expect(stripLocalePrefix("/en/features/demo")).toBe("/features/demo");
    expect(stripLocalePrefix("/ko/company/news")).toBe("/company/news");
    expect(stripLocalePrefix("/ja/plans")).toBe("/plans");
  });

  it("locale 접두사가 없으면 원본 경로를 반환한다", () => {
    expect(stripLocalePrefix("/features/demo")).toBe("/features/demo");
    expect(stripLocalePrefix("/admin")).toBe("/admin");
  });

  it("locale만 있는 경로는 루트로 반환한다", () => {
    expect(stripLocalePrefix("/en")).toBe("/");
    expect(stripLocalePrefix("/ko")).toBe("/");
  });

  it("빈 경로는 루트를 반환한다", () => {
    expect(stripLocalePrefix("/")).toBe("/");
  });
});

describe("getLocalePath", () => {
  it("기본 locale(en)에도 접두사를 붙인다", () => {
    expect(getLocalePath("en", "/features/demo")).toBe("/en/features/demo");
    expect(getLocalePath("en", "/plans")).toBe("/en/plans");
    expect(getLocalePath("en", "/")).toBe("/en");
  });

  it("모든 locale에 접두사를 붙인다", () => {
    expect(getLocalePath("ko", "/features/demo")).toBe("/ko/features/demo");
    expect(getLocalePath("ja", "/plans")).toBe("/ja/plans");
  });

  it("루트 경로에 locale 접두사를 올바르게 붙인다", () => {
    expect(getLocalePath("ko", "/")).toBe("/ko");
    expect(getLocalePath("ja", "/")).toBe("/ja");
  });

  it("절대 URL은 그대로 반환한다", () => {
    expect(getLocalePath("ko", "https://example.com/foo")).toBe("https://example.com/foo");
  });

  it("locale 경로가 포함된 경우 중복 없이 반환한다", () => {
    expect(getLocalePath("ko", "/ko/plans")).toBe("/ko/plans");
    expect(getLocalePath("en", "/en/plans")).toBe("/en/plans");
  });
});

describe("getLocaleSwitchPath", () => {
  it("영어·한국어 Plans 페이지에서 일본어로 변경하면 일본어 홈으로 이동한다", () => {
    expect(getLocaleSwitchPath("/en/plans/aip", "ja")).toBe("/ja");
    expect(getLocaleSwitchPath("/ko/plans/acp", "ja")).toBe("/ja");
  });

  it("Plans의 영어·한국어 전환과 다른 페이지의 일본어 전환은 현재 경로를 유지한다", () => {
    expect(getLocaleSwitchPath("/en/plans/aip", "ko")).toBe("/ko/plans/aip");
    expect(getLocaleSwitchPath("/ko/plans/acp", "en")).toBe("/en/plans/acp");
    expect(getLocaleSwitchPath("/en/solutions/aip", "ja")).toBe("/ja/solutions/aip");
  });
});
