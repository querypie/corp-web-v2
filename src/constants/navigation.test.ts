import { describe, expect, it } from "vitest";
import { getDemoSubItems, getFooterHref, getResourcesSubItems, getShellMenuCopy, getSolutionsSubItems } from "./navigation";

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

describe("getDemoSubItems", () => {
  it("Demo 메뉴를 CMS demo 경로로 연결한다", () => {
    expect(getDemoSubItems("en")).toEqual([
      { label: "Use Cases", href: "/features/demo?category=use-cases" },
      { label: "AIP Features", href: "/features/demo?category=aip-features" },
      { label: "ACP Features", href: "/features/demo?category=acp-features" },
    ]);
  });

  it("비영어 locale에는 locale prefix를 붙인다", () => {
    expect(getDemoSubItems("ko")).toEqual([
      { label: "Use Cases", href: "/ko/features/demo?category=use-cases" },
      { label: "AIP Features", href: "/ko/features/demo?category=aip-features" },
      { label: "ACP Features", href: "/ko/features/demo?category=acp-features" },
    ]);
  });
});

describe("getResourcesSubItems", () => {
  it("Resources 메뉴를 CMS documentation 경로로 연결한다", () => {
    expect(getResourcesSubItems("en")).toEqual([
      { label: "Introduction", href: "/features/documentation?category=introduction" },
      { label: "Glossary", href: "/features/documentation?category=glossary" },
      { label: "Manuals", href: "/features/documentation?category=manuals" },
      { label: "White Papers", href: "/features/documentation?category=white-papers" },
      { label: "Blog", href: "/features/documentation?category=blogs" },
    ]);
  });

  it("비영어 locale에는 locale prefix를 붙인다", () => {
    expect(getResourcesSubItems("ko")).toEqual([
      { label: "Introduction", href: "/ko/features/documentation?category=introduction" },
      { label: "Glossary", href: "/ko/features/documentation?category=glossary" },
      { label: "Manuals", href: "/ko/features/documentation?category=manuals" },
      { label: "White Papers", href: "/ko/features/documentation?category=white-papers" },
      { label: "Blog", href: "/ko/features/documentation?category=blogs" },
    ]);
  });
});

describe("getShellMenuCopy", () => {
  it("GNB 상위 메뉴를 Solutions / Demo / Resources / Company / Plans 순서로 반환한다", () => {
    expect(getShellMenuCopy("en").navItems).toEqual(["Solutions", "Demo", "Resources", "Company", "Plans"]);
    expect(getShellMenuCopy("ko").navItems).toEqual(["솔루션", "데모", "리소스", "회사", "요금제"]);
    expect(getShellMenuCopy("ja").navItems).toEqual(["ソリューション", "デモ", "リソース", "会社", "プラン"]);
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
