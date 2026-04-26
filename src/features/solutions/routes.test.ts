import { describe, expect, it } from "vitest";
import {
  getSolutionEntryBySlug,
  getSolutionHref,
  resolveLegacyPlaceholderPath,
  resolveLegacySolutionAlias,
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

describe("resolveLegacyPlaceholderPath", () => {
  it("기존 placeholder path를 새 canonical solutions path로 연결한다", () => {
    expect(resolveLegacyPlaceholderPath("/aip-not-found")).toBe("/solutions/aip");
    expect(resolveLegacyPlaceholderPath("/acp-not-found")).toBe("/solutions/acp");
    expect(resolveLegacyPlaceholderPath("/fdes-not-found")).toBe("/solutions/aip/fde-services");
  });

  it("모르는 placeholder path는 null을 반환한다", () => {
    expect(resolveLegacyPlaceholderPath("/unknown")).toBeNull();
  });
});

describe("resolveLegacySolutionAlias", () => {
  it("AIP alias family를 canonical path로 변환한다", () => {
    expect(resolveLegacySolutionAlias("/platform/ai/aip")).toBe("/solutions/aip");
    expect(resolveLegacySolutionAlias("/platform/ai/aip/mcp-gateway")).toBe(
      "/solutions/aip/mcp-gateway",
    );
  });

  it("ACP alias family를 canonical path로 변환한다", () => {
    expect(resolveLegacySolutionAlias("/products/database-access-controller")).toBe(
      "/solutions/acp/database-access-controller",
    );
    expect(resolveLegacySolutionAlias("/products/web-application-access-controller")).toBe(
      "/solutions/acp/web-access-controller",
    );
    expect(resolveLegacySolutionAlias("/platform/security/system-access-controller")).toBe(
      "/solutions/acp/system-access-controller",
    );
    expect(resolveLegacySolutionAlias("/resources/manage/kubernetes-access-controller")).toBe(
      "/solutions/acp/kubernetes-access-controller",
    );
    expect(resolveLegacySolutionAlias("/resources/integrations")).toBe(
      "/solutions/acp/integrations",
    );
    expect(resolveLegacySolutionAlias("/resources/discover/integrations")).toBe(
      "/solutions/acp/integrations",
    );
  });

  it("지원하지 않는 alias path는 null을 반환한다", () => {
    expect(resolveLegacySolutionAlias("/products/data-discovery")).toBeNull();
    expect(resolveLegacySolutionAlias("/platform/security/missing-controller")).toBeNull();
  });
});
