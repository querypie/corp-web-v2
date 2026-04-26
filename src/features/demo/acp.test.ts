import { describe, expect, it } from "vitest";
import {
  acpDemoEntries,
  getAcpDemoEntry,
  getAcpDemoHref,
  getAcpDemoMdxSlug,
  resolveAcpDemoRoute,
} from "./acp";

describe("acpDemoEntries", () => {
  it("legacy ACP demo 26개 경로를 모두 유지한다", () => {
    expect(acpDemoEntries).toHaveLength(26);
  });
});

describe("getAcpDemoEntry", () => {
  it("legacy 번호로 canonical slug를 찾는다", () => {
    expect(getAcpDemoEntry("1")).toEqual({ id: "1", slug: "integrating-querypie-with-redash" });
    expect(getAcpDemoEntry("26")).toEqual({ id: "26", slug: "integrate-sso-with-okta" });
  });

  it("중복 slug도 번호별로 따로 유지한다", () => {
    expect(getAcpDemoEntry("7")?.slug).toBe("review-audit-logs");
    expect(getAcpDemoEntry("15")?.slug).toBe("review-audit-logs");
    expect(getAcpDemoEntry("25")?.slug).toBe("review-audit-logs");
  });

  it("없는 번호는 null을 반환한다", () => {
    expect(getAcpDemoEntry("999")).toBeNull();
  });
});

describe("getAcpDemoMdxSlug", () => {
  it("MDX 콘텐츠 디렉터리 경로를 반환한다", () => {
    expect(getAcpDemoMdxSlug("1")).toBe("acp/1");
    expect(getAcpDemoMdxSlug("26")).toBe("acp/26");
  });
});

describe("getAcpDemoHref", () => {
  it("짧은 demo/acp canonical 경로를 생성한다", () => {
    expect(getAcpDemoHref("en", "1")).toBe("/demo/acp/1/integrating-querypie-with-redash");
    expect(getAcpDemoHref("ko", "10")).toBe("/ko/demo/acp/10/submit-server-access-workflow");
  });

  it("없는 번호는 null을 반환한다", () => {
    expect(getAcpDemoHref("en", "999")).toBeNull();
  });
});

describe("resolveAcpDemoRoute", () => {
  it("slug가 없으면 canonical 경로로 redirect 대상이 된다", () => {
    expect(resolveAcpDemoRoute("en", "1")).toEqual({
      canonicalHref: "/demo/acp/1/integrating-querypie-with-redash",
      entry: { id: "1", slug: "integrating-querypie-with-redash" },
      shouldRedirect: true,
    });
  });

  it("slug가 다르면 canonical 경로로 redirect 대상이 된다", () => {
    expect(resolveAcpDemoRoute("en", "1", ["wrong-slug"])).toEqual({
      canonicalHref: "/demo/acp/1/integrating-querypie-with-redash",
      entry: { id: "1", slug: "integrating-querypie-with-redash" },
      shouldRedirect: true,
    });
  });

  it("canonical slug면 redirect하지 않는다", () => {
    expect(resolveAcpDemoRoute("ja", "26", ["integrate-sso-with-okta"])).toEqual({
      canonicalHref: "/ja/demo/acp/26/integrate-sso-with-okta",
      entry: { id: "26", slug: "integrate-sso-with-okta" },
      shouldRedirect: false,
    });
  });

  it("추가 세그먼트가 있어도 canonical 경로로 redirect한다", () => {
    expect(resolveAcpDemoRoute("en", "4", ["connect-kubernetes-agent", "extra"])).toEqual({
      canonicalHref: "/demo/acp/4/connect-kubernetes-agent",
      entry: { id: "4", slug: "connect-kubernetes-agent" },
      shouldRedirect: true,
    });
  });

  it("없는 번호는 notFound 처리용 null entry를 반환한다", () => {
    expect(resolveAcpDemoRoute("en", "999", ["missing"])).toEqual({
      canonicalHref: null,
      entry: null,
      shouldRedirect: false,
    });
  });
});
