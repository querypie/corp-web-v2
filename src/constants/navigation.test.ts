import { describe, expect, it } from "vitest";
import { getFooterHref, getSolutionsSubItems } from "./navigation";

describe("getSolutionsSubItems", () => {
  it("Solutions 메뉴를 canonical solutions 경로로 연결한다", () => {
    expect(getSolutionsSubItems("en")).toEqual([
      { label: "AI Platform (AIP)", href: "/solutions/aip" },
      { label: "Access Control Platform (ACP)", href: "/solutions/acp" },
      { label: "Forward Deployed Engineer Service (FDES)", href: "/solutions/aip/fde-services" },
    ]);
  });

  it("비영어 locale에는 locale prefix를 붙인다", () => {
    expect(getSolutionsSubItems("ko")[0]?.href).toBe("/ko/solutions/aip");
    expect(getSolutionsSubItems("ja")[2]?.href).toBe("/ja/solutions/aip/fde-services");
  });
});

describe("getFooterHref", () => {
  it("footer solutions 링크도 canonical solutions 경로를 사용한다", () => {
    expect(getFooterHref("AI Platform (AIP)", "en")).toBe("/solutions/aip");
    expect(getFooterHref("Access Control Platform (ACP)", "ko")).toBe("/ko/solutions/acp");
    expect(getFooterHref("Forward Deployed Engineer Service (FDES)", "ja")).toBe(
      "/ja/solutions/aip/fde-services",
    );
  });
});
