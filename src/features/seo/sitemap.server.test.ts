import { beforeEach, describe, expect, it, vi } from "vitest";

const requestHeaders = vi.hoisted(() => ({
  current: new Headers(),
}));

vi.mock("next/headers", () => ({
  headers: async () => requestHeaders.current,
}));

vi.mock("@/features/content/contentState.server", () => ({
  readContentState: async () => [],
}));

import { createSiteSitemap } from "./sitemap.server";

describe("site sitemap", () => {
  beforeEach(() => {
    requestHeaders.current = new Headers({
      host: "www.querypie.com",
      "x-forwarded-proto": "https",
    });
  });

  it("현재 다국어 사이트 origin과 locale 경로를 사용한다", async () => {
    const urls = (await createSiteSitemap(["en", "ko"])).map((entry) => entry.url);

    expect(urls).toContain("https://www.querypie.com/en");
    expect(urls).toContain("https://www.querypie.com/ko");
    expect(urls).not.toContain("https://www.querypie.com/ja");
    expect(urls).not.toContain("https://www.querypie.com/ja/as400-cobol");
    expect(urls).toContain("https://www.querypie.com/ko/ai-gateway");
    expect(urls).toContain("https://www.querypie.com/en/fde-services");
    expect(urls).not.toContain("https://www.querypie.com/en/local-llm");
    expect(urls.some(url => /\/(platforms|solutions)\//.test(url))).toBe(false);
  });

  it("현재 일본어 사이트 origin과 prefix 없는 경로를 사용한다", async () => {
    requestHeaders.current = new Headers({
      host: "stage-v2.querypie.ai",
      "x-forwarded-proto": "https",
    });

    const urls = (await createSiteSitemap(["ja"])).map((entry) => entry.url);

    expect(urls).toContain("https://stage-v2.querypie.ai/");
    expect(urls.every((url) => url.startsWith("https://stage-v2.querypie.ai/"))).toBe(true);
    expect(urls.some((url) => new URL(url).pathname.startsWith("/ja"))).toBe(false);
    expect(urls).toContain("https://stage-v2.querypie.ai/ai-gateway");
    expect(urls).toContain("https://stage-v2.querypie.ai/as400-cobol");
    expect(urls).not.toContain("https://stage-v2.querypie.ai/dlp");
  });
});
