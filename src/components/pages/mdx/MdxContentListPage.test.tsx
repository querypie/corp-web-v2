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
  it("사이드바 메뉴와 2열 목록용 카드/페이지네이션을 함께 렌더링한다", () => {
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
          { href: "/features/documentation", isActive: false, label: "All" },
          { href: "/white-papers", isActive: false, label: "White Papers" },
          { href: "/blog", isActive: true, label: "Blogs" },
        ]}
        nextHref="/blog?page=3"
        previousHref="/blog"
        title="Blog"
        totalPages={4}
      />,
    );

    expect(screen.getByRole("heading", { name: "Blog" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "All" })).toHaveAttribute(
      "href",
      "/features/documentation",
    );
    expect(screen.getByRole("link", { name: "White Papers" })).toHaveAttribute(
      "href",
      "/white-papers",
    );
    expect(screen.getByRole("link", { name: "Blogs" })).toHaveAttribute("href", "/blog");
    expect(screen.getByRole("link", { name: /Post 1/ })).toHaveAttribute("href", "/blog/1");
    expect(screen.getByRole("link", { name: "Previous Page" })).toHaveAttribute("href", "/blog");
    expect(screen.getByRole("link", { name: "Next Page" })).toHaveAttribute("href", "/blog?page=3");
  });
});