import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import PlansPage from "./PlansPage";

describe("PlansPage", () => {
  it("renders the AIP and ACP product switcher as locale-aware links", () => {
    render(<PlansPage locale="en" productKey="aip" />);

    const aipLink = screen.getByRole("link", { name: "QueryPie AIP" });

    expect(aipLink).toHaveAttribute(
      "href",
      "/en/plans/aip",
    );
    expect(aipLink).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "QueryPie ACP" })).toHaveAttribute(
      "href",
      "/en/plans/acp",
    );
  });

  it("renders every standard AIP plan", () => {
    render(<PlansPage locale="en" productKey="aip" />);

    expect(screen.getByText("Collaborate and innovate together")).toBeInTheDocument();
    expect(screen.getByText("Enterprise power unleashed")).toBeInTheDocument();
  });

  it("renders comparison group headlines with contrasting text on the primary background", () => {
    render(<PlansPage locale="en" productKey="aip" />);

    expect(screen.getByText("General")).toHaveClass(
      "bg-primary",
      "py-1.5",
      "type-body-sm",
      "text-bg",
    );
    expect(screen.getByText("General")).not.toHaveClass("theme-dark");
  });
});
