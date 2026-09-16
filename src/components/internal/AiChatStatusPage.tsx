"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Activity, AlertTriangle, CheckCircle2, Clock, Server } from "lucide-react";
import Button from "@/components/ui/Button";
import { aiChatStatusCopy as copy } from "@/copy/aiChatStatus";
import type { AiChatProbeResult, AiChatStatusConfig } from "@/features/ai-chat/status";

type AiChatStatusPageProps = {
  config: AiChatStatusConfig;
};

type ProbeState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "complete"; result: AiChatProbeResult }
  | { status: "error"; message: string; retryAfterSeconds?: number };

type ApiErrorBody = {
  code?: string;
  retryAfterSeconds?: number;
};

const endpoint = "/api/internal/ai-chat-status";
const probeCodes = new Set([
  "OK",
  "DISABLED",
  "NOT_CONFIGURED",
  "UPSTREAM_HTTP_ERROR",
  "INVALID_RESPONSE",
  "TIMEOUT",
  "NETWORK_ERROR",
]);

function Pill({ children, tone = "neutral" }: { children: string; tone?: "neutral" | "success" | "warning" | "danger" }) {
  const toneClassName = {
    danger: "border-red-200 bg-red-50 text-red-700",
    neutral: "border-border bg-bg text-fg",
    success: "border-emerald-200 bg-emerald-50 text-emerald-700",
    warning: "border-amber-200 bg-amber-50 text-amber-700",
  }[tone];
  return (
    <span className={`inline-flex w-fit items-center rounded-full border px-2.5 py-1 type-body-sm ${toneClassName}`}>
      {children}
    </span>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 rounded-box bg-bg px-4 py-3">
      <dt className="mb-1 type-body-sm text-mute">{label}</dt>
      <dd className="m-0 break-all type-body-md text-fg">{value}</dd>
    </div>
  );
}

function formatDuration(ms: number) {
  return `${Math.max(0, Math.round(ms)).toLocaleString("en-US")}ms`;
}

function formatResponseType(value: AiChatProbeResult["responseType"]) {
  if (!value) return "-";
  return value.toUpperCase();
}

function formatResponseServer(value: AiChatProbeResult["responseServer"]) {
  if (!value) return "-";
  return value === "awselb" ? "AWS ALB" : copy.values.other;
}

function getProbeMessage(result: AiChatProbeResult) {
  if (result.ok) return null;
  if (
    result.code === "UPSTREAM_HTTP_ERROR" &&
    result.upstreamStatus === 403 &&
    result.responseType === "html" &&
    result.responseServer === "awselb"
  ) {
    return copy.errors.albForbidden;
  }
  if (result.code === "DISABLED") return copy.errors.disabled;
  if (result.code === "NOT_CONFIGURED") return copy.errors.notConfigured;
  if (result.code === "INVALID_RESPONSE") return copy.errors.invalidResponse;
  if (result.code === "TIMEOUT") return copy.errors.timeout;
  if (result.code === "NETWORK_ERROR") return copy.errors.network;
  return copy.errors.generic;
}

function isNullableString(value: unknown): value is string | null {
  return typeof value === "string" || value === null;
}

function isNullableNumber(value: unknown): value is number | null {
  return (typeof value === "number" && Number.isFinite(value)) || value === null;
}

function isResponseType(value: unknown): value is AiChatProbeResult["responseType"] {
  return value === "json" || value === "html" || value === "other" || value === null;
}

function isResponseServer(value: unknown): value is AiChatProbeResult["responseServer"] {
  return value === "awselb" || value === "other" || value === null;
}

function isProbeResult(value: unknown): value is AiChatProbeResult {
  if (!value || typeof value !== "object") return false;
  const result = value as Record<string, unknown>;
  return (
    typeof result.ok === "boolean" &&
    typeof result.checkedAt === "string" &&
    typeof result.durationMs === "number" &&
    Number.isFinite(result.durationMs) &&
    isNullableNumber(result.upstreamStatus) &&
    isResponseType(result.responseType) &&
    isResponseServer(result.responseServer) &&
    isNullableString(result.answer) &&
    isNullableString(result.finishReason) &&
    typeof result.code === "string" &&
    probeCodes.has(result.code)
  );
}

