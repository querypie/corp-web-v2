import { describe, expect, it } from "vitest";
import { solutionEntries } from "./routes";
import { getSolutionStaticContent } from "./staticContent";

describe("getSolutionStaticContent", () => {
  it("모든 canonical solution entry에 대해 locale별 정적 콘텐츠 컴포넌트를 제공한다", () => {
    for (const entry of solutionEntries) {
      expect(getSolutionStaticContent(entry.id, "en"), `${entry.id} en`).toBeTypeOf("function");
      expect(getSolutionStaticContent(entry.id, "ko"), `${entry.id} ko`).toBeTypeOf("function");
      expect(getSolutionStaticContent(entry.id, "ja"), `${entry.id} ja`).toBeTypeOf("function");
    }
  });

  it("정적 콘텐츠가 없는 id에는 null을 반환한다", () => {
    expect(getSolutionStaticContent("missing" as never, "en")).toBeNull();
  });
});
