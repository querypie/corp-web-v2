import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ContentArticlePreview from "./ContentArticlePreview";

describe("ContentArticlePreview author profile", () => {
  const baseProps = {
    date: "2026년 3월 12일",
    downloadLabel: "PDF",
    heroImageAlt: "백서",
    heroImageSrc: "",
    locale: "ko" as const,
    title: "백서 제목",
    writer: "테라자와 신스케",
  };

  it("사진을 작성자·소개 왼쪽에 두고 직책을 작성자 옆에 표시한다", () => {
    render(<ContentArticlePreview
      {...baseProps}
      authorProfileImageSrc="/assets/content/author-profiles/terazawa.jpg"
      introduction="마케팅과 조직 개발을 지원합니다."
      writerRole="마케팅 컨설턴트"
    />);
    const photo = screen.getByRole("img", { name: "테라자와 신스케" });
    const writer = screen.getByText("테라자와 신스케 / 마케팅 컨설턴트");
    const introduction = screen.getByText("마케팅과 조직 개발을 지원합니다.");
    const date = screen.getByText("2026년 3월 12일");
    expect(photo).toHaveAttribute("src", "/assets/content/author-profiles/terazawa.jpg");
    expect(photo.parentElement).toContainElement(writer);
    expect(photo.parentElement).toContainElement(introduction);
    expect(writer.compareDocumentPosition(introduction) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(introduction.compareDocumentPosition(date) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it("사진과 소개가 없는 백서는 기존 작성자·날짜를 표시한다", () => {
    render(<ContentArticlePreview {...baseProps} writer="QueryPie AI Research" />);
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    expect(screen.getByText("QueryPie AI Research")).toBeInTheDocument();
    expect(screen.getByText("2026년 3월 12일")).toBeInTheDocument();
  });
});
