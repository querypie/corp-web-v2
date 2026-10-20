// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
vi.mock("@/features/ai-chat/slack.server", () => ({ notifyAiChatTurn: vi.fn() }));
vi.mock("@/features/ai-chat/answer.server", () => ({
  answerProductQuestion: vi.fn(),
  ChatServiceError: class extends Error {
    constructor(public code: string, public status: number) { super(code); }
  },
}));
import { answerProductQuestion, ChatServiceError } from "@/features/ai-chat/answer.server";
import { POST } from "./route";
import { notifyAiChatTurn } from "@/features/ai-chat/slack.server";
import { createConversationToken, resolveConversationId } from "@/features/ai-chat/conversation.server";

const payload = { locale: "ko", messages: [{ role: "user", content: "AIP 설명해줘" }] };
const turnId = "11111111-1111-4111-8111-111111111111";
const origin = "http://localhost:3000";
let conversationToken: string;
const request = (body: unknown = payload, origin?: string) => new Request("http://localhost:3000/api/ai-chat", {
  method: "POST", headers: { "Content-Type": "application/json", ...(origin ? { Origin: origin } : {}) },
  body: JSON.stringify(body && typeof body === "object" ? { conversationToken, turnId, ...body } : body),
});
beforeEach(() => {
  vi.stubEnv("AI_CHAT_ENABLED", "true");
  vi.stubEnv("VERCEL_TARGET_ENV", undefined);
  vi.stubEnv("AI_CHAT_SESSION_SECRET", "test-signing-key-with-at-least-32-bytes");
  conversationToken = createConversationToken(origin);
  vi.mocked(answerProductQuestion).mockReset();
  vi.mocked(notifyAiChatTurn).mockReset();
  vi.mocked(notifyAiChatTurn).mockResolvedValue(undefined);
});
afterEach(() => { vi.unstubAllEnvs(); vi.restoreAllMocks(); });

