import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import PlansPage from "./PlansPage";

describe("PlansPage", () => {
  it.each(["en", "ko", "ja"] as const)("shows ACP before AIP and selects ACP by default in %s", (locale) => {
    render(<PlansPage locale={locale} />);

    const productLinks = screen.getAllByRole("link", { name: /^QueryPie (ACP|AIP)$/ });

    expect(productLinks.map((link) => link.textContent)).toEqual(["QueryPie ACP", "QueryPie AIP"]);
    expect(productLinks[0]).toHaveAttribute("href", `/${locale}/plans/acp`);
    expect(productLinks[0]).toHaveAttribute("aria-current", "page");
    expect(productLinks[1]).not.toHaveAttribute("aria-current");
  });

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

  it.each([
    ["en", "Free", "$50/mo/user", "Let's Talk"],
    ["ko", "무료", "$50/월/사용자", "별도 문의"],
    ["ja", "$0/月", "$50/人・月", "個別見積もり"],
  ] as const)("preserves ACP card prices and omits unused comparison prices in %s", (locale, community, standard, enterprise) => {
    const { container } = render(<PlansPage locale={locale} productKey="acp" />);

    expect(screen.getByText(community)).toBeInTheDocument();
    expect(screen.getByText(standard)).toBeInTheDocument();
    expect(screen.getByText(enterprise)).toBeInTheDocument();
    expect(container.querySelectorAll("article")).toHaveLength(3);
    expect(container).not.toHaveTextContent(/\$(?:29|590|650)\//);
    expect(container).not.toHaveTextContent(/productKey|pricingProductsByLocale/);
  });

  it.each([
    ["en", "Monthly Billing", "$650/month", "Custom Pricing"],
    ["ko", "월간 요금", "$650/월", "별도 문의"],
    ["ja", "料金", "$650/月", "カスタム価格 (年間契約)"],
  ] as const)("renders only current AIP comparison prices in %s", (locale, label, business, enterprise) => {
    render(<PlansPage locale={locale} productKey="aip" />);

    const priceRow = screen.getByText(label).parentElement;

    expect(priceRow).toHaveTextContent(business);
    expect(priceRow).toHaveTextContent(enterprise);
    expect(priceRow?.children).toHaveLength(3);
    expect(screen.queryByText(/\$20(?:\/| per)/)).not.toBeInTheDocument();
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
