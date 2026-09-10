import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import JapanLingoFaq from "./JapanLingoFaq";

describe("JapanLingoFaq", () => {
  it("6개 카테고리 선택 목록과 선택된 카테고리의 질문만 렌더링한다", () => {
    render(<JapanLingoFaq />);

    const faq = screen.getByTestId("japan-lingo-faq");
    expect(within(faq).queryByText("Lingoについて、よくあるご質問")).not.toBeInTheDocument();
    expect(within(faq).queryByText("機能やセキュリティ、トライアル、料金についてのご質問をまとめました。")).not.toBeInTheDocument();
    const categoryList = within(faq).getByRole("tablist", { name: "FAQカテゴリー" });
    expect(categoryList).toHaveClass("-mx-5", "w-[calc(100%+40px)]", "min-w-0", "overflow-x-auto", "px-5");
    expect(within(categoryList).getAllByRole("tab")).toHaveLength(6);
    const firstCategory = within(faq).getByRole("tab", { name: "会議機能と対応言語" });
    expect(firstCategory).toHaveAttribute("aria-selected", "true");
    expect(firstCategory).toHaveClass("min-h-11", "py-2");
    expect(within(within(faq).getByRole("tabpanel")).getAllByRole("button")).toHaveLength(4);
    const firstQuestionCard = within(faq)
      .getByRole("button", { name: "1つのマイクで複数人の音声を取得する場合も、話者を識別できますか？" })
      .closest("article");
    expect(firstQuestionCard).toHaveClass("rounded-box");
    expect(firstQuestionCard).not.toHaveClass("rounded-modal");
    expect(within(faq).queryByText(/^Q\d{2}$/)).not.toBeInTheDocument();
    expect(within(faq).queryByText("データはどこに保存されますか？")).not.toBeInTheDocument();

    fireEvent.click(within(faq).getByRole("tab", { name: "月額料金と契約条件" }));

    expect(within(faq).getByRole("tab", { name: "月額料金と契約条件" })).toHaveAttribute("aria-selected", "true");
    expect(within(within(faq).getByRole("tabpanel")).getAllByRole("button")).toHaveLength(2);
    expect(within(faq).getByText("Businessプランは月額650米ドルですか？支払いは毎月ですか？")).toBeInTheDocument();
    expect(within(faq).queryByText("追加のお問い合わせ")).not.toBeInTheDocument();
    expect(within(faq).queryByText(/付録/)).not.toBeInTheDocument();
  });

  it("질문을 펼치면 연결된 답변을 확인할 수 있다", () => {
    render(<JapanLingoFaq />);

    fireEvent.click(screen.getByRole("tab", { name: "セキュリティとデータの取り扱い" }));
    const question = screen.getByRole("button", { name: "データはAIモデルの学習に使われますか？" });
    expect(question).toHaveAttribute("aria-expanded", "false");
    fireEvent.click(question);
    expect(question).toHaveAttribute("aria-expanded", "true");
    const answer = screen.getByText("いいえ。AIモデルの学習には使用されません。");
    expect(answer).toBeInTheDocument();
    expect(answer.parentElement).toHaveClass("type-body-lg");
  });

  it("다른 질문을 열면 이전 질문을 닫는다", () => {
    render(<JapanLingoFaq />);

    const firstQuestion = screen.getByRole("button", { name: "1つのマイクで複数人の音声を取得する場合も、話者を識別できますか？" });
    const secondQuestion = screen.getByRole("button", { name: "オンライン会議では発言者の名前も表示できますか？" });

    expect(firstQuestion).toHaveAttribute("aria-expanded", "false");
    expect(secondQuestion).toHaveAttribute("aria-expanded", "false");

    fireEvent.click(firstQuestion);
    expect(firstQuestion).toHaveAttribute("aria-expanded", "true");

    fireEvent.click(secondQuestion);

    expect(firstQuestion).toHaveAttribute("aria-expanded", "false");
    expect(secondQuestion).toHaveAttribute("aria-expanded", "true");
    expect(screen.queryByText("はい。音声的な特徴をもとに話者を区別して表示します。")).not.toBeInTheDocument();
    expect(screen.getByText("はい。Google Meet、Zoom、Microsoft Teamsなどのオンライン会議では、発言者の名前も表示できます。")).toBeInTheDocument();
  });

  it("방향키로 카테고리를 전환한다", () => {
    render(<JapanLingoFaq />);

    const firstCategory = screen.getByRole("tab", { name: "会議機能と対応言語" });
    firstCategory.focus();
    fireEvent.keyDown(firstCategory, { key: "ArrowDown" });

    const secondCategory = screen.getByRole("tab", { name: "セキュリティとデータの取り扱い" });
    expect(secondCategory).toHaveFocus();
    expect(secondCategory).toHaveAttribute("aria-selected", "true");
    expect(screen.getByText("データはどこに保存されますか？")).toBeInTheDocument();
  });
});
