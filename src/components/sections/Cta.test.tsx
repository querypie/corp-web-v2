import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Cta from "./Cta";

describe("Cta", () => {
  it("renders the shared primary and secondary actions by default", () => {
    render(<Cta locale="ko" />);

    expect(screen.getByRole("link", { name: "Agentic AI Platform" })).toHaveAttribute(
      "href",
      "https://app.querypie.com/",
    );
    expect(screen.getByRole("link", { name: "ACP Community Edition" })).toHaveAttribute(
      "href",
      "https://docs.querypie.com/ko/installation/querypie-acp-community-edition",
    );
  });

  it("allows pages to hide the secondary action explicitly", () => {
    render(<Cta secondaryActionLabel="" />);

    expect(screen.queryByRole("link", { name: "ACP Community Edition" })).not.toBeInTheDocument();
  });
});
