import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { getShellMenuCopy } from "@/constants/navigation";
import Footer from "./Footer";

describe("Footer", () => {
  it("Demo를 독립 섹션으로 노출하고 기존 기능 링크를 자료 섹션에 합친다", () => {
    const copy = getShellMenuCopy("ko");

    render(
      <Footer
        legalLinks={copy.footerLegalLinks}
        locale="ko"
        sections={copy.footerSections}
      />,
    );

    expect(screen.getByText("데모")).toBeInTheDocument();
    expect(screen.getByText("자료")).toBeInTheDocument();
    expect(screen.queryByText("기능")).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "AIP 활용" })).toHaveAttribute("href", "/ko/demo/aip");
    expect(screen.getByRole("link", { name: "ACP 활용" })).toHaveAttribute("href", "/ko/demo/acp");
    expect(screen.getByRole("link", { name: "제품 소개" })).toHaveAttribute("href", "/ko/introduction-deck");
    expect(screen.queryByRole("link", { name: "데모" })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "문서" })).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "AIP 시작하기" })).toHaveAttribute("href", "https://app.querypie.com/");
    expect(screen.queryByRole("combobox", { name: "컬러 테마 선택" })).not.toBeInTheDocument();
  });

  it("locale별 공개 메뉴 노출 규칙을 적용한다", () => {
    const englishCopy = getShellMenuCopy("en");
    const { rerender } = render(
      <Footer locale="en" sections={englishCopy.footerSections} />,
    );

    expect(screen.queryByRole("link", { name: "Workplace Productivity | AI Crew" })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "AI for Your Service | AI Dashi" })).not.toBeInTheDocument();
    expect(screen.getByText("Plans")).toBeInTheDocument();

    const japaneseCopy = getShellMenuCopy("ja");
    rerender(<Footer locale="ja" sections={japaneseCopy.footerSections} />);

    expect(screen.queryByText("価格・プラン")).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "社内業務効率化｜AI Crew" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "自社サービスAI化｜AI Dashi" })).toBeInTheDocument();
    expect(screen.getByText("ソリューション").parentElement).toHaveClass("w-max", "max-w-full");
  });
});
