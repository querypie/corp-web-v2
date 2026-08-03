import { describe, expect, it } from "vitest";
import nextConfig from "../../../next.config";
import {
  japaneseRedirectConfig,
  japaneseExactRedirects,
  japaneseFallbackRedirects,
  japaneseRedirects,
  resolveJapaneseRedirectSource,
} from "./jaRedirects";

function expectRedirect(source: string, destination: string) {
  expect(resolveJapaneseRedirectSource(source)).toMatchObject({
    destination: `https://querypie.ai${destination}`,
    permanent: true,
  });
}

describe("japaneseRedirects", () => {
  it("loads the YAML origin and emits permanent redirects", () => {
    expect(japaneseRedirectConfig.destination_origin).toBe("https://querypie.ai");
    expect(japaneseRedirects.every((redirect) => redirect.permanent)).toBe(true);
  });

  it("maps static Japanese routes to QueryPie AI equivalents", () => {
    expectRedirect("/ja", "/");
    expectRedirect("/ja/company/about-us", "/about-us");
    expectRedirect("/ja/solutions/aip", "/platforms/aip");
    expectRedirect("/ja/solutions/aip/fde-services", "/services/fde");
    expectRedirect("/ja/documentation/features/documentation", "/resources");
    expectRedirect("/ja/features/demo", "/use-cases");
    expectRedirect("/ja/demo/use-cases", "/use-cases");
    expectRedirect("/ja/voc", "/use-cases");
    expectRedirect("/ja/apps/slack", "/apps");
    expectRedirect("/ja/community-license", "/platforms/acp");
    expectRedirect("/ja/querypie/license/community/apply", "/contact-us");
    expectRedirect("/ja/plans/acp", "/plans/acp");
    expectRedirect("/ja/privacy-policy", "/privacy-policy");
  });

  it("maps source content slugs to ID-based target content paths", () => {
    expectRedirect("/ja/blog/agentless-philosophy", "/blog/1/agentless-philosophy");
    expectRedirect("/ja/whitepapers/ai-transformation-japan", "/whitepapers/24/ai-transformation-japan");
    expectRedirect("/ja/events/air-company-ai-agent-security-webinar", "/events/27/air-company-ai-agent-security-webinar");
    expectRedirect("/ja/events/air-company-querypie-ai-webinar-3", "/events/21/air-company-querypie-ai-webinar");
    expectRedirect("/ja/events/querypie-side-kick-teaser-ko", "/events");
    expectRedirect("/ja/glossary/glossary-items", "/glossary/1/querypie-ai-glossary");
    expectRedirect("/ja/voc/allganize-changsu-lee", "/use-cases/1/allganize-changsu-lee");
    expectRedirect("/ja/news/querypie-becomes-okta-integration-network-partner-in-korea", "/news/1/okta-integration-network-partner-korea");
  });

  it("maps generic, legacy, and download aliases before family fallbacks", () => {
    expectRedirect("/ja/features/documentation/blog/agentless-philosophy", "/blog/1/agentless-philosophy");
    expectRedirect("/ja/blog/legacy/agentless-philosophy", "/blog/1/agentless-philosophy");
    expectRedirect(
      "/ja/whitepapers/ai-transformation-japan/download",
      "/whitepapers/24/ai-transformation-japan/pdf",
    );
  });

  it("falls back unknown family paths and final unknown Japanese paths", () => {
    expectRedirect("/ja/blog/unknown-source", "/blog");
    expectRedirect("/ja/whitepapers/unknown-source", "/whitepapers");
    expectRedirect("/ja/something/unmapped", "/");
  });

  it("keeps generated sources unique and ordered with exact rules before fallbacks", () => {
    const sources = japaneseRedirects.map((redirect) => redirect.source);
    expect(new Set(sources).size).toBe(sources.length);
    expect(sources.indexOf("/ja/blog/agentless-philosophy")).toBeLessThan(sources.indexOf("/ja/blog/:path*"));
    expect(sources.at(-1)).toBe("/ja/:path*");
    expect(japaneseExactRedirects.length + japaneseFallbackRedirects.length).toBe(japaneseRedirects.length);
    expect(japaneseExactRedirects.every((redirect) => !redirect.source.endsWith(":path*"))).toBe(true);
    expect(japaneseFallbackRedirects.every((redirect) => redirect.source.endsWith(":path*"))).toBe(true);
  });

  it("keeps every Japanese fallback ahead of legacy normalization and stays below the custom-route warning", async () => {
    if (!nextConfig.redirects) {
      throw new Error("next.config redirects are not configured");
    }

    const redirects = await nextConfig.redirects();
    const legacyDownloadIndex = redirects.findIndex(
      (redirect) => redirect.source === "/:locale(en|ko|ja)/blog/:legacyFolder/:slug/pdf",
    );
    const blogFallbackIndex = redirects.findIndex(
      (redirect) => redirect.source === "/ja/blog/:path*",
    );

    expect(blogFallbackIndex).toBeGreaterThanOrEqual(japaneseExactRedirects.length);
    expect(blogFallbackIndex).toBeLessThan(legacyDownloadIndex);
    expect(redirects.length).toBeLessThan(1_000);
  });
});
