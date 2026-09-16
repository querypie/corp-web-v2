// @vitest-environment node
import { afterEach, describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));

const okResult = {
  ok: true,
  checkedAt: "2026-09-16T00:00:00.000Z",
  durationMs: 10,
  upstreamStatus: 200,
  responseType: "json",
  responseServer: "awselb",
  answer: "OK",
  finishReason: "stop",
  code: "OK",
} as const;

const request = (body: unknown = {}, headers: Record<string, string> = {}) => new Request("https://www.querypie.com/api/internal/ai-chat-status", {
  method: "POST",
  headers: { "Content-Type": "application/json", ...headers },
  body: JSON.stringify(body),
});

async function loadRoute(options: {
  config?: { enabled: boolean; keyConfigured: boolean };
  result?: unknown;
  pending?: boolean;
} = {}) {
  vi.resetModules();
  const probeAiChat = options.pending
    ? vi.fn(() => new Promise(() => {}))
    : vi.fn().mockResolvedValue(options.result ?? okResult);
  const getAiChatStatusConfig = vi.fn(() => ({
    enabled: options.config?.enabled ?? true,
    keyConfigured: options.config?.keyConfigured ?? true,
    baseUrl: "https://ai-gateway.stg.querypie.com/v1",
    model: "querypie-internal/glm53-flash/glm-5.3-flash",
    samplePrompt: "Reply with exactly OK and no other text.",
    environment: "preview",
  }));
  vi.doMock("@/features/ai-chat/status.server", () => ({ getAiChatStatusConfig, probeAiChat }));
  const route = await import("./route");
  return { route, getAiChatStatusConfig, probeAiChat };
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  vi.resetModules();
});

describe("AI Chat 상태 점검 API", () => {
  it("빈 JSON 객체 POST만 허용하고 다른 필드는 거부한다", async () => {
    const { route, probeAiChat } = await loadRoute();

    expect((await route.POST(request({ prompt: "override" }))).status).toBe(400);
    expect((await route.POST(new Request("https://www.querypie.com/api/internal/ai-chat-status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{",
    }))).status).toBe(400);
    expect((await route.POST(new Request("https://www.querypie.com/api/internal/ai-chat-status", {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: "{}",
    }))).status).toBe(400);
    expect(probeAiChat).not.toHaveBeenCalled();
  });

  it("다른 Origin 요청을 거부한다", async () => {
    const { route, probeAiChat } = await loadRoute();

    const result = await route.POST(request({}, { Origin: "https://evil.example" }));

    expect(result.status).toBe(403);
    expect(await result.json()).toEqual({ code: "INVALID_ORIGIN" });
    expect(probeAiChat).not.toHaveBeenCalled();
  });

  it("비활성화 또는 키 누락은 호출 예산을 쓰기 전에 typed result로 503 반환한다", async () => {
    const disabled = {
      ...okResult,
      ok: false,
      upstreamStatus: null,
      responseType: null,
      responseServer: null,
      answer: null,
      finishReason: null,
      code: "DISABLED",
    };
    const { route, probeAiChat } = await loadRoute({ config: { enabled: false, keyConfigured: true }, result: disabled });

    const first = await route.POST(request());
    const second = await route.POST(request());
    const third = await route.POST(request());

    expect(first.status).toBe(503);
    expect(await first.json()).toEqual(disabled);
    expect(second.status).toBe(503);
    expect(third.status).toBe(503);
    expect(probeAiChat).toHaveBeenCalledTimes(3);
  });

  it("성공과 upstream 403을 캐시 없이 200 result로 반환한다", async () => {
    const upstream403 = {
      ...okResult,
      ok: false,
      upstreamStatus: 403,
      responseType: "html",
      responseServer: "awselb",
      answer: null,
      finishReason: null,
      code: "UPSTREAM_HTTP_ERROR",
    };
    const { route } = await loadRoute({ result: upstream403 });

    const result = await route.POST(request());

    expect(result.status).toBe(200);
    expect(result.headers.get("cache-control")).toBe("no-store");
    expect(await result.json()).toEqual(upstream403);
  });

  it("분당 2회와 동시 1회 제한을 Retry-After와 함께 반환한다", async () => {
    const limited = await loadRoute();
    expect((await limited.route.POST(request())).status).toBe(200);
    expect((await limited.route.POST(request())).status).toBe(200);
    const third = await limited.route.POST(request());
    expect(third.status).toBe(429);
    expect(third.headers.get("retry-after")).toBeTruthy();
    expect(await third.json()).toMatchObject({ code: "RATE_LIMITED", retryAfterSeconds: expect.any(Number) });

    const concurrent = await loadRoute({ pending: true });
    void concurrent.route.POST(request());
    const busy = await concurrent.route.POST(request());
    expect(busy.status).toBe(429);
    expect(await busy.json()).toMatchObject({ code: "RATE_LIMITED", retryAfterSeconds: expect.any(Number) });
  });
});
