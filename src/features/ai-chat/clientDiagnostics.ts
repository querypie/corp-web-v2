import { isLocale, type Locale } from "@/constants/i18n";

export const MAX_DIAGNOSTIC_BYTES = 12000;

// Strip URL queries/fragments, which may contain attribution or credentials.
function clean(value: string, limit: number) {
  return value.replace(/https?:\/\/[^\s)]+/g, (url) => {
    if (!/[?#]/.test(url)) return url;
    // Vercel's deployment query can precede :line:column in a JS stack frame.
    const position = url.match(/:\d+:\d+$/)?.[0] ?? "";
    return url.split(/[?#]/)[0] + position;
  }).slice(0, limit);
}

export function parseClientDiagnostic(value: unknown) {
  if (!value || typeof value !== "object") return null;
  const report = value as Record<string, unknown>;
  if (typeof report.locale !== "string" || !isLocale(report.locale) || typeof report.name !== "string" || typeof report.message !== "string") return null;
  const text = (key: string, limit: number) => typeof report[key] === "string" ? clean(report[key], limit) : "";
  return {
    locale: report.locale,
    occurredAt: text("occurredAt", 40),
    // Record the page path only, never its search params or hash.
    pathname: text("pathname", 200).split(/[?#]/)[0],
    deploymentId: text("deploymentId", 100),
    name: text("name", 80),
    message: text("message", 500),
    stack: text("stack", 3000),
    componentStack: text("componentStack", 1500),
    failedAsset: text("failedAsset", 500),
    userAgent: text("userAgent", 300),
    online: report.online === true,
  };
}

export function reportChatClientError(error: Error, componentStack: string | null | undefined, locale: Locale) {
  try {
    const scripts = Array.from(document.scripts);
    const deploymentId = scripts.map((script) => new URL(script.src, location.href).searchParams.get("dpl")).find(Boolean) ?? "";
    const request = "request" in error && typeof error.request === "string" ? error.request : "";
    const report = parseClientDiagnostic({
      locale,
      occurredAt: new Date().toISOString(),
      pathname: location.pathname,
      deploymentId,
      name: error.name,
      message: error.message,
      // Omit the message line from the stack; the bounded message is sent separately.
      stack: error.stack?.split("\n").slice(1).join("\n"),
      componentStack,
      failedAsset: request,
      userAgent: navigator.userAgent,
      online: navigator.onLine,
    });
    if (!report) return;
    // Keep escaped/non-ASCII stacks within the server's byte limit as well.
    let body = JSON.stringify(report);
    while (new TextEncoder().encode(body).byteLength > MAX_DIAGNOSTIC_BYTES) {
      report.stack = report.stack.slice(0, Math.floor(report.stack.length / 2));
      report.componentStack = report.componentStack.slice(0, Math.floor(report.componentStack.length / 2));
      report.message = report.message.slice(0, Math.floor(report.message.length / 2));
      body = JSON.stringify(report);
    }
    // No session, draft, answer, cookie, or thread token is included.
    void fetch("/api/ai-chat/client-error", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
      credentials: "omit",
    }).catch(() => undefined);
  } catch {
    // Diagnostics must never cause another client exception.
  }
}
