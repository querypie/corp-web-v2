import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Button from "./Button";

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
    expect(screen.getByRole("button").className).toContain("border-secondary");
  });

  it("type 기본값은 button이다", () => {
    render(<Button>Click</Button>);
    expect(screen.getByRole("button")).toHaveAttribute("type", "button");
  });

  it("size=large이면 h-14 클래스를 적용한다", () => {
    render(<Button size="large">Large</Button>);
    expect(screen.getByRole("button").className).toContain("h-14");
  });

  it("size=small이면 h-8 클래스를 적용한다", () => {
    render(<Button size="small">Small</Button>);
    expect(screen.getByRole("button").className).toContain("h-8");
  });
});
