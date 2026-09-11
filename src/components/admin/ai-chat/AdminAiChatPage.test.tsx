import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import AdminAiChatPage from "./AdminAiChatPage";

const item = {
  id: 1,
  question: "Lingo는 수화 통역을 지원하나요?",
  locale: "ko",
  reason: "no_relevant_source",
  candidateSources: [],
  occurrenceCount: 3,
  firstSeenAt: "2026-09-09T00:00:00.000Z",
  lastSeenAt: "2026-09-10T00:00:00.000Z",
  status: "pending",
  product: null,
  approvedAnswer: null,
  approvedSourceUrl: null,
  answerVersion: 0,
  reviewedAt: null,
};

describe("AI 상담 미답변 관리자 화면", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ configured: true, items: [item] })))
      .mockResolvedValueOnce(new Response(JSON.stringify({ success: true, indexedCount: 1 }))));
  });
  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it("답변과 근거를 입력해 승인하고 목록에서 제거한다", async () => {
    render(<AdminAiChatPage />);
    expect(await screen.findByText(item.question)).toBeVisible();
    fireEvent.change(screen.getByLabelText("공개 근거 URL"), { target: { value: "https://lingo.querypie.ai/ko/faq" } });
    fireEvent.change(screen.getByLabelText("승인할 답변"), { target: { value: "공식 답변" } });
    fireEvent.click(screen.getByRole("button", { name: "답변 승인 및 반영" }));
    expect(await screen.findByText("검토할 미답변 질문이 없습니다.")).toBeVisible();
    expect(JSON.parse(vi.mocked(fetch).mock.calls[1][1]!.body as string)).toEqual({
      id: 1,
      status: "answered",
      product: "lingo",
      approvedAnswer: "공식 답변",
      approvedSourceUrl: "https://lingo.querypie.ai/ko/faq",
    });
  });

  it("DB 미설정을 빈 미답변 목록으로 표시하지 않는다", async () => {
    vi.mocked(fetch).mockReset().mockResolvedValueOnce(new Response(JSON.stringify({ configured: false, items: [] })));
    render(<AdminAiChatPage />);

    expect(await screen.findByRole("alert")).toHaveTextContent("AI 상담 DB가 설정되지 않았습니다.");
    expect(screen.queryByText("검토할 미답변 질문이 없습니다.")).not.toBeInTheDocument();
  });
});
