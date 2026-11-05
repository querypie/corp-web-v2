import { afterEach, describe, expect, it, vi } from "vitest";
import { isPublishedContentAccessible, isPublishedContentVisible } from "./data";

const scheduled = {
  status: "published" as const,
  visibleLocales: ["ja" as const],
  publishAt: "2026-11-06T08:00:00+09:00",
};

afterEach(() => vi.useRealTimers());

describe("scheduled publication", () => {
  it("keeps list, detail, and sitemap visibility closed until 08:00 JST, then opens without reloading content", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-11-05T22:59:59.999Z"));
    expect(isPublishedContentAccessible(scheduled)).toBe(false);
    expect(isPublishedContentVisible(scheduled, "ja")).toBe(false);

    vi.setSystemTime(new Date("2026-11-05T23:00:00Z"));
    expect(isPublishedContentAccessible(scheduled)).toBe(true);
    expect(isPublishedContentVisible(scheduled, "ja")).toBe(true);
    expect(isPublishedContentVisible(scheduled, "en")).toBe(false);
  });

  it("preserves hidden status and locale restrictions after the release time", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-11-06T00:00:00Z"));
    expect(isPublishedContentAccessible({ ...scheduled, status: "hidden" })).toBe(false);
    expect(isPublishedContentAccessible({ ...scheduled, visibleLocales: [] })).toBe(false);
  });

  it.each(["invalid", "2026-11-06T08:00:00"])("fails closed for invalid or timezone-free schedules: %s", (publishAt) => {
    expect(isPublishedContentAccessible({ ...scheduled, publishAt })).toBe(false);
  });

  it.each([null, false, 0, ""])("does not treat malformed values as unscheduled: %s", (publishAt) => {
    expect(isPublishedContentAccessible({ ...scheduled, publishAt: publishAt as unknown as string })).toBe(false);
  });

  it("keeps existing unscheduled articles available", () => {
    expect(isPublishedContentAccessible({ status: "published", visibleLocales: ["ja"] })).toBe(true);
  });
});
