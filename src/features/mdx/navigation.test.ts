import { describe, expect, it } from "vitest";
import { getMdxSidebarMenuItems } from "./navigation";

describe("getMdxSidebarMenuItems", () => {
  it("white-paper 목록은 CMS 섹션 아래에 documentation 카테고리 전체를 CMS href 순서대로 유지한다", () => {
    const items = getMdxSidebarMenuItems("white-paper", "en");

    expect(items).toEqual([
      { kind: "section", label: "CMS" },
      { href: "/features/documentation", isActive: false, kind: "link", label: "All", slug: "all" },
      {
        href: "/features/documentation?category=introduction",
        isActive: false,
        kind: "link",
        label: "Introduction",
        slug: "introduction",
      },
      {
        href: "/features/documentation?category=glossary",
        isActive: false,
        kind: "link",
        label: "Glossary",
        slug: "glossary",
      },
      {
        href: "/features/documentation?category=manuals",
        isActive: false,
        kind: "link",
        label: "Manuals",
        slug: "manuals",
      },
      {
        href: "/features/documentation?category=white-papers",
        isActive: true,
        kind: "link",
        label: "White Papers",
        slug: "white-papers",
      },
      {
        href: "/features/documentation?category=blogs",
        isActive: false,
        kind: "link",
        label: "Blogs",
        slug: "blogs",
      },
    ]);
  });

  it("blog 목록은 blogs를 활성화하되 blogs href도 CMS documentation category 링크를 사용한다", () => {
    const items = getMdxSidebarMenuItems("blog", "ko");

    expect(items.find((item) => item.kind === "link" && item.label === "Blogs")).toMatchObject({
      href: "/ko/features/documentation?category=blogs",
      isActive: true,
      kind: "link",
      label: "Blogs",
    });
    expect(items.find((item) => item.kind === "link" && item.label === "Manuals")).toMatchObject({
      href: "/ko/features/documentation?category=manuals",
      isActive: false,
      kind: "link",
      label: "Manuals",
    });
  });
});
