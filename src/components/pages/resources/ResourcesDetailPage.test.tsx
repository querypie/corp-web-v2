import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import DocsDetailPage from "./ResourcesDetailPage";

const props = {
  bodyHtml: "<p>노트 본문 마지막 문장</p>",
  category: "ACP 실습 노트",
  contentListDescription: "",
  contentListItems: [],
  contentListLinks: [],
  contentListTitle: "",
  date: "",
  docsHref: "/ko/resources/acp-lab-notes",
  heroImageAlt: "",
  heroImageSrc: "",
  locale: "ko" as const,
  slug: "lab-note",
  title: "실습 노트",
  writer: "QueryPie 기술 검증 팀",
};

describe("ACP 실습 노트 본문 하단 링크", () => {
  it("본문 뒤에 커뮤니티 에디션과 공식 문서 링크를 표시하고 전체 목차는 표시하지 않는다", () => {
    render(<DocsDetailPage {...props} labNote={{ episode: 1, topics: [] }} />);

    const body = screen.getByText("노트 본문 마지막 문장");
    const community = screen.getByRole("link", { name: "ACP 커뮤니티 에디션 시작하기" });
    const docs = screen.getByRole("link", { name: "ACP 공식 문서" });
    expect(community).toHaveAttribute("href", "https://docs.querypie.com/ko/installation/querypie-acp-community-edition");
    expect(docs).toHaveAttribute("href", "https://docs.querypie.com/ko");
    expect(body.compareDocumentPosition(community) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(community.compareDocumentPosition(docs) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(screen.queryByRole("link", { name: "전체 목차" })).not.toBeInTheDocument();
  });

  it("다른 리소스에는 노트 링크를 표시하지 않는다", () => {
    render(<DocsDetailPage {...props} />);
    expect(screen.queryByRole("link", { name: "ACP 공식 문서" })).not.toBeInTheDocument();
  });
});
