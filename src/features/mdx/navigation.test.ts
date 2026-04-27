import { describe, expect, it } from "vitest";
import { getMdxSidebarMenuItems } from "./navigation";

describe("getMdxSidebarMenuItems", () => {
  it("white-paper 목록은 CMS/MDX 섹션을 함께 노출하고 MDX whitepapers를 활성화한다", () => {
    const items = getMdxSidebarMenuItems("white-paper", "en");

    expect(items.map((item) => (item.kind === "separator" ? "separator" : item.label))).toEqual([
      "CMS",
      "All",
      "Introduction",
      "Glossary",
      "Manuals",
      "White Papers",
      "Blogs",
      "separator",
      "MDX",
      "White Papers",
      "Blogs",
    ]);
    expect(items.find((item) => item.kind === "link" && item.label === "White Papers" && item.href === "/whitepapers")).toMatchObject({
      href: "/whitepapers",
      isActive: true,
    });
    expect(items.find((item) => item.kind === "link" && item.label === "Blogs" && item.href === "/blog")).toMatchObject({
      href: "/blog",
      isActive: false,
    });
  });

  it("blog 목록은 blog MDX 링크만 활성화하고 CMS 링크는 그대로 유지한다", () => {
    const items = getMdxSidebarMenuItems("blog", "ko");

    expect(items.find((item) => item.kind === "link" && item.label === "Blogs" && item.href === "/ko/blog")).toMatchObject({
      href: "/ko/blog",
      isActive: true,
    });
    expect(items.find((item) => item.kind === "link" && item.label === "Manuals" && item.href === "/ko/features/documentation?category=manuals")).toMatchObject({
      href: "/ko/features/documentation?category=manuals",
      isActive: false,
    });
  });
});