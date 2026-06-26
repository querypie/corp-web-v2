import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import PaginationNav from "./PaginationNav";

describe("PaginationNav", () => {
  it("이전/다음 페이지 링크와 현재 페이지 정보를 렌더링한다", () => {
    render(
      <PaginationNav
        currentPage={2}
        locale="en"
        nextHref="/blog?page=3"
        previousHref="/blog"
        totalPages={4}
      />,
    );

    expect(screen.getByRole("link", { name: "Previous Page" })).toHaveAttribute("href", "/blog");
    expect(screen.getByRole("link", { name: "Next Page" })).toHaveAttribute("href", "/blog?page=3");
    expect(screen.getByText("2 / 4")).toBeInTheDocument();
  });

  it("이전/다음 페이지가 없으면 해당 링크를 숨긴다", () => {
    render(<PaginationNav currentPage={1} locale="ko" totalPages={1} />);

    expect(screen.queryByRole("link", { name: "이전 페이지" })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "다음 페이지" })).not.toBeInTheDocument();
    expect(screen.getByText("1 / 1")).toBeInTheDocument();
  });
});
