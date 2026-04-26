import { describe, expect, it } from "vitest";
import { createSolutionMetadata } from "./staticPage";
import { solutionEntries } from "./routes";
import { getSolutionStaticMetadata } from "./solutionMetadata";

describe("getSolutionStaticMetadata", () => {
  it("모든 canonical solution entry에 대해 locale별 정적 metadata를 제공한다", () => {
    for (const entry of solutionEntries) {
      expect(getSolutionStaticMetadata(entry.id, "en"), `${entry.id} en`).toMatchObject({
        title: expect.any(String),
        description: expect.any(String),
      });
      expect(getSolutionStaticMetadata(entry.id, "ko"), `${entry.id} ko`).toMatchObject({
        title: expect.any(String),
        description: expect.any(String),
      });
      expect(getSolutionStaticMetadata(entry.id, "ja"), `${entry.id} ja`).toMatchObject({
        title: expect.any(String),
        description: expect.any(String),
      });
    }
  });

  it("정적 metadata가 없는 id에는 null을 반환한다", () => {
    expect(getSolutionStaticMetadata("missing" as never, "en")).toBeNull();
  });
});

describe("createSolutionMetadata", () => {
  it("정적 metadata registry 기반으로 canonical metadata를 생성한다", async () => {
    const generateMetadata = createSolutionMetadata("aip");

    await expect(
      generateMetadata({ params: Promise.resolve({ locale: "ko" }) }),
    ).resolves.toMatchObject({
      title: "QueryPie: Secure Enterprise AI Hub",
      description: expect.stringContaining("AI"),
      alternates: {
        canonical: "/ko/solutions/aip",
      },
    });
  });
});
