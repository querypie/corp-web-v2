import { describe, expect, it } from "vitest";
import { getMdxSidebarMenuItems } from "./navigation";

describe("getMdxSidebarMenuItems", () => {
  it("white-paper 목록은 documentation 사이드바 라벨을 유지하면서 whitepapers를 활성화한다", () => {
    const items = getMdxSidebarMenuItems("white-paper", "en");

    expect(items.map((item) => item.label)).toEqual([
      "All",
      "Introduction",
      "Glossary",
      "Manuals",
      "White Papers",
      "Blogs",
    ]);
    expect(items.find((item) => item.label === "White Papers")).toMatchObject({
      href: "/whitepapers",
      isActive: true,
    });
    expect(items.find((item) => item.label === "Blogs")).toMatchObject({
      href: "/blog",
      isActive: false,
    });
  });

  it("blog 목록은 blogs를 활성화하고 나머지 documentation 카테고리 href를 유지한다", () => {
    const items = getMdxSidebarMenuItems("blog", "ko");

    expect(items.find((item) => item.label === "Blogs")).toMatchObject({
      href: "/ko/blog",
      isActive: true,
    });
    expect(items.find((item) => item.label === "Manuals")).toMatchObject({
      href: "/ko/features/documentation?category=manuals",
      isActive: false,
    });
  });
});