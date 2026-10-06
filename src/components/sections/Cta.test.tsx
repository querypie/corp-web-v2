import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Cta from "./Cta";

describe("Cta", () => {
  it.each(["en", "ko", "ja"] as const)("renders the CTA actions in the expected order for %s", (locale) => {
    render(<Cta locale={locale} />);

    expect(screen.getAllByRole("link").map((link) => link.textContent)).toEqual(
      locale === "ja"
        ? ["Agentic AI Platform", "ACP Community Edition"]
        : ["ACP Community Edition", "Agentic AI Platform"],
    );
    expect(screen.getByRole("link", { name: "ACP Community Edition" })).toHaveAttribute(
      "href",
      `https://docs.querypie.com/${locale}/installation/querypie-acp-community-edition`,
    );
    expect(screen.getByRole("link", { name: "Agentic AI Platform" })).toHaveAttribute(
      "href",
      "https://app.querypie.com/",
    );
  });

  it("renders the shared primary and secondary actions by default", () => {
    const { container } = render(<Cta locale="ko" />);

    expect(container.querySelector("section")).toHaveClass(
      "pb-5",
      "pt-10",
      "md:pb-10",
      "md:pt-20",
    );

    expect(screen.getByRole("link", { name: "Agentic AI Platform" })).toHaveAttribute(
      "href",
      "https://app.querypie.com/",
    );
    expect(screen.getByRole("link", { name: "ACP Community Edition" })).toHaveAttribute(
      "href",
      "https://docs.querypie.com/ko/installation/querypie-acp-community-edition",
    );
    expect(
      screen.queryByText("Sign up in seconds and secure your 14-day free trial now."),
    ).not.toBeInTheDocument();
  });

  it("allows pages to hide the secondary action explicitly", () => {
    render(<Cta secondaryActionLabel="" />);

    expect(screen.queryByRole("link", { name: "ACP Community Edition" })).not.toBeInTheDocument();
  });

  it("allows pages to hide the eyebrow explicitly", () => {
    render(<Cta hideEyebrow locale="ja" title="相談する" />);

    expect(screen.queryByText("考え続けるのをやめて。")).not.toBeInTheDocument();
    expect(screen.getByText("相談する")).toBeInTheDocument();
  });
});
