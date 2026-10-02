import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { LogLevel, WebClient, type ChatPostMessageArguments } from "@slack/web-api";
import { after } from "next/server";
import type { Locale } from "@/constants/i18n";
import type { ChatReply } from "./types";

type ChatNotification = {
  locale: Locale;
  question: string;
  outcome: ChatReply | { code: string };
  upstreamDurationMs: number;
  slackThreadToken?: unknown;
};

type SlackMessage = {
  text: string;
  blocks: Extract<ChatPostMessageArguments, { blocks: unknown }>["blocks"];
  thread_ts?: string;
  reply_broadcast?: false;
};

const channels = { production: "C08FXKA72SU", development: "C0C211STFRR" };
const localeLabels: Record<Locale, string> = { en: "영어", ko: "한국어", ja: "일본어" };
const maxErrorQuestionLength = 80;

function errorQuestionPreview(question: string) {
  const characters = Array.from(question);
  return characters.slice(0, maxErrorQuestionLength).join("") + (characters.length > maxErrorQuestionLength ? "…" : "");
}

function bodyBlocks(content: string) {
  return (content.match(/[\s\S]{1,2800}/g) ?? []).map((text) => ({
    type: "section" as const, text: { type: "plain_text" as const, text, emoji: false },
  }));
}

function signature(secret: string, environment: string, channel: string, ts: string) {
  return createHmac("sha256", secret).update(`ai-chat-slack:v1:${environment}:${channel}:${ts}`).digest("base64url");
}

function readThread(token: unknown, secret: string, environment: string, channel: string) {
  if (typeof token !== "string" || token.length > 512 || !/^\d+\.\d+:[\w-]{43}$/.test(token)) return undefined;
  const [ts, supplied] = token.split(":");
  const expected = signature(secret, environment, channel, ts);
  return timingSafeEqual(Buffer.from(supplied), Buffer.from(expected)) ? ts : undefined;
}

// The first post must finish before returning its signed thread handle. Subsequent
// turns use after() so Slack does not delay the answer or depend on process memory.
export async function notifyAiChatTurn(input: ChatNotification): Promise<string | undefined> {
  const secret = process.env.SLACK_BOT_OAUTH_TOKEN;
  if (!secret) return undefined;
  const environment = process.env.VERCEL_TARGET_ENV ?? process.env.VERCEL_ENV ?? "development";
  const channel = environment === "production" ? channels.production : channels.development;
  const threadTs = readThread(input.slackThreadToken, secret, environment, channel);
  const errorCode = "code" in input.outcome ? input.outcome.code : undefined;
  const question = errorCode ? errorQuestionPreview(input.question) : input.question;
  const durationText = `Upstream 응답 시간: ${(input.upstreamDurationMs / 1000).toFixed(2)}초`;
  const title = `AI Chat · ${environment} · ${input.locale} · ${durationText}`;
  const environmentLabel = environment === "production" ? "Production" : environment === "preview" ? "Preview" : environment;
  const context = {
    type: "context" as const,
    elements: [{ type: "plain_text" as const, text: `${environmentLabel} · ${localeLabels[input.locale]} · ${durationText}`, emoji: false }],
  };
  const turnMessage: SlackMessage = {
    ...(threadTs ? { thread_ts: threadTs, reply_broadcast: false } : {}),
    text: title,
    blocks: [
      { type: "header", text: { type: "plain_text", text: "사용자 질문", emoji: false } },
      ...bodyBlocks(question),
      { type: "divider" },
      { type: "header", text: { type: "plain_text", text: "answer" in input.outcome ? "AI 답변" : "AI 응답 실패", emoji: false } },
      ...bodyBlocks("answer" in input.outcome ? input.outcome.answer : input.outcome.code),
      context,
    ],
  };
  const client = new WebClient(secret, {
    timeout: 2000,
    retryConfig: { retries: 0 },
    rejectRateLimitedCalls: true,
    // Log only the safe event below, never SDK errors containing request details.
    logger: {
      debug() {}, info() {}, warn() {}, error() {}, setLevel() {}, setName() {},
      getLevel: () => LogLevel.ERROR,
    },
  });
  async function send(message: SlackMessage) {
    try {
      const result = await client.chat.postMessage({
        channel,
        ...message,
        mrkdwn: false,
        parse: "none",
        link_names: false,
        unfurl_links: false,
        unfurl_media: false,
      });
      if (!result.ok || !result.ts || !/^\d+\.\d+$/.test(result.ts)) throw new Error("Slack post failed");
      return result.ts;
    } catch {
      console.warn("[ai-chat]", { event: "slack_notification_error" });
      return undefined;
    }
  }
  if (threadTs || errorCode) {
    after(async () => {
      const pending = threadTs ? [send(turnMessage)] : [];
      if (errorCode) {
        // Independent channel alert: no thread_ts and no additional response delay.
        pending.push(send({
          text: `AI Chat 응답 오류 · ${environment} · ${input.locale} · ${errorCode} · ${durationText} · 질문: ${question}`,
          blocks: [
            { type: "header", text: { type: "plain_text", text: "AI 응답 오류 발생", emoji: false } },
            ...bodyBlocks(`오류 코드: ${errorCode}`),
            ...bodyBlocks(`요청 미리보기 (최대 ${maxErrorQuestionLength}자):\n${question}`),
            context,
          ],
        }));
      }
      await Promise.all(pending);
    });
  }
  if (threadTs) return input.slackThreadToken as string;
  const ts = await send(turnMessage);
  return ts ? `${ts}:${signature(secret, environment, channel, ts)}` : undefined;
}
