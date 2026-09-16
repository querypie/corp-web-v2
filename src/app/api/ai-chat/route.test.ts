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

const payload = { locale: "ko", messages: [{ role: "user", content: "AIP 설명해줘" }] };
const request = (body: unknown = payload, origin?: string) => new Request("http://localhost:3000/api/ai-chat", {
  method: "POST", headers: { "Content-Type": "application/json", ...(origin ? { Origin: origin } : {}) }, body: JSON.stringify(body),
});
beforeEach(() => {
  vi.stubEnv("AI_CHAT_ENABLED", "true");
  vi.stubEnv("VERCEL_TARGET_ENV", undefined);
  vi.mocked(answerProductQuestion).mockReset();
  vi.mocked(notifyAiChatTurn).mockReset();
  vi.mocked(notifyAiChatTurn).mockResolvedValue(undefined);
});
afterEach(() => vi.unstubAllEnvs());

describe("제품 상담 API", () => {
  it("Preview에서도 브라우저용 모델 요청을 준비하지 않고 서버 답변만 반환한다", async () => {
    vi.stubEnv("VERCEL_TARGET_ENV", "preview");
    vi.stubEnv("AI_CHAT_BASE_URL", "https://old.example/v1");
    vi.stubEnv("AI_CHAT_MODEL", "old-model");
    vi.stubEnv("AI_CHAT_API_KEY", "stage-secret");
    const reply = { answer: "서버 답변", sources: [], answered: false };
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
    const reply = { answer: "설명", sources: [], answered: false };
    vi.mocked(answerProductQuestion).mockResolvedValue(reply);
    const result = await POST(request());
    expect(result.status).toBe(200);
    expect(result.headers.get("cache-control")).toBe("no-store");
    expect(await result.json()).toEqual(reply);
  });
  it("서버 주소나 인증 정보가 포함된 오류 원문을 노출하지 않는다", async () => {
    vi.mocked(answerProductQuestion).mockRejectedValue(new Error("private upstream details"));
    const result = await POST(request());
    expect(result.status).toBe(502);
    expect(await result.json()).toEqual({ code: "PROVIDER_ERROR" });
    expect(notifyAiChatTurn).toHaveBeenCalledWith({ locale: "ko", question: "AIP 설명해줘", outcome: { code: "PROVIDER_ERROR" }, slackThreadToken: undefined });
  });
  it("최신 질문과 검증된 답변만 알리고 스레드 연결값을 반환한다", async () => {
    const reply = { answer: "후속 답변", sources: [], answered: false };
    vi.mocked(answerProductQuestion).mockResolvedValue(reply);
    vi.mocked(notifyAiChatTurn).mockResolvedValue("signed-thread");
    const result = await POST(request({ ...payload, slackThreadToken: "signed-thread", messages: [
      { role: "user", content: "이전 질문" }, { role: "assistant", content: "이전 답변" }, ...payload.messages,
    ] }));
    expect(notifyAiChatTurn).toHaveBeenCalledExactlyOnceWith({ locale: "ko", question: "AIP 설명해줘", outcome: reply, slackThreadToken: "signed-thread" });
    expect(await result.json()).toEqual({ ...reply, slackThreadToken: "signed-thread" });
  });
  it("알림 오류는 정상 AI 응답을 바꾸지 않는다", async () => {
    const reply = { answer: "정상 답변", sources: [], answered: false };
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
});
