import { unstable_getResponseFromNextConfig } from "next/experimental/testing/server";
import { describe, expect, it } from "vitest";
import nextConfig from "../../../next.config";

describe("일본 사이트 도메인 라우팅", () => {
  it.each([
    ["/ja", "/"],
    ["/en", "/"],
    ["/ko", "/"],
    ["/en/contact-us?utm_source=test", "/contact-us?utm_source=test"],
    ["/ko/demo/aip", "/demo/aip"],
    ["/ja/solutions/ai-crew", "/solutions/ai-crew"],
  ])("일본 도메인 %s → %s", async (path, destination) => {
    for (const host of ["querypie.ai", "www.querypie.ai"]) {
      const response = await unstable_getResponseFromNextConfig({
        url: `https://${host}${path}`,
        nextConfig,
        cookies: { querypie_locale_preference: "ko" },
        headers: { "accept-language": "en-US" },
      });
      expect(response.status).toBe(308);
      expect(response.headers.get("location")).toBe(`https://${host}${destination}`);
    }
  });

  it.each(["/", "/solutions/ai-crew", "/api/language-suggestion", "/admin", "/_next/static/app.js", "/assets/logo.svg", "/robots.txt"])("%s는 일본어 리디렉션을 적용하지 않는다", async (path) => {
    const response = await unstable_getResponseFromNextConfig({ url: `https://querypie.ai${path}`, nextConfig });
    expect(response.headers.get("location")).toBeNull();
  });

  it.each([
    ["/", "/ja"],
    ["/solutions/ai-crew?utm_source=test", "/ja/solutions/ai-crew?utm_source=test"],
  ])("일본 도메인 %s는 주소를 바꾸지 않고 %s를 렌더링한다", async (path, internalPath) => {
    for (const host of ["querypie.ai", "www.querypie.ai"]) {
      const response = await unstable_getResponseFromNextConfig({ url: `https://${host}${path}`, nextConfig });
      expect(response.headers.get("location")).toBeNull();
      expect(response.headers.get("x-middleware-rewrite")).toBe(`https://${host}${internalPath}`);
    }
  });

  it.each(["www.querypie.com", "stage-v2.querypie.com", "localhost:3000", "querypiexai"])("다른 호스트 %s의 기본 경로는 영어로 이동한다", async (host) => {
    const response = await unstable_getResponseFromNextConfig({ url: `https://${host}/contact-us`, nextConfig });
    expect(response.headers.get("location")).toBe(`https://${host}/en/contact-us`);
  });
});

describe("공개 AI Chat 진단 경로", () => {
  it.each(["www.querypie.com", "stage-v2.querypie.com", "preview.vercel.app", "querypie.ai", "www.querypie.ai", "localhost:3000"])("%s에서 진단 페이지를 locale 경로로 보내지 않는다", async (host) => {
    const response = await unstable_getResponseFromNextConfig({ url: `https://${host}/internal/ai-chat-status`, nextConfig });
    expect(response.headers.get("location")).toBeNull();
    expect(response.headers.get("x-middleware-rewrite")).toBeNull();
  });
  it("다른 internal 경로는 기존 공개 경로 규칙을 유지한다", async () => {
    const response = await unstable_getResponseFromNextConfig({ url: "https://www.querypie.com/internal/unknown", nextConfig });
    expect(response.headers.get("location")).toBe("https://www.querypie.com/en/internal/unknown");
  });
});
