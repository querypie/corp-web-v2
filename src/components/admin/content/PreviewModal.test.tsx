import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { createEmptyManagedContentDraft, type ManagedContentEntry } from "@/features/content/data";
import { PreviewModal } from "./AdminManagedContentListPage";

vi.mock("@/components/layout/admin/AdminLocaleProvider", () => ({
  useAdminLocale: () => ({ t: (copy: string) => copy }),
}));

vi.mock("./AdminContentPreview", () => ({
  default: ({ title, bodyHtml }: { title: string; bodyHtml: string }) => (
    <article>
      <h1>{title}</h1>
      <div>{bodyHtml}</div>
    </article>
  ),
}));

function makeItem(visibleLocales: ManagedContentEntry["visibleLocales"]): ManagedContentEntry {
  return {
    ...createEmptyManagedContentDraft("news", "news"),
    title: { en: "English title", ko: "한국어 제목", ja: "日本語タイトル" },
    bodyHtml: { en: "English body", ko: "한국어 본문", ja: "日本語本文" },
    bodyRichText: { en: "", ko: "", ja: "" },
    visibleLocales,
  };
}

describe("PreviewModal", () => {
  it("노출 설정된 언어 탭만 순서대로 표시하고 선택한 언어의 내용을 보여준다", () => {
    render(<PreviewModal item={makeItem(["ja", "ko"])} onClose={vi.fn()} />);

    expect(screen.queryByRole("button", { name: "EN" })).not.toBeInTheDocument();
    expect(screen.getAllByRole("button").map((button) => button.textContent)).toEqual(["KO", "JA", ""]);
    expect(screen.getByRole("heading")).toHaveTextContent("한국어 제목");
    expect(screen.getByText("한국어 본문")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "JA" }));

    expect(screen.getByRole("heading")).toHaveTextContent("日本語タイトル");
    expect(screen.getByText("日本語本文")).toBeInTheDocument();
  });

  it("노출 언어가 하나면 탭 없이 해당 언어를 보여주고 닫기를 유지한다", () => {
    const onClose = vi.fn();
    render(<PreviewModal initialLocale="en" item={makeItem(["ja"])} onClose={onClose} />);

    expect(screen.queryByRole("button", { name: /^(EN|KO|JA)$/ })).not.toBeInTheDocument();
    expect(screen.getByRole("heading")).toHaveTextContent("日本語タイトル");
    fireEvent.click(screen.getByRole("button", { name: "미리보기 닫기" }));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("초기 편집 언어가 노출 언어이면 해당 언어를 유지한다", () => {
    render(<PreviewModal initialLocale="ja" item={makeItem(["en", "ja"])} onClose={vi.fn()} />);

    expect(screen.getByRole("heading")).toHaveTextContent("日本語タイトル");
  });

  it("선택한 언어가 노출 대상에서 빠지면 남은 노출 언어로 전환한다", () => {
    const onClose = vi.fn();
    const { rerender } = render(
      <PreviewModal item={makeItem(["en", "ko", "ja"])} onClose={onClose} />,
    );
    fireEvent.click(screen.getByRole("button", { name: "JA" }));

    rerender(<PreviewModal item={makeItem(["ko"])} onClose={onClose} />);

    expect(screen.queryByRole("button", { name: /^(EN|KO|JA)$/ })).not.toBeInTheDocument();
    expect(screen.getByRole("heading")).toHaveTextContent("한국어 제목");
  });

  it("노출 언어가 없는 초안은 탭 없이 현재 편집 언어로 미리보기한다", () => {
    render(<PreviewModal initialLocale="ko" item={makeItem([])} onClose={vi.fn()} />);

    expect(screen.queryByRole("button", { name: /^(EN|KO|JA)$/ })).not.toBeInTheDocument();
    expect(screen.getByRole("heading")).toHaveTextContent("한국어 제목");
  });
});
