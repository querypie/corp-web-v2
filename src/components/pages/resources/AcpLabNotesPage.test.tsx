import { readFileSync, readdirSync } from "node:fs";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import AcpLabNotesPage from "./AcpLabNotesPage";
import { acpLabNoteTopics, getAcpLabNotesCopy } from "@/copy/acpLabNotes";
import { getLocalizedLabNote } from "@/features/content/acpLabNotes";
import { getLocalizedContent, getPublicDetailHref } from "@/features/content/data";

const contentRoot = "src/content/resources/acp-lab-notes";
const notes = readdirSync(contentRoot).map((directory) => JSON.parse(readFileSync(`${contentRoot}/${directory}/meta.json`, "utf8")));

describe("ACP 실습 리소스 목록", () => {
  beforeEach(() => sessionStorage.clear());
  it.each(["ko", "en", "ja"] as const)("%s 실제 50편에서 전체와 주제 5개만 표시하고 각 주제로 필터한다", (locale) => {
    const copy = getAcpLabNotesCopy(locale);
    const items = notes.map((note) => ({
      href: getPublicDetailHref("resources", locale, note.id, "acp-lab-notes"),
      title: getLocalizedContent(note.title, locale),
      summary: "",
      imageSrc: "",
      topics: getLocalizedLabNote(note, locale)!.topics,
    }));
    // A removed topic stored by the previous page must not leave an empty list.
    sessionStorage.setItem(`querypie:acp-lab-notes:topic:${locale}`, "승인");
    const { container } = render(<AcpLabNotesPage locale={locale} visibleCategorySlugs={["acp-lab-notes"]} items={items} />);
    const filters = within(screen.getByRole("group", { name: copy.topicsLabel }));
    const visibleHrefs = () => Array.from(container.querySelectorAll(`a[href^="/${locale}/acp-lab-notes/"]`)).map((link) => link.getAttribute("href")).sort();
    expect(filters.getAllByRole("button")).toHaveLength(6);
    expect(filters.getByRole("button", { name: copy.all })).toHaveAttribute("aria-pressed", "true");
    expect(visibleHrefs()).toHaveLength(50);
    for (const labels of Object.values(acpLabNoteTopics)) {
      fireEvent.click(filters.getByRole("button", { name: labels[locale] }));
      expect(visibleHrefs()).toEqual(items.filter((item) => item.topics.includes(labels[locale])).map((item) => item.href).sort());
    }
    fireEvent.click(filters.getByRole("button", { name: copy.all }));
    expect(visibleHrefs()).toHaveLength(50);
  });
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
        { href: "/ko/acp-lab-notes/audit", title: "DB 감사 기록", summary: "실행 이력", imageSrc: "", topics: ["DB 접근 제어"] },
        { href: "/ko/acp-lab-notes/approval", title: "SQL 승인", summary: "승인 요청", imageSrc: "", topics: ["운영 관리"] },
      ],
    };
    const list = () => <AcpLabNotesPage items={props.items} visibleCategorySlugs={[...props.visibleCategorySlugs]} />;
    const firstVisit = render(list());
    fireEvent.click(screen.getByRole("button", { name: "운영 관리" }));
    firstVisit.unmount();

    const returnVisit = render(list());
    expect(screen.getByRole("button", { name: "운영 관리" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.queryByRole("link", { name: /DB 감사 기록/ })).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: /SQL 승인/ })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "전체" }));
    returnVisit.unmount();

    render(list());
    expect(screen.getByRole("button", { name: "전체" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("link", { name: /DB 감사 기록/ })).toBeInTheDocument();
  });
});
