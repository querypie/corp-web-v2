type CompetitorColumn = {
  name: string;
  monthlyCost: string;
  models: string[];
  features: string[];
  annualCost: string[];
};

type QueryPieColumn = {
  name: string;
  monthlyCost: string;
  models: string[];
  summary: string[];
  features: string[];
  annualCost: string;
  savings: string;
};

type ComparisonCopy = {
  rows: {
    monthlyCost: string;
    models: string;
    features: string;
    annualCost: string[];
  };
  competitors: CompetitorColumn[];
  queryPie: QueryPieColumn;
  note: string;
};

type UsageBasedLlmComparisonTableProps = {
  copy: ComparisonCopy;
};

function CellText({ lines }: { lines: string[] }) {
  return (
    <span className="flex flex-col gap-1">
      {lines.map((line) => (
        <span key={line}>{line}</span>
      ))}
    </span>
  );
}

function FeatureList({ items, columns = false }: { items: string[]; columns?: boolean }) {
  return (
    <ul
      className={
        columns
          ? "m-0 grid list-disc gap-x-7 gap-y-2 pl-5 text-left marker:text-mute sm:grid-cols-2"
          : "m-0 flex list-disc flex-col gap-2 pl-5 text-left marker:text-mute"
      }
    >
      {items.map((item) => (
        <li key={item} className="pl-1">
          {item}
        </li>
      ))}
    </ul>
  );
}

export type { ComparisonCopy };

