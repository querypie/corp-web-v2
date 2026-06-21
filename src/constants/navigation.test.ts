import { describe, expect, it } from "vitest";
import {
  getDemoSubItems,
  getFeaturesSubItems,
  getFooterHref,
  getResourcesSubItems,
  getShellMenuCopy,
  getSolutionsSubItems,
} from "./navigation";

describe("getSolutionsSubItems", () => {
  it("Solutions 메뉴를 canonical solutions 경로로 연결한다", () => {
    expect(getSolutionsSubItems("en")).toEqual([
      { label: "AI Platform (AIP)", href: "/solutions/aip" },
      { label: "Access Control Platform (ACP)", href: "/solutions/acp" },
    ]);
  });

  it("비영어 locale에는 locale prefix를 붙인다", () => {
    expect(getSolutionsSubItems("ko")).toEqual([
      { label: "AI 플랫폼 (AIP)", href: "/ko/solutions/aip" },
      { label: "접근 제어 플랫폼 (ACP)", href: "/ko/solutions/acp" },
    ]);
    expect(getSolutionsSubItems("ja")).toEqual([
      { label: "AIプラットフォーム (AIP)", href: "/ja/solutions/aip" },
      { label: "アクセス制御プラットフォーム (ACP)", href: "/ja/solutions/acp" },
    ]);
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

describe("getFeaturesSubItems", () => {
  it("Features 메뉴를 Demo / Documentation 목록 경로로 연결한다", () => {
    expect(getFeaturesSubItems("en")).toEqual([
      { label: "Demo", href: "/features/demo" },
      { label: "Documentation", href: "/features/documentation" },
    ]);
  });

  it("비영어 locale에는 locale prefix를 붙인다", () => {
    expect(getFeaturesSubItems("ko")).toEqual([
      { label: "데모", href: "/ko/features/demo" },
      { label: "문서", href: "/ko/features/documentation" },
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
  it("GNB 상위 메뉴를 Solutions / Features / Company / Plans 순서로 반환한다", () => {
    expect(getShellMenuCopy("en").navItems).toEqual(["Solutions", "Features", "Company", "Plans"]);
    expect(getShellMenuCopy("ko").navItems).toEqual(["솔루션", "기능", "회사", "가격 · 플랜"]);
    expect(getShellMenuCopy("ja").navItems).toEqual(["ソリューション", "機能", "会社", "価格・プラン"]);
  });

  it("GNB CTA 라벨을 locale별로 반환한다", () => {
    expect(getShellMenuCopy("en").navActionLabel).toBe("Free start!");
    expect(getShellMenuCopy("ko").navActionLabel).toBe("무료로 시작하기");
    expect(getShellMenuCopy("ja").navActionLabel).toBe("無料で始める");
  });

  it("푸터 메뉴를 locale별로 반환한다", () => {
    expect(getShellMenuCopy("ko").footerSections).toEqual([
      { title: "솔루션", items: ["AI 플랫폼 (AIP)", "접근 제어 플랫폼 (ACP)"] },
      { title: "기능", items: ["데모", "문서", "AIP 시작하기", "AIP 문서", "ACP 커뮤니티 에디션", "ACP 문서"] },
      { title: "회사", items: ["회사 소개", "인증", "뉴스", "문의하기"] },
      { title: "가격 · 플랜", items: ["AIP", "ACP"] },
    ]);
    expect(getShellMenuCopy("ja").footerSections).toEqual([
      { title: "ソリューション", items: ["AIプラットフォーム (AIP)", "アクセス制御プラットフォーム (ACP)"] },
      { title: "機能", items: ["デモ", "ドキュメント", "AIPを始める", "AIP ドキュメント", "ACP コミュニティエディション", "ACP ドキュメント"] },
      { title: "会社", items: ["会社概要", "認証", "ニュース", "お問い合わせ"] },
      { title: "価格・プラン", items: ["AIP", "ACP"] },
    ]);
  });
});

describe("getFooterHref", () => {
  it("footer solutions 링크도 canonical solutions 경로를 사용한다", () => {
    expect(getFooterHref("AI Platform (AIP)", "en")).toBe("/solutions/aip");
    expect(getFooterHref("접근 제어 플랫폼 (ACP)", "ko")).toBe("/ko/solutions/acp");
    expect(getFooterHref("AIプラットフォーム (AIP)", "ja")).toBe("/ja/solutions/aip");
  });

  it("다국어 footer feature 링크를 올바른 대상에 연결한다", () => {
    expect(getFooterHref("데모", "ko")).toBe("/ko/features/demo");
    expect(getFooterHref("ドキュメント", "ja")).toBe("/ja/features/documentation");
    expect(getFooterHref("AIP 시작하기", "ko")).toBe("https://app.querypie.com/");
    expect(getFooterHref("AIPを始める", "ja")).toBe("https://app.querypie.com/");
    expect(getFooterHref("ACP 커뮤니티 에디션", "ko")).toBe(
      "https://docs.querypie.com/ko/installation/querypie-acp-community-edition",
    );
    expect(getFooterHref("ACP ドキュメント", "ja")).toBe("https://docs.querypie.com/ko");
  });
});
