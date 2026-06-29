import type { ReactNode } from "react";
import { unstable_noStore as noStore } from "next/cache";
import ContentPreviewImage from "@/components/content/ContentPreviewImage";
import TextButton from "@/components/ui/TextButton";
import { locales } from "@/constants/i18n";
import type { Locale } from "@/constants/i18n";
import { readContentState } from "@/features/content/contentState.server";
import { readVercelAnalyticsSummary, type VercelAnalyticsListItem } from "@/features/analytics/vercel.server";
import {
  getLocalizedContent,
  getManagedCategoryLabel,
  getPublicDetailHref,
  getResolvedContentLocale,
  type ManagedContentEntry,
} from "@/features/content/data";
import { isContentGatingEnabled } from "@/features/content/gating";

type SummaryCard = {
  description: string;
  label: string;
  value: string;
};

type TopContentPageItem = {
  category: string;
  href: string;
  imageSrc: string;
  pageViews: number;
  title: string;
};

const vercelAnalyticsHref = "https://vercel.com/querypie/corp-web-v2/analytics";

function DashboardCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`rounded-box bg-bg-content ${className}`}>
      {children}
    </section>
  );
}

function DashboardSection({
  children,
  title,
}: {
  children: ReactNode;
  title: string;
}) {
  return (
    <section className="flex flex-col gap-4">
      <h3 className="m-0 type-h3 text-fg">{title}</h3>
      {children}
    </section>
  );
}

function formatPercent(value: number) {
  if (!Number.isFinite(value)) return "0%";
  return `${Math.round(value)}%`;
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("en").format(value);
}

function getChangePercent(current: number, previous: number) {
  if (previous <= 0) {
    return current > 0 ? 100 : 0;
  }

  return ((current - previous) / previous) * 100;
}

function getTopItem(items: VercelAnalyticsListItem[]) {
  return items[0] ?? null;
}

function normalizePath(value: string) {
  const path = value.split("?")[0].split("#")[0] || "/";
  return path.length > 1 ? path.replace(/\/+$/, "") : path;
}

function getVisibleItemCount(items: ManagedContentEntry[]) {
  return items.filter((item) => item.status === "published" && item.visibleLocales.length > 0).length;
}

function getMissingLocaleCount(items: ManagedContentEntry[]) {
  return items.filter((item) => item.status === "published" && item.visibleLocales.length < locales.length).length;
}

function getGatedContentCount(items: ManagedContentEntry[]) {
  return items.filter((item) =>
    item.status === "published" &&
    item.visibleLocales.length > 0 &&
    isContentGatingEnabled(item),
  ).length;
}

function buildDashboardData(items: ManagedContentEntry[]) {
  const publishedCount = getVisibleItemCount(items);
  const gatedContentCount = getGatedContentCount(items);
  const missingLocaleCount = getMissingLocaleCount(items);
  const downloadableCount = items.filter((item) => item.enableDownloadButton || item.downloadPdfSrc).length;

  const summaryCards: SummaryCard[] = [
    {
      label: "Live content",
      value: String(publishedCount),
      description: "게시 상태이며 하나 이상의 locale에 노출되는 콘텐츠",
    },
    {
      label: "Locale gaps",
      value: String(missingLocaleCount),
      description: "게시되었지만 EN/KO/JA 중 일부 locale이 빠진 콘텐츠",
    },
    {
      label: "Gated content",
      value: String(gatedContentCount),
      description: "게시 상태이며 게이팅이 적용된 콘텐츠",
    },
    {
      label: "Downloads",
      value: String(downloadableCount),
      description: "다운로드 버튼 또는 PDF 파일이 연결된 콘텐츠",
    },
  ];

  return {
    summaryCards,
  };
}

