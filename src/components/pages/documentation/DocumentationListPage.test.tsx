import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import DocsListPage from "./DocumentationListPage";

vi.mock("../../common/ContentPreviewImage", () => ({
  default: ({ alt, src }: { alt: string; src: string }) => <img alt={alt} src={src} />,
}));

vi.mock("../../sections/Cta", () => ({
  default: () => <div data-testid="cta" />,
}));

describe("DocsListPage", () => {
  it("사이드바에 CMS/MDX 섹션 구분과 링크를 함께 렌더링한다", () => {
    render(
      <DocsListPage
        items={[
          {
            category: "Manuals",
            description: "desc",
            href: "/features/documentation/item-1",
            imageSrc: "/documentation/item-1/thumbnail.png",
            title: "Item 1",
          },
        ]}
        locale="en"
        menu={[
          { kind: "section", label: "CMS" },
          { href: "/features/documentation", isActive: true, kind: "link", label: "All", slug: "all" },
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
            href: "/whitepapers",
            isActive: false,
            kind: "link",
            label: "White Papers",
            slug: "white-papers",
          },
          { href: "/blog", isActive: false, kind: "link", label: "Blogs", slug: "blogs" },
        ]}
        title="Documentation"
      />,
    );

    expect(screen.getByRole("heading", { name: "Documentation" })).toBeInTheDocument();
    expect(screen.getByText("CMS")).toBeInTheDocument();
    expect(screen.getByText("MDX")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "All" })).toHaveAttribute("href", "/features/documentation");
    expect(screen.getByRole("link", { name: "White Papers" })).toHaveAttribute("href", "/whitepapers");
    expect(screen.getByRole("separator")).toBeInTheDocument();
  });
});
