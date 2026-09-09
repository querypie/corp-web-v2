import { afterEach, describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
import { answerProductQuestion, parseGroundedAnswer } from "./answer.server";
import { knowledgeChunks } from "./knowledge";

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
  it("API key 없이 사내 모델을 호출하고 원문 근거를 함께 제공한다", async () => {
    vi.stubEnv("AI_CHAT_BASE_URL", "https://internal-llm.querypie.io/v1");
    vi.stubEnv("AI_CHAT_MODEL", "glm-5.3-flash");
    vi.stubEnv("AI_CHAT_API_KEY", "");
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ choices: [{ finish_reason: "stop", message: { content: '{"answer":"자료가 부족합니다.","sourceIds":[],"answered":false}' } }] }) });
    vi.stubGlobal("fetch", fetchMock);
    const result = await answerProductQuestion([{ role: "user", content: "AIP가 무엇인가요?" }], "ko", new AbortController().signal);
    expect(result.answered).toBe(false);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://internal-llm.querypie.io/v1/chat/completions");
    expect(init.headers.Authorization).toBeUndefined();
    expect(JSON.parse(init.body).model).toBe("glm-5.3-flash");
    expect(JSON.parse(init.body).messages[1].content).toContain("Official source excerpts");
  });
});