function buildTopContentPages(
  items: ManagedContentEntry[],
  pages: VercelAnalyticsListItem[],
): TopContentPageItem[] {
  const contentByPath = new Map<string, { item: ManagedContentEntry; locale: Locale }>();

  for (const item of items) {
    if (item.status !== "published" || item.visibleLocales.length === 0 || item.contentType !== "content") {
      continue;
    }

    for (const locale of item.visibleLocales) {
      contentByPath.set(normalizePath(getPublicDetailHref(item.section, locale, item.id, item.categorySlug)), {
        item,
        locale,
      });
    }
  }

  return pages
    .map((page) => {
      const matched = contentByPath.get(normalizePath(page.label));
      if (!matched) return null;

      const contentLocale = getResolvedContentLocale(matched.item, matched.locale);

      return {
        category: getManagedCategoryLabel(matched.item.section, matched.item.categorySlug, contentLocale),
        href: getPublicDetailHref(matched.item.section, contentLocale, matched.item.id, matched.item.categorySlug),
        imageSrc: matched.item.imageSrc,
        pageViews: page.value,
        title: getLocalizedContent(matched.item.title, contentLocale),
      };
    })
    .filter((item): item is TopContentPageItem => item !== null)
    .slice(0, 10);
}

function MetricList({ items }: { items: VercelAnalyticsListItem[] }) {
  const maxValue = Math.max(...items.map((item) => item.value), 1);

  if (items.length === 0) {
    return (
      <div className="flex min-h-[120px] items-center justify-center rounded-box bg-bg px-5 py-5 text-center type-body-md text-mute">
        표시할 Analytics 데이터가 없습니다.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {items.map((item) => {
        const width = Math.max(3, Math.round((item.value / maxValue) * 100));

        return (
          <div key={item.label} className="flex flex-col gap-2">
            <div className="flex items-center justify-between gap-4">
              <span className="min-w-0 truncate type-body-md text-fg">{item.label}</span>
              <span className="shrink-0 type-body-sm text-mute">{formatNumber(item.value)}</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-black">
              <div className="h-full rounded-full bg-success" style={{ width: `${width}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default async function AdminDashboardPage() {
  noStore();
  const [items, analytics] = await Promise.all([
    readContentState(undefined, { includeBodies: false }),
    readVercelAnalyticsSummary(),
  ]);
  const data = buildDashboardData(items);
  const topContentPages = buildTopContentPages(items, analytics.contentPages);
  const topCountry = getTopItem(analytics.countries);
  const topDevice = getTopItem(analytics.devices);
  const pageViewChange = getChangePercent(analytics.pageViews, analytics.previousPageViews);
  const trendMaxValue = Math.max(...analytics.trend.map((entry) => entry.value), 1);

  return (
    <section className="mx-auto flex w-full max-w-[1000px] flex-col gap-5 py-5 md:gap-6 md:py-8">
      <DashboardSection title="Vercel Web Analytics">
        <DashboardCard className="p-[30px]">
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="flex flex-col gap-2">
                <div className="inline-flex w-fit items-center gap-2 rounded-full bg-bg px-3 py-1 type-body-sm text-mute">
                  <span aria-hidden="true" className="h-2 w-2 rounded-full bg-success" />
                  Web Analytics enabled
                </div>
                <p className="m-0 type-body-md text-mute">
                  최근 30일 기준 방문 흐름입니다. 배포 전이거나 방문이 없으면 빈 상태로 표시됩니다.
                </p>
              </div>
              <TextButton className="w-fit shrink-0" href={vercelAnalyticsHref} rel="noreferrer" target="_blank">
                Open Vercel Analytics
              </TextButton>
            </div>

            {analytics.error ? (
              <div className="rounded-box bg-bg px-5 py-5">
                <p className="m-0 type-body-md text-fg">
                  {analytics.isConfigured ? "Vercel Analytics fetch failed" : "Vercel Analytics setup required"}
                </p>
                <p className="m-0 type-body-sm text-mute">{analytics.error}</p>
              </div>
            ) : null}

            <div className="grid overflow-hidden rounded-box bg-bg divide-y divide-border md:grid-cols-4 md:divide-x md:divide-y-0">
              <div className="flex min-h-[92px] flex-col justify-between gap-3 bg-bg px-5 py-5">
                <p className="m-0 type-body-sm text-mute">Page views · 30d</p>
                <p className="m-0 type-h2 text-fg">{analytics.isConfigured ? formatNumber(analytics.pageViews) : "Setup"}</p>
              </div>
              <div className="flex min-h-[92px] flex-col justify-between gap-3 bg-bg px-5 py-5">
                <p className="m-0 type-body-sm text-mute">Previous period</p>
                <p className="m-0 type-h2 text-fg">
                  {analytics.isConfigured ? `${pageViewChange >= 0 ? "+" : ""}${formatPercent(pageViewChange)}` : "-"}
                </p>
              </div>
              <div className="flex min-h-[92px] flex-col justify-between gap-3 bg-bg px-5 py-5">
                <p className="m-0 type-body-sm text-mute">Top country</p>
                <p className="m-0 break-words type-body-md text-fg">{topCountry?.label ?? "-"}</p>
              </div>
              <div className="flex min-h-[92px] flex-col justify-between gap-3 bg-bg px-5 py-5">
                <p className="m-0 type-body-sm text-mute">Top device</p>
                <p className="m-0 break-words type-body-md text-fg">{topDevice?.label ?? "-"}</p>
              </div>
            </div>

            <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.7fr)]">
              <div className="flex flex-col gap-3">
                <p className="m-0 type-body-md text-fg">Traffic trend</p>
                <div className="flex h-[160px] items-end gap-1 rounded-box bg-bg px-5 py-5">
                  {analytics.trend.length > 0 ? (
                    analytics.trend.map((item) => {
                      const height = Math.max(4, Math.round((item.value / trendMaxValue) * 100));

                      return (
                        <div key={item.label} className="flex min-w-0 flex-1 items-end">
                          <div
                            aria-label={`${item.label}: ${item.value} page views`}
                            className="w-full rounded-t-sm bg-point"
                            style={{ height: `${height}%` }}
                            title={`${item.label}: ${item.value}`}
                          />
                        </div>
                      );
                    })
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-center type-body-md text-mute">
                      Analytics 데이터가 아직 없습니다.
                    </div>
                  )}
                </div>
              </div>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
                <div className="flex flex-col gap-3">
                  <p className="m-0 type-body-md text-fg">Top pages</p>
                  <MetricList items={analytics.topPages} />
                </div>
                <div className="flex flex-col gap-3">
                  <p className="m-0 type-body-md text-fg">Referrers</p>
                  <MetricList items={analytics.referrers} />
                </div>
              </div>
            </div>
          </div>
        </DashboardCard>
      </DashboardSection>

      <DashboardSection title="Content operations">
        <DashboardCard className="p-[30px]">
          <div className="flex flex-col gap-5">
            <div className="grid overflow-hidden rounded-box bg-bg divide-y divide-border md:grid-cols-4 md:divide-x md:divide-y-0">
              {data.summaryCards.map((metric) => (
                <div key={metric.label} className="flex min-h-[112px] flex-col justify-between gap-3 bg-bg px-5 py-5">
                  <p className="m-0 type-body-sm text-mute">{metric.label}</p>
                  <div className="flex flex-col gap-1">
                    <p className="m-0 type-h2 text-fg">{metric.value}</p>
                    <p className="m-0 type-body-sm text-mute">{metric.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-3">
              <p className="m-0 type-body-md text-fg">Top viewed content</p>
              <div className="flex flex-col overflow-hidden rounded-box bg-bg divide-y divide-border">
                {topContentPages.length > 0 ? (
                  topContentPages.map((item, index) => (
                    <div key={`${item.href}:${index}`} className="grid gap-4 px-5 py-4 md:grid-cols-[36px_72px_minmax(0,1fr)_92px_84px] md:items-center">
                      <div className="type-body-sm text-mute">{index + 1}</div>
                      <ContentPreviewImage
                        alt={item.title}
                        className="block h-full w-full object-cover"
                        containerClassName="h-[48px] w-[72px] overflow-hidden rounded-button bg-bg-content"
                        src={item.imageSrc}
                        useThumbnailFallback
                      />
                      <div className="min-w-0">
                        <p className="mb-1 mt-0 type-body-sm text-mute">{item.category}</p>
                        <p className="m-0 line-clamp-2 type-body-md text-fg">{item.title}</p>
                      </div>
                      <div className="type-body-sm text-mute md:text-right">
                        {formatNumber(item.pageViews)} views
                      </div>
                      <TextButton className="w-fit justify-self-start type-body-sm md:justify-self-end" href={item.href} target="_blank" rel="noreferrer">
                        바로가기
                      </TextButton>
                    </div>
                  ))
                ) : (
                  <div className="flex min-h-[160px] items-center justify-center px-5 py-6 text-center type-body-md text-mute">
                    페이지뷰가 집계된 콘텐츠가 없습니다.
                  </div>
                )}
              </div>
            </div>
          </div>
        </DashboardCard>
      </DashboardSection>
    </section>
  );
}
