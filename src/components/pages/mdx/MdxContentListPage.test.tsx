import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import MdxContentListPage from "./MdxContentListPage";

vi.mock("../../common/ContentPreviewImage", () => ({
  default: ({ alt, src }: { alt: string; src: string }) => <img alt={alt} src={src} />,
}));

vi.mock("../../sections/Cta", () => ({
  default: () => <div data-testid="cta" />,
}));

describe("MdxContentListPage", () => {
  it("사이드바에 CMS/MDX 섹션과 중복된 White Papers/Blogs 링크를 함께 렌더링한다", () => {
    render(
      <MdxContentListPage
        currentPage={2}
        items={[
          {
            date: "2026-04-27",
            description: "desc",
            href: "/blog/1",
            imageSrc: "/blog/1/thumbnail.png",
            title: "Post 1",
          },
          {
            date: "2026-04-26",
            description: "desc2",
            href: "/blog/2",
            imageSrc: "/blog/2/thumbnail.png",
            title: "Post 2",
          },
        ]}
        locale="en"
        menu={[
          { kind: "section", label: "CMS" },
          { href: "/features/documentation", isActive: false, kind: "link", label: "All", slug: "all" },
          { href: "/features/documentation?category=introduction", isActive: false, kind: "link", label: "Introduction", slug: "introduction" },
          { href: "/features/documentation?category=glossary", isActive: false, kind: "link", label: "Glossary", slug: "glossary" },
          { href: "/features/documentation?category=manuals", isActive: false, kind: "link", label: "Manuals", slug: "manuals" },
          { href: "/features/documentation?category=white-papers", isActive: false, kind: "link", label: "White Papers", slug: "white-papers" },
          { href: "/features/documentation?category=blogs", isActive: true, kind: "link", label: "Blogs", slug: "blogs" },
          { kind: "divider" },
          { kind: "section", label: "MDX" },
          { href: "/whitepapers", isActive: false, kind: "link", label: "White Papers", slug: "white-papers" },
          { href: "/blog", isActive: true, kind: "link", label: "Blogs", slug: "blogs" },
        ]}
        nextHref="/blog?page=3"
        previousHref="/blog"
        title="Blog"
        totalPages={4}
      />,
    );

    expect(screen.getByRole("heading", { name: "Blog" })).toBeInTheDocument();
    expect(screen.getByText("CMS")).toBeInTheDocument();
    expect(screen.getByText("MDX")).toBeInTheDocument();
    expect(screen.getByRole("separator")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "All" })).toHaveAttribute("href", "/features/documentation");
    expect(screen.getAllByRole("link", { name: "White Papers" })).toHaveLength(2);
    expect(screen.getAllByRole("link", { name: "Blogs" })).toHaveLength(2);
    expect(screen.getByRole("link", { name: /Post 1/ })).toHaveAttribute("href", "/blog/1");
    expect(screen.getByRole("link", { name: "Previous Page" })).toHaveAttribute("href", "/blog");
    expect(screen.getByRole("link", { name: "Next Page" })).toHaveAttribute("href", "/blog?page=3");
  });
});
