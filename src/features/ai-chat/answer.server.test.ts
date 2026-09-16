import { afterEach, describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
import { AI_CHAT_BASE_URL, AI_CHAT_MODEL } from "@/features/ai/config.server";
import { answerProductQuestion, parseGroundedAnswer } from "./answer.server";
import { makeChunk } from "./knowledge";
import { retrieveLiveKnowledge } from "./liveKnowledge.server";
vi.mock("./liveKnowledge.server", () => ({ retrieveLiveKnowledge: vi.fn(async () => [
  { id: "aip", product: "aip", locale: "ko", title: "AIP", url: "https://aip-docs.app.querypie.com/ko", text: "최신 공식 본문", searchable: "aip", heading: "aip" },
]) }));
const knowledgeChunks = [makeChunk("site", "ko", "https://www.querypie.com/ko", "소개", "공식 자료")];

afterEach(() => { vi.unstubAllGlobals(); vi.unstubAllEnvs(); vi.restoreAllMocks(); });

describe("근거 기반 AI 답변", () => {
  it("제공된 문서 ID만 출처 링크로 변환하고 내부 추론은 노출하지 않는다", () => {
    const chunk = knowledgeChunks[0];
    const result = parseGroundedAnswer(`Internal analysis not for users.\n${JSON.stringify({ answer: "문서 기반 답변", sourceIds: [chunk.id, "invented"], answered: true })}`, [chunk]);
    expect(result).toEqual({ answer: "문서 기반 답변", sources: [{ title: chunk.title, url: chunk.url }], answered: true });
  });
  it("존재하지 않는 출처만 제시한 답변을 거부한다", () => {
    expect(() => parseGroundedAnswer('{"answer":"invented","sourceIds":["fake"],"answered":true}', knowledgeChunks.slice(0, 1))).toThrow("INVALID_RESPONSE");
  });
  it("JSON 키 순서가 바뀌어도 유효한 답변을 처리한다", () => {
    const chunk = knowledgeChunks[0];
    expect(parseGroundedAnswer(JSON.stringify({ answered: true, sourceIds: [chunk.id], answer: "답변" }), [chunk]).answer).toBe("답변");
  });
  it("API key가 없으면 최신 원문 검색이나 모델 호출 전에 설정 오류를 반환한다", async () => {
    vi.stubEnv("AI_CHAT_ENABLED", "true");
    vi.stubEnv("AI_CHAT_API_KEY", "");
    const fetcher = vi.fn();
    vi.stubGlobal("fetch", fetcher);
    await expect(answerProductQuestion([{ role: "user", content: "AIP가 무엇인가요?" }], "ko", new AbortController().signal)).rejects.toMatchObject({
      code: "NOT_CONFIGURED",
      status: 503,
    });
    expect(retrieveLiveKnowledge).not.toHaveBeenCalled();
    expect(fetcher).not.toHaveBeenCalled();
  });
  it("Stage Gateway를 서버에서 Bearer 인증으로 호출하고 원문 근거를 함께 제공한다", async () => {
    vi.stubEnv("AI_CHAT_ENABLED", "true");
    vi.stubEnv("AI_CHAT_BASE_URL", "https://old.example/v1");
    vi.stubEnv("AI_CHAT_MODEL", "old-model");
    vi.stubEnv("AI_CHAT_API_KEY", "stage-secret");
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ choices: [{ finish_reason: "stop", message: { content: '{"answer":"자료가 부족합니다.","sourceIds":[],"answered":false}' } }] }) });
    vi.stubGlobal("fetch", fetchMock);
    const result = await answerProductQuestion([{ role: "user", content: "AIP가 무엇인가요?" }], "ko", new AbortController().signal);
    expect(result.answered).toBe(false);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe(`${AI_CHAT_BASE_URL}/chat/completions`);
    expect(init.headers.Authorization).toBe("Bearer stage-secret");
    expect(JSON.parse(init.body).model).toBe(AI_CHAT_MODEL);
    expect(JSON.parse(init.body).reasoning_effort).toBe("low");
    expect(JSON.parse(init.body).messages[1].content).toContain("Official source excerpts");
  });
  it("근거가 없어도 모델이 대화 언어로 답하고 출처 없는 확정 답변은 거부한다", async () => {
    vi.stubEnv("AI_CHAT_ENABLED", "true");
    vi.stubEnv("AI_CHAT_API_KEY", "stage-secret");
    vi.mocked(retrieveLiveKnowledge).mockResolvedValueOnce([]);
    const fetcher = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ choices: [{ finish_reason: "stop", message: { content: '{"answer":"저는 QueryPie 제품 안내를 돕는 AI 상담입니다. 궁금한 제품을 알려주세요.","sourceIds":[],"answered":false}' } }] }),
    }).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ choices: [{ finish_reason: "stop", message: { content: '{"answer":"AIP는 모든 기능을 제공합니다.","sourceIds":[],"answered":true}' } }] }),
    });
    vi.stubGlobal("fetch", fetcher);
    const reply = await answerProductQuestion([{ role: "user", content: "네 이름이 무엇이니?" }], "en", AbortSignal.timeout(1000));
    expect(reply).toEqual({
      answer: "저는 QueryPie 제품 안내를 돕는 AI 상담입니다. 궁금한 제품을 알려주세요.",
      sources: [],
      answered: false,
    });
    vi.mocked(retrieveLiveKnowledge).mockResolvedValueOnce([]);
    await expect(answerProductQuestion([{ role: "user", content: "AIP 기능" }], "ko", AbortSignal.timeout(1000))).rejects.toMatchObject({
      code: "INVALID_RESPONSE",
      status: 502,
    });
  });
  it("Gateway 오류 시 본문이나 키 없이 경계 진단만 기록한다", async () => {
    vi.stubEnv("AI_CHAT_ENABLED", "true");
    vi.stubEnv("AI_CHAT_API_KEY", "stage-secret");
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("upstream secret body", { status: 504 })));
    await expect(answerProductQuestion([{ role: "user", content: "AIP가 무엇인가요?" }], "ko", new AbortController().signal)).rejects.toMatchObject({
      code: "PROVIDER_ERROR",
      status: 502,
    });
    expect(warn).toHaveBeenCalledWith("[ai-chat]", expect.objectContaining({
      event: "provider_http_error",
      status: 504,
      provider: "ai-gateway",
    }));
    expect(JSON.stringify(warn.mock.calls)).not.toContain("stage-secret");
    expect(JSON.stringify(warn.mock.calls)).not.toContain("upstream secret body");
  });
});
