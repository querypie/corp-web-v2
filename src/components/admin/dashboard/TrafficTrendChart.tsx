"use client";

import { useMemo } from "react";

export type TrafficTrendPoint = {
  label: string;
  value: number;
};

function formatNumber(value: number) {
  return new Intl.NumberFormat("en").format(value);
}

function formatTrendDate(value: string) {
  const [, month, day] = value.split("-");
  return month && day ? `${month}/${day}` : value;
}

export default function TrafficTrendChart({ items }: { items: TrafficTrendPoint[] }) {
  const displayItems = useMemo(() => [...items].reverse(), [items]);
  const maxValue = useMemo(() => Math.max(...items.map((item) => item.value), 1), [items]);
  const peakLabel = useMemo(() => {
    return items.reduce<TrafficTrendPoint | null>((peak, item) => {
      if (!peak || item.value > peak.value) return item;
      return peak;
    }, null)?.label;
  }, [items]);
  const chartWidth = Math.max(960, items.length * 42);

  if (items.length === 0) {
    return (
      <div className="flex h-[260px] w-full items-center justify-center rounded-box bg-bg text-center type-body-md text-mute">
        Analytics 데이터가 아직 없습니다.
      </div>
    );
  }

  return (
    <div className="relative min-w-0 max-w-full">
      <div className="max-w-full overflow-x-auto overflow-y-hidden rounded-box bg-bg px-5 py-5">
        <div className="flex h-[260px] items-end gap-1.5" style={{ minWidth: `${chartWidth}px` }}>
          {displayItems.map((item) => {
            const height = item.value > 0 ? Math.max(4, Math.round((item.value / maxValue) * 100)) : 1;
            const isPeak = peakLabel === item.label && item.value > 0;

            return (
              <div key={item.label} className="flex h-full min-w-[32px] flex-1 flex-col justify-end gap-2">
                <div className="min-h-[16px] text-center text-[10px] leading-none text-fg">
                  {item.value > 0 ? formatNumber(item.value) : ""}
                </div>
                <div className="flex min-h-0 flex-1 items-end">
                  <button
                    aria-label={`${item.label}: ${item.value} page views`}
                    className={`w-full min-w-[8px] rounded-t-sm border-0 p-0 outline-none ring-offset-2 ring-offset-bg transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:ring-border ${
                      isPeak ? "bg-chart-primary" : item.value > 0 ? "bg-chart-secondary" : "bg-border"
                    }`}
                    style={{ height: `${height}%` }}
                    type="button"
                  />
                </div>
                <div className="min-h-[14px] whitespace-nowrap text-center text-[10px] leading-none text-mute">
                  {formatTrendDate(item.label)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
