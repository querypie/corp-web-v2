import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Cta from "./Cta";

describe("Cta", () => {
  it("내부 문의 링크는 현재 탭에서 열고 외부 문서는 새 탭에서 연다", () => {
    render(<Cta actionHref="/ja/contact-us?inquiry=ai-consulting&product=penetrationtest" actionLabel="문의하기" locale="ja" />);
    const internal = screen.getByRole("link", { name: "문의하기" });
    expect(internal).not.toHaveAttribute("target");
    expect(internal).not.toHaveAttribute("rel");
    const external = screen.getByRole("link", { name: "ACP Community Edition" });
    expect(external).toHaveAttribute("target", "_blank");
    expect(external).toHaveAttribute("rel", "noreferrer noopener");
  });

  it("보조 내부 링크도 현재 탭에서 연다", () => {
    render(<Cta secondaryActionHref="/ja/demo/aip" secondaryActionLabel="데모" />);
    expect(screen.getByRole("link", { name: "데모" })).not.toHaveAttribute("target");
    expect(screen.getByRole("link", { name: "Agentic AI Platform" })).toHaveAttribute("target", "_blank");
  });

  it.each(["https://app.querypie.com/", "http://example.com", "//docs.querypie.com/guide"])("외부 URL %s는 새 탭에서 연다", (href) => {
    render(<Cta actionHref={href} actionLabel="외부" secondaryActionLabel="" />);
    expect(screen.getByRole("link", { name: "외부" })).toHaveAttribute("target", "_blank");
  });

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
