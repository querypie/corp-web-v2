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

import sitemap from "./sitemap";

describe("sitemap route", () => {
  beforeEach(() => {
    requestHeaders.current = new Headers({
      host: "www.querypie.com",
      "x-forwarded-proto": "https",
    });
  });

  it("다국어 사이트에서는 영어와 한국어 URL만 노출한다", async () => {
    const urls = (await sitemap()).map((entry) => entry.url);

    expect(urls).toContain("https://www.querypie.com/en");
    expect(urls).toContain("https://www.querypie.com/ko");
    expect(urls).not.toContain("https://www.querypie.com/ja");
    expect(urls).not.toContain("https://www.querypie.com/ja/solutions/as400-cobol");
  });

  it("일본어 전용 사이트에서는 일본어 URL만 노출한다", async () => {
    requestHeaders.current = new Headers({
      host: "stage-v2.querypie.ai",
      "x-forwarded-proto": "https",
    });

    const urls = (await sitemap()).map((entry) => entry.url);

    expect(urls).toContain("https://stage-v2.querypie.ai/");
    expect(urls).toContain("https://stage-v2.querypie.ai/solutions/as400-cobol");
    expect(urls.every((url) => !new URL(url).pathname.startsWith("/ja"))).toBe(true);
  });
});
