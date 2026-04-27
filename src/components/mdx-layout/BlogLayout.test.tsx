import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));

import BlogLayout from "./BlogLayout";

describe("BlogLayout", () => {
  it("등록된 author 카드를 제목 바로 아래에 렌더링한다", async () => {
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

    render(element);

    const title = screen.getByRole("heading", { level: 1, name: "Japanese Author Post" });
    const authorImage = screen.getByAltText("寺澤慎祐");
    const articleAuthorBox = screen.getByLabelText("ja-article-author-box");
    const date = screen.getByText("2026年1月1日");

    expect(authorImage).toHaveAttribute("src", "/crew/terazawa.jpg");
    expect(screen.getByText("マーケティングコンサルタント")).toBeInTheDocument();
    expect(screen.getByText(/出現する未来/)).toBeInTheDocument();
    expect(title.compareDocumentPosition(articleAuthorBox) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(articleAuthorBox.compareDocumentPosition(date) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();

    const linkedInLink = screen.getByRole("link", { name: /LinkedIn/i });
    expect(linkedInLink).toHaveAttribute("href", "https://www.linkedin.com/in/terazawa/");
    expect(linkedInLink).toHaveAttribute("target", "_blank");
    expect(linkedInLink).toHaveAttribute("rel", expect.stringContaining("noopener"));
  });

  it("등록 여부와 무관하게 author가 있으면 제목 아래 카드 순서를 유지한다", async () => {
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

    expect(screen.getByRole("heading", { level: 1, name: "Mixed Authors Post" })).toBeInTheDocument();
    expect(screen.getByLabelText("en-article-author-box")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Brant Hwang" })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Ravi Kang" })).toBeInTheDocument();
    expect(screen.getByText("Jessica Kim")).toBeInTheDocument();
  });

  it("등록되지 않은 author만 있어도 제목 아래에 author 카드를 렌더링한다", async () => {
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

    const title = screen.getByRole("heading", { level: 1, name: "Guest Post" });
    const articleAuthorBox = screen.getByLabelText("en-article-author-box");

    expect(screen.getByText("Jessica Kim")).toBeInTheDocument();
    expect(title.compareDocumentPosition(articleAuthorBox) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });
});
