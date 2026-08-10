import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Button from "./Button";
import ButtonGroup from "./ButtonGroup";

describe("ButtonGroup", () => {
  it("나란히 배치된 버튼에 기본 10px 간격을 적용한다", () => {
    render(
      <ButtonGroup aria-label="Actions">
        <Button>Cancel</Button>
        <Button>Save</Button>
      </ButtonGroup>,
    );

    expect(screen.getByLabelText("Actions")).toHaveClass("flex", "gap-2.5");
  });

  it("레이아웃 확장 클래스를 함께 적용한다", () => {
    render(<ButtonGroup aria-label="Actions" className="flex-col sm:flex-row" />);

    expect(screen.getByLabelText("Actions")).toHaveClass("gap-2.5", "flex-col", "sm:flex-row");
  });
});
