import { beforeEach, describe, expect, it, vi } from "vitest";

const requestHeaders = vi.hoisted(() => ({
  current: new Headers(),
}));

vi.mock("next/headers", () => ({
  headers: async () => requestHeaders.current,
}));

import robots from "./robots";

describe("robots sitemap", () => {
  beforeEach(() => {
    requestHeaders.current = new Headers({
      host: "www.querypie.com",
      "x-forwarded-proto": "https",
    });
  });

  it("사이트 종류에 맞는 분리된 sitemap URL을 제공한다", async () => {
    expect((await robots()).sitemap)
      .toBe("https://www.querypie.com/sitemaps/multilingual/sitemap.xml");

    requestHeaders.current = new Headers({
      host: "stage-v2.querypie.ai",
      "x-forwarded-proto": "https",
    });

    expect((await robots()).sitemap)
      .toBe("https://stage-v2.querypie.ai/sitemaps/japanese/sitemap.xml");
  });
});
