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
  it("사이드바에 CMS 카테고리 링크를 렌더링한다", () => {
    render(
      <DocsListPage
        items={[
          {
            category: "Manuals",
            description: "desc",
            href: "/en/features/documentation/item-1",
            imageSrc: "/documentation/item-1/thumbnail.png",
            title: "Item 1",
          },
        ]}
        locale="en"
        menu={[
          { href: "/en/features/documentation", isActive: true, kind: "link", label: "All", slug: "all" },
          {
            href: "/en/features/documentation?category=manuals",
            isActive: false,
            kind: "link",
            label: "Manuals",
            slug: "manuals",
          },
        ]}
        title="Documentation"
      />,
    );

    expect(screen.getByRole("heading", { name: "Documentation" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "All" })).toHaveAttribute("href", "/en/features/documentation");
    expect(screen.getByRole("link", { name: "Manuals" })).toHaveAttribute("href", "/en/features/documentation?category=manuals");
    expect(screen.queryByText("MDX")).not.toBeInTheDocument();
  });
});
