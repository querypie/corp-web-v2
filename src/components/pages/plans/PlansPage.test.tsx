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

  it("keeps the ACP tab on the standard plans route for enterprise AIP content", () => {
    render(
      <PlansPage
        enterpriseOnly
        locale="en"
        productKey="aip"
      />,
    );

    expect(screen.getByRole("link", { name: "QueryPie AIP" })).toHaveAttribute(
      "href",
      "/en/plans/aip",
    );
    expect(screen.getByRole("link", { name: "QueryPie ACP" })).toHaveAttribute(
      "href",
      "/en/plans/acp",
    );
  });
});
