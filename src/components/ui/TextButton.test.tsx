import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import TextButton from "./TextButton";

describe("TextButton", () => {
  it("기본으로 more 텍스트 버튼 스타일과 화살표 아이콘을 렌더링한다", () => {
    const { container } = render(<TextButton>More</TextButton>);
    const button = screen.getByRole("button", { name: /More/ });

    expect(button).toHaveClass("text-brand");
    expect(button).not.toHaveClass("hover:text-fg");
    expect(screen.getByText("More")).toHaveClass("group-hover:underline");
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("hover 상태에서도 브랜드 컬러를 유지하고 언더라인을 표시한다", () => {
    render(<TextButton state="hover">More</TextButton>);

    expect(screen.getByRole("button", { name: /More/ })).toHaveClass("text-brand");
    expect(screen.getByText("More")).toHaveClass("underline");
  });

  it("href가 있으면 링크로 렌더링된다", () => {
    render(<TextButton href="/demo">Demo</TextButton>);
    expect(screen.getByRole("link", { name: /Demo/ })).toHaveAttribute("href", "/demo");
  });
});
