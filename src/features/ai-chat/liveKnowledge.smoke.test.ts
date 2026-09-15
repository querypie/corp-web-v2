// @vitest-environment node
import { expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
import { retrieveLiveKnowledge } from "./liveKnowledge.server";

// Optional real-network check; regular tests use deterministic fixtures.
it.skipIf(process.env.AI_CHAT_LIVE_SMOKE !== "1")("공식 사이트에서 AIP·ACP·Lingo 최신 근거를 읽는다", async () => {
  for (const [product, question] of [["aip", "AIP 보안 정책은?"], ["acp", "ACP 접근 제어란?"], ["lingo", "Lingo 요금은?"]]) {
    const chunks = await retrieveLiveKnowledge([{ role: "user", content: question }], "ko", AbortSignal.timeout(25000));
    expect(chunks.some((chunk) => chunk.product === product && chunk.text.length > 20), product).toBe(true);
    expect(chunks.every((chunk) => chunk.url.startsWith("https://"))).toBe(true);
  }
}, 60000);
