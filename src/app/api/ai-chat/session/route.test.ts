// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
import { POST } from "./route";
import { resolveConversationId } from "@/features/ai-chat/conversation.server";

const origin = "https://www.querypie.com";
const request = (from = origin) => new Request(`${origin}/api/ai-chat/session`, { method: "POST", headers: { Origin: from } });
beforeEach(() => {
  vi.stubEnv("AI_CHAT_ENABLED", "true");
  vi.stubEnv("AI_CHAT_API_KEY", "test-api-key");
  vi.stubEnv("AI_CHAT_SESSION_SECRET", "test-signing-key-with-at-least-32-bytes");
});
afterEach(() => { vi.unstubAllEnvs(); });

describe("대화 시작 API", () => {
  it("LLM 호출 없이 고유 토큰을 발급하고 캐시하지 않는다", async () => {
    const first = await POST(request());
    const second = await POST(request());
    const a = await first.json();
    const b = await second.json();
    expect(first.status).toBe(200);
    expect(first.headers.get("cache-control")).toBe("no-store");
    expect(a.conversationToken).not.toBe(b.conversationToken);
    expect(resolveConversationId(a.conversationToken, origin)).toBeTruthy();
  });

  it("다른 사이트에서 발급 요청을 보내면 거부한다", async () => {
    expect((await POST(request("https://other.example"))).status).toBe(403);
  });

  it.each(["AI_CHAT_ENABLED", "AI_CHAT_API_KEY", "AI_CHAT_SESSION_SECRET"])("%s 설정이 없으면 발급하지 않는다", async (key) => {
    vi.stubEnv(key, "");
    const response = await POST(request());
    expect(response.status).toBe(503);
    expect(await response.json()).toEqual({ code: "NOT_CONFIGURED" });
  });
});
