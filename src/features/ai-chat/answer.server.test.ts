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

afterEach(() => { vi.unstubAllGlobals(); vi.unstubAllEnvs(); });

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
    expect(JSON.parse(init.body).messages[1].content).toContain("Official source excerpts");
  });
  it("최신 원문을 읽지 못하면 모델을 호출하지 않고 근거 부족을 안내한다", async () => {
    vi.stubEnv("AI_CHAT_ENABLED", "true");
    vi.stubEnv("AI_CHAT_API_KEY", "stage-secret");
    vi.mocked(retrieveLiveKnowledge).mockResolvedValueOnce([]);
    const fetcher = vi.fn();
    vi.stubGlobal("fetch", fetcher);
    const reply = await answerProductQuestion([{ role: "user", content: "AIP 요금" }], "ko", AbortSignal.timeout(1000));
    expect(reply).toMatchObject({ answered: false, sources: [] });
    expect(fetcher).not.toHaveBeenCalled();
  });
});
