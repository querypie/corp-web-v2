import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));

import BlogLayout from "./BlogLayout";

describe("BlogLayout", () => {
  it("등록된 author의 locale 이름과 소개 박스를 렌더링한다", async () => {
    const element = await BlogLayout({
      children: <p>본문</p>,
      frontmatter: {
        layout: "Article",
        category: "blog",
        title: "Japanese Author Post",
        date: "2026-01-01",
        author: "terazawa",
      },
      headings: [],
      locale: "ja",
    });

    const { container } = render(element);

    expect(screen.getByRole("heading", { level: 1, name: "Japanese Author Post" })).toBeInTheDocument();
    expect(screen.getAllByText("寺澤慎祐")).toHaveLength(2);
    expect(screen.getByText("著者紹介")).toBeInTheDocument();
    expect(screen.getByText("マーケティングコンサルタント")).toBeInTheDocument();
    expect(screen.getByText(/出現する未来/)).toBeInTheDocument();

    const profileImage = screen.getByAltText("寺澤慎祐");
    expect(profileImage).toHaveAttribute("src", "/crew/terazawa.jpg");

    const linkedInLink = screen.getByRole("link", { name: /LinkedIn/i });
    expect(linkedInLink).toHaveAttribute("href", "https://www.linkedin.com/in/terazawa/");
    expect(linkedInLink).toHaveAttribute("target", "_blank");
    expect(linkedInLink).toHaveAttribute("rel", expect.stringContaining("noopener"));

    expect(container.textContent).toContain("寺澤慎祐");
  });

  it("등록된 author만 소개 박스에 포함하고 헤더는 locale 이름 순서를 유지한다", async () => {
    const element = await BlogLayout({
      children: <p>본문</p>,
      frontmatter: {
        layout: "Article",
        category: "blog",
        title: "Mixed Authors Post",
        date: "2026-01-01",
        author: ["brant", "Jessica Kim", "ravi"],
      },
      headings: [],
      locale: "en",
    });

    render(element);

    expect(screen.getByText("Brant Hwang, Jessica Kim, Ravi Kang")).toBeInTheDocument();
    expect(screen.getByText("About the author")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Brant Hwang" })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Ravi Kang" })).toBeInTheDocument();
    expect(screen.queryByRole("img", { name: "Jessica Kim" })).not.toBeInTheDocument();
  });

  it("등록되지 않은 author만 있으면 소개 박스를 렌더링하지 않는다", async () => {
    const element = await BlogLayout({
      children: <p>본문</p>,
      frontmatter: {
        layout: "Article",
        category: "blog",
        title: "Guest Post",
        date: "2026-01-01",
        author: "Jessica Kim",
      },
      headings: [],
      locale: "en",
    });

    render(element);

    expect(screen.getByText("Jessica Kim")).toBeInTheDocument();
    expect(screen.queryByText("About the author")).not.toBeInTheDocument();
  });
});
