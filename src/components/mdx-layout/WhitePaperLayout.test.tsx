import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));

import WhitePaperLayout from "./WhitePaperLayout";

describe("WhitePaperLayout", () => {
  it("등록된 author의 locale 소개 박스를 함께 렌더링한다", async () => {
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

    expect(screen.getAllByText("Brant Hwang")).toHaveLength(2);
    expect(screen.getByText("작성자 소개")).toBeInTheDocument();
    expect(screen.getByText(/브랜트는 QueryPie의 창립자이자 CEO/)).toBeInTheDocument();
  });
});
