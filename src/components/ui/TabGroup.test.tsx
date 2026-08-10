import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import TabGroup from "@/components/ui/TabGroup";

describe("TabGroup", () => {
  it("renders a transparent capsule with a border", () => {
    render(
      <TabGroup>
        <span>Tab content</span>
      </TabGroup>,
    );

    const group = screen.getByText("Tab content").parentElement?.parentElement;

    expect(group).toHaveClass("rounded-full", "border", "border-border", "bg-transparent");
    expect(group).not.toHaveClass("bg-tab-group");
  });
});
