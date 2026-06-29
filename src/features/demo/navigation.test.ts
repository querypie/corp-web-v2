import { describe, expect, it } from "vitest";
import { getDemoSidebarMenuItems } from "./navigation";

describe("getDemoSidebarMenuItems", () => {
  it("Demo CMS 카테고리 메뉴를 반환한다", () => {
    expect(getDemoSidebarMenuItems("en", "use-cases")).toEqual([
      { href: "/en/demo", isActive: false, kind: "link", label: "All", slug: "all" },
      {
        href: "/en/demo/use-cases",
        isActive: true,
        kind: "link",
        label: "Use Cases",
        slug: "use-cases",
      },
      {
        href: "/en/demo/aip",
        isActive: false,
        kind: "link",
        label: "AIP Features",
        slug: "aip-features",
      },
      {
        href: "/en/demo/acp",
        isActive: false,
        kind: "link",
        label: "ACP Features",
        slug: "acp-features",
      },
    ]);
  });

  it("locale에 맞는 Demo 카테고리 라벨을 반환한다", () => {
    expect(getDemoSidebarMenuItems("ja", "acp-features")).toEqual([
      { href: "/ja/demo", isActive: false, kind: "link", label: "すべて", slug: "all" },
      {
        href: "/ja/demo/use-cases",
        isActive: false,
        kind: "link",
        label: "ユースケース",
        slug: "use-cases",
      },
      {
        href: "/ja/demo/aip",
        isActive: false,
        kind: "link",
        label: "AIP機能",
        slug: "aip-features",
      },
      {
        href: "/ja/demo/acp",
        isActive: true,
        kind: "link",
        label: "ACP機能",
        slug: "acp-features",
      },
    ]);
  });
});
