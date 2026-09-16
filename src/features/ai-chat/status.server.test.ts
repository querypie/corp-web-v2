import { afterEach, describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
import { AI_CHAT_BASE_URL, AI_CHAT_MODEL } from "@/features/ai/config.server";
import { getAiChatStatusConfig, probeAiChat } from "./status.server";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("AI Chat 상태 점검 서비스", () => {
  it("공개 가능한 설정만 반환하고 키는 포함하지 않는다", () => {
    vi.stubEnv("AI_CHAT_ENABLED", "true");
    vi.stubEnv("AI_CHAT_API_KEY", "stage-secret");
    vi.stubEnv("VERCEL_TARGET_ENV", "preview");

    expect(getAiChatStatusConfig()).toEqual({
      enabled: true,
      keyConfigured: true,
      baseUrl: AI_CHAT_BASE_URL,
      model: AI_CHAT_MODEL,
      samplePrompt: "Reply with exactly OK and no other text.",
      environment: "preview",
    });
  });

  it("VERCEL_TARGET_ENV가 없으면 VERCEL_ENV를 환경 이름으로 사용한다", () => {
    vi.stubEnv("AI_CHAT_ENABLED", "true");
    vi.stubEnv("AI_CHAT_API_KEY", "stage-secret");
    vi.stubEnv("VERCEL_TARGET_ENV", undefined);
    vi.stubEnv("VERCEL_ENV", "preview");

    expect(getAiChatStatusConfig().environment).toBe("preview");
  });

  it("비활성화 또는 키 누락이면 upstream fetch를 실행하지 않는다", async () => {
    const fetcher = vi.fn();
    vi.stubGlobal("fetch", fetcher);

    vi.stubEnv("AI_CHAT_ENABLED", "false");
    vi.stubEnv("AI_CHAT_API_KEY", "stage-secret");
    await expect(probeAiChat(new AbortController().signal)).resolves.toMatchObject({
      ok: false,
      upstreamStatus: null,
      code: "DISABLED",
    });

    vi.stubEnv("AI_CHAT_ENABLED", "true");
    vi.stubEnv("AI_CHAT_API_KEY", "");
    await expect(probeAiChat(new AbortController().signal)).resolves.toMatchObject({
      ok: false,
      upstreamStatus: null,
      code: "NOT_CONFIGURED",
    });

    expect(fetcher).not.toHaveBeenCalled();
  });

  it("Gateway에 고정 OK 요청만 보내고 내부 추론과 키를 노출하지 않는다", async () => {
    vi.stubEnv("AI_CHAT_ENABLED", "true");
    vi.stubEnv("AI_CHAT_API_KEY", "stage-secret");
    const fetcher = vi.fn().mockResolvedValue(new Response(JSON.stringify({
      choices: [{
        finish_reason: "stop",
        message: {
          reasoning_content: "hidden chain",
          content: "OK",
        },
      }],
    }), { status: 200, headers: { "content-type": "application/json", server: "awselb/2.0" } }));
    vi.stubGlobal("fetch", fetcher);

    const result = await probeAiChat(new AbortController().signal);

    expect(result).toMatchObject({
      ok: true,
      upstreamStatus: 200,
      responseType: "json",
      responseServer: "awselb",
      answer: "OK",
      finishReason: "stop",
      code: "OK",
    });
    const [url, init] = fetcher.mock.calls[0];
    expect(url).toBe(`${AI_CHAT_BASE_URL}/chat/completions`);
    expect(init.headers.Authorization).toBe("Bearer stage-secret");
    const body = JSON.parse(init.body);
    expect(body).toEqual({
      model: AI_CHAT_MODEL,
      reasoning_effort: "low",
      max_tokens: 512,
      temperature: 0,
      messages: [{ role: "user", content: "Reply with exactly OK and no other text." }],
    });
    expect(JSON.stringify(result)).not.toContain("stage-secret");
    expect(JSON.stringify(result)).not.toContain("hidden chain");
  });

  it("HTTP 오류는 본문 없이 상태와 안전한 응답 분류만 반환한다", async () => {
    vi.stubEnv("AI_CHAT_ENABLED", "true");
    vi.stubEnv("AI_CHAT_API_KEY", "stage-secret");
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("<html>secret</html>", {
      status: 403,
      headers: { "content-type": "text/html", server: "awselb/2.0" },
    })));

    const result = await probeAiChat(new AbortController().signal);

    expect(result).toMatchObject({
      ok: false,
      upstreamStatus: 403,
      responseType: "html",
      responseServer: "awselb",
      answer: null,
      finishReason: null,
      code: "UPSTREAM_HTTP_ERROR",
    });
    expect(JSON.stringify(result)).not.toContain("secret");
  });

  it("OK 외 답변이나 stop 이외 종료는 제한된 답변만 담아 INVALID_RESPONSE로 반환한다", async () => {
    vi.stubEnv("AI_CHAT_ENABLED", "true");
    vi.stubEnv("AI_CHAT_API_KEY", "stage-secret");
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({
      choices: [{ finish_reason: "length", message: { content: `${"x".repeat(2100)}NO` } }],
    }), { status: 200, headers: { "content-type": "application/json" } })));

    const result = await probeAiChat(new AbortController().signal);

    expect(result).toMatchObject({
      ok: false,
      upstreamStatus: 200,
      responseType: "json",
      responseServer: "other",
      finishReason: "length",
      code: "INVALID_RESPONSE",
    });
    expect(result.answer).toHaveLength(2000);
  });

  it("null, primitive, malformed choices 응답을 원문 없이 INVALID_RESPONSE로 반환한다", async () => {
    vi.stubEnv("AI_CHAT_ENABLED", "true");
    vi.stubEnv("AI_CHAT_API_KEY", "stage-secret");
    const fetcher = vi.fn()
      .mockResolvedValueOnce(new Response("null", { status: 200, headers: { "content-type": "application/json" } }))
      .mockResolvedValueOnce(new Response("\"raw secret\"", { status: 200, headers: { "content-type": "application/json" } }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ choices: "raw secret" }), { status: 200, headers: { "content-type": "application/json" } }));
    vi.stubGlobal("fetch", fetcher);

    for (let index = 0; index < 3; index++) {
      const result = await probeAiChat(new AbortController().signal);
      expect(result).toMatchObject({
        ok: false,
        upstreamStatus: 200,
        responseType: "json",
        code: "INVALID_RESPONSE",
      });
      expect(JSON.stringify(result)).not.toContain("raw secret");
    }
  });

  it("response.json 중 timeout이 발생하면 응답 메타데이터와 함께 TIMEOUT으로 분류한다", async () => {
    vi.stubEnv("AI_CHAT_ENABLED", "true");
    vi.stubEnv("AI_CHAT_API_KEY", "stage-secret");
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({ "content-type": "application/json", server: "awselb/2.0" }),
      json: vi.fn().mockRejectedValue(new DOMException("timeout", "TimeoutError")),
    }));

    await expect(probeAiChat(new AbortController().signal)).resolves.toMatchObject({
      ok: false,
      upstreamStatus: 200,
      responseType: "json",
      responseServer: "awselb",
      answer: null,
      finishReason: null,
      code: "TIMEOUT",
    });
  });

  it("timeout과 네트워크 오류를 안전한 코드로 분류한다", async () => {
    vi.stubEnv("AI_CHAT_ENABLED", "true");
    vi.stubEnv("AI_CHAT_API_KEY", "stage-secret");
    vi.stubGlobal("fetch", vi.fn()
      .mockRejectedValueOnce(new DOMException("timeout", "TimeoutError"))
      .mockRejectedValueOnce(Object.assign(new Error("connect failed"), { code: "ECONNRESET" })));

    await expect(probeAiChat(new AbortController().signal)).resolves.toMatchObject({
      ok: false,
      upstreamStatus: null,
      code: "TIMEOUT",
    });
    await expect(probeAiChat(new AbortController().signal)).resolves.toMatchObject({
      ok: false,
      upstreamStatus: null,
      code: "NETWORK_ERROR",
      networkCode: "ECONNRESET",
    });
  });
});
