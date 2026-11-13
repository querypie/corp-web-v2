import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import AcpLabNotesPage from "./AcpLabNotesPage";

describe("ACP 실습 리소스 목록", () => {
  beforeEach(() => sessionStorage.clear());
  it("공통 리소스 메뉴와 카드를 보여주며 태그로 필터하고 전체로 돌아온다", () => {
    render(<AcpLabNotesPage visibleCategorySlugs={["blogs", "acp-lab-notes"]} items={[
      { href: "/ko/acp-lab-notes/audit", title: "DB 감사 기록", summary: "실행 이력", imageSrc: "", topics: ["DB 접근 제어"] },
      { href: "/ko/acp-lab-notes/recording", title: "서버 녹화", summary: "세션 재생", imageSrc: "", topics: ["서버 접근 제어"] },
    ]} />);
    expect(screen.getByRole("heading", { level: 1, name: "리소스" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "블로그" })).toHaveAttribute("href", "/ko/blog");
    expect(screen.getByRole("link", { name: "ACP 실습 노트" })).toHaveAttribute("href", "/ko/acp-lab-notes");
    expect(screen.queryByRole("searchbox")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "DB 접근 제어" }));
    expect(screen.getByRole("link", { name: /DB 감사 기록/ })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /서버 녹화/ })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "DB 접근 제어" })).toHaveAttribute("aria-pressed", "true");
    fireEvent.click(screen.getByRole("button", { name: "전체" }));
    expect(screen.getByRole("link", { name: /서버 녹화/ })).toBeInTheDocument();
  });
  it("게시물에서 목록으로 돌아오면 섹션을 복원하고 전체 선택도 유지한다", () => {
    const props = {
      visibleCategorySlugs: ["acp-lab-notes"] as const,
      items: [
        { href: "/ko/acp-lab-notes/audit", title: "DB 감사 기록", summary: "실행 이력", imageSrc: "", topics: ["감사"] },
        { href: "/ko/acp-lab-notes/approval", title: "SQL 승인", summary: "승인 요청", imageSrc: "", topics: ["승인"] },
      ],
    };
    const list = () => <AcpLabNotesPage items={props.items} visibleCategorySlugs={[...props.visibleCategorySlugs]} />;
    const firstVisit = render(list());
    fireEvent.click(screen.getByRole("button", { name: "승인" }));
    firstVisit.unmount();

    const returnVisit = render(list());
    expect(screen.getByRole("button", { name: "승인" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.queryByRole("link", { name: /DB 감사 기록/ })).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: /SQL 승인/ })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "전체" }));
    returnVisit.unmount();

    render(list());
    expect(screen.getByRole("button", { name: "전체" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("link", { name: /DB 감사 기록/ })).toBeInTheDocument();
  });
});
