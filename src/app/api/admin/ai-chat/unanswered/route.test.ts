// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
vi.mock("@/features/ai-chat/unanswered.server", () => ({
  listUnansweredQuestions: vi.fn(), reviewUnansweredQuestion: vi.fn(),
}));
vi.mock("@/features/ai-chat/approvedKnowledge.server", () => ({ writeApprovedKnowledgeSnapshot: vi.fn() }));
vi.mock("@/features/ai-chat/database.server", () => ({ getAiChatDatabaseUrl: vi.fn(() => "postgres://test") }));
import { writeApprovedKnowledgeSnapshot } from "@/features/ai-chat/approvedKnowledge.server";
import { getAiChatDatabaseUrl } from "@/features/ai-chat/database.server";
import { listUnansweredQuestions, reviewUnansweredQuestion } from "@/features/ai-chat/unanswered.server";
import { GET, PATCH } from "./route";

describe("AI 상담 미답변 Admin API", () => {
  beforeEach(() => vi.clearAllMocks());

  it("대기 중인 질문을 반환한다", async () => {
    vi.mocked(listUnansweredQuestions).mockResolvedValue([]);
    const response = await GET();
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ configured: true, items: [] });
  });

  it("DB 미설정 상태를 빈 목록과 구분한다", async () => {
    vi.mocked(getAiChatDatabaseUrl).mockReturnValueOnce("");
    vi.mocked(listUnansweredQuestions).mockResolvedValue([]);
    const response = await GET();

    expect(await response.json()).toEqual({ configured: false, items: [] });
  });

  it("승인 답변을 저장하고 RAG 입력 파일을 갱신한다", async () => {
    vi.mocked(reviewUnansweredQuestion).mockResolvedValue(true);
    vi.mocked(writeApprovedKnowledgeSnapshot).mockResolvedValue(4);
    const response = await PATCH(new Request("http://localhost/api/admin/ai-chat/unanswered", {
      method: "PATCH",
      body: JSON.stringify({
        id: 1, status: "answered", product: "lingo", approvedAnswer: "공식 답변",
        approvedSourceUrl: "https://lingo.querypie.ai/ko/faq",
      }),
    }));
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ success: true, indexedCount: 4 });
    expect(writeApprovedKnowledgeSnapshot).toHaveBeenCalledOnce();
  });

  it("허용하지 않은 출처 URL을 거부한다", async () => {
    const response = await PATCH(new Request("http://localhost/api/admin/ai-chat/unanswered", {
      method: "PATCH",
      body: JSON.stringify({
        id: 1, status: "answered", product: "lingo", approvedAnswer: "답변",
        approvedSourceUrl: "https://example.com/untrusted",
      }),
    }));
    expect(response.status).toBe(400);
    expect(reviewUnansweredQuestion).not.toHaveBeenCalled();
  });
});
