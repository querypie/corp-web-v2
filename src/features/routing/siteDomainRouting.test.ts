import { unstable_getResponseFromNextConfig } from "next/experimental/testing/server";
import { describe, expect, it } from "vitest";
import nextConfig from "../../../next.config";
import { getPublicSitePathname, getSiteSitemapLocales } from "./siteDomainRouting";

describe("site domain routing", () => {
  it.each(["querypie.com", "www.querypie.com"])(
    "%s의 일본어 홈과 하위 경로를 쿼리를 유지하며 일본 도메인으로 영구 이동한다",
    async (host) => {
      for (const [path, destination] of [
        ["/ja", "/"],
        ["/ja/about-us?utm_source=test", "/about-us?utm_source=test"],
        ["/ja/platforms/aip?utm_campaign=japan", "/platforms/aip?utm_campaign=japan"],
      ]) {
        const response = await unstable_getResponseFromNextConfig({
          url: `https://${host}${path}`,
          nextConfig,
        });

        expect(response.status).toBe(308);
        expect(response.headers.get("location")).toBe(`https://querypie.ai${destination}`);
      }
    },
  );

  it("끝에 슬래시가 있는 일본어 홈은 정규화 후 일본 도메인으로 이동한다", async () => {
    const response = await unstable_getResponseFromNextConfig({
      url: "https://querypie.com/ja/?utm_source=test",
      nextConfig,
    });
    expect(response.status).toBe(308);
    expect(response.headers.get("location")).toBe("https://querypie.com/ja?utm_source=test");

    const destination = await unstable_getResponseFromNextConfig({
      url: response.headers.get("location")!,
      nextConfig,
    });
    expect(destination.status).toBe(308);
    expect(destination.headers.get("location")).toBe("https://querypie.ai/?utm_source=test");

    const japaneseHome = await unstable_getResponseFromNextConfig({
      url: destination.headers.get("location")!,
      nextConfig,
    });
    expect(japaneseHome.headers.get("location")).toBeNull();
    expect(japaneseHome.headers.get("x-middleware-rewrite")).toBe("https://querypie.ai/ja?utm_source=test");
  });

  it.each([
    "stage.querypie.com",
    "stage-v2.querypie.com",
    "branch.vercel.app",
    "localhost:3000",
    "querypie.com.example.com",
  ])("%s의 일본어 경로는 운영 일본 도메인으로 이동하지 않는다", async (host) => {
    const response = await unstable_getResponseFromNextConfig({
      url: `https://${host}/ja/about-us`,
      nextConfig,
    });

    expect(response.headers.get("location")).toBeNull();
  });

  it.each(["en", "ko"])("운영 .com의 %s 경로는 유지한다", async (locale) => {
    const response = await unstable_getResponseFromNextConfig({
      url: `https://www.querypie.com/${locale}/about-us`,
      nextConfig,
    });

    expect(response.headers.get("location")).toBeNull();
  });

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
