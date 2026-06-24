import { describe, expect, it } from "vitest";
import { getDemoSidebarMenuItems } from "./navigation";

describe("getDemoSidebarMenuItems", () => {
  it("Demo CMS 카테고리 메뉴를 반환한다", () => {
    expect(getDemoSidebarMenuItems("en", "use-cases")).toEqual([
      { href: "/en/features/demo", isActive: false, kind: "link", label: "All", slug: "all" },
      {
        href: "/en/features/demo?category=use-cases",
        isActive: true,
        kind: "link",
        label: "Use Cases",
        slug: "use-cases",
      },
      {
        href: "/en/features/demo?category=aip-features",
        isActive: false,
        kind: "link",
        label: "AIP Features",
        slug: "aip-features",
      },
      {
        href: "/en/features/demo?category=acp-features",
        isActive: false,
        kind: "link",
        label: "ACP Features",
        slug: "acp-features",
      },
      {
        href: "/en/features/demo?category=webinars",
        isActive: false,
        kind: "link",
        label: "Webinars",
        slug: "webinars",
      },
    ]);
  });

  it("locale에 맞는 Demo 카테고리 라벨을 반환한다", () => {
    expect(getDemoSidebarMenuItems("ja", "webinars")).toEqual([
      { href: "/ja/features/demo", isActive: false, kind: "link", label: "すべて", slug: "all" },
      {
        href: "/ja/features/demo?category=use-cases",
        isActive: false,
        kind: "link",
        label: "ユースケース",
        slug: "use-cases",
      },
      {
        href: "/ja/features/demo?category=aip-features",
        isActive: false,
        kind: "link",
        label: "AIP機能",
        slug: "aip-features",
      },
      {
        href: "/ja/features/demo?category=acp-features",
        isActive: false,
        kind: "link",
        label: "ACP機能",
        slug: "acp-features",
      },
      {
        href: "/ja/features/demo?category=webinars",
        isActive: true,
        kind: "link",
        label: "ウェビナー",
        slug: "webinars",
      },
    ]);
  });
});
