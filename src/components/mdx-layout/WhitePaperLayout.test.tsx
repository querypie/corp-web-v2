import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));

import WhitePaperLayout from "./WhitePaperLayout";

describe("WhitePaperLayout", () => {
  it("등록된 author 카드를 제목 바로 아래에 렌더링한다", async () => {
    const element = await WhitePaperLayout({
      children: <p>본문</p>,
      frontmatter: {
        layout: "Article",
        category: "white-paper",
        title: "Korean White Paper",
        date: "2026-01-01",
        author: "brant",
      },
      headings: [],
      locale: "ko",
    });

    render(element);

    const title = screen.getByRole("heading", { level: 1, name: "Korean White Paper" });
    const articleAuthorBox = screen.getByLabelText("ko-article-author-box");
    const date = screen.getByText("2026년 1월 1일");

    expect(screen.getByText("Brant Hwang")).toBeInTheDocument();
    expect(screen.getByText(/브랜트는 QueryPie의 창립자이자 CEO/)).toBeInTheDocument();
    expect(title.compareDocumentPosition(articleAuthorBox) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(articleAuthorBox.compareDocumentPosition(date) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });
});
