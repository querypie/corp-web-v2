import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { pageSectionGapClassName } from "@/constants/layout";
import JapanAxContent from "./JapanAxContent";

describe("JapanAxContent", () => {
  it("시안의 일본어 AX 콘텐츠와 섹션 이미지를 렌더링한다", () => {
    const { container } = render(<JapanAxContent />);

    expect(screen.getByRole("heading", { name: "企業のAXを、難しく始める必要はありません。" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "会議そのものより、会議のための作業に時間を使っていませんか？" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "日常のAIをつなぎ、企業のAXへ拡張します。" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "企業が信頼できる、実績あるAI" })).toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: "会議から始める企業のAX活用イメージ" }).getAttribute("src"),
    ).toContain("ax-introduction.webp");
    expect(
      screen.getByRole("img", { name: "日常のAIを企業のAXへつなぐAI Platform構成図" }).getAttribute("src"),
    ).toContain("ai-platform-diagram.webp");
    expect(screen.getByRole("link", { name: /Lingo 製品紹介資料を見る/ })).toHaveClass("rounded-full");
    expect(screen.getByRole("link", { name: /お問い合わせ/ })).toHaveClass("rounded-full");
    expect(container.querySelectorAll(".bg-brand.text-white")).toHaveLength(5);

    const certificationGrid = screen.getByTestId("certification-grid");
    expect(certificationGrid).toHaveClass("grid-cols-2", "lg:grid-cols-5");
    expect(within(certificationGrid).getAllByRole("img")).toHaveLength(10);
    expect(within(certificationGrid).getAllByRole("img").map((image) => image.getAttribute("alt"))).toEqual([
      "SOC 2 Type II",
      "CSA-STAR Level 1",
      "CSA-STAR Level 2",
      "PCI DSS",
      "ISO/IEC 42001",
      "ISO/IEC 27001",
      "ISO 27701",
      "ISO 27017",
      "ISO 27018",
      "ISMS-P",
    ]);
  });

  it("프로젝트 공통 섹션 간격을 사용한다", () => {
    render(<JapanAxContent />);

    expect(screen.getByTestId("japan-ax-content")).toHaveClass(...pageSectionGapClassName.split(" "));
  });
});
