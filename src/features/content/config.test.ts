import { describe, expect, it } from "vitest";
import { getDocumentationSidebarMenuItems } from "./config";

describe("getDocumentationSidebarMenuItems", () => {
  it("blogs 활성 상태에서 Documentation CMS 카테고리 메뉴를 반환한다", () => {
    expect(getDocumentationSidebarMenuItems("ko", "blogs")).toEqual([
      { href: "/ko/features/documentation", isActive: false, kind: "link", label: "전체", slug: "all" },
      {
        href: "/ko/features/documentation?category=introduction",
        isActive: false,
        kind: "link",
        label: "소개",
        slug: "introduction",
      },
      {
        href: "/ko/features/documentation?category=glossary",
        isActive: false,
        kind: "link",
        label: "용어집",
        slug: "glossary",
      },
      {
        href: "/ko/features/documentation?category=manuals",
        isActive: false,
        kind: "link",
        label: "매뉴얼",
        slug: "manuals",
      },
      {
        href: "/ko/features/documentation?category=white-papers",
        isActive: false,
        kind: "link",
        label: "화이트페이퍼",
        slug: "white-papers",
      },
      {
        href: "/ko/features/documentation?category=blogs",
        isActive: true,
        kind: "link",
        label: "블로그",
        slug: "blogs",
      },
    ]);
  });

  it("white-papers 활성 상태에서 Documentation CMS 카테고리 메뉴를 반환한다", () => {
    expect(getDocumentationSidebarMenuItems("en", "white-papers")).toEqual([
      { href: "/en/features/documentation", isActive: false, kind: "link", label: "All", slug: "all" },
      {
        href: "/en/features/documentation?category=introduction",
        isActive: false,
        kind: "link",
        label: "Introduction",
        slug: "introduction",
      },
      {
        href: "/en/features/documentation?category=glossary",
        isActive: false,
        kind: "link",
        label: "Glossary",
        slug: "glossary",
      },
      {
        href: "/en/features/documentation?category=manuals",
        isActive: false,
        kind: "link",
        label: "Manuals",
        slug: "manuals",
      },
      {
        href: "/en/features/documentation?category=white-papers",
        isActive: true,
        kind: "link",
        label: "White Papers",
        slug: "white-papers",
      },
      {
        href: "/en/features/documentation?category=blogs",
        isActive: false,
        kind: "link",
        label: "Blogs",
        slug: "blogs",
      },
    ]);
  });
});
