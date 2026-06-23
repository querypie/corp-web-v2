import { describe, expect, it } from "vitest";
import {
  getSolutionEntryById,
  getSolutionEntryBySlug,
  getSolutionHref,
  solutionEntries,
} from "./routes";

describe("solutionEntries", () => {
  it("공개 solution 7개 경로를 유지한다", () => {
    expect(solutionEntries).toHaveLength(7);
  });
});

describe("getSolutionEntryById", () => {
  it("solution id로 canonical entry를 찾는다", () => {
    expect(getSolutionEntryById("aip")?.slug).toEqual(["aip"]);
    expect(getSolutionEntryById("usage-based-llm")?.slug).toEqual(["aip", "usage-based-llm"]);
    expect(getSolutionEntryById("mcp-gateway")?.slug).toEqual(["aip", "mcp-gateway"]);
    expect(getSolutionEntryById("fde-services")?.slug).toEqual(["aip", "fde-services"]);
    expect(getSolutionEntryById("aip-integrations")?.slug).toEqual(["aip", "integrations"]);
    expect(getSolutionEntryById("acp")?.slug).toEqual(["acp"]);
    expect(getSolutionEntryById("acp-integrations")?.slug).toEqual(["acp", "integrations"]);
  });
});

describe("getSolutionEntryBySlug", () => {
  it("AIP slug 경로를 canonical entry로 찾는다", () => {
    expect(getSolutionEntryBySlug(["aip"])?.id).toBe("aip");
  });

  it("AIP 상세 slug 경로를 canonical entry로 찾는다", () => {
    expect(getSolutionEntryBySlug(["aip", "usage-based-llm"])?.id).toBe("usage-based-llm");
    expect(getSolutionEntryBySlug(["aip", "mcp-gateway"])?.id).toBe("mcp-gateway");
    expect(getSolutionEntryBySlug(["aip", "fde-services"])?.id).toBe("fde-services");
    expect(getSolutionEntryBySlug(["aip", "integrations"])?.id).toBe("aip-integrations");
  });

  it("ACP slug 경로를 canonical entry로 찾는다", () => {
    expect(getSolutionEntryBySlug(["acp"])?.id).toBe("acp");
    expect(getSolutionEntryBySlug(["acp", "integrations"])?.id).toBe("acp-integrations");
  });

  it("없는 slug는 null을 반환한다", () => {
    expect(getSolutionEntryBySlug(["missing"])).toBeNull();
  });
});

describe("getSolutionHref", () => {
  it("locale별 canonical href를 생성한다", () => {
    expect(getSolutionHref("en", "aip")).toBe("/en/solutions/aip");
    expect(getSolutionHref("ko", "usage-based-llm")).toBe("/ko/solutions/aip/usage-based-llm");
    expect(getSolutionHref("ja", "mcp-gateway")).toBe("/ja/solutions/aip/mcp-gateway");
    expect(getSolutionHref("en", "fde-services")).toBe("/en/solutions/aip/fde-services");
    expect(getSolutionHref("en", "aip-integrations")).toBe("/en/solutions/aip/integrations");
    expect(getSolutionHref("ja", "acp")).toBe("/ja/solutions/acp");
    expect(getSolutionHref("ko", "acp-integrations")).toBe("/ko/solutions/acp/integrations");
  });
});
