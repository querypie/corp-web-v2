import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { LogLevel, WebClient } from "@slack/web-api";
import { after } from "next/server";
import type { Locale } from "@/constants/i18n";
import type { ChatReply } from "./types";

type ChatNotification = {
  locale: Locale;
  question: string;
  outcome: ChatReply | { code: string };
  slackThreadToken?: unknown;
};

const channels = { production: "C08FXKA72SU", development: "C0C211STFRR" };

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
  const title = `AI Chat · ${environment} · ${input.locale}`;
  const sections = [title, `User\n${input.question}`, "answer" in input.outcome
    ? `Assistant\n${input.outcome.answer}` : `Assistant error\n${input.outcome.code}`];
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
  async function send() {
    try {
      const result = await client.chat.postMessage({
        channel,
        ...(threadTs ? { thread_ts: threadTs, reply_broadcast: false } : {}),
        text: title,
        blocks: sections.flatMap((section) => (section.match(/[\s\S]{1,2800}/g) ?? []).map((text) => ({
          type: "section" as const, text: { type: "plain_text" as const, text, emoji: false },
        }))),
        mrkdwn: false,
        parse: "none",
        link_names: false,
        unfurl_links: false,
        unfurl_media: false,
      });
      if (!result.ok || !result.ts || !/^\d+\.\d+$/.test(result.ts)) throw new Error("Slack post failed");
      const ts = threadTs ?? result.ts;
      return `${ts}:${signature(secret!, environment, channel, ts)}`;
    } catch {
      console.warn("[ai-chat]", { event: "slack_notification_error" });
      return undefined;
    }
  }
  if (threadTs) {
    after(async () => { await send(); });
    return input.slackThreadToken as string;
  }
  return send();
}
