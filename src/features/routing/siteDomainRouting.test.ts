import { unstable_getResponseFromNextConfig } from "next/experimental/testing/server";
import { describe, expect, it } from "vitest";
import nextConfig from "../../../next.config";
import { getPublicSitePathname, getSiteSitemapLocales } from "./siteDomainRouting";

describe("site domain routing", () => {
  it("selects Japanese-only or English/Korean sitemap locales by hostname", () => {
    expect(getSiteSitemapLocales("stage-v2.querypie.ai")).toEqual(["ja"]);
    expect(getSiteSitemapLocales("www.querypie.com")).toEqual(["en", "ko"]);
  });

  it("일본어 사이트의 내부 locale 경로만 공개 경로로 정규화한다", () => {
    expect(getPublicSitePathname("stage-v2.querypie.ai", "/ja/about-us"))
      .toBe("/about-us");
    expect(getPublicSitePathname("stage-v2.querypie.com", "/ja/about-us"))
      .toBe("/ja/about-us");
  });

  it.each(["querypie.ai", "stage-v2.querypie.ai", "preview.branch.querypie.ai"])(
    "%s renders public paths in Japanese without changing the URL",
    async (host) => {
      const response = await unstable_getResponseFromNextConfig({
        url: `https://${host}/about-us`,
        nextConfig,
      });

      expect(response.headers.get("location")).toBeNull();
      expect(response.headers.get("x-middleware-rewrite")).toBe(`https://${host}/ja/about-us`);
    },
  );

  it("normalizes locale-prefixed Japanese URLs without changing the hostname", async () => {
    const response = await unstable_getResponseFromNextConfig({
      url: "https://www.querypie.ai/en/about-us?utm_source=test",
      nextConfig,
    });

    expect(response.status).toBe(308);
    expect(response.headers.get("location")).toBe("https://www.querypie.ai/about-us?utm_source=test");
  });

  it.each(["www.querypie.com", "querypie.ai.example.com"])(
    "%s uses the multilingual URL structure",
    async (host) => {
      const response = await unstable_getResponseFromNextConfig({
        url: `https://${host}/about-us`,
        nextConfig,
      });

      expect(response.headers.get("location")).toBe(`https://${host}/en/about-us`);
    },
  );

  it("does not apply public-site routing to API paths", async () => {
    const response = await unstable_getResponseFromNextConfig({
      url: "https://stage-v2.querypie.ai/api/language-suggestion",
      nextConfig,
    });

    expect(response.headers.get("location")).toBeNull();
    expect(response.headers.get("x-middleware-rewrite")).toBeNull();
  });
});
