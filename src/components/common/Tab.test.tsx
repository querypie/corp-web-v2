import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Tab from "./Tab";

describe("Tab", () => {
  it("기본 텍스트로 렌더링된다", () => {
    render(<Tab>All</Tab>);
    expect(screen.getByRole("button", { name: "All" })).toBeInTheDocument();
  });

  it("children이 없으면 기본값 'Tab'을 표시한다", () => {
    render(<Tab />);
    expect(screen.getByRole("button", { name: "Tab" })).toBeInTheDocument();
  });

  it("state=on 이면 활성 스타일 클래스를 적용한다", () => {
    render(<Tab state="on">Active</Tab>);
    const btn = screen.getByRole("button");
    expect(btn.className).toContain("bg-secondary");
  });

  it("state=off 이면 비활성 스타일 클래스를 적용한다", () => {
    render(<Tab state="off">Inactive</Tab>);
    const btn = screen.getByRole("button");
    expect(btn.className).toContain("bg-transparent");
    expect(btn.className).toContain("text-mute-fg");
  });

  it("disabled이면 버튼이 비활성화되고 off 스타일을 적용한다", () => {
    render(<Tab disabled state="on">Disabled</Tab>);
    const btn = screen.getByRole("button");
    expect(btn).toBeDisabled();
    // disabled 시 state=on이어도 off 스타일로 처리
    expect(btn.className).not.toContain("bg-secondary");
  });

  it("className prop을 추가 클래스로 적용한다", () => {
    render(<Tab className="my-custom-class">Custom</Tab>);
    expect(screen.getByRole("button").className).toContain("my-custom-class");
  });

  it("type 기본값은 button이다", () => {
    render(<Tab>Click</Tab>);
    expect(screen.getByRole("button")).toHaveAttribute("type", "button");
  });
});
