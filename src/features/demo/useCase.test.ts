import { describe, expect, it } from "vitest";
import {
  getUseCaseDemoEntry,
  getUseCaseDemoEntryByContentId,
  getUseCaseDemoHref,
  getUseCaseDemoHrefByContentId,
  resolveUseCaseDemoRoute,
  useCaseDemoEntries,
} from "./useCase";

describe("useCaseDemoEntries", () => {
  it("legacy use-cases 번호 29개를 모두 매핑한다", () => {
    expect(useCaseDemoEntries).toHaveLength(29);
    expect(useCaseDemoEntries[0]).toEqual({ id: "1", slug: "allganize-changsu-lee", contentId: "allganize-changsu-lee" });
    expect(useCaseDemoEntries[28]).toEqual({ id: "29", slug: "seo-analyst", contentId: "seo-analyst" });
  });
});

describe("getUseCaseDemoEntry", () => {
  it("id에 해당하는 use-case entry를 반환한다", () => {
    expect(getUseCaseDemoEntry("1")).toEqual({ id: "1", slug: "allganize-changsu-lee", contentId: "allganize-changsu-lee" });
  });

  it("없는 id는 null을 반환한다", () => {
    expect(getUseCaseDemoEntry("99")).toBeNull();
  });
});

describe("getUseCaseDemoEntryByContentId", () => {
  it("content id로 entry를 찾는다", () => {
    expect(getUseCaseDemoEntryByContentId("allganize-changsu-lee")).toEqual({ id: "1", slug: "allganize-changsu-lee", contentId: "allganize-changsu-lee" });
  });
});

describe("getUseCaseDemoHref", () => {
  it("짧은 demo/use-case canonical 경로를 생성한다", () => {
    expect(getUseCaseDemoHref("en", "1")).toBe("/demo/use-case/1/allganize-changsu-lee");
    expect(getUseCaseDemoHref("ko", "1")).toBe("/ko/demo/use-case/1/allganize-changsu-lee");
  });
});

describe("getUseCaseDemoHrefByContentId", () => {
  it("managed content id에서 짧은 경로를 만든다", () => {
    expect(getUseCaseDemoHrefByContentId("en", "allganize-changsu-lee")).toBe("/demo/use-case/1/allganize-changsu-lee");
  });
});

describe("resolveUseCaseDemoRoute", () => {
  it("canonical slug가 오면 redirect하지 않는다", () => {
    expect(resolveUseCaseDemoRoute("en", "1", ["allganize-changsu-lee"])).toEqual({
      canonicalHref: "/demo/use-case/1/allganize-changsu-lee",
      entry: { id: "1", slug: "allganize-changsu-lee", contentId: "allganize-changsu-lee" },
      shouldRedirect: false,
    });
  });

  it("slug가 없으면 canonical 경로로 redirect한다", () => {
    expect(resolveUseCaseDemoRoute("en", "1")).toEqual({
      canonicalHref: "/demo/use-case/1/allganize-changsu-lee",
      entry: { id: "1", slug: "allganize-changsu-lee", contentId: "allganize-changsu-lee" },
      shouldRedirect: true,
    });
  });

  it("잘못된 slug면 canonical 경로로 redirect한다", () => {
    expect(resolveUseCaseDemoRoute("en", "1", ["wrong-slug"])).toEqual({
      canonicalHref: "/demo/use-case/1/allganize-changsu-lee",
      entry: { id: "1", slug: "allganize-changsu-lee", contentId: "allganize-changsu-lee" },
      shouldRedirect: true,
    });
  });
});
