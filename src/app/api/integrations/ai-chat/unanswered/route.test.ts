// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
vi.mock("@/features/ai-chat/database.server", () => ({ getAiChatDatabaseUrl: vi.fn() }));
vi.mock("@/features/ai-chat/unanswered.server", () => ({ listUnansweredQuestions: vi.fn() }));
import { getAiChatDatabaseUrl } from "@/features/ai-chat/database.server";
import { listUnansweredQuestions } from "@/features/ai-chat/unanswered.server";
import { GET } from "./route";

function request(query = "", token = "report-secret") {
  return new Request(`https://example.com/api/integrations/ai-chat/unanswered${query}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

describe("미답변 MCP 조회 API", () => {
  beforeEach(() => {
    vi.stubEnv("AI_CHAT_REPORT_API_KEY", "report-secret");
    vi.mocked(getAiChatDatabaseUrl).mockReturnValue("postgres://test");
  });
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.clearAllMocks();
  });

  it("인증되지 않은 요청을 거부한다", async () => {
    expect((await GET(request("", "wrong"))).status).toBe(401);
    expect(listUnansweredQuestions).not.toHaveBeenCalled();
  });

  it("API 키나 DB가 없으면 미설정으로 응답한다", async () => {
    vi.stubEnv("AI_CHAT_REPORT_API_KEY", "");
    expect((await GET(request())).status).toBe(503);

    vi.stubEnv("AI_CHAT_REPORT_API_KEY", "report-secret");
    vi.mocked(getAiChatDatabaseUrl).mockReturnValue("");
    expect((await GET(request())).status).toBe(503);
  });

  it("인증된 요청에 필요한 미답변 필드만 반환한다", async () => {
    vi.mocked(listUnansweredQuestions).mockResolvedValue([{
      id: 12,
      question: "Lingo의 지원 언어는?",
      locale: "ko",
      reason: "no_relevant_source",
      candidateSources: [{ title: "내부 후보", url: "https://www.querypie.com/ko" }],
      occurrenceCount: 3,
      firstSeenAt: "2026-09-08T00:00:00.000Z",
      lastSeenAt: "2026-09-09T00:00:00.000Z",
      status: "pending",
      product: null,
      approvedAnswer: null,
      approvedSourceUrl: null,
      answerVersion: 0,
      reviewedAt: null,
    }]);
    const response = await GET(request("?since=2026-09-08T00:00:00.000Z&limit=20"));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toMatchObject({
      since: "2026-09-08T00:00:00.000Z",
      count: 1,
      items: [{ id: 12, question: "Lingo의 지원 언어는?", occurrenceCount: 3 }],
    });
    expect(body.items[0]).not.toHaveProperty("candidateSources");
    expect(listUnansweredQuestions).toHaveBeenCalledWith({
      status: "pending",
      since: new Date("2026-09-08T00:00:00.000Z"),
      limit: 20,
    });
  });

  it("잘못된 조회 조건을 거부한다", async () => {
    expect((await GET(request("?since=invalid"))).status).toBe(400);
    expect((await GET(request("?limit=501"))).status).toBe(400);
    expect(listUnansweredQuestions).not.toHaveBeenCalled();
  });
});
