import { afterEach, describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
import { AI_CHAT_BASE_URL_PROD, AI_CHAT_MODEL } from "@/features/ai/config.server";
import { answerProductQuestion } from "./answer.server";
import { parseProviderReply } from "./reply";

afterEach(() => { vi.unstubAllGlobals(); vi.unstubAllEnvs(); vi.restoreAllMocks(); });

describe("Hermes Agent AI 답변", () => {
  it("Hermes 본문을 그대로 반환하고 Markdown 링크와 일반 URL을 sources로 정규화한다", () => {
    const content = [
      "AIP 안내는 [공식 문서](https://aip-docs.app.querypie.com/ko)를 확인하세요.",
      "제품 페이지: https://www.querypie.com/ko/platforms/aip.",
    ].join("\n");

    expect(parseProviderReply({
      choices: [{ finish_reason: "stop", message: { role: "assistant", content } }],
    })).toEqual({
      answer: content,
      sources: [
        { title: "공식 문서", url: "https://aip-docs.app.querypie.com/ko" },
        { title: "www.querypie.com", url: "https://www.querypie.com/ko/platforms/aip" },
      ],
    });
  });

  it("finish_reason이나 출처 유무로 답변 품질을 판정하지 않는다", () => {
    expect(parseProviderReply({
      choices: [{ finish_reason: "length", message: { content: "Hermes가 반환한 답변" } }],
    })).toEqual({ answer: "Hermes가 반환한 답변", sources: [] });
  });

  it("빈 본문과 허용 길이를 넘는 본문만 안전하지 않은 응답으로 거부한다", () => {
    expect(() => parseProviderReply({ choices: [{ message: { content: "   " } }] })).toThrow("INVALID_RESPONSE");
    expect(() => parseProviderReply({ choices: [{ message: { content: "x".repeat(6001) } }] })).toThrow("INVALID_RESPONSE");
  });

  it("API key가 없으면 Hermes를 호출하지 않고 설정 오류를 반환한다", async () => {
    vi.stubEnv("AI_CHAT_ENABLED", "true");
    vi.stubEnv("AI_CHAT_API_KEY", "");
    const fetcher = vi.fn();
    vi.stubGlobal("fetch", fetcher);

    await expect(answerProductQuestion([{ role: "user", content: "AIP가 무엇인가요?" }], "ko", new AbortController().signal)).rejects.toMatchObject({
      code: "NOT_CONFIGURED",
      status: 503,
    });
    expect(fetcher).not.toHaveBeenCalled();
  });

  it("웹사이트 프롬프트나 외부 문서 없이 대화만 Hermes Wrapper에 전달한다", async () => {
    vi.stubEnv("AI_CHAT_ENABLED", "true");
    vi.stubEnv("AI_CHAT_API_KEY", "environment-secret");
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ choices: [{ finish_reason: "stop", message: { content: "Hermes 답변" } }] }),
    });
    vi.stubGlobal("fetch", fetchMock);

    const messages = [
      { role: "user" as const, content: "AIP가 무엇인가요?" },
      { role: "assistant" as const, content: "이전 답변" },
      { role: "user" as const, content: "공식 문서도 알려줘" },
    ];
    await expect(answerProductQuestion(messages, "ko", new AbortController().signal)).resolves.toEqual({
      answer: "Hermes 답변",
      sources: [],
    });

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe(`${AI_CHAT_BASE_URL_PROD}/chat/completions`);
    expect(init.headers.Authorization).toBe("Bearer environment-secret");
    expect(JSON.parse(init.body)).toEqual({ model: AI_CHAT_MODEL, messages });
  });

  it("Hermes HTTP 오류 시 본문이나 키 없이 경계 진단만 기록한다", async () => {
    vi.stubEnv("AI_CHAT_ENABLED", "true");
    vi.stubEnv("AI_CHAT_API_KEY", "environment-secret");
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("upstream secret body", {
      status: 504,
      headers: { "content-type": "text/html", server: "awselb/2.0" },
    })));

    await expect(answerProductQuestion([{ role: "user", content: "AIP가 무엇인가요?" }], "ko", new AbortController().signal)).rejects.toMatchObject({
      code: "PROVIDER_ERROR",
      status: 502,
    });
    expect(JSON.stringify(warn.mock.calls)).not.toContain("environment-secret");
    expect(JSON.stringify(warn.mock.calls)).not.toContain("upstream secret body");
  });
});