function readRetryAfterSeconds(response: Response, body: unknown) {
  const bodyValue = (body as ApiErrorBody | null)?.retryAfterSeconds;
  if (typeof bodyValue === "number" && Number.isFinite(bodyValue)) {
    return Math.max(1, Math.ceil(bodyValue));
  }
  const headerValue = response.headers.get("Retry-After");
  if (!headerValue) return 60;
  const parsed = Number(headerValue);
  return Number.isFinite(parsed) ? Math.max(1, Math.ceil(parsed)) : 60;
}

async function readJson(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

export default function AiChatStatusPage({ config }: AiChatStatusPageProps) {
  const [probe, setProbe] = useState<ProbeState>({ status: "idle" });
  const [retryAfterSeconds, setRetryAfterSeconds] = useState(0);
  const abortControllerRef = useRef<AbortController | null>(null);

  const disabledReason = useMemo(() => {
    if (!config.enabled) return copy.notices.disabled;
    if (!config.keyConfigured) return copy.notices.missingKey;
    return null;
  }, [config.enabled, config.keyConfigured]);

  const isLoading = probe.status === "loading";
  const isButtonDisabled = Boolean(disabledReason) || isLoading || retryAfterSeconds > 0;
  const buttonLabel = retryAfterSeconds > 0 ? copy.retryAfter(retryAfterSeconds) : copy.action;

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  useEffect(() => {
    if (retryAfterSeconds <= 0) return undefined;
    const timer = window.setInterval(() => {
      setRetryAfterSeconds((current) => Math.max(0, current - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [retryAfterSeconds]);

  async function runProbe() {
    if (isButtonDisabled) return;
    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;
    setProbe({ status: "loading" });

    try {
      const response = await fetch(endpoint, {
        body: "{}",
        cache: "no-store",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        method: "POST",
        signal: controller.signal,
      });
      const body = await readJson(response);

      if (response.status === 429) {
        const retryAfter = readRetryAfterSeconds(response, body);
        setRetryAfterSeconds(retryAfter);
        setProbe({ status: "error", message: copy.errors.rateLimited, retryAfterSeconds: retryAfter });
        return;
      }

      if (!response.ok) {
        const code = (body as ApiErrorBody | null)?.code;
        const message = code === "DISABLED"
          ? copy.errors.disabled
          : code === "NOT_CONFIGURED"
            ? copy.errors.notConfigured
            : copy.errors.generic;
        setProbe({ status: "error", message });
        return;
      }

      if (!isProbeResult(body)) {
        setProbe({ status: "error", message: copy.errors.generic });
        return;
      }

      setProbe({ status: "complete", result: body });
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      setProbe({ status: "error", message: copy.errors.network });
    } finally {
      if (abortControllerRef.current === controller) abortControllerRef.current = null;
    }
  }

  const completedResult = probe.status === "complete" ? probe.result : null;
  const probeMessage = completedResult ? getProbeMessage(completedResult) : null;
  const hasFailure = Boolean(probeMessage) || probe.status === "error";
  const isProduction = config.environment.toLowerCase() === "production";

  return (
    <main className="min-h-screen bg-bg px-5 py-8 text-fg sm:px-8 lg:px-10" lang="ko">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        <header className="flex flex-col gap-3">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-bg-content px-3 py-1 type-body-sm text-mute">
            <Server aria-hidden="true" className="h-4 w-4" />
            {copy.eyebrow}
          </div>
          <div className="flex flex-col gap-2">
            <h1 className="m-0 type-h1 text-fg">{copy.title}</h1>
            <p className="m-0 max-w-2xl type-body-md text-mute">{copy.description}</p>
          </div>
        </header>

        <section className="rounded-box bg-bg-content p-5">
          <div className="mb-4 flex items-center gap-2">
            <Activity aria-hidden="true" className="h-5 w-5 text-mute" />
            <h2 className="m-0 type-h3 text-fg">{copy.configTitle}</h2>
          </div>
          <dl className="grid gap-3 sm:grid-cols-2">
            <Field label={copy.labels.environment} value={config.environment} />
            <div className="rounded-box bg-bg px-4 py-3">
              <dt className="mb-1 type-body-sm text-mute">{copy.labels.enabled}</dt>
              <dd className="m-0">
                <Pill tone={config.enabled ? "success" : "warning"}>
                  {config.enabled ? copy.status.enabled : copy.status.disabled}
                </Pill>
              </dd>
            </div>
            <div className="rounded-box bg-bg px-4 py-3">
              <dt className="mb-1 type-body-sm text-mute">{copy.labels.keyConfigured}</dt>
              <dd className="m-0">
                <Pill tone={config.keyConfigured ? "success" : "danger"}>
                  {config.keyConfigured ? copy.status.configured : copy.status.missing}
                </Pill>
              </dd>
            </div>
            <Field label={copy.labels.model} value={config.model} />
            <div className="sm:col-span-2">
              <Field label={copy.labels.baseUrl} value={config.baseUrl} />
            </div>
          </dl>
        </section>

        <section className="rounded-box bg-bg-content p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <div className="mb-2 flex items-center gap-2">
                <Clock aria-hidden="true" className="h-5 w-5 text-mute" />
                <h2 className="m-0 type-h3 text-fg">{copy.probeTitle}</h2>
              </div>
              <p className="m-0 type-body-sm text-mute">{copy.fixedRequestLabel}</p>
              <p className="m-0 mt-1 break-words type-body-md text-fg">{config.samplePrompt}</p>
            </div>
            <Button
              arrow={false}
              className="w-full shrink-0 sm:w-auto"
              disabled={isButtonDisabled}
              onClick={runProbe}
              variant="primary"
            >
              {buttonLabel}
            </Button>
          </div>

          {disabledReason ? (
            <div className="mt-4 rounded-box border border-amber-200 bg-amber-50 px-4 py-3 type-body-md text-amber-800" role="alert">
              {disabledReason}
              {!config.enabled && isProduction ? <p className="m-0 mt-2 type-body-sm">{copy.notices.productionDisabled}</p> : null}
            </div>
          ) : null}

          <p className="m-0 mt-4 type-body-sm text-mute">{copy.notices.rateLimit}</p>
        </section>

        <section className="rounded-box bg-bg-content p-5" aria-labelledby="ai-chat-status-result">
          <div className="mb-4 flex items-center gap-2">
            {completedResult?.ok ? (
              <CheckCircle2 aria-hidden="true" className="h-5 w-5 text-emerald-600" />
            ) : (
              <AlertTriangle aria-hidden="true" className="h-5 w-5 text-mute" />
            )}
            <h2 className="m-0 type-h3 text-fg" id="ai-chat-status-result">
              {copy.resultTitle}
            </h2>
          </div>

          {probe.status === "idle" ? (
            <p className="m-0 type-body-md text-mute">{copy.status.idle}</p>
          ) : null}

          {probe.status === "loading" ? (
            <p className="m-0 type-body-md text-mute" role="status">
              {copy.loading}
            </p>
          ) : null}

          {probe.status === "error" ? (
            <div className="rounded-box border border-red-200 bg-red-50 px-4 py-3 type-body-md text-red-700" role="alert">
              {probe.message}
              {probe.retryAfterSeconds ? <p className="m-0 mt-2 type-body-sm">Retry-After: {probe.retryAfterSeconds}s</p> : null}
            </div>
          ) : null}

          {completedResult ? (
            <div className="flex flex-col gap-4">
              <div
                className={`rounded-box border px-4 py-3 type-body-md ${
                  hasFailure ? "border-red-200 bg-red-50 text-red-700" : "border-emerald-200 bg-emerald-50 text-emerald-700"
                }`}
                role={hasFailure ? "alert" : "status"}
              >
                {hasFailure ? probeMessage : copy.status.success}
              </div>

              <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <Field label={copy.labels.result} value={completedResult.ok ? copy.status.success : copy.status.failure} />
                <Field label={copy.labels.upstreamStatus} value={completedResult.upstreamStatus === null ? "-" : String(completedResult.upstreamStatus)} />
                <Field label={copy.labels.elapsed} value={formatDuration(completedResult.durationMs)} />
                <Field label={copy.labels.finishReason} value={completedResult.finishReason ?? "-"} />
                <Field label={copy.labels.responseType} value={formatResponseType(completedResult.responseType)} />
                <Field label={copy.labels.responseServer} value={formatResponseServer(completedResult.responseServer)} />
                <div className="lg:col-span-3">
                  <Field label={copy.labels.checkedAt} value={completedResult.checkedAt} />
                </div>
              </dl>

              {completedResult.answer ? (
                <div className="rounded-box bg-bg px-4 py-3">
                  <h3 className="m-0 mb-2 type-body-sm text-mute">{copy.labels.finalAnswer}</h3>
                  <p className="m-0 whitespace-pre-wrap break-words type-body-md text-fg">{completedResult.answer}</p>
                </div>
              ) : null}
            </div>
          ) : null}
        </section>
      </div>
    </main>
  );
}
