"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Button from "../../common/Button";
import Tab from "../../common/Tab";
import { pricingProductsByLocale, type ComparisonGroup, type ComparisonValue, type PlanCard, type PricingProduct } from "../../../constants/plans";
import type { Locale } from "../../../constants/i18n";

type PlansPageProps = {
  initialProductKey?: string;
  locale: Locale;
};

function cx(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

function withLocaleHref(locale: string, href: string) {
  // 플랜 CTA가 현재 언어 경로를 유지하도록 locale prefix 보정
  if (href.startsWith("http")) return href;
  if (href.startsWith(`/${locale}/`)) return href;
  if (href.startsWith("/")) return `/${locale}${href}`;
  return `/${locale}/${href}`;
}

function PlanSummaryCard({
  ctaLabel,
  description,
  features,
  href,
  index,
  name,
  priceLabel,
  tone = "secondary",
}: PlanCard & { index: number }) {
  return (
    /* 상단 플랜 카드 한 장 */
    <article
      className="flex flex-col justify-between rounded-box bg-bg-content p-[30px] md:h-full md:min-h-[420px]"
      data-reveal
      style={{ transitionDelay: `${index * 70}ms` }}
    >
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-1">
          <h2 className={cx("m-0 type-h2", tone === "primary" ? "text-brand" : "text-fg")}>{name}</h2>
          <p className="m-0 type-body-md text-mute-fg">{description}</p>
        </div>

        <p className="m-0 type-h2 text-fg">{priceLabel}</p>

        <ul className="m-0 flex list-none flex-col gap-1.5 p-0">
          {features.map((feature) => (
            <li
              key={typeof feature === "string" ? feature : feature.value}
              className="type-body-md text-fg"
            >
              <span className={cx(typeof feature === "string" || feature.tone !== "danger" ? "text-success" : "text-destructive")}>
                {typeof feature === "string" || feature.tone !== "danger" ? "✓" : "✕"}
              </span>{" "}
              {typeof feature === "string" ? feature : feature.value}
            </li>
          ))}
        </ul>
      </div>

      <div className="pt-8">
        <a className="inline-flex" href={href}>
          <Button
            arrow
            className="min-w-[126px]"
            size="large"
            variant="secondary"
          >
            {ctaLabel}
          </Button>
        </a>
      </div>
    </article>
  );
}

function getValueToneClass(tone?: ComparisonValue["tone"]) {
  if (tone === "success") return "text-success";
  if (tone === "danger") return "text-destructive";
  if (tone === "muted") return "text-mute-fg";
  return "text-fg";
}

function renderComparisonValue(cell: ComparisonValue) {
  const trimmedValue = cell.value.trim();
  const symbolMatch = trimmedValue.match(/^([○✕])\s*(.+)?$/);

  if (!symbolMatch) {
    return <span className={getValueToneClass(cell.tone)}>{cell.value}</span>;
  }

  const [, symbol, text = ""] = symbolMatch;

  return (
    <span className="inline-flex items-center justify-center gap-2">
      <span className={getValueToneClass(cell.tone)}>{symbol}</span>
      {text ? <span className="text-mute-fg">{text}</span> : null}
    </span>
  );
}

function ComparisonTable({
  comparisonGroups,
  plans,
}: {
  comparisonGroups: ComparisonGroup[];
  plans: PricingProduct["plans"];
}) {
  return (
    /* 하단 플랜 비교표 */
    <div className="w-full" data-reveal style={{ transitionDelay: "220ms" }}>
      <div className="overflow-x-auto">
        <div className="min-w-[760px]">
          <div className="grid w-full grid-cols-4 items-center py-4">
            <div />
            {plans.map((plan) => (
              <div
                key={plan}
                className={cx(
                  "px-5 text-center type-body-md",
                  plan === "Enterprise" ? "text-brand" : "text-fg",
                )}
              >
                {plan}
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-5">
            {comparisonGroups.map((group) => (
              <div key={group.title} className="flex flex-col gap-0">
                <div className="rounded-button bg-bg-content px-5 py-[10px] type-body-md text-mute-fg">
                  {group.title}
                </div>

                {group.rows.map((row, rowIndex) => (
                  <div
                    key={row.label}
                    className={cx(
                      "grid grid-cols-4 items-center py-4",
                      rowIndex !== group.rows.length - 1 && "border-b border-border",
                    )}
                  >
                    <div className="px-5 type-body-md text-fg">{row.label}</div>

                    {row.values.map((cell, index) => (
                      <div
                        key={`${row.label}-${plans[index]}`}
                        className="px-5 text-center type-body-md"
                      >
                        {renderComparisonValue(cell)}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PlansPage({
  initialProductKey,
  locale,
}: PlansPageProps) {
  const pricingProducts = pricingProductsByLocale[locale];
  const router = useRouter();
  const pathname = usePathname();
  const resolvedInitialProductKey =
    initialProductKey && initialProductKey in pricingProducts
      ? (initialProductKey as keyof typeof pricingProducts)
      : "aip";
  const [activeProductKey, setActiveProductKey] = useState<keyof typeof pricingProducts>(resolvedInitialProductKey);
  const activeProduct = useMemo(
    () => pricingProducts[activeProductKey],
    [activeProductKey, pricingProducts],
  );
  const activeProductCaption =
    activeProductKey === "aip" ? "AI Platform" : "Access Control Platform";

  useEffect(() => {
    setActiveProductKey(resolvedInitialProductKey);
  }, [resolvedInitialProductKey]);

  function handleProductChange(nextKey: keyof typeof pricingProducts) {
    const nextParams = new URLSearchParams();

    if (nextKey === "aip") {
      nextParams.delete("product");
    } else {
      nextParams.set("product", nextKey);
    }

    const nextQuery = nextParams.toString();
    setActiveProductKey(nextKey);
    router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, { scroll: false });
  }

  return (
    <div className="flex w-full justify-center px-5 pb-10 md:px-10">
      <section className="flex w-full max-w-[1200px] flex-col gap-[60px] md:gap-[80px]">
          <div className="flex flex-col items-center gap-3" data-reveal>
            <h1 className="m-0 mb-[8px] type-h1 text-center text-fg">Pricing</h1>

            {/* 제품군 전환 탭 */}
            <div className="rounded-full bg-bg-deep p-1">
              <div className="flex items-center rounded-full">
                {(Object.entries(pricingProducts) as Array<[keyof typeof pricingProducts, PricingProduct]>).map(
                  ([key, product]) => (
                    <Tab
                      key={key}
                      className="shrink-0"
                      onClick={() => handleProductChange(key)}
                      state={activeProductKey === key ? "on" : "off"}
                    >
                      {product.tabLabel}
                    </Tab>
                  ),
                )}
              </div>
            </div>

            <p className="m-0 text-center type-body-md text-mute-fg">{activeProductCaption}</p>
          </div>

          {/* 선택된 제품군에 맞는 카드/비교표 렌더링 */}
          <div className="flex flex-col items-center gap-[60px] md:gap-[80px]">
            <div className="grid w-full gap-5 md:grid-cols-3">
              {activeProduct.cards.map((plan, index) => (
                <PlanSummaryCard
                  key={`${activeProductKey}-${plan.name}`}
                  {...plan}
                  href={withLocaleHref(locale, plan.href)}
                  index={index}
                />
              ))}
            </div>

            {activeProductKey === "aip" ? (
              <ComparisonTable
                comparisonGroups={activeProduct.comparisonGroups}
                plans={activeProduct.plans}
              />
            ) : null}
          </div>
        </section>
    </div>
  );
}
