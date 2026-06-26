import type { ReactNode } from "react";
import { unstable_noStore as noStore } from "next/cache";
import TextButton from "@/components/ui/TextButton";
import { locales } from "@/constants/i18n";
import { readContentState } from "@/features/content/contentState.server";
import { readVercelAnalyticsSummary, type VercelAnalyticsListItem } from "@/features/analytics/vercel.server";
import {
  getAdminCategoryHref,
  type ManagedContentEntry,
  type ManagedContentSection,
} from "@/features/content/data";

type SummaryCard = {
  description: string;
  label: string;
  value: string;
};

const vercelAnalyticsHref = "https://vercel.com/querypie/corp-web-v2/analytics";

const sectionLabels: Record<ManagedContentSection, string> = {
  demo: "Demo",
  documentation: "Documentation",
  news: "News",
};

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

function getVisibleItemCount(items: ManagedContentEntry[]) {
  return items.filter((item) => item.status === "published" && item.visibleLocales.length > 0).length;
}

function getMissingLocaleCount(items: ManagedContentEntry[]) {
  return items.filter((item) => item.status === "published" && item.visibleLocales.length < locales.length).length;
}

function buildDashboardData(items: ManagedContentEntry[]) {
  const totalCount = items.length;
  const publishedCount = getVisibleItemCount(items);
  const hiddenCount = items.filter((item) => item.status === "hidden").length;
  const missingLocaleCount = getMissingLocaleCount(items);
  const downloadableCount = items.filter((item) => item.enableDownloadButton || item.downloadPdfSrc).length;

  const summaryCards: SummaryCard[] = [
    {
      label: "Live content",
      value: String(publishedCount),
      description: "게시 상태이며 하나 이상의 locale에 노출되는 콘텐츠",
    },
    {
      label: "Hidden",
      value: String(hiddenCount),
      description: "작성 중이거나 공개 화면에서 숨겨진 콘텐츠",
    },
    {
      label: "Locale gaps",
      value: String(missingLocaleCount),
      description: "게시되었지만 EN/KO/JA 중 일부 locale이 빠진 콘텐츠",
    },
    {
      label: "Downloads",
      value: String(downloadableCount),
      description: "다운로드 버튼 또는 PDF 파일이 연결된 콘텐츠",
    },
  ];

  const sectionStats = (["news", "demo", "documentation"] as const).map((section) => {
    const sectionItems = items.filter((item) => item.section === section);
    const sectionPublishedCount = getVisibleItemCount(sectionItems);

    return {
      hiddenCount: sectionItems.filter((item) => item.status === "hidden").length,
      href: getAdminCategoryHref(section, section === "news" ? "news" : section === "demo" ? "use-cases" : "blogs"),
      label: sectionLabels[section],
      publishedCount: sectionPublishedCount,
      section,
      totalCount: sectionItems.length,
      visibleRate: totalCount === 0 ? 0 : (sectionPublishedCount / Math.max(sectionItems.length, 1)) * 100,
    };
  });

  const localeStats = locales.map((locale) => {
    const visibleCount = items.filter((item) => item.status === "published" && item.visibleLocales.includes(locale)).length;

    return {
      label: locale.toUpperCase(),
      locale,
      percent: publishedCount === 0 ? 0 : (visibleCount / publishedCount) * 100,
      visibleCount,
    };
  });

  return {
    hiddenCount,
    localeStats,
    missingLocaleCount,
    publishedCount,
    sectionStats,
    summaryCards,
    totalCount,
  };
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
  const topCountry = getTopItem(analytics.countries);
  const topDevice = getTopItem(analytics.devices);
  const pageViewChange = getChangePercent(analytics.pageViews, analytics.previousPageViews);

  return (
    <section className="mx-auto flex w-full max-w-[1120px] flex-col gap-5 py-5 md:gap-6 md:py-8">
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
                      const maxValue = Math.max(...analytics.trend.map((entry) => entry.value), 1);
                      const height = Math.max(4, Math.round((item.value / maxValue) * 100));

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

            <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.7fr)]">
              <div className="flex flex-col gap-3">
                <p className="m-0 type-body-md text-fg">Section health</p>
                <div className="flex flex-col gap-5">
                  {data.sectionStats.map((section) => (
                    <a key={section.section} className="rounded-box bg-bg px-5 py-5 transition-colors hover:bg-secondary" href={section.href}>
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <p className="m-0 type-body-md text-fg">{section.label}</p>
                          <p className="m-0 type-body-sm text-mute">
                            {section.publishedCount} live / {section.hiddenCount} hidden / {section.totalCount} total
                          </p>
                        </div>
                        <span className="shrink-0 type-body-md text-fg">{formatPercent(section.visibleRate)}</span>
                      </div>
                      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-black">
                        <div className="h-full rounded-full bg-point" style={{ width: formatPercent(section.visibleRate) }} />
                      </div>
                    </a>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <p className="m-0 type-body-md text-fg">Locale coverage</p>
                <div className="flex flex-col gap-4 rounded-box bg-bg px-5 py-5">
                  {data.localeStats.map((locale) => (
                    <div key={locale.locale} className="flex flex-col gap-2">
                      <div className="flex items-center justify-between gap-3">
                        <span className="type-body-md text-fg">{locale.label}</span>
                        <span className="type-body-sm text-mute">
                          {locale.visibleCount} items · {formatPercent(locale.percent)}
                        </span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-black">
                        <div className="h-full rounded-full bg-success" style={{ width: formatPercent(locale.percent) }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </DashboardCard>
      </DashboardSection>
    </section>
  );
}
