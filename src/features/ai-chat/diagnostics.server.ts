import "server-only";

type SafeErrorInfo = {
  name?: string;
  code?: string;
  causeCode?: string;
};

type DiagnosticFields = {
  provider?: "ai-gateway";
  contentType?: "html" | "json" | "other";
  server?: "awselb" | "other";
  status?: number;
  durationMs?: number;
  chunks?: number;
  references?: number;
  requestBytes?: number;
  messageCount?: number;
  error?: SafeErrorInfo;
};

const safeErrorNames = new Set(["Error", "TypeError", "SyntaxError", "AbortError", "TimeoutError"]);
const safeCodes = new Set([
  "UND_ERR_CONNECT_TIMEOUT",
  "ENOTFOUND",
  "EAI_AGAIN",
  "ECONNREFUSED",
  "ECONNRESET",
  "ETIMEDOUT",
  "CERT_HAS_EXPIRED",
  "UNABLE_TO_VERIFY_LEAF_SIGNATURE",
  "SELF_SIGNED_CERT_IN_CHAIN",
  "DEPTH_ZERO_SELF_SIGNED_CERT",
  "ERR_TLS_CERT_ALTNAME_INVALID",
  "NOT_CONFIGURED",
  "PROVIDER_ERROR",
  "INVALID_RESPONSE",
]);

const safeCode = (value: unknown): string | undefined =>
  typeof value === "string" && safeCodes.has(value) ? value : undefined;

export function safeErrorInfo(error: unknown): SafeErrorInfo {
  if (!(error instanceof Error)) return {};
  const cause = error.cause;
  return {
    name: safeErrorNames.has(error.name) ? error.name : "Error",
    code: safeCode((error as { code?: unknown }).code),
    causeCode: safeCode(cause && typeof cause === "object" ? (cause as { code?: unknown }).code : undefined),
  };
}

export function safeResponseInfo(response: Response): Pick<DiagnosticFields, "contentType" | "server"> {
  const contentType = response.headers.get("content-type") ?? "";
  return {
    contentType: contentType.includes("json") ? "json" : contentType.includes("html") ? "html" : "other",
    server: response.headers.get("server")?.toLowerCase() === "awselb/2.0" ? "awselb" : "other",
  };
}

export function logAiChatDiagnostic(event: string, fields: DiagnosticFields & Record<string, unknown> = {}) {
  const entry: DiagnosticFields & { event: string } = { event };
  if (fields.provider === "ai-gateway") entry.provider = fields.provider;
  if (fields.contentType) entry.contentType = fields.contentType;
  if (fields.server) entry.server = fields.server;
  for (const key of ["status", "durationMs", "chunks", "references", "requestBytes", "messageCount"] as const) {
    if (typeof fields[key] === "number" && Number.isFinite(fields[key])) entry[key] = fields[key];
  }
  if (fields.error) entry.error = fields.error;
  const write = /(?:_error|invalid_response)$/.test(event) ? console.warn : console.info;
  write("[ai-chat]", entry);
}
