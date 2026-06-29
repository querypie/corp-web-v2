import "server-only";

export type VercelAnalyticsListItem = {
  label: string;
  value: number;
};

export type VercelAnalyticsTrendItem = {
  label: string;
  value: number;
};

export type VercelAnalyticsSummary = {
  contentPages: VercelAnalyticsListItem[];
  countries: VercelAnalyticsListItem[];
  devices: VercelAnalyticsListItem[];
  error?: string;
  isConfigured: boolean;
  pageViews: number;
  previousPageViews: number;
  referrers: VercelAnalyticsListItem[];
  topPages: VercelAnalyticsListItem[];
  trend: VercelAnalyticsTrendItem[];
};

type VercelAggregateRow = Record<string, unknown>;

type VercelAggregateResponse = {
  data?: VercelAggregateRow[];
};

const VERCEL_ANALYTICS_ENDPOINT = "https://api.vercel.com/v1/query/web-analytics/visits/aggregate";
const DEFAULT_PROJECT_ID = "prj_xeobCehIxv13fSJdlEprUfdqRlTd";
const DEFAULT_TEAM_ID = "team_8DsCdrF1uCfwY30OS8F8lREn";
const metricFieldCandidates = ["visits", "pageviews", "pageViews", "count", "value", "total", "events"];
const dimensionFields = new Set([
  "browserName",
  "country",
  "day",
  "deviceType",
  "environment",
  "hour",
  "month",
  "osName",
  "referrerHostname",
  "requestPath",
  "route",
  "utmCampaign",
  "utmContent",
  "utmMedium",
  "utmSource",
  "utmTerm",
  "week",
  "year",
]);

function getAnalyticsConfig() {
  return {
    projectId: process.env.VERCEL_ANALYTICS_PROJECT_ID || DEFAULT_PROJECT_ID,
    teamId: process.env.VERCEL_ANALYTICS_TEAM_ID || DEFAULT_TEAM_ID,
    token: process.env.VERCEL_ACCESS_TOKEN || process.env.VERCEL_TOKEN || "",
  };
}

function getDateRange(days: number, offsetDays = 0) {
  const until = new Date();
  until.setUTCHours(23, 59, 59, 999);
  until.setUTCDate(until.getUTCDate() - offsetDays);

  const since = new Date(until);
  since.setUTCHours(0, 0, 0, 0);
  since.setUTCDate(since.getUTCDate() - days + 1);

  return {
    since: since.toISOString(),
    until: until.toISOString(),
  };
}

function getMetricValue(row: VercelAggregateRow) {
  for (const field of metricFieldCandidates) {
    const value = row[field];
    if (typeof value === "number") {
      return value;
    }
  }

  return Object.entries(row).reduce((total, [key, value]) => {
    if (dimensionFields.has(key) || typeof value !== "number") {
      return total;
    }

    return total + value;
  }, 0);
}

function getDimensionLabel(row: VercelAggregateRow, dimension: string) {
  const value = row[dimension];
  if (typeof value === "string" && value.trim()) {
    return value;
  }

  if (typeof value === "number") {
    return String(value);
  }

  return "Direct / Unknown";
}

function sumRows(rows: VercelAggregateRow[]) {
  return rows.reduce((total, row) => total + getMetricValue(row), 0);
}

export function aggregateAnalyticsItems<TItem extends VercelAnalyticsListItem>(items: TItem[]): TItem[] {
  const itemsByLabel = new Map<string, TItem>();

  for (const item of items) {
    const existing = itemsByLabel.get(item.label);

    if (existing) {
      existing.value += item.value;
    } else {
      itemsByLabel.set(item.label, { ...item });
    }
  }

  return Array.from(itemsByLabel.values());
}

function toListItems(rows: VercelAggregateRow[], dimension: string, limit: number): VercelAnalyticsListItem[] {
  const items = rows
    .map((row) => ({
      label: getDimensionLabel(row, dimension),
      value: getMetricValue(row),
    }))
    .filter((item) => item.value > 0);

  return aggregateAnalyticsItems(items)
    .sort((left, right) => right.value - left.value)
    .slice(0, limit);
}

function toTrendItems(rows: VercelAggregateRow[]): VercelAnalyticsTrendItem[] {
  const items = rows
    .map((row) => ({
      label: getDimensionLabel(row, "day"),
      value: getMetricValue(row),
    }));

  return aggregateAnalyticsItems(items)
    .sort((left, right) => left.label.localeCompare(right.label));
}

async function fetchAggregate({
  by,
  days,
  limit = 10,
  offsetDays = 0,
}: {
  by: string;
  days: number;
  limit?: number;
  offsetDays?: number;
}) {
  const { projectId, teamId, token } = getAnalyticsConfig();
  const { since, until } = getDateRange(days, offsetDays);
  const url = new URL(VERCEL_ANALYTICS_ENDPOINT);

  url.searchParams.set("projectId", projectId);
  url.searchParams.set("teamId", teamId);
  url.searchParams.set("since", since);
  url.searchParams.set("until", until);
  url.searchParams.set("limit", String(limit));
  url.searchParams.append("by", by);

  const response = await fetch(url, {
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const message = await response.text().catch(() => "");
    throw new Error(`Vercel Analytics API ${response.status}: ${message || response.statusText}`);
  }

  const payload = (await response.json()) as VercelAggregateResponse;
  return Array.isArray(payload.data) ? payload.data : [];
}

export async function readVercelAnalyticsSummary(): Promise<VercelAnalyticsSummary> {
  const { token } = getAnalyticsConfig();

  if (!token) {
    return {
      countries: [],
      contentPages: [],
      devices: [],
      error: "VERCEL_ACCESS_TOKEN 환경변수가 필요합니다.",
      isConfigured: false,
      pageViews: 0,
      previousPageViews: 0,
      referrers: [],
      topPages: [],
      trend: [],
    };
  }

  try {
    const [
      currentRows,
      previousRows,
      countryRows,
      pageRows,
      referrerRows,
      deviceRows,
    ] = await Promise.all([
      fetchAggregate({ by: "day", days: 30, limit: 30 }),
      fetchAggregate({ by: "day", days: 30, limit: 30, offsetDays: 30 }),
      fetchAggregate({ by: "country", days: 30, limit: 6 }),
      fetchAggregate({ by: "requestPath", days: 30, limit: 50 }),
      fetchAggregate({ by: "referrerHostname", days: 30, limit: 6 }),
      fetchAggregate({ by: "deviceType", days: 30, limit: 6 }),
    ]);

    return {
      contentPages: toListItems(pageRows, "requestPath", 50),
      countries: toListItems(countryRows, "country", 6),
      devices: toListItems(deviceRows, "deviceType", 6),
      isConfigured: true,
      pageViews: sumRows(currentRows),
      previousPageViews: sumRows(previousRows),
      referrers: toListItems(referrerRows, "referrerHostname", 6),
      topPages: toListItems(pageRows, "requestPath", 8),
      trend: toTrendItems(currentRows),
    };
  } catch (error) {
    return {
      countries: [],
      contentPages: [],
      devices: [],
      error: error instanceof Error ? error.message : "Vercel Analytics 데이터를 불러오지 못했습니다.",
      isConfigured: true,
      pageViews: 0,
      previousPageViews: 0,
      referrers: [],
      topPages: [],
      trend: [],
    };
  }
}
