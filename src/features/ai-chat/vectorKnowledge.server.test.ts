import { afterEach, describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
vi.mock("./embedding.server", () => ({ embedTexts: vi.fn() }));
vi.mock("./database.server", () => ({ getAiChatDatabase: vi.fn(() => null) }));
import { knowledgeChunks } from "./knowledge";
import { getAiChatDatabase } from "./database.server";
import { embedTexts } from "./embedding.server";
import { fuseKnowledge, retrieveKnowledgeForAnswer } from "./vectorKnowledge.server";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.mocked(getAiChatDatabase).mockReturnValue(null);
  vi.clearAllMocks();
});

describe("하이브리드 지식 검색", () => {
  it("키워드와 벡터 양쪽에 나온 출처를 중복 없이 우선한다", () => {
    const first = knowledgeChunks[0];
    const second = knowledgeChunks.find((chunk) => chunk.url !== first.url)!;
    expect(fuseKnowledge([first, second], [first])).toEqual([first, second]);
  });

  it("정확한 키워드 상위 3개를 유지하고 벡터 후보로 나머지를 보강한다", () => {
    const distinct = knowledgeChunks.filter((chunk, index, chunks) => chunks.findIndex((item) => item.url === chunk.url) === index).slice(0, 5);
    const result = fuseKnowledge(distinct.slice(0, 4), [distinct[4]]);
    expect(result.slice(0, 3)).toEqual(distinct.slice(0, 3));
    expect(result).toContain(distinct[4]);
  });

  it("DB에 남은 보류 자료와 단서 없는 예정 기능도 실제 검색 경로에서 차단한다", async () => {
    vi.stubEnv("AI_CHAT_EMBEDDING_BASE_URL", "https://embeddings.example.com");
    vi.stubEnv("AI_CHAT_EMBEDDING_MODEL", "test-model");
    vi.mocked(embedTexts).mockResolvedValue([Array(1024).fill(0.1)]);
    const current = knowledgeChunks.find((chunk) => chunk.url.endsWith("/ko/administrator-manual/web-apps") && chunk.title.endsWith("— Overview"))!;
    const row = {
      chunk_id: "stale-wac", product: "acp", locale: "ko", title: current.title,
      source_url: current.url, distance: 0.01,
      content: "권한 통제 : 허가된 사용자라 하더라도 웹 애플리케이션의 주요 작업은 통제합니다.",
    };
    const rows = [row, { ...row, chunk_id: "current-wac", content: current.text }];
    const sql = vi.fn((input: { raw?: unknown }) => input.raw ? Promise.resolve(rows) : input);
    vi.mocked(getAiChatDatabase).mockReturnValue(sql as never);
    const result = await retrieveKnowledgeForAnswer([{ role: "user", content: "WAC가 뭐야?" }], "ko", new AbortController().signal);
    expect(sql).toHaveBeenCalled();
    expect(result.some((chunk) => chunk.text.includes(row.content))).toBe(false);
    expect(result.some((chunk) => chunk.text === current.text)).toBe(true);
  });

  it("벡터가 없을 때의 키워드 대체 검색에도 보류 자료가 들어가지 않는다", async () => {
    const chunks = await retrieveKnowledgeForAnswer([{ role: "user", content: "CorpNavi 타깃과 공시 자동 확인은?" }], "ko", new AbortController().signal);
    expect(chunks.length).toBeGreaterThan(0);
    expect(chunks.map((chunk) => chunk.text).join("\n")).not.toMatch(/TDNet|공식 타깃|제품 요구사항/);
  });
});
