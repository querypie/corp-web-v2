import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { getShellMenuCopy } from "@/constants/navigation";
import Footer from "./Footer";

describe("Footer", () => {
  it.each([
    ["en", "Platform", "Solutions"],
    ["ko", "플랫폼", "솔루션"],
  ])("%s 푸터에서 AIG는 플랫폼에, FDE·DLP는 솔루션에 표시한다", (locale, platformLabel, solutionsLabel) => {
    const copy = getShellMenuCopy(locale, { includeDlpPlatform: true });
    render(<Footer locale={locale} sections={copy.footerSections} />);
    const platform = screen.getByText(platformLabel).parentElement!;
    expect(within(platform).getAllByRole("link").map((link) => link.getAttribute("href"))).toEqual([
      `/${locale}/platforms/acp`, `/${locale}/platforms/aip`, `/${locale}/solutions/ai-gateway`,
    ]);
    const solutions = screen.getByText(solutionsLabel).parentElement!;
    expect(within(solutions).getAllByRole("link").map((link) => link.getAttribute("href"))).toEqual([
      `/${locale}/solutions/penetration-testing`, `/${locale}/platforms/aip/fde-services`, `/${locale}/platforms/dlp`,
    ]);
  });

  it("Demo를 독립 섹션으로 노출하고 기존 기능 링크를 리소스 섹션에 합친다", () => {
    const copy = getShellMenuCopy("ko");

    render(
      <Footer
        legalLinks={copy.footerLegalLinks}
        locale="ko"
        sections={copy.footerSections}
      />,
    );

    expect(screen.getByText("데모")).toBeInTheDocument();
    expect(screen.getByText("플랫폼")).toBeInTheDocument();
    expect(screen.getByText("솔루션")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "FDE 서비스" })).toHaveAttribute("href", "/ko/platforms/aip/fde-services");
    expect(screen.getByText("리소스")).toBeInTheDocument();
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
    expect(screen.getByRole("link", { name: "ペネトレーションテスト" })).toHaveAttribute("href", "/ja/solutions/penetration-testing");
    expect(screen.queryByRole("link", { name: "QueryPie LLM｜QLM" })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "QueryPie Decision Model｜QEV" })).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "社内業務効率化｜AI Crew" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "自社サービスAI化｜AI Dashi" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "AI Gateway (AIG)" })).toHaveAttribute("href", "/ja/solutions/ai-gateway");
    expect(screen.getByRole("link", { name: "オンプレミスAI｜Local LLM" })).toHaveAttribute("href", "/ja/solutions/local-llm");
    expect(screen.getByRole("link", { name: "専任エンジニア｜FDEサービス" })).toHaveAttribute("href", "/ja/platforms/aip/fde-services");
  });
});
