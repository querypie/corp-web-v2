export type AiChatStatusConfig = {
  enabled: boolean;
  keyConfigured: boolean;
  baseUrl: string;
  model: string;
  samplePrompt: string;
  environment: string;
};

export type AiChatProbeResult = {
  ok: boolean;
  checkedAt: string;
  durationMs: number;
  upstreamStatus: number | null;
  responseType: "json" | "html" | "other" | null;
  responseServer: "awselb" | "other" | null;
  answer: string | null;
  finishReason: string | null;
  code:
    | "OK"
    | "DISABLED"
    | "NOT_CONFIGURED"
    | "UPSTREAM_HTTP_ERROR"
    | "INVALID_RESPONSE"
    | "TIMEOUT"
    | "NETWORK_ERROR";
  networkCode?: string;
};
