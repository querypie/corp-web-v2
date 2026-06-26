import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import TextButton from "./TextButton";

describe("TextButton", () => {
  it("기본으로 more 텍스트 버튼 스타일과 화살표 아이콘을 렌더링한다", () => {
    const { container } = render(<TextButton>More</TextButton>);
    expect(screen.getByRole("button", { name: /More/ }).className).toContain("text-brand");
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("href가 있으면 링크로 렌더링된다", () => {
    render(<TextButton href="/demo">Demo</TextButton>);
    expect(screen.getByRole("link", { name: /Demo/ })).toHaveAttribute("href", "/demo");
  });
});
