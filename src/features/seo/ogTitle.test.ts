import { describe, expect, it } from "vitest";

import { getOgDescriptionLines, getOgTitleLines } from "@/features/seo/ogTitle";

describe("getOgTitleLines", () => {
  it("limits long Japanese titles to two lines", () => {
    const lines = getOgTitleLines(
      'AI攻撃ツールが55カ国のファイアウォール600台を突破──ファイアウォールの先にある"データ"をどう守るか',
      "ja",
    );

    expect(lines).toHaveLength(2);
    expect(lines[1]).toMatch(/\.\.\.$/);
  });

  it("keeps short titles on one line", () => {
    expect(getOgTitleLines("QueryPie AI Platform", "en")).toEqual(["QueryPie AI Platform"]);
  });

  it("wraps English titles at word boundaries before truncating", () => {
    const lines = getOgTitleLines(
      "A practical guide to identity governance for enterprise AI deployments and secure data access",
      "en",
    );

    expect(lines).toHaveLength(2);
    expect(lines[0]).not.toMatch(/\s$/);
    expect(lines[1]).toMatch(/\.\.\.$/);
  });
});

describe("getOgDescriptionLines", () => {
  it("limits long Korean descriptions to three lines", () => {
    const lines = getOgDescriptionLines(
      "Replit AI Agent가 프로덕션 DB를 삭제한 사고는 단순한 기술적 실수가 아니라, AI 에이전트를 실환경에 도입할 때 반드시 고민해야 할 보안 구조의 중요성을 보여줍니다. 이번 사례를 통해 AI 거짓 응답 탐지, 최소 권한 설계, 실행 기록 확보 등 보안 체크리스트를 정리합니다.",
      "ko",
      36,
    );

    expect(lines).toHaveLength(3);
    expect(lines[2]).toMatch(/\.\.\.$/);
  });

  it("keeps short descriptions on one line", () => {
    expect(getOgDescriptionLines("QueryPie AI transforms enterprise work.", "en", 36)).toEqual([
      "QueryPie AI transforms enterprise work.",
    ]);
  });
});
