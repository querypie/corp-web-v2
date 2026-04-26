import { describe, expect, it } from "vitest";
import {
  getWebinarDemoEntry,
  getWebinarDemoEntryByContentId,
  getWebinarDemoHref,
  getWebinarDemoHrefByContentId,
  resolveWebinarDemoRoute,
  webinarDemoEntries,
} from "./webinar";

describe("webinarDemoEntries", () => {
  it("26개의 legacy webinar id 매핑을 가진다", () => {
    expect(webinarDemoEntries).toHaveLength(26);
  });

  it("사용자 예시 webinar id 22를 포함한다", () => {
    expect(getWebinarDemoEntry("22")).toEqual({
      id: "22",
      slug: "air-company-querypie-mcp-webinar",
      contentId: "air-company-querypie-mcp-webinar",
    });
  });
});

describe("getWebinarDemoEntryByContentId", () => {
  it("중복 contentId는 마지막 legacy 번호를 canonical id로 사용한다", () => {
    expect(getWebinarDemoEntryByContentId("air-company-querypie-mcp-webinar")).toEqual({
      id: "22",
      slug: "air-company-querypie-mcp-webinar",
      contentId: "air-company-querypie-mcp-webinar",
    });
    expect(getWebinarDemoEntryByContentId("air-company-querypie-ai-webinar")).toEqual({
      id: "24",
      slug: "air-company-querypie-ai-webinar",
      contentId: "air-company-querypie-ai-webinar",
    });
  });
});

describe("getWebinarDemoHref", () => {
  it("canonical webinar 경로를 반환한다", () => {
    expect(getWebinarDemoHref("en", "22")).toBe("/demo/webinar/22/air-company-querypie-mcp-webinar");
    expect(getWebinarDemoHref("ko", "22")).toBe("/ko/demo/webinar/22/air-company-querypie-mcp-webinar");
  });

  it("중복 legacy 번호도 canonical webinar 경로로 정규화한다", () => {
    expect(getWebinarDemoHref("en", "18")).toBe("/demo/webinar/22/air-company-querypie-mcp-webinar");
    expect(getWebinarDemoHref("en", "19")).toBe("/demo/webinar/22/air-company-querypie-mcp-webinar");
    expect(getWebinarDemoHref("en", "20")).toBe("/demo/webinar/22/air-company-querypie-mcp-webinar");
  });
});

describe("getWebinarDemoHrefByContentId", () => {
  it("contentId 기준으로 canonical webinar 경로를 반환한다", () => {
    expect(getWebinarDemoHrefByContentId("en", "air-company-querypie-mcp-webinar")).toBe(
      "/demo/webinar/22/air-company-querypie-mcp-webinar",
    );
  });
});

describe("resolveWebinarDemoRoute", () => {
  it("canonical slug 요청은 redirect 없이 통과시킨다", () => {
    expect(resolveWebinarDemoRoute("en", "22", ["air-company-querypie-mcp-webinar"])).toEqual({
      canonicalHref: "/demo/webinar/22/air-company-querypie-mcp-webinar",
      entry: { id: "22", slug: "air-company-querypie-mcp-webinar", contentId: "air-company-querypie-mcp-webinar" },
      shouldRedirect: false,
    });
  });

  it("slug 없는 요청은 canonical 경로로 redirect 한다", () => {
    expect(resolveWebinarDemoRoute("en", "22")).toEqual({
      canonicalHref: "/demo/webinar/22/air-company-querypie-mcp-webinar",
      entry: { id: "22", slug: "air-company-querypie-mcp-webinar", contentId: "air-company-querypie-mcp-webinar" },
      shouldRedirect: true,
    });
  });

  it("legacy alias id 요청도 canonical 경로로 redirect 한다", () => {
    expect(resolveWebinarDemoRoute("en", "18", ["air-company-querypie-mcp-webinar"])).toEqual({
      canonicalHref: "/demo/webinar/22/air-company-querypie-mcp-webinar",
      entry: { id: "22", slug: "air-company-querypie-mcp-webinar", contentId: "air-company-querypie-mcp-webinar" },
      shouldRedirect: true,
    });
  });
});
