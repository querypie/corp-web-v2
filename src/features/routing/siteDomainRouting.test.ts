import { unstable_getResponseFromNextConfig } from "next/experimental/testing/server";
import { describe, expect, it } from "vitest";
import nextConfig from "../../../next.config";

describe("site domain routing", () => {
  it.each(["querypie.ai", "stage-v2.querypie.ai", "preview.branch.querypie.ai"])(
    "%s renders public paths in Japanese without changing the URL",
    async (host) => {
      const response = await unstable_getResponseFromNextConfig({
        url: `https://${host}/company/about-us`,
        nextConfig,
      });

      expect(response.headers.get("location")).toBeNull();
      expect(response.headers.get("x-middleware-rewrite")).toBe(`https://${host}/ja/company/about-us`);
    },
  );

  it("normalizes locale-prefixed Japanese URLs without changing the hostname", async () => {
    const response = await unstable_getResponseFromNextConfig({
      url: "https://www.querypie.ai/en/company/about-us?utm_source=test",
      nextConfig,
    });

    expect(response.status).toBe(308);
    expect(response.headers.get("location")).toBe("https://www.querypie.ai/company/about-us?utm_source=test");
  });

  it.each(["www.querypie.com", "querypie.ai.example.com"])(
    "%s uses the multilingual URL structure",
    async (host) => {
      const response = await unstable_getResponseFromNextConfig({
        url: `https://${host}/company/about-us`,
        nextConfig,
      });

      expect(response.headers.get("location")).toBe(`https://${host}/en/company/about-us`);
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
