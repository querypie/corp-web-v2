import { describe, expect, it } from "vitest";
import {
  aipDemoEntries,
  getAipDemoEntry,
  getAipDemoEntryByContentId,
  getAipDemoHref,
  getAipDemoHrefByContentId,
  resolveAipDemoRoute,
} from "./aip";

describe("aipDemoEntries", () => {
  it("legacy AIP demo 숫자 id와 content id를 매핑한다", () => {
    expect(aipDemoEntries).toEqual([
      { id: "1", slug: "google-oauth-demo", contentId: "google-oauth-demo" },
    ]);
  });
});

describe("getAipDemoEntry", () => {
  it("id에 해당하는 AIP demo entry를 반환한다", () => {
    expect(getAipDemoEntry("1")).toEqual({ id: "1", slug: "google-oauth-demo", contentId: "google-oauth-demo" });
  });

  it("없는 id는 null을 반환한다", () => {
    expect(getAipDemoEntry("99")).toBeNull();
  });
});

describe("getAipDemoEntryByContentId", () => {
  it("content id로 entry를 찾는다", () => {
    expect(getAipDemoEntryByContentId("google-oauth-demo")).toEqual({ id: "1", slug: "google-oauth-demo", contentId: "google-oauth-demo" });
  });
});

describe("getAipDemoHref", () => {
  it("짧은 demo/aip canonical 경로를 생성한다", () => {
    expect(getAipDemoHref("en", "1")).toBe("/demo/aip/1/google-oauth-demo");
    expect(getAipDemoHref("ko", "1")).toBe("/ko/demo/aip/1/google-oauth-demo");
  });
});

describe("getAipDemoHrefByContentId", () => {
  it("managed content id에서 짧은 경로를 만든다", () => {
    expect(getAipDemoHrefByContentId("en", "google-oauth-demo")).toBe("/demo/aip/1/google-oauth-demo");
  });
});

describe("resolveAipDemoRoute", () => {
  it("canonical slug가 오면 redirect하지 않는다", () => {
    expect(resolveAipDemoRoute("en", "1", ["google-oauth-demo"])).toEqual({
      canonicalHref: "/demo/aip/1/google-oauth-demo",
      entry: { id: "1", slug: "google-oauth-demo", contentId: "google-oauth-demo" },
      shouldRedirect: false,
    });
  });

  it("slug가 없으면 canonical 경로로 redirect한다", () => {
    expect(resolveAipDemoRoute("en", "1")).toEqual({
      canonicalHref: "/demo/aip/1/google-oauth-demo",
      entry: { id: "1", slug: "google-oauth-demo", contentId: "google-oauth-demo" },
      shouldRedirect: true,
    });
  });

  it("잘못된 slug면 canonical 경로로 redirect한다", () => {
    expect(resolveAipDemoRoute("en", "1", ["wrong-slug"])).toEqual({
      canonicalHref: "/demo/aip/1/google-oauth-demo",
      entry: { id: "1", slug: "google-oauth-demo", contentId: "google-oauth-demo" },
      shouldRedirect: true,
    });
  });
});
