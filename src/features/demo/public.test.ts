import { describe, expect, it } from "vitest";
import { getPublicDemoListItems } from "./public";

describe("getPublicDemoListItems", () => {
  it("webinars list item은 /webinars canonical href를 사용한다", () => {
    const items = getPublicDemoListItems("ja", "webinars");
    const webinar17 = items.find((item) => item.title.includes("Findy") || item.href.includes("/webinars/17/"));

    expect(items.length).toBeGreaterThan(0);
    expect(webinar17?.href).toBe("/ja/webinars/17/findy-querypie-mcp-webinar");
  });
});
