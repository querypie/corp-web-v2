import { describe, expect, it } from "vitest";
import { getDocumentationSidebarMenuItems } from "./config";

describe("getDocumentationSidebarMenuItems", () => {
  it("documentation 페이지에서는 CMS 섹션 6개 링크와 MDX 섹션 2개 링크를 함께 반환한다", () => {
    const items = getDocumentationSidebarMenuItems("en", { activeSlug: "manuals" });

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

    const cmsWhitePapers = items.find(
      (item) => item.kind === "link" && item.label === "White Papers" && item.href.includes("category=white-papers"),
    );
    const mdxWhitePapers = items.find(
      (item) => item.kind === "link" && item.label === "White Papers" && item.href === "/whitepapers",
    );

    expect(cmsWhitePapers).toMatchObject({ isActive: false });
    expect(mdxWhitePapers).toMatchObject({ isActive: false });
    expect(items.find((item) => item.kind === "link" && item.label === "Manuals")).toMatchObject({
      href: "/features/documentation?category=manuals",
      isActive: true,
    });
  });

  it("MDX 페이지에서는 CMS 링크는 유지하고 MDX 섹션 링크만 활성화한다", () => {
    const items = getDocumentationSidebarMenuItems("ko", { activeMdxSlug: "blogs" });

    expect(items.find((item) => item.kind === "link" && item.label === "Blogs" && item.href === "/ko/blog")).toMatchObject({
      isActive: true,
    });
    expect(
      items.find(
        (item) =>
          item.kind === "link" &&
          item.label === "Blogs" &&
          item.href === "/ko/features/documentation?category=blogs",
      ),
    ).toMatchObject({ isActive: false });
  });
});
