export function groupMilestones<T extends { year: number; image?: string }>(
  entries: readonly T[],
) {
  const years = new Map<number, (T & { align: "left" | "right" })[]>();
  let photos = 0;
  let textOnly = 0;

  for (const entry of [...entries].sort((a, b) => a.year - b.year)) {
    // Text-only entries don't interrupt the alternation of photo spreads.
    const onRight = entry.image ? photos++ % 2 === 0 : textOnly++ % 2 !== 0;
    const group = years.get(entry.year) ?? [];
    group.push({ ...entry, align: onRight ? "right" : "left" });
    years.set(entry.year, group);
  }

  return Array.from(years, ([year, milestones]) => ({ year, milestones }));
}
