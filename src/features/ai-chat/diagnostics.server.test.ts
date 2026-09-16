// @vitest-environment node
import { afterEach, describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
import { logAiChatDiagnostic, safeErrorInfo } from "./diagnostics.server";

afterEach(() => { vi.restoreAllMocks(); });

describe("AI Chat 서버 진단", () => {
  it("오류 이름과 cause code만 남기고 메시지·본문·키 후보는 기록하지 않는다", () => {
    const warning = vi.spyOn(console, "warn").mockImplementation(() => {});
    const cause = Object.assign(new Error("token abc123"), { code: "ECONNRESET" });
    const error = new TypeError("Bearer sk-secret failed", { cause });
    logAiChatDiagnostic("provider_fetch_error", { error: safeErrorInfo(error), apiKey: "stage-secret", body: "upstream body" });
    const printed = JSON.stringify(warning.mock.calls);
    expect(printed).toContain("TypeError");
    expect(printed).toContain("ECONNRESET");
    expect(printed).not.toContain("Bearer sk-secret");
    expect(printed).not.toContain("stage-secret");
    expect(printed).not.toContain("upstream body");
    expect(printed).not.toContain("token abc123");
  });
});
