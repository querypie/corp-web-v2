import { describe, expect, it } from "vitest";
import { getDocumentationSidebarMenuItems } from "./config";

describe("getDocumentationSidebarMenuItems", () => {
  it("blogs 활성 상태에서도 CMS/MDX 섹션과 각 링크를 모두 유지한다", () => {
    expect(getDocumentationSidebarMenuItems("ko", "blogs")).toEqual([
      { kind: "section", label: "CMS" },
      { href: "/ko/features/documentation", isActive: false, kind: "link", label: "All", slug: "all" },
      {
        href: "/ko/features/documentation?category=introduction",
        isActive: false,
        kind: "link",
        label: "Introduction",
        slug: "introduction",
      },
      {
        href: "/ko/features/documentation?category=glossary",
        isActive: false,
        kind: "link",
        label: "Glossary",
        slug: "glossary",
      },
      {
        href: "/ko/features/documentation?category=manuals",
        isActive: false,
        kind: "link",
        label: "Manuals",
        slug: "manuals",
      },
      { kind: "divider" },
      { kind: "section", label: "MDX" },
      {
        href: "/ko/features/documentation?category=white-papers",
        isActive: false,
        kind: "link",
        label: "White Papers",
        slug: "white-papers",
      },
      { href: "/ko/features/documentation?category=blogs", isActive: true, kind: "link", label: "Blogs", slug: "blogs" },
    ]);
  });

  it("white-papers 활성 상태에서도 CMS/MDX 섹션과 각 링크를 모두 유지한다", () => {
    expect(getDocumentationSidebarMenuItems("en", "white-papers")).toEqual([
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
      {
        href: "/features/documentation?category=white-papers",
        isActive: true,
        kind: "link",
        label: "White Papers",
        slug: "white-papers",
      },
      { href: "/features/documentation?category=blogs", isActive: false, kind: "link", label: "Blogs", slug: "blogs" },
    ]);
  });
});
