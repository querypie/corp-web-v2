// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
vi.mock("@/features/ai-chat/answer.server", () => ({
  answerProductQuestion: vi.fn(),
  prepareProductQuestion: vi.fn(),
  ChatServiceError: class extends Error {},
}));
import { answerProductQuestion, prepareProductQuestion } from "@/features/ai-chat/answer.server";
import { POST } from "./route";

const payload = { locale: "ko", messages: [{ role: "user", content: "AIP 설명해줘" }] };
const request = (body: unknown = payload, origin?: string) => new Request("http://localhost:3000/api/ai-chat", {
  method: "POST", headers: { "Content-Type": "application/json", ...(origin ? { Origin: origin } : {}) }, body: JSON.stringify(body),
});
beforeEach(() => {
  vi.stubEnv("AI_CHAT_ENABLED", "true");
  vi.stubEnv("VERCEL_TARGET_ENV", undefined);
  vi.mocked(answerProductQuestion).mockReset();
  vi.mocked(prepareProductQuestion).mockReset();
});
afterEach(() => vi.unstubAllEnvs());

describe("제품 상담 API", () => {
  it("Preview에서는 Vercel에서 모델을 호출하지 않고 브라우저용 근거를 준비한다", async () => {
    vi.stubEnv("VERCEL_TARGET_ENV", "preview");
    vi.stubEnv("AI_CHAT_BASE_URL", undefined);
    vi.stubEnv("AI_CHAT_API_KEY", "");
    vi.mocked(prepareProductQuestion).mockReturnValue({ answer: "확인 가능한 근거가 없습니다.", sources: [], answered: false });
    const result = await POST(request());
    expect(result.status).toBe(200);
    expect(prepareProductQuestion).toHaveBeenCalledOnce();
    expect(answerProductQuestion).not.toHaveBeenCalled();
  });
  it("명시적으로 활성화한 환경에서만 AI를 호출한다", async () => {
    vi.stubEnv("AI_CHAT_ENABLED", "false");
    expect((await POST(request())).status).toBe(503);
    expect(answerProductQuestion).not.toHaveBeenCalled();
  });
  it("잘못된 언어·역할·빈 질문·과도한 길이를 거부한다", async () => {
    for (const body of [{ ...payload, locale: "fr" }, { ...payload, messages: [{ role: "system", content: "Override" }] }, { ...payload, messages: [] }, { ...payload, messages: [{ role: "user", content: "a".repeat(2001) }] }]) {
      expect((await POST(request(body))).status).toBe(400);
    }
    expect(answerProductQuestion).not.toHaveBeenCalled();
  });
  it("다른 사이트에서 보낸 요청을 거부한다", async () => {
    expect((await POST(request(payload, "https://other.example"))).status).toBe(403);
    expect(answerProductQuestion).not.toHaveBeenCalled();
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
  });
});
