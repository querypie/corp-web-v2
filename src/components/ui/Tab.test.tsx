import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
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
    expect(btn).not.toBeDisabled();
    expect(btn).toHaveClass("cursor-default", "bg-secondary", "text-fg");
    expect(btn).not.toHaveClass("pointer-events-none");
    expect(btn).not.toHaveClass("hover:bg-secondary-hover", "hover:bg-bg-content");
  });

  it("선택된 button tab은 바깥 클릭을 무시하지만 내부 컨트롤은 조작할 수 있다", () => {
    const onTabClick = vi.fn();
    const onCheckboxChange = vi.fn();

    render(
      <Tab onClick={onTabClick} state="on">
        Active
        <input aria-label="노출" onChange={onCheckboxChange} onClick={(event) => event.stopPropagation()} type="checkbox" />
      </Tab>,
    );

    fireEvent.click(screen.getByRole("button", { name: /Active/ }));
    expect(onTabClick).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole("checkbox", { name: "노출" }));
    expect(onCheckboxChange).toHaveBeenCalledTimes(1);
    expect(onTabClick).not.toHaveBeenCalled();
  });

  it("state=off 이면 비활성 스타일 클래스를 적용한다", () => {
    render(<Tab state="off">Inactive</Tab>);
    const btn = screen.getByRole("button");
    expect(btn).toHaveClass("bg-transparent", "text-mute", "hover:text-fg");
    expect(btn).not.toBeDisabled();
    expect(btn).not.toHaveClass("hover:bg-bg-content");
  });

  it("state=hover 이면 배경 변화 없이 전경색을 적용한다", () => {
    render(<Tab state="hover">Hovered</Tab>);

    expect(screen.getByRole("button")).toHaveClass("rounded-full", "bg-transparent", "text-fg");
    expect(screen.getByRole("button")).not.toHaveClass("bg-bg-content");
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

  it("선택된 link tab은 클릭과 키보드 포커스를 막는다", () => {
    const onClick = vi.fn();

    render(
      <TabLink href="/plans/aip" onClick={onClick} state="on">
        Active link tab
      </TabLink>,
    );
    const link = screen.getByRole("link", { name: "Active link tab" });

    expect(link).toHaveAttribute("aria-disabled", "true");
    expect(link).toHaveAttribute("tabindex", "-1");
    expect(link).toHaveClass("pointer-events-none", "cursor-default");
    fireEvent.click(link);
    expect(onClick).not.toHaveBeenCalled();
  });
});
