import { describe, expect, it } from "vitest";
import { getSolutionHref, getSolutionEntryById, getSolutionEntryBySlug, solutionEntries } from "./routes";

describe("solution routes", () => {
  it("locale별 canonical URL을 유지한다", () => {
    expect(getSolutionHref("ja", "ai-crew")).toBe("/ja/solutions/ai-crew");
    expect(getSolutionHref("ja", "ai-dashi")).toBe("/ja/solutions/ai-dashi");
    expect(getSolutionHref("en", "ai-crew")).toBe("/en/solutions/ai-crew");
    expect(getSolutionHref("ko", "ai-dashi")).toBe("/ko/solutions/ai-dashi");
  });

  it("등록된 경로를 ID와 slug로 조회한다", () => {
    expect(solutionEntries).toHaveLength(3);
    for (const entry of solutionEntries) {
      expect(getSolutionEntryById(entry.id)).toEqual(entry);
      expect(getSolutionEntryBySlug(entry.slug)).toEqual(entry);
    }
    expect(getSolutionEntryBySlug(["missing"])).toBeNull();
  });

  it("COBOL의 일본어 전용 규칙을 유지한다", () => {
    expect(getSolutionEntryById("as400-cobol")?.locales).toEqual(["ja"]);
    expect(getSolutionEntryById("ai-crew")?.locales).toBeUndefined();
    expect(getSolutionEntryById("ai-dashi")?.locales).toBeUndefined();
    expect(getSolutionHref("ja", "as400-cobol")).toBe("/ja/solutions/as400-cobol");
  });
});
