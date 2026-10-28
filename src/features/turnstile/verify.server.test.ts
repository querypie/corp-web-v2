import { afterEach, describe, expect, it, vi } from "vitest";
import { verifyTurnstileToken } from "./verify.server";

describe("verifyTurnstileToken", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it("Turnstile 환경 변수가 없으면 검증을 건너뛴다", async () => {
    await expect(verifyTurnstileToken(undefined)).resolves.toEqual({ ok: true, configured: false });
  });

  it("Site Key만 있으면 잘못된 설정으로 거부한다", async () => {
    vi.stubEnv("NEXT_PUBLIC_TURNSTILE_SITE_KEY", "site-key");
    await expect(verifyTurnstileToken("token")).resolves.toEqual({ ok: false, reason: "misconfigured" });
  });

  it("Secret Key만 있으면 잘못된 설정으로 거부한다", async () => {
    vi.stubEnv("TURNSTILE_SECRET_KEY", "secret-key");
    await expect(verifyTurnstileToken("token")).resolves.toEqual({ ok: false, reason: "misconfigured" });
  });

  it("유효한 토큰은 Cloudflare 검증 API를 통과한다", async () => {
    vi.stubEnv("NEXT_PUBLIC_TURNSTILE_SITE_KEY", "site-key");
    vi.stubEnv("TURNSTILE_SECRET_KEY", "secret-key");
    const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    } as Response);

    await expect(verifyTurnstileToken("token", "203.0.113.10")).resolves.toEqual({ ok: true, configured: true });
    expect(fetchSpy).toHaveBeenCalledWith(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      expect.objectContaining({ method: "POST" }),
    );
  });

  it("토큰이 없으면 Cloudflare API를 호출하지 않고 거부한다", async () => {
    vi.stubEnv("NEXT_PUBLIC_TURNSTILE_SITE_KEY", "site-key");
    vi.stubEnv("TURNSTILE_SECRET_KEY", "secret-key");
    const fetchSpy = vi.spyOn(global, "fetch");

    await expect(verifyTurnstileToken(undefined)).resolves.toEqual({ ok: false, reason: "missing" });
    expect(fetchSpy).not.toHaveBeenCalled();
  });
});
