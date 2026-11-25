export function groupMilestones<T extends { year: number }>(
  entries: readonly T[],
) {
  const years = new Map<number, (T & { align: "left" | "right" })[]>();
  let align: "left" | "right" = "left";

  for (const entry of [...entries].sort((a, b) => a.year - b.year)) {
    const group = years.get(entry.year) ?? [];
    group.push({ ...entry, align });
    years.set(entry.year, group);
    align = align === "left" ? "right" : "left";
  }

  return Array.from(years, ([year, milestones]) => ({ year, milestones }));
}
