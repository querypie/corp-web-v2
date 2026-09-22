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

  it("모든 사이트에서 현재 host의 canonical sitemap URL을 제공한다", async () => {
    expect((await robots()).sitemap)
      .toBe("https://www.querypie.com/sitemap.xml");

    requestHeaders.current = new Headers({
      host: "stage-v2.querypie.ai",
      "x-forwarded-proto": "https",
    });

    expect((await robots()).sitemap)
      .toBe("https://stage-v2.querypie.ai/sitemap.xml");
  });
});