export default function UsageBasedLlmComparisonTable({ copy }: UsageBasedLlmComparisonTableProps) {
  return (
    <section className="flex w-full justify-center">
      <div className="flex w-full max-w-[1200px] flex-col gap-8">
        <header className="flex w-full flex-col items-center gap-5 text-center">
          <h2 className="m-0 w-full type-h1 font-normal tracking-[0] text-fg md:tracking-[-0.2px]">
            Best Performance, Best Price!
          </h2>
        </header>

        <div className="grid gap-4 lg:hidden">
          <article className="overflow-hidden rounded-box bg-bg">
            <div className="bg-brand px-5 py-5 text-center type-body-lg text-on-brand">
              {copy.queryPie.name} AI
            </div>
            <div className="grid gap-0">
              <div className="grid gap-2 border-b border-border px-5 py-4">
                <span className="type-body-md text-mute">{copy.rows.monthlyCost}</span>
                <span className="type-body-md text-mute">{copy.queryPie.monthlyCost}</span>
              </div>
              <div className="grid gap-2 border-b border-border px-5 py-4">
                <span className="type-body-md text-mute">{copy.rows.models}</span>
                <span className="type-body-md leading-relaxed text-mute">
                  <CellText lines={copy.queryPie.models} />
                </span>
              </div>
              <div className="grid gap-5 border-b border-border px-5 py-5 type-body-md leading-relaxed text-mute">
                <p className="mx-auto my-0 max-w-[360px] text-pretty text-center text-fg">
                  {copy.queryPie.summary.join(" ")}
                </p>
                <FeatureList items={copy.queryPie.features} columns />
              </div>
              <div className="px-5 py-5 text-center">
                <p className="m-0 text-pretty type-body-md leading-relaxed text-mute">
                  <span className="type-h3 text-brand">{copy.queryPie.annualCost}</span>
                  <br />
                  {copy.queryPie.savings}
                </p>
              </div>
            </div>
          </article>

          <div className="grid gap-4 sm:grid-cols-2">
            {copy.competitors.map((competitor) => (
              <article key={competitor.name} className="rounded-box bg-bg">
                <div className="bg-bg-content px-5 py-5 text-center type-body-lg text-fg">
                  {competitor.name}
                </div>
                <div className="grid gap-0">
                  <div className="grid gap-2 border-b border-border px-5 py-4">
                    <span className="type-body-md text-mute">{copy.rows.monthlyCost}</span>
                    <span className="type-body-md text-mute">{competitor.monthlyCost}</span>
                  </div>
                  <div className="grid gap-2 border-b border-border px-5 py-4">
                    <span className="type-body-md text-mute">{copy.rows.models}</span>
                    <span className="type-body-md leading-relaxed text-mute">
                      <CellText lines={competitor.models} />
                    </span>
                  </div>
                  <div className="grid gap-3 border-b border-border px-5 py-4 type-body-md leading-relaxed text-mute">
                    <span className="type-body-md text-mute">{copy.rows.features}</span>
                    <FeatureList items={competitor.features} />
                  </div>
                  <div className="grid gap-1 px-5 py-4 type-body-md text-mute">
                    <span className="type-body-md text-mute">{copy.rows.annualCost.join(" ")}</span>
                    <CellText lines={competitor.annualCost} />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="hidden lg:block">
          <div className="grid w-full grid-cols-[minmax(120px,0.72fr)_repeat(4,minmax(0,1fr))_minmax(0,1.45fr)] bg-bg">
            <div className="rounded-l-box bg-bg-content px-5 py-5" />

            {copy.competitors.map((competitor) => (
              <div
                key={competitor.name}
                className="bg-bg-content px-5 py-5 text-center type-body-lg text-fg"
              >
                {competitor.name}
              </div>
            ))}

            <div className="rounded-r-box bg-brand px-5 py-5 text-center type-body-lg text-on-brand">
              {copy.queryPie.name} AI
            </div>

            <div className="border-b border-border px-5 py-7 type-body-md text-fg">{copy.rows.monthlyCost}</div>
            {copy.competitors.map((competitor) => (
              <div key={`${competitor.name}-monthly`} className="border-b border-border px-5 py-7 text-center type-body-md text-mute">
                {competitor.monthlyCost}
              </div>
            ))}
            <div className="border-b border-border px-5 py-7 text-center type-body-md text-mute">
              {copy.queryPie.monthlyCost}
            </div>

            <div className="border-b border-border px-5 py-7 type-body-md text-fg">{copy.rows.models}</div>
            {copy.competitors.map((competitor) => (
              <div key={`${competitor.name}-models`} className="border-b border-border px-5 py-7 text-center type-body-md leading-relaxed text-mute">
                <CellText lines={competitor.models} />
              </div>
            ))}
            <div className="border-b border-border px-5 py-7 text-center type-body-md leading-relaxed text-mute">
              <CellText lines={copy.queryPie.models} />
            </div>

            <div className="min-h-[420px] border-b border-border px-5 py-8 type-body-md text-fg">{copy.rows.features}</div>
            {copy.competitors.map((competitor) => (
              <div key={`${competitor.name}-features`} className="flex min-h-[420px] items-start border-b border-border px-5 py-8 type-body-md leading-relaxed text-mute">
                <FeatureList items={competitor.features} />
              </div>
            ))}
            <div className="flex min-h-[420px] flex-col items-stretch justify-start gap-8 border-b border-border px-7 py-8 type-body-md leading-relaxed text-mute">
              <p className="mx-auto my-0 max-w-[360px] text-pretty text-center text-fg">
                {copy.queryPie.summary.join(" ")}
              </p>
              <FeatureList items={copy.queryPie.features} columns />
            </div>

            <div className="px-5 py-8 type-body-md text-fg">
              <CellText lines={copy.rows.annualCost} />
            </div>
            {copy.competitors.map((competitor) => (
              <div key={`${competitor.name}-annual`} className="px-5 py-8 text-center type-body-md text-mute">
                <CellText lines={competitor.annualCost} />
              </div>
            ))}
            <div className="px-5 py-8 text-center">
              <p className="m-0 text-pretty type-body-md leading-relaxed text-mute">
                <span className="type-h3 text-brand">{copy.queryPie.annualCost}</span>
                <br />
                {copy.queryPie.savings}
              </p>
            </div>
          </div>
        </div>

        <p className="m-0 type-body-md text-mute">{copy.note}</p>
      </div>
    </section>
  );
}
