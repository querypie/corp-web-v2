import "server-only";
import { WebClient } from "@slack/web-api";
import { getAiChatDatabaseUrl } from "./database.server";
import { listUnansweredDigest, type UnansweredDigestItem } from "./unanswered.server";

const KST_OFFSET_MS = 9 * 60 * 60 * 1000;
const TEST_CHANNEL = "C083Y0300M7";

export function previousKoreanDay(now = new Date()) {
  const korean = new Date(now.getTime() + KST_OFFSET_MS);
  const until = new Date(Date.UTC(korean.getUTCFullYear(), korean.getUTCMonth(), korean.getUTCDate()) - KST_OFFSET_MS);
  return { since: new Date(until.getTime() - 24 * 60 * 60 * 1000), until };
}

export function formatUnansweredDigest(items: UnansweredDigestItem[], since: Date) {
  const date = new Date(since.getTime() + KST_OFFSET_MS).toISOString().slice(0, 10);
  const total = items.reduce((sum, item) => sum + item.dailyOccurrenceCount, 0);
  const header = `*${date} AI 제품 상담 미답변*\n총 ${total}건 · 중복 제외 ${items.length}개\n\n`;
  const lines: string[] = [];
  for (const item of items) {
    const safeQuestion = item.question.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
    const line = `${lines.length + 1}. [${item.locale.toUpperCase()}] ${safeQuestion.slice(0, 180)} (${item.dailyOccurrenceCount}회)`;
    if (`${header}${[...lines, line].join("\n")}`.length > 2900) break;
    lines.push(line);
  }
  return `${header}${lines.length ? lines.join("\n") : "미답변 질문이 없습니다."}`;
}

function getDigestTarget() {
  if (process.env.VERCEL_TARGET_ENV === "production") {
    return { user: process.env.SLACK_USER_ALERT_AI_CHAT_UNANSWERED, channel: undefined };
  }
  return {
    user: undefined,
    channel: process.env.SLACK_CHANNEL_ALERT_AI_CHAT_UNANSWERED_TESTING ?? TEST_CHANNEL,
  };
}

export async function sendUnansweredDigest(now = new Date()) {
  const token = process.env.SLACK_BOT_OAUTH_TOKEN;
  const target = getDigestTarget();
  if (!token || (!target.user && !target.channel) || !getAiChatDatabaseUrl()) {
    return { sent: false, reason: "not_configured" as const, count: 0 };
  }
  const { since, until } = previousKoreanDay(now);
  const items = await listUnansweredDigest(since, until);
  const text = formatUnansweredDigest(items, since);
  const web = new WebClient(token);
  let channel = target.channel;
  if (target.user) {
    const conversation = await web.conversations.open({ users: target.user });
    channel = conversation.channel?.id;
  }
  if (!channel) throw new Error("Slack DM channel could not be opened");
  await web.chat.postMessage({
    channel,
    text: `${since.toISOString().slice(0, 10)} AI 제품 상담 미답변`,
    blocks: [{ type: "section", text: { type: "mrkdwn", text } }],
  });
  return { sent: true, count: items.length };
}
