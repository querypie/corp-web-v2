import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Button from "@/components/ui/Button";

describe("Button", () => {
  it("기본 텍스트로 렌더링된다", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole("button", { name: /Click me/ })).toBeInTheDocument();
  });

  it("children이 없으면 기본값 'Button'을 표시한다", () => {
    render(<Button />);
    expect(screen.getByRole("button", { name: /Button/ })).toBeInTheDocument();
  });

  it("arrow=true이면 SVG 아이콘을 렌더링한다", () => {
    const { container } = render(<Button arrow={true}>With Arrow</Button>);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("arrow=false이면 SVG 아이콘을 렌더링하지 않는다", () => {
    const { container } = render(<Button arrow={false}>No Arrow</Button>);
    expect(container.querySelector("svg")).not.toBeInTheDocument();
  });

  it("disabled이면 버튼이 비활성화된다", () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("disabled이면 disable 상태 스타일을 적용한다", () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByRole("button").className).toContain("opacity-40");
  });

  it("variant=primary이면 primary 배경 클래스를 적용한다", () => {
    render(<Button variant="primary">Primary</Button>);
    expect(screen.getByRole("button").className).toContain("bg-primary");
  });

  it("variant=outline이면 border 클래스를 적용한다", () => {
    render(<Button variant="outline">Outline</Button>);
    expect(screen.getByRole("button").className).toContain("border");
    expect(screen.getByRole("button").className).toContain("border-border");
    expect(screen.getByRole("button").className).toContain("hover:bg-secondary");
  });

  it("outline hover 상태에는 secondary 배경을 적용한다", () => {
    render(<Button state="hover" variant="outline">Outline hover</Button>);
    expect(screen.getByRole("button").className).toContain("bg-secondary");
  });

  it("type 기본값은 button이다", () => {
    render(<Button>Click</Button>);
    expect(screen.getByRole("button")).toHaveAttribute("type", "button");
  });

  it("href가 있으면 동일한 스타일의 링크로 렌더링된다", () => {
    render(<Button href="/demo">View demo</Button>);
    const link = screen.getByRole("link", { name: /View demo/ });
    expect(link).toHaveAttribute("href", "/demo");
    expect(link.className).toContain("bg-secondary");
  });

  it("링크 버튼이 disabled이면 href를 제거한다", () => {
    render(<Button disabled href="/demo">View demo</Button>);
    const link = screen.getByText("View demo").closest("a");
    expect(link).not.toHaveAttribute("href");
    expect(link).toHaveAttribute("aria-disabled", "true");
  });

  it("size=large이면 h-12 클래스를 적용한다", () => {
    render(<Button size="large">Large</Button>);
    expect(screen.getByRole("button").className).toContain("h-12");
  });

  it("size=small이면 위아래 여백을 1px씩 늘린 34px 높이를 적용한다", () => {
    render(<Button size="small">Small</Button>);
    expect(screen.getByRole("button").className).toContain("h-[34px]");
  });

  it("size=xsmall이면 Figma xsmall 크기와 sm 텍스트를 적용한다", () => {
    render(<Button size="xsmall">XSmall</Button>);
    expect(screen.getByRole("button").className).toContain("h-[26px]");
    expect(screen.getByRole("button").className).toContain("px-2");
    expect(screen.getByRole("button").className).toContain("type-body-sm");
  });

  it("round 버튼만 좌우 패딩을 줄이고 full 버튼은 기존 패딩을 유지한다", () => {
    const { rerender } = render(<Button size="default" style="round">Round</Button>);
    expect(screen.getByRole("button").className).toContain("px-4");

    rerender(<Button size="default" style="full">Full</Button>);
    expect(screen.getByRole("button").className).toContain("px-5");
  });
});
