const TURNSTILE_VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

type TurnstileResponse = {
  success?: boolean;
};

export type TurnstileVerification =
  | { ok: true; configured: false }
  | { ok: true; configured: true }
  | { ok: false; reason: "missing" | "failed" | "misconfigured" };

export async function verifyTurnstileToken(
  token: string | undefined,
  remoteIp?: string,
): Promise<TurnstileVerification> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  if (!secret && !siteKey) {
    if (process.env.VERCEL_ENV === "production" || process.env.VERCEL_ENV === "preview") {
      return { ok: false, reason: "misconfigured" };
    }
    return { ok: true, configured: false };
  }
  if (!secret || !siteKey) return { ok: false, reason: "misconfigured" };
  if (!token) return { ok: false, reason: "missing" };

  try {
    const body = new URLSearchParams({ secret, response: token });
    if (remoteIp) body.set("remoteip", remoteIp);

    const response = await fetch(TURNSTILE_VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) return { ok: false, reason: "failed" };

    const result = (await response.json()) as TurnstileResponse;
    return result.success ? { ok: true, configured: true } : { ok: false, reason: "failed" };
  } catch (error) {
    console.error("[contact-us] turnstile: verification failed", error);
    return { ok: false, reason: "failed" };
  }
}
