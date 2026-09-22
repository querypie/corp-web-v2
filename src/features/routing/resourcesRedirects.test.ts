import { unstable_getResponseFromNextConfig } from "next/experimental/testing/server";
import { describe, expect, it } from "vitest";
import nextConfig from "../../../next.config";

describe("리소스 URL 이전", () => {
  it.each([
    ["/documentation", "/resources"],
    ["/ko/documentation?category=blogs", "/ko/resources?category=blogs"],
    ["/en/documentation/guide/download", "/en/resources/guide/download"],
    ["/documentation/white-papers/sample.pdf", "/resources/white-papers/sample.pdf"],
    ["/documentation/blogs/image.webp", "/resources/blogs/image.webp"],
    ["/admin/documentation/blogs/cnt_000001", "/admin/resources/blogs/cnt_000001"],
    ["/ja/features/documentation/guide", "/ja/features/resources/guide"],
  ])("%s → %s", async (source, destination) => {
    const origin = "https://www.querypie.com";
    const response = await unstable_getResponseFromNextConfig({ url: origin + source, nextConfig });
    expect(response.status).toBe(308);
    expect(response.headers.get("location")).toBe(origin + destination);
  });
});