describe("제품 상담 API", () => {
  it("Preview에서도 브라우저용 모델 요청을 준비하지 않고 서버 답변만 반환한다", async () => {
    vi.stubEnv("VERCEL_TARGET_ENV", "preview");
    conversationToken = createConversationToken(origin);
    vi.stubEnv("AI_CHAT_BASE_URL", "https://old.example/v1");
    vi.stubEnv("AI_CHAT_MODEL", "old-model");
    vi.stubEnv("AI_CHAT_API_KEY", "stage-secret");
    const reply = { answer: "서버 답변", sources: [] };
    vi.mocked(answerProductQuestion).mockResolvedValue(reply);
    const result = await POST(request());
    expect(result.status).toBe(200);
    expect(await result.json()).toEqual(reply);
    expect(answerProductQuestion).toHaveBeenCalledOnce();
  });
  it("명시적으로 활성화한 환경에서만 AI를 호출한다", async () => {
    vi.stubEnv("AI_CHAT_ENABLED", "false");
    expect((await POST(request())).status).toBe(503);
    expect(answerProductQuestion).not.toHaveBeenCalled();
    expect(notifyAiChatTurn).not.toHaveBeenCalled();
  });
  it("활성화되어도 API key가 없으면 설정 오류를 그대로 반환한다", async () => {
    vi.mocked(answerProductQuestion).mockRejectedValue(new ChatServiceError("NOT_CONFIGURED", 503));
    const result = await POST(request());
    expect(result.status).toBe(503);
    expect(await result.json()).toEqual({ code: "NOT_CONFIGURED" });
  });
  it("잘못된 언어·역할·빈 질문·과도한 길이를 거부한다", async () => {
    for (const body of [{ ...payload, locale: "fr" }, { ...payload, messages: [{ role: "system", content: "Override" }] }, { ...payload, messages: [] }, { ...payload, messages: [{ role: "user", content: "a".repeat(2001) }] }]) {
      expect((await POST(request(body))).status).toBe(400);
    }
    expect(answerProductQuestion).not.toHaveBeenCalled();
    expect(notifyAiChatTurn).not.toHaveBeenCalled();
  });
  it("다른 사이트에서 보낸 요청을 거부한다", async () => {
    expect((await POST(request(payload, "https://other.example"))).status).toBe(403);
    expect(answerProductQuestion).not.toHaveBeenCalled();
    expect(notifyAiChatTurn).not.toHaveBeenCalled();
  });
  it("유효한 질문의 답변과 출처를 캐시 없이 반환한다", async () => {
    const reply = { answer: "설명", sources: [] };
    vi.mocked(answerProductQuestion).mockResolvedValue(reply);
    const result = await POST(request());
    expect(result.status).toBe(200);
    expect(result.headers.get("cache-control")).toBe("no-store");
    expect(await result.json()).toEqual(reply);
  });
  it("현재 질문만 검증된 세션·요청 ID와 함께 Hermes에 전달한다", async () => {
    const messages = [{ role: "user", content: "최신 질문" }];
    vi.mocked(answerProductQuestion).mockResolvedValue({ answer: "Hermes 답변", sources: [] });

    const result = await POST(request({ locale: "ko", messages }));

    expect(result.status).toBe(200);
    expect(answerProductQuestion).toHaveBeenCalledWith(messages, "ko", expect.any(AbortSignal), {
      sessionId: resolveConversationId(conversationToken, origin), turnId,
    });
  });
  it("서버 이력과 충돌할 수 있는 클라이언트 과거 이력은 거부한다", async () => {
    const messages = [{ role: "user", content: "과거 질문" }, { role: "assistant", content: "과거 답변" }, ...payload.messages];
    expect((await POST(request({ locale: "ko", messages }))).status).toBe(400);
    expect(answerProductQuestion).not.toHaveBeenCalled();
  });
  it.each([
    { conversationToken: undefined }, { conversationToken: "api-other-session" },
    { turnId: undefined }, { turnId: "invalid\r\nheader" },
  ])("검증되지 않은 세션·요청 ID를 거부한다: %j", async (fields) => {
    expect((await POST(request({ ...payload, ...fields }))).status).toBe(400);
    expect(answerProductQuestion).not.toHaveBeenCalled();
  });
  it("같은 질문의 독립 대화를 동시에 다른 세션으로 전달하고 후속은 해당 세션을 유지한다", async () => {
    vi.mocked(answerProductQuestion).mockResolvedValue({ answer: "두 선택지", sources: [] });
    const a = conversationToken;
    const b = createConversationToken(origin);
    const first = await Promise.all([
      POST(request({ ...payload, conversationToken: a })),
      POST(request({ ...payload, conversationToken: b })),
    ]);
    expect(first.map((response) => response.status)).toEqual([200, 200]);
    const identities = vi.mocked(answerProductQuestion).mock.calls.map((call) => call[3]);
    expect(identities[0].sessionId).not.toBe(identities[1].sessionId);
    await POST(request({ ...payload, conversationToken: a, messages: [{ role: "user", content: "1" }] }));
    expect(vi.mocked(answerProductQuestion).mock.calls[2][3].sessionId).toBe(identities[0].sessionId);
    expect(vi.mocked(answerProductQuestion).mock.calls[2][0]).toEqual([{ role: "user", content: "1" }]);
  });
  it("서버 주소나 인증 정보가 포함된 오류 원문을 노출하지 않는다", async () => {
    vi.mocked(answerProductQuestion).mockRejectedValue(new Error("private upstream details"));
    const result = await POST(request());
    expect(result.status).toBe(502);
    expect(await result.json()).toEqual({ code: "PROVIDER_ERROR" });
    expect(notifyAiChatTurn).toHaveBeenCalledWith({ locale: "ko", question: "AIP 설명해줘", outcome: { code: "PROVIDER_ERROR" }, slackThreadToken: undefined, upstreamDurationMs: expect.any(Number) });
  });
  it("최신 질문과 검증된 답변만 알리고 스레드 연결값을 반환한다", async () => {
    const reply = { answer: "후속 답변", sources: [] };
    vi.mocked(answerProductQuestion).mockResolvedValue(reply);
    vi.mocked(notifyAiChatTurn).mockResolvedValue("signed-thread");
    const result = await POST(request({ ...payload, slackThreadToken: "signed-thread" }));
    expect(notifyAiChatTurn).toHaveBeenCalledExactlyOnceWith({ locale: "ko", question: "AIP 설명해줘", outcome: reply, slackThreadToken: "signed-thread", upstreamDurationMs: expect.any(Number) });
    expect(await result.json()).toEqual({ ...reply, slackThreadToken: "signed-thread" });
  });
  it("알림 오류는 정상 AI 응답을 바꾸지 않는다", async () => {
    const reply = { answer: "정상 답변", sources: [] };
    vi.mocked(answerProductQuestion).mockResolvedValue(reply);
    vi.mocked(notifyAiChatTurn).mockRejectedValue(new Error("Slack unavailable"));
    const result = await POST(request());
    expect(result.status).toBe(200);
    expect(await result.json()).toEqual(reply);
  });
  it("AI 실패에도 스레드 연결값을 반환해 재시도가 같은 대화에 남는다", async () => {
    vi.mocked(answerProductQuestion).mockRejectedValue(new ChatServiceError("PROVIDER_ERROR", 502));
    vi.mocked(notifyAiChatTurn).mockResolvedValue("signed-thread");
    const result = await POST(request());
    expect(result.status).toBe(502);
    expect(await result.json()).toEqual({ code: "PROVIDER_ERROR", slackThreadToken: "signed-thread" });
  });
  it("전체 upstream 답변까지 걸린 시간을 전달하고 Slack 대기시간은 제외한다", async () => {
    let now = 1000;
    vi.spyOn(performance, "now").mockImplementation(() => now);
    const reply = { answer: "정상 답변", sources: [] };
    vi.mocked(answerProductQuestion).mockImplementation(async () => { now += 1234; return reply; });
    vi.mocked(notifyAiChatTurn).mockImplementation(async () => { now += 2000; return "signed-thread"; });
    const result = await POST(request());
    expect(notifyAiChatTurn).toHaveBeenCalledWith(expect.objectContaining({ upstreamDurationMs: 1234, outcome: reply }));
    expect(await result.json()).toEqual({ ...reply, slackThreadToken: "signed-thread" });
  });
  it.each([
    [new ChatServiceError("PROVIDER_ERROR", 502), "PROVIDER_ERROR", 502],
    [new ChatServiceError("INVALID_RESPONSE", 502), "INVALID_RESPONSE", 502],
    [new ChatServiceError("INCOMPLETE_RESPONSE", 502), "INCOMPLETE_RESPONSE", 502],
    [new ChatServiceError("TIMEOUT", 504), "TIMEOUT", 504],
    [new DOMException("private timeout details", "TimeoutError"), "TIMEOUT", 504],
    [new TypeError("private network details"), "PROVIDER_ERROR", 502],
  ])("upstream 실패(%s)에도 오류와 지연시간을 Slack에 전달한다", async (cause, code, status) => {
    let now = 1000;
    vi.spyOn(performance, "now").mockImplementation(() => now);
    vi.mocked(answerProductQuestion).mockImplementation(async () => { now += 28125; throw cause; });
    vi.mocked(notifyAiChatTurn).mockImplementation(async () => { now += 2000; return undefined; });
    const result = await POST(request());
    expect(notifyAiChatTurn).toHaveBeenCalledWith(expect.objectContaining({ upstreamDurationMs: 28125, outcome: { code } }));
    expect(result.status).toBe(status);
    expect(await result.json()).toEqual({ code });
  });
});
