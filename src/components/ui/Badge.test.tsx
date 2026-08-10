import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Badge from "@/components/ui/Badge";

describe("Badge", () => {
  it("단일 크기와 secondary variant를 사용한다", () => {
    render(<Badge>Badge</Badge>);
    const badge = screen.getByText("Badge");
    expect(badge.className).toContain("h-[26px]");
    expect(badge.className).toContain("px-[10px]");
    expect(badge.className).toContain("type-body-sm");
    expect(badge.className).toContain("bg-secondary");
  });

  it("primary variant는 공용 primary 색상 토큰을 사용한다", () => {
    render(<Badge variant="primary">Primary</Badge>);
    expect(screen.getByText("Primary").className).toContain("bg-primary");
    expect(screen.getByText("Primary").className).toContain("text-bg");
  });

  it("brand variant는 브랜드 색상 토큰을 사용한다", () => {
    render(<Badge variant="brand">Brand</Badge>);
    expect(screen.getByText("Brand").className).toContain("bg-brand");
    expect(screen.getByText("Brand").className).toContain("text-on-brand");
  });

  it("outline variant는 공용 border와 bg 토큰을 사용한다", () => {
    render(<Badge variant="outline">Outline</Badge>);
    expect(screen.getByText("Outline").className).toContain("border-border");
    expect(screen.getByText("Outline").className).toContain("bg-bg");
  });
});
