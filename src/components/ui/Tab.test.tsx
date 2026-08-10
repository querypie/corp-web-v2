import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Tab, { TabLink } from "@/components/ui/Tab";

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
    expect(btn).toHaveClass("bg-secondary", "text-fg", "hover:bg-secondary-hover");
  });

  it("state=off 이면 비활성 스타일 클래스를 적용한다", () => {
    render(<Tab state="off">Inactive</Tab>);
    const btn = screen.getByRole("button");
    expect(btn).toHaveClass("bg-transparent", "text-fg", "hover:bg-secondary");
    expect(btn).not.toHaveClass("text-mute");
  });

  it("state=hover 이면 secondary 캡슐 스타일을 적용한다", () => {
    render(<Tab state="hover">Hovered</Tab>);

    expect(screen.getByRole("button")).toHaveClass("rounded-full", "bg-secondary", "text-fg");
  });

  it("disabled이면 버튼이 비활성화되고 off 스타일을 적용한다", () => {
    render(<Tab disabled state="on">Disabled</Tab>);
    const btn = screen.getByRole("button");
    expect(btn).toBeDisabled();
    // disabled 시 state=on이어도 off 스타일로 처리
    expect(btn).not.toHaveClass("bg-secondary");
  });

  it("className prop을 추가 클래스로 적용한다", () => {
    render(<Tab className="my-custom-class">Custom</Tab>);
    expect(screen.getByRole("button").className).toContain("my-custom-class");
  });

  it("type 기본값은 button이다", () => {
    render(<Tab>Click</Tab>);
    expect(screen.getByRole("button")).toHaveAttribute("type", "button");
  });

  it("link tab reuses the button tab visual classes", () => {
    render(
      <>
        <Tab className="shrink-0" state="off">Button tab</Tab>
        <TabLink className="shrink-0" href="/plans/acp" state="off">Link tab</TabLink>
      </>,
    );

    expect(screen.getByRole("link", { name: "Link tab" })).toHaveClass(
      ...screen.getByRole("button", { name: "Button tab" }).className.split(" "),
    );
  });
});
