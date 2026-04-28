import { describe, expect, it } from "vitest";
import { getMdxSidebarMenuItems } from "./navigation";

describe("getMdxSidebarMenuItems", () => {
  it("white-paper 목록은 CMS/MDX 섹션을 유지하고 두 섹션 모두에 White Papers/Blogs를 노출한다", () => {
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
      { kind: "divider" },
      { kind: "section", label: "MDX" },
      { href: "/whitepapers", isActive: true, kind: "link", label: "White Papers", slug: "white-papers" },
      { href: "/blog", isActive: false, kind: "link", label: "Blogs", slug: "blogs" },
    ]);
  });

  it("blog 목록은 CMS의 blogs 링크와 MDX의 blog 링크가 각각 유지된다", () => {
    const items = getMdxSidebarMenuItems("blog", "ko");

    expect(items.find((item) => item.kind === "link" && item.label === "Blogs" && item.href === "/ko/features/documentation?category=blogs")).toMatchObject({
      isActive: true,
      kind: "link",
      label: "Blogs",
    });
    expect(items.find((item) => item.kind === "link" && item.label === "Blogs" && item.href === "/ko/blog")).toMatchObject({
      isActive: true,
      kind: "link",
      label: "Blogs",
    });
  });
});
