import AdminHeader from "../../layout/admin/AdminHeader";

function cx(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

function StatCard({
  children,
  className,
  title,
}: {
  children: React.ReactNode;
  className?: string;
  title: string;
}) {
  return (
    /* 대시보드에서 반복 사용하는 공통 통계 카드 */
    <article className={cx("rounded-box border border-border bg-bg-content p-5", className)}>
      <div className="flex flex-col gap-5">
        <p className="m-0 type-body-md text-mute-fg">{title}</p>
        {children}
      </div>
    </article>
  );
}

function BarChart({
  bars,
  colorClass = "bg-brand",
}: {
  bars: number[];
  colorClass?: string;
}) {
  return (
    /* 간단한 막대 차트 프리뷰 */
    <div className="flex h-[140px] items-end gap-2">
      {bars.map((value, index) => (
        <div key={`${value}-${index}`} className="flex flex-1 flex-col justify-end">
          <div className="rounded-t-[6px] bg-bg-deep">
            <div className={cx("w-full rounded-t-[6px]", colorClass)} style={{ height: `${value}px` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function MiniLineChart() {
  return (
    /* 구독자 추이를 보여주는 라인 차트 */
    <svg className="h-[140px] w-full" viewBox="0 0 300 140" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 98C36 74 60 80 82 62C104 44 120 40 146 54C168 66 184 102 212 94C236 86 252 28 290 36" stroke="#EF612E" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M10 98C36 74 60 80 82 62C104 44 120 40 146 54C168 66 184 102 212 94C236 86 252 28 290 36V140H10V98Z" fill="url(#subscribers-fill)" fillOpacity="0.18" />
      <defs>
        <linearGradient id="subscribers-fill" x1="150" y1="24" x2="150" y2="140" gradientUnits="userSpaceOnUse">
          <stop stopColor="#EF612E" />
          <stop offset="1" stopColor="#EF612E" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function PieChart({
  items,
}: {
  items: Array<{ color: string; label: string; percent: number; value: string }>;
}) {
  let accumulated = 0;
  const gradientStops = items.map((item) => {
    const start = accumulated;
    const end = accumulated + item.percent;
    accumulated = end;
    return `${item.color} ${start}% ${end}%`;
  });

  return (
    /* 방문 지역 비중을 표시하는 원형 차트 */
    <div className="flex items-center gap-8">
      <div
        className="h-[160px] w-[160px] rounded-full"
        style={{
          background: `conic-gradient(${gradientStops.join(", ")})`,
        }}
      />

      <div className="flex flex-col gap-3">
        {items.map((item) => (
          <div key={item.label} className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="type-body-md text-fg">{item.label}</span>
            <span className="type-body-md text-mute-fg">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <section className="flex flex-col gap-8">
      {/* 관리자 첫 화면 요약 헤더 */}
      <AdminHeader
        description="홈페이지 운영 현황과 주요 지표를 한눈에 확인합니다."
        title="Dashboard"
      />

      {/* 운영 지표를 카드형으로 나열 */}
      <div className="grid gap-4 xl:grid-cols-3">
        <StatCard title="Visitors">
          <div className="flex items-end justify-between">
            <p className="m-0 type-h2 text-fg">12,480</p>
            <span className="type-body-md text-success">+18.2%</span>
          </div>
          <BarChart bars={[42, 76, 58, 92, 84, 118, 96, 132]} />
        </StatCard>

        <StatCard title="Subscribers">
          <div className="flex items-end justify-between">
            <p className="m-0 type-h2 text-fg">2,431</p>
            <span className="type-body-md text-success">+6.4%</span>
          </div>
          <MiniLineChart />
        </StatCard>

        <StatCard title="Content Count">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-box bg-bg-deep p-4">
              <p className="m-0 type-body-md text-mute-fg">Use Cases</p>
              <p className="mt-3 m-0 type-h2 text-fg">14</p>
            </div>
            <div className="rounded-box bg-bg-deep p-4">
              <p className="m-0 type-body-md text-mute-fg">Blogs</p>
              <p className="mt-3 m-0 type-h2 text-fg">28</p>
            </div>
            <div className="rounded-box bg-bg-deep p-4">
              <p className="m-0 type-body-md text-mute-fg">White Papers</p>
              <p className="mt-3 m-0 type-h2 text-fg">9</p>
            </div>
            <div className="rounded-box bg-bg-deep p-4">
              <p className="m-0 type-body-md text-mute-fg">News</p>
              <p className="mt-3 m-0 type-h2 text-fg">11</p>
            </div>
          </div>
        </StatCard>

        <StatCard title="SEO Issues">
          <div className="flex items-end justify-between">
            <p className="m-0 type-h2 text-fg">17</p>
            <span className="type-body-md text-destructive">2 urgent</span>
          </div>
          <div className="flex flex-col gap-3">
            <div className="rounded-box bg-bg-deep p-4">
              <p className="m-0 type-body-md text-mute-fg">Missing metadata</p>
              <p className="mt-2 m-0 type-body-lg text-fg">8 pages</p>
            </div>
            <div className="rounded-box bg-bg-deep p-4">
              <p className="m-0 type-body-md text-mute-fg">Broken internal links</p>
              <p className="mt-2 m-0 type-body-lg text-fg">5 pages</p>
            </div>
          </div>
        </StatCard>

        <StatCard title="Visitor Region">
          <PieChart
            items={[
              { color: "#EF612E", label: "KR", percent: 42, value: "42%" },
              { color: "#2F94E5", label: "JP", percent: 27, value: "27%" },
              { color: "#C0E136", label: "US", percent: 19, value: "19%" },
              { color: "#7D8187", label: "ETC", percent: 12, value: "12%" },
            ]}
          />
        </StatCard>

        <StatCard title="CPU Usage">
          <div className="flex items-end justify-between">
            <p className="m-0 type-h2 text-fg">63%</p>
            <span className="type-body-md text-warning">Peak 81%</span>
          </div>
          <BarChart bars={[26, 34, 48, 62, 57, 71, 66, 88]} colorClass="bg-point" />
        </StatCard>
      </div>
    </section>
  );
}
