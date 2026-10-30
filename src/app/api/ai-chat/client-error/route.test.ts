// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const body = { locale: "ko", name: "ChunkLoadError", message: "Loading chunk failed", occurredAt: "2026-10-30T05:00:00Z" };
const request = (value: unknown = body, origin = "https://www.querypie.com") => new Request("https://www.querypie.com/api/ai-chat/client-error", {
  method: "POST",
  headers: { "Content-Type": "application/json", Origin: origin },
  body: JSON.stringify(value),
});

beforeEach(() => {
  vi.resetModules();
  vi.spyOn(console, "error").mockImplementation(() => undefined);
});
afterEach(() => { vi.restoreAllMocks(); });

describe("채팅 브라우저 진단 API", () => {
  it("허용한 진단 필드만 수집하고 URL 검색어와 대화 데이터는 제외한다", async () => {
    const { POST } = await import("./route");
    const result = await POST(request({
      ...body,
      pathname: "/ko?email=private@example.com",
      failedAsset: "https://www.querypie.com/_next/static/chunks/chat.js?token=secret#hash",
      message: "failed https://www.querypie.com/_next/chat.js?token=secret",
      stack: "at render (https://www.querypie.com/_next/chat.js?dpl=old:1:321)\n" + "x".repeat(5000),
      draft: "private draft",
      messages: ["private answer"],
      slackThreadToken: "private token",
    }));
    expect(result.status).toBe(204);
    expect(result.headers.get("cache-control")).toBe("no-store");
    const [tag, json] = vi.mocked(console.error).mock.calls[0];
    expect(tag).toBe("[ai-chat-client-error]");
    const report = JSON.parse(json);
    expect(report.pathname).toBe("/ko");
    expect(report.failedAsset).toBe("https://www.querypie.com/_next/static/chunks/chat.js");
    expect(report.stack).toHaveLength(3000);
    expect(report.stack).toContain("https://www.querypie.com/_next/chat.js:1:321");
    expect(json).not.toMatch(/private|secret|token=|email=/);
    expect(report).toHaveProperty("receivedAt");
  });

  it("다른 Origin, 잘못된 payload 및 과도한 본문을 기록하지 않는다", async () => {
    const { POST } = await import("./route");
    expect((await POST(request(body, "https://other.example"))).status).toBe(403);
    expect((await POST(request({ locale: "zh", name: "Error", message: "invalid" }))).status).toBe(400);
    expect((await POST(request({ ...body, message: "x".repeat(13000) }))).status).toBe(413);
    expect((await POST(new Request("https://www.querypie.com/api/ai-chat/client-error", {
      method: "POST", headers: { Origin: "https://www.querypie.com", "Content-Type": "application/json" }, body: "{",
    }))).status).toBe(400);
    expect(console.error).not.toHaveBeenCalled();
  });

  it("인스턴스별 기록량을 제한한다", async () => {
    const { POST } = await import("./route");
    for (let i = 0; i < 20; i++) expect((await POST(request())).status).toBe(204);
    expect((await POST(request())).status).toBe(429);
    expect(console.error).toHaveBeenCalledTimes(20);
  });
});
