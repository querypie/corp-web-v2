import { describe, expect, it } from "vitest";
import { getAdminSectionMenuItems, getResourcesSidebarMenuItems } from "./config";

describe("getAdminSectionMenuItems", () => {
  it("Demo CMS 메뉴에는 AIP/ACP Use Cases만 노출한다", () => {
    expect(getAdminSectionMenuItems("demo")).toEqual([
      { href: "/admin/demo/aip-features", label: "AIP Use Cases", slug: "aip-features" },
      { href: "/admin/demo/acp-features", label: "ACP Use Cases", slug: "acp-features" },
    ]);
  });
});

describe("getResourcesSidebarMenuItems", () => {
  it("blogs 활성 상태에서 Resources CMS 카테고리 메뉴를 반환한다", () => {
    expect(getResourcesSidebarMenuItems("ko", "blogs")).toEqual([
      { href: "/ko/resources", isActive: false, kind: "link", label: "전체", slug: "all" },
      {
        href: "/ko/introduction-deck",
        isActive: false,
        kind: "link",
        label: "제품 소개",
        slug: "introduction",
      },
      {
        href: "/ko/glossary",
        isActive: false,
        kind: "link",
        label: "용어집",
        slug: "glossary",
      },
      {
        href: "/ko/manuals",
        isActive: false,
        kind: "link",
        label: "매뉴얼",
        slug: "manuals",
      },
      {
        href: "/ko/whitepapers",
        isActive: false,
        kind: "link",
        label: "화이트페이퍼",
        slug: "white-papers",
      },
      {
        href: "/ko/blog",
        isActive: true,
        kind: "link",
        label: "블로그",
        slug: "blogs",
      },
      {
        href: "/ko/voc",
        isActive: false,
        kind: "link",
        label: "고객의 목소리",
        slug: "voc",
      },
      {
        href: "/ko/events",
        isActive: false,
        kind: "link",
        label: "이벤트",
        slug: "events",
      },
    ]);
  });

  it("white-papers 활성 상태에서 Resources CMS 카테고리 메뉴를 반환한다", () => {
    expect(getResourcesSidebarMenuItems("en", "white-papers")).toEqual([
      { href: "/en/resources", isActive: false, kind: "link", label: "All", slug: "all" },
      {
        href: "/en/introduction-deck",
        isActive: false,
        kind: "link",
        label: "Introduction Decks",
        slug: "introduction",
      },
      {
        href: "/en/glossary",
        isActive: false,
        kind: "link",
        label: "Glossary",
        slug: "glossary",
      },
      {
        href: "/en/manuals",
        isActive: false,
        kind: "link",
        label: "Manuals",
        slug: "manuals",
      },
      {
        href: "/en/whitepapers",
        isActive: true,
        kind: "link",
        label: "White Papers",
        slug: "white-papers",
      },
      {
        href: "/en/blog",
        isActive: false,
        kind: "link",
        label: "Blog",
        slug: "blogs",
      },
      {
        href: "/en/voc",
        isActive: false,
        kind: "link",
        label: "VOC",
        slug: "voc",
      },
      {
        href: "/en/events",
        isActive: false,
        kind: "link",
        label: "Events",
        slug: "events",
      },
    ]);
  });

  it("공개 게시물이 있는 Resources 카테고리만 메뉴에 노출한다", () => {
    expect(getResourcesSidebarMenuItems("ko", "all", ["blogs", "events"])).toEqual([
      { href: "/ko/resources", isActive: true, kind: "link", label: "전체", slug: "all" },
      {
        href: "/ko/blog",
        isActive: false,
        kind: "link",
        label: "블로그",
        slug: "blogs",
      },
      {
        href: "/ko/events",
        isActive: false,
        kind: "link",
        label: "이벤트",
        slug: "events",
      },
    ]);
  });
});
