import { describe, expect, it } from "vitest";
import { getMdxSidebarMenuItems } from "./navigation";

describe("getMdxSidebarMenuItems", () => {
  it("white-paper 목록은 CMS/MDX 섹션형 documentation 사이드바를 유지하면서 whitepapers를 활성화한다", () => {
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
      { kind: "divider" },
      { kind: "section", label: "MDX" },
      { href: "/whitepapers", isActive: true, kind: "link", label: "White Papers", slug: "white-papers" },
      { href: "/blog", isActive: false, kind: "link", label: "Blogs", slug: "blogs" },
    ]);
  });

  it("blog 목록은 blogs를 활성화하고 CMS 카테고리 href를 유지한다", () => {
    const items = getMdxSidebarMenuItems("blog", "ko");

    expect(items.find((item) => item.kind === "link" && item.label === "Blogs")).toMatchObject({
      href: "/ko/blog",
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
