import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { aggregateAnalyticsItems, readVercelAnalyticsSummary } from "./vercel.server";

const originalEnv = process.env;

afterEach(() => {
  process.env = originalEnv;
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

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

  it("Vercel Analytics 요청은 production environment로 제한한다", async () => {
    process.env = {
      ...originalEnv,
      VERCEL_ACCESS_TOKEN: "test-token",
      VERCEL_ANALYTICS_TARGET_HOST: "www.querypie.com",
    };
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ data: [] }),
    });
    vi.stubGlobal("fetch", fetchMock);

    const summary = await readVercelAnalyticsSummary();

    expect(summary.targetHost).toBe("www.querypie.com");
    expect(fetchMock).toHaveBeenCalledTimes(6);

    for (const [url] of fetchMock.mock.calls) {
      expect(new URL(String(url)).searchParams.get("filter")).toBe("environment eq 'production'");
    }
  });

  it("day 집계 응답의 timestamp 필드를 차트 날짜 라벨로 사용한다", async () => {
    process.env = {
      ...originalEnv,
      VERCEL_ACCESS_TOKEN: "test-token",
    };
    let dayCallCount = 0;
    const fetchMock = vi.fn().mockImplementation((url: URL | string) => {
      const requestUrl = new URL(String(url));
      const by = requestUrl.searchParams.getAll("by")[0];
      const isCurrentTrendRequest = by === "day" && dayCallCount === 0;
      if (by === "day") dayCallCount += 1;

      return Promise.resolve({
        ok: true,
        json: async () => ({
          data: isCurrentTrendRequest
            ? [
                { pageviews: 0, timestamp: "2026-06-28T00:00:00.000Z", visitors: 0 },
                { pageviews: 10, timestamp: "2026-06-29T00:00:00.000Z", visitors: 4 },
              ]
            : [],
        }),
      });
    });
    vi.stubGlobal("fetch", fetchMock);

    const summary = await readVercelAnalyticsSummary();

    expect(summary.trend).toEqual([
      { label: "2026-06-28", value: 0 },
      { label: "2026-06-29", value: 10 },
    ]);
  });
});
