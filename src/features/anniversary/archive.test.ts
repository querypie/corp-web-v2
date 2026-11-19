import { describe, expect, it } from "vitest";
import { getAnniversaryHistory } from "@/copy/anniversaryHistory";
import { groupMilestones } from "./archive";

describe("10주년 연혁", () => {
  it("세 언어에서 같은 연도와 사건 순서를 유지하고 제목과 설명을 번역한다", () => {
    const original = getAnniversaryHistory("ko");
    const korean = original.flatMap(({ milestones }) => milestones);

    for (const locale of ["en", "ja"] as const) {
      const translated = getAnniversaryHistory(locale);
      expect(translated.map(({ year }) => year)).toEqual(original.map(({ year }) => year));
      const entries = translated.flatMap(({ milestones }) => milestones);
      expect(entries.map(({ id }) => id)).toEqual(korean.map(({ id }) => id));
      for (const [index, entry] of entries.entries()) {
        expect(entry.title).not.toBe(korean[index].title);
        expect(entry.body).not.toBe(korean[index].body);
      }
    }
  });
  it("같은 해의 기록은 한 곳에 모으고 기록 없는 해는 만들지 않는다", () => {
    const archive = groupMilestones([
      { year: 2025, id: "a" },
      { year: 2022, id: "b" },
      { year: 2025, id: "c" },
    ]);

    expect(
      archive.map(({ year, milestones }) => [
        year,
        milestones.map(({ id }) => id),
      ]),
    ).toEqual([
      [2022, ["b"]],
      [2025, ["a", "c"]],
    ]);
    expect(groupMilestones([])).toEqual([]);
  });

  it("사진이 없는 기록이 사이에 있어도 사진 배치는 번갈아 나온다", () => {
    const archive = groupMilestones([
      { year: 2022, image: "/first.jpg" },
      { year: 2022 },
      { year: 2025, image: "/second.jpg" },
    ]);

    const photoPlacements = archive
      .flatMap(({ milestones }) => milestones)
      .filter((entry) => entry.image)
      .map((entry) => entry.align);
    expect(photoPlacements).toEqual(["right", "left"]);
  });
});
