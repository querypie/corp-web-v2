import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { aggregateAnalyticsItems } from "./vercel.server";

describe("aggregateAnalyticsItems", () => {
  it("같은 라벨의 Analytics 항목을 하나로 합산한다", () => {
    const items = [
      { label: "Direct / Unknown", value: 3 },
      { label: "/en", value: 7 },
      { label: "Direct / Unknown", value: 4 },
    ];

    expect(aggregateAnalyticsItems(items)).toEqual([
      { label: "Direct / Unknown", value: 7 },
      { label: "/en", value: 7 },
    ]);
    expect(items[0].value).toBe(3);
  });
});
