import { describe, expect, it } from "vitest";
import { getPlatformHref, getPlatformEntryById, getPlatformEntryBySlug, platformEntries } from "./routes";

describe("platform routes", () => {
  it("locale별 canonical URL을 유지한다", () => {
    expect(getPlatformHref("en", "aip")).toBe("/en/platforms/aip");
    expect(getPlatformHref("ko", "usage-based-llm")).toBe("/ko/platforms/aip/usage-based-llm");
    expect(getPlatformHref("ja", "mcp-gateway")).toBe("/ja/platforms/aip/mcp-gateway");
    expect(getPlatformHref("en", "fde-services")).toBe("/en/platforms/aip/fde-services");
    expect(getPlatformHref("en", "aip-integrations")).toBe("/en/platforms/aip/integrations");
    expect(getPlatformHref("ja", "acp")).toBe("/ja/platforms/acp");
    expect(getPlatformHref("ko", "acp-integrations")).toBe("/ko/platforms/acp/integrations");
  });

  it("등록된 경로를 ID와 slug로 조회한다", () => {
    expect(platformEntries).toHaveLength(7);
    for (const entry of platformEntries) {
      expect(getPlatformEntryById(entry.id)).toEqual(entry);
      expect(getPlatformEntryBySlug(entry.slug)).toEqual(entry);
    }
    expect(getPlatformEntryBySlug(["missing"])).toBeNull();
  });
});
