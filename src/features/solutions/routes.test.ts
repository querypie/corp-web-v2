import { describe, expect, it } from "vitest";
import {
  getSolutionEntryBySlug,
  getSolutionHref,
  solutionEntries,
} from "./routes";

describe("solutionEntries", () => {
  it("legacy canonical solutions 11개 경로를 모두 유지한다", () => {
    expect(solutionEntries).toHaveLength(11);
  });
});

describe("getSolutionEntryBySlug", () => {
  it("AIP slug 경로를 canonical entry로 찾는다", () => {
    expect(getSolutionEntryBySlug(["aip"])?.id).toBe("aip");
    expect(getSolutionEntryBySlug(["aip", "integrations"])?.id).toBe("aip-integrations");
  });

  it("ACP slug 경로를 canonical entry로 찾는다", () => {
    expect(getSolutionEntryBySlug(["acp"])?.id).toBe("acp");
    expect(getSolutionEntryBySlug(["acp", "web-access-controller"])?.id).toBe(
      "acp-web-access-controller",
    );
  });

  it("없는 slug는 null을 반환한다", () => {
    expect(getSolutionEntryBySlug(["missing"])).toBeNull();
  });
});

describe("getSolutionHref", () => {
  it("locale별 canonical href를 생성한다", () => {
    expect(getSolutionHref("en", "aip")).toBe("/solutions/aip");
    expect(getSolutionHref("ko", "aip-fde-services")).toBe("/ko/solutions/aip/fde-services");
    expect(getSolutionHref("ja", "acp-integrations")).toBe("/ja/solutions/acp/integrations");
  });
});
