"use client";

import { useMemo, useState } from "react";
import Button from "../../common/Button";
import Tab from "../../common/Tab";
import { pricingProductsByLocale, type ComparisonGroup, type ComparisonValue, type PlanCard, type PricingProduct } from "../../../constants/plans";
import type { Locale } from "../../../constants/i18n";

type PlansPageProps = {
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
      className="card-hover flex min-h-[420px] flex-col justify-between rounded-box bg-bg-content p-[30px]"
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
            <li key={feature} className="type-body-md text-fg">
              ✓ {feature}
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
            variant={tone === "primary" ? "primary" : "secondary"}
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
      <div className="hidden w-full grid-cols-4 items-center py-4 md:grid">
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
            <div className="rounded-box bg-bg-content px-5 py-[10px] type-body-md text-mute-fg">
              {group.title}
            </div>

            {group.rows.map((row) => (
              <div
                key={row.label}
                className="border-b border-border py-4 md:grid md:grid-cols-4 md:items-center"
              >
                <div className="pb-3 type-body-md text-fg md:px-5 md:pb-0">{row.label}</div>

                <div className="grid grid-cols-1 gap-3 md:col-span-3 md:grid-cols-3 md:gap-0">
                  {row.values.map((cell, index) => (
                    <div
                      key={`${row.label}-${plans[index]}`}
                      className={cx(
                        "type-body-md text-left md:px-5 md:text-center",
                        getValueToneClass(cell.tone),
                      )}
                    >
                      {cell.value}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function PlansPage({
  locale,
}: PlansPageProps) {
  const pricingProducts = pricingProductsByLocale[locale];
  const [activeProductKey, setActiveProductKey] = useState<keyof typeof pricingProducts>("aip");
  const activeProduct = useMemo(
    () => pricingProducts[activeProductKey],
    [activeProductKey],
  );

  return (
    <div className="flex w-full justify-center px-5 pb-10 md:px-10">
      <section className="flex w-full max-w-[1200px] flex-col gap-[80px]">
          <div className="flex flex-col items-center gap-5" data-reveal>
            <h1 className="m-0 type-h1 text-center text-fg">Pricing</h1>

            {/* 제품군 전환 탭 */}
            <div className="rounded-full bg-bg-deep p-1">
              <div className="flex items-center rounded-full">
                {(Object.entries(pricingProducts) as Array<[keyof typeof pricingProducts, PricingProduct]>).map(
                  ([key, product]) => (
                    <Tab
                      key={key}
                      className="shrink-0"
                      onClick={() => setActiveProductKey(key)}
                      state={activeProductKey === key ? "on" : "off"}
                    >
                      {product.tabLabel}
                    </Tab>
                  ),
                )}
              </div>
            </div>
          </div>

          {/* 선택된 제품군에 맞는 카드/비교표 렌더링 */}
          <div className="flex flex-col items-center gap-[80px]">
            <div className="grid w-full gap-5 md:grid-cols-3">
              {activeProduct.cards.map((plan, index) => (
                <PlanSummaryCard
                  key={plan.name}
                  {...plan}
                  href={withLocaleHref(locale, plan.href)}
                  index={index}
                />
              ))}
            </div>

            <ComparisonTable
              comparisonGroups={activeProduct.comparisonGroups}
              plans={activeProduct.plans}
            />
          </div>
        </section>
    </div>
  );
}
