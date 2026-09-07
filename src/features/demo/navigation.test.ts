import { describe, expect, it } from "vitest";
import { getDemoSidebarMenuItems } from "./navigation";

describe("getDemoSidebarMenuItems", () => {
  it("공개 Demo 좌측 메뉴를 locale별 카테고리명으로 반환한다", () => {
    expect(getDemoSidebarMenuItems("en", "all")).toEqual([
      { href: "/en/demo", isActive: true, kind: "link", label: "All", slug: "all" },
      {
        href: "/en/demo/aip",
        isActive: false,
        kind: "link",
        label: "AIP Use Cases",
        slug: "aip-features",
      },
      {
        href: "/en/demo/acp",
        isActive: false,
        kind: "link",
        label: "ACP Use Cases",
        slug: "acp-features",
      },
    ]);
  });

  it("locale에 맞는 Demo 카테고리 라벨을 반환한다", () => {
    expect(getDemoSidebarMenuItems("ja", "acp-features")).toEqual([
      { href: "/ja/demo", isActive: false, kind: "link", label: "すべて", slug: "all" },
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

  it("게시물 수와 관계없이 모든 공개 카테고리를 항상 노출한다", () => {
    expect(getDemoSidebarMenuItems("ko", "all")).toEqual([
      { href: "/ko/demo", isActive: true, kind: "link", label: "전체", slug: "all" },
      {
        href: "/ko/demo/aip",
        isActive: false,
        kind: "link",
        label: "AIP 활용",
        slug: "aip-features",
      },
      {
        href: "/ko/demo/acp",
        isActive: false,
        kind: "link",
        label: "ACP 활용",
        slug: "acp-features",
      },
    ]);
  });
});
