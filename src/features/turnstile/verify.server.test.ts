import { afterEach, describe, expect, it, vi } from "vitest";
import { verifyTurnstileToken } from "./verify.server";

describe("verifyTurnstileToken", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it("Turnstile 환경 변수가 없으면 검증을 건너뛴다", async () => {
    vi.stubEnv("VERCEL_ENV", "development");
    vi.stubEnv("NEXT_PUBLIC_TURNSTILE_SITE_KEY", "");
    vi.stubEnv("TURNSTILE_SECRET_KEY", "");
    await expect(verifyTurnstileToken(undefined)).resolves.toEqual({ ok: true, configured: false });
  });

  it.each(["preview", "production"])("%s에서 키가 모두 없으면 거부한다", async (environment) => {
    vi.stubEnv("VERCEL_ENV", environment);
    vi.stubEnv("NEXT_PUBLIC_TURNSTILE_SITE_KEY", "");
    vi.stubEnv("TURNSTILE_SECRET_KEY", "");
    await expect(verifyTurnstileToken(undefined)).resolves.toEqual({ ok: false, reason: "misconfigured" });
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

  it("Siteverify가 반환한 hostname이 요청 호스트와 같으면 통과한다", async () => {
    vi.stubEnv("NEXT_PUBLIC_TURNSTILE_SITE_KEY", "site-key");
    vi.stubEnv("TURNSTILE_SECRET_KEY", "secret-key");
    vi.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, hostname: "Stage.QueryPie.com." }),
    } as Response);

    await expect(
      verifyTurnstileToken("token", undefined, "stage.querypie.com:443"),
    ).resolves.toEqual({ ok: true, configured: true });
  });

  it("Siteverify가 반환한 hostname이 요청 호스트와 다르면 거부한다", async () => {
    vi.stubEnv("NEXT_PUBLIC_TURNSTILE_SITE_KEY", "site-key");
    vi.stubEnv("TURNSTILE_SECRET_KEY", "secret-key");
    vi.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, hostname: "attacker.example.com" }),
    } as Response);

    await expect(
      verifyTurnstileToken("token", undefined, "stage.querypie.com"),
    ).resolves.toEqual({ ok: false, reason: "failed" });
  });

  it("요청 호스트를 확인하는데 응답에 hostname이 없으면 거부한다", async () => {
    vi.stubEnv("NEXT_PUBLIC_TURNSTILE_SITE_KEY", "site-key");
    vi.stubEnv("TURNSTILE_SECRET_KEY", "secret-key");
    vi.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    } as Response);

    await expect(
      verifyTurnstileToken("token", undefined, "stage.querypie.com"),
    ).resolves.toEqual({ ok: false, reason: "failed" });
  });

  it("Cloudflare 요청 실패 시 거부한다", async () => {
    vi.stubEnv("NEXT_PUBLIC_TURNSTILE_SITE_KEY", "site-key");
    vi.stubEnv("TURNSTILE_SECRET_KEY", "secret-key");
    vi.spyOn(global, "fetch").mockRejectedValue(new Error("timeout"));
    vi.spyOn(console, "error").mockImplementation(() => {});
    await expect(verifyTurnstileToken("token")).resolves.toEqual({ ok: false, reason: "failed" });
  });
});
