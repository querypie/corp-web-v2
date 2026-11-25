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

  it("연도 사이에서도 사진 유무와 관계없이 전체 기록이 교차 정렬된다", () => {
    const first = { year: 2022, id: "first", image: "/first.jpg" };
    const middle = { year: 2025, id: "middle" };
    const last = { year: 2025, id: "last", image: "/last.jpg" };
    const placements = (entries: Array<typeof first | typeof middle>) => groupMilestones(entries)
      .flatMap(({ milestones }) => milestones)
      .map(({ id, align }) => [id, align]);

    expect(placements([first, middle, last])).toEqual([
      ["first", "left"], ["middle", "right"], ["last", "left"],
    ]);
    expect(placements([first, last])).toEqual([
      ["first", "left"], ["last", "right"],
    ]);
  });
});
