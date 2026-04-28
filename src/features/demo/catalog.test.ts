import { existsSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  demoMdxEntries,
  getDemoMdxEntry,
  getDemoMdxEntryByCategoryAndId,
  getDemoMdxHref,
  getDemoMdxHrefByCategoryAndId,
  getDemoMdxLocalizedValue,
  getDemoMdxSlug,
  getVisibleDemoMdxEntries,
  isDemoMdxVisibleInLocale,
  resolveDemoMdxRoute,
} from "./catalog";

describe("demoMdxEntries", () => {
  it("ACP/AIP/use-cases/webinars demo 83개를 포함한다", () => {
    expect(demoMdxEntries).toHaveLength(83);
  });

  it("카테고리별 건수를 유지한다", () => {
    expect(demoMdxEntries.filter((entry) => entry.segment === "acp")).toHaveLength(26);
    expect(demoMdxEntries.filter((entry) => entry.segment === "aip")).toHaveLength(1);
    expect(demoMdxEntries.filter((entry) => entry.segment === "use-cases")).toHaveLength(29);
    expect(demoMdxEntries.filter((entry) => entry.segment === "webinars")).toHaveLength(27);
  });
});

describe("demoMdx lookup helpers", () => {
  it("segment/id로 canonical entry를 찾는다", () => {
    expect(getDemoMdxEntry("aip", "1")?.slug).toBe("google-oauth-demo");
    expect(getDemoMdxEntry("use-cases", "1")?.slug).toBe("allganize-changsu-lee");
    expect(getDemoMdxEntry("webinars", "17")?.slug).toBe("findy-querypie-mcp-webinar");
  });

  it("category/id로 canonical entry를 찾는다", () => {
    expect(getDemoMdxEntryByCategoryAndId("aip-features", "1")?.segment).toBe("aip");
    expect(getDemoMdxEntryByCategoryAndId("use-cases", "29")?.slug).toBe("seo-analyst");
    expect(getDemoMdxEntryByCategoryAndId("webinars", "26")?.slug).toBe(
      "air-company-querypie-ai-usecase-webinar",
    );
    expect(getDemoMdxEntryByCategoryAndId("webinars", "27")?.slug).toBe(
      "air-company-ai-agent-security-webinar",
    );
  });

  it("MDX slug를 반환한다", () => {
    expect(getDemoMdxSlug("acp", "1")).toBe("acp/1");
    expect(getDemoMdxSlug("aip", "1")).toBe("aip/1");
    expect(getDemoMdxSlug("use-cases", "29")).toBe("use-cases/29");
    expect(getDemoMdxSlug("webinars", "17")).toBe("webinars/17");
    expect(getDemoMdxSlug("webinars", "27")).toBe("webinars/27");
  });
});

describe("demoMdx href helpers", () => {
  it("short canonical href를 생성한다", () => {
    expect(getDemoMdxHref("en", "aip", "1")).toBe("/demo/aip/1/google-oauth-demo");
    expect(getDemoMdxHref("ko", "use-cases", "1")).toBe(
      "/ko/demo/use-cases/1/allganize-changsu-lee",
    );
    expect(getDemoMdxHrefByCategoryAndId("ja", "webinars", "17")).toBe(
      "/ja/webinars/17/findy-querypie-mcp-webinar",
    );
    expect(getDemoMdxHrefByCategoryAndId("ja", "webinars", "27")).toBe(
      "/ja/webinars/27/air-company-ai-agent-security-webinar",
    );
  });

  it("없는 id는 null을 반환한다", () => {
    expect(getDemoMdxHref("en", "aip", "999")).toBeNull();
  });
});

describe("resolveDemoMdxRoute", () => {
  it("slug 없이 접근해도 canonical 정보만 반환한다", () => {
    expect(resolveDemoMdxRoute("en", "aip", "1")).toEqual({
      canonicalHref: "/demo/aip/1/google-oauth-demo",
      entry: getDemoMdxEntry("aip", "1"),
      shouldRedirect: false,
    });
  });

  it("canonical slug 접근 시에도 같은 canonical 정보를 반환한다", () => {
    expect(resolveDemoMdxRoute("ja", "webinars", "17", ["findy-querypie-mcp-webinar"])).toEqual({
      canonicalHref: "/ja/webinars/17/findy-querypie-mcp-webinar",
      entry: getDemoMdxEntry("webinars", "17"),
      shouldRedirect: false,
    });
  });
});

describe("locale visibility/fallback", () => {
  it("ko가 없는 AIP는 en fallback 기준으로 ko에서 보인다", () => {
    const aip = getDemoMdxEntry("aip", "1");
    expect(aip && isDemoMdxVisibleInLocale(aip, "ko")).toBe(true);
    expect(aip && getDemoMdxLocalizedValue(aip.title, "ko")).toBe("AIP Google OAuth Demo");
  });

  it("en이 없는 webinar는 en 목록에서 제외된다", () => {
    const entry = getDemoMdxEntry("webinars", "16");
    expect(entry).not.toBeNull();
    expect(entry && entry.locales.includes("en")).toBe(false);
    expect(entry && isDemoMdxVisibleInLocale(entry, "en")).toBe(false);
  });

  it("locale별 visible entry가 달라진다", () => {
    expect(getVisibleDemoMdxEntries("en").length).toBeLessThan(demoMdxEntries.length);
    expect(getVisibleDemoMdxEntries("ja").length).toBeGreaterThan(getVisibleDemoMdxEntries("en").length);
    expect(getVisibleDemoMdxEntries("ja").some((entry) => entry.segment === "webinars" && entry.id === "27")).toBe(true);
  });
});

describe("demoMdx image assets", () => {
  it("use-cases thumbnail paths point to existing public files", () => {
    const repoRoot = process.cwd();
    const missing = demoMdxEntries
      .filter((entry) => entry.segment === "use-cases")
      .flatMap((entry) =>
        Object.entries(entry.imageSrc).flatMap(([locale, imageSrc]) => {
          const publicPath = path.join(repoRoot, "public", imageSrc.replace(/^\//, ""));
          return existsSync(publicPath) ? [] : [`${entry.segment}:${entry.id}:${locale}:${imageSrc}`];
        }),
      );

    expect(missing).toEqual([]);
  });
});
