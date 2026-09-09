import { describe, expect, it } from "vitest";
import { retrieveKnowledge } from "./knowledge";

describe("테스트 문서 검색", () => {
  it("AIP·ACP 비교 질문에서 양쪽 제품의 근거를 확보한다", () => {
    const chunks = retrieveKnowledge([{ role: "user", content: "AIP와 ACP는 어떤 차이가 있나요?" }], "ko");
    expect(chunks.some((chunk) => chunk.product === "aip")).toBe(true);
    expect(chunks.some((chunk) => chunk.product === "acp")).toBe(true);
  });
  it("Lingo 언어 질문에서 공식 FAQ를 검색한다", () => {
    const chunks = retrieveKnowledge([{ role: "user", content: "링고는 어떤 언어를 지원해?" }], "ko");
    expect(chunks.some((chunk) => chunk.product === "lingo" && chunk.text.includes("베트남"))).toBe(true);
    expect(chunks.every((chunk) => chunk.product === "lingo" || chunk.product === "site")).toBe(true);
  });
  it("제품명이 없는 후속 질문에는 앞선 질문의 제품을 적용한다", () => {
    const chunks = retrieveKnowledge([{ role: "user", content: "Lingo가 뭐야?" }, { role: "assistant", content: "회의 번역 서비스입니다." }, { role: "user", content: "그럼 요금은?" }], "ko");
    expect(chunks.some((chunk) => chunk.url.includes("pricing"))).toBe(true);
    expect(chunks.every((chunk) => chunk.product === "lingo" || chunk.product === "site")).toBe(true);
  });
});
