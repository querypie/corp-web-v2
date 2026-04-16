import { describe, expect, it } from "vitest";
import { getLocalePath, isLocale, stripLocalePrefix } from "./i18n";

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
  it("기본 locale(en)은 접두사 없이 경로를 반환한다", () => {
    expect(getLocalePath("en", "/features/demo")).toBe("/features/demo");
    expect(getLocalePath("en", "/plans")).toBe("/plans");
    expect(getLocalePath("en", "/")).toBe("/");
  });

  it("en 이외 locale은 접두사를 붙인다", () => {
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
    expect(getLocalePath("en", "/en/plans")).toBe("/plans");
  });
});
