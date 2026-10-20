// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
import { createConversationToken, resolveConversationId } from "./conversation.server";

const origin = "https://www.querypie.com";
beforeEach(() => { vi.stubEnv("AI_CHAT_SESSION_SECRET", "test-signing-key-with-at-least-32-bytes"); });
afterEach(() => { vi.unstubAllEnvs(); });

describe("홈페이지 대화 식별", () => {
  it("같은 첫 질문·서버에서도 독립 대화에 다른 ID를 발급한다", () => {
    const first = createConversationToken(origin);
    const second = createConversationToken(origin);
    expect(first).not.toBe(second);
    expect(resolveConversationId(first, origin)).toMatch(/^webchat-[a-f0-9]{64}$/);
    expect(resolveConversationId(first, origin)).not.toBe(resolveConversationId(second, origin));
  });

  it("다른 서버 인스턴스에서도 서명된 같은 토큰은 같은 ID가 된다", async () => {
    const token = createConversationToken(origin);
    const first = resolveConversationId(token, origin);
    vi.resetModules();
    const fresh = await import("./conversation.server");
    expect(fresh.resolveConversationId(token, origin)).toBe(first);
  });

  it("임의·변조·다른 환경·다른 사이트의 토큰을 거부한다", () => {
    const token = createConversationToken(origin);
    expect(resolveConversationId("api-another-session", origin)).toBeUndefined();
    expect(resolveConversationId(token.replace(/v1\.[^.]+/, "v1.11111111-1111-4111-8111-111111111111"), origin)).toBeUndefined();
    expect(resolveConversationId(token, "https://stage-v2.querypie.com")).toBeUndefined();
    vi.stubEnv("VERCEL_TARGET_ENV", "preview");
    expect(resolveConversationId(token, origin)).toBeUndefined();
  });

  it("서명 키가 없거나 짧으면 세션을 만들지 않는다", () => {
    for (const secret of ["", "short-api-key"]) {
      vi.stubEnv("AI_CHAT_SESSION_SECRET", secret);
      expect(() => createConversationToken(origin)).toThrow();
    }
  });

  it("대화 토큰과 원시 Native ID가 서로 다르고 서명 키 변경 후 기존 토큰을 거부한다", () => {
    const token = createConversationToken(origin);
    const id = resolveConversationId(token, origin);
    expect(token).not.toContain(id!);
    expect(id).not.toContain(token.split(".")[1]);
    vi.stubEnv("AI_CHAT_SESSION_SECRET", "another-test-signing-key-at-least-32-bytes");
    expect(resolveConversationId(token, origin)).toBeUndefined();
  });
});
