"use client";

import { pageSectionGapClassName, pageXPaddingClassName } from "@/constants/layout";
import { useMemo } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Tab from "@/components/ui/Tab";
import TabGroup from "@/components/ui/TabGroup";
import Cta from "@/components/sections/common/Cta";
import { pricingProductsByLocale, type ComparisonGroup, type ComparisonValue, type PlanCard, type PlanFeature, type PricingProduct } from "@/constants/plans";
import { getLocalePath, type Locale } from "@/constants/i18n";
import { getPlansPageCopy } from "@/copy/contentPages";

type PlansPageProps = {
  productKey?: "aip" | "acp";
  locale: Locale;
};

function cx(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

function withLocaleHref(locale: string, href: string) {
  // 플랜 CTA가 현재 언어 경로를 유지하도록 locale prefix 보정
  if (href.startsWith("http")) return href;
  return getLocalePath(locale as Locale, href.startsWith("/") ? href : `/${href}`);
}

function isPlanFeatureDivider(feature: PlanFeature): feature is Extract<PlanFeature, { type: "divider" }> {
  return typeof feature === "object" && "type" in feature && feature.type === "divider";
}

function PlanSummaryCard({
  ctaLabel,
  description,
  features,
  href,
  name,
  priceLabel,
  tone = "secondary",
}: PlanCard) {
  return (
    /* 상단 플랜 카드 한 장 */
    <article
      className="flex flex-col justify-between rounded-box bg-bg-content p-[30px] md:h-full md:min-h-[420px]"
    >
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-1">
          <h2 className={cx("m-0 type-h2", tone === "primary" ? "text-brand" : "text-fg")}>{name}</h2>
          <p className="m-0 type-body-md text-mute">{description}</p>
        </div>

        <p className="m-0 type-h2 text-fg">{priceLabel}</p>

        <ul className="m-0 flex list-none flex-col gap-1.5 p-0">
          {features.map((feature, index) => {
            if (isPlanFeatureDivider(feature)) {
              return (
                <li
                  aria-hidden="true"
                  className="my-2 h-px w-full bg-border"
                  key={`divider-${index}`}
                />
              );
            }

            return (
              <li
                key={`${typeof feature === "string" ? feature : feature.value}-${index}`}
                className="flex items-start gap-1.5 whitespace-pre-line type-body-md text-fg"
              >
                <span className={cx(
                  "inline-flex w-4 shrink-0 justify-center",
                  typeof feature === "string" || feature.tone !== "danger" ? "text-success" : "text-destructive",
                )}>
                  {typeof feature === "string" || feature.tone !== "danger" ? "✓" : "✕"}
                </span>
                <span>{typeof feature === "string" ? feature : feature.value}</span>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="pt-8">
        <a className="inline-flex" href={href}>
          <Button
            arrow
            className="min-w-[126px]"
            style="full"
            variant="primary"
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
  if (tone === "muted") return "text-mute";
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
      {text ? <span className="text-mute">{text}</span> : null}
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
    <div className="w-full">
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
                <div className="rounded-button bg-bg-content px-5 py-[10px] type-body-md text-mute">
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
  productKey = "aip",
  locale,
}: PlansPageProps) {
  const pricingProducts = pricingProductsByLocale[locale];
  const pageCopy = getPlansPageCopy(locale);
  const router = useRouter();
  const activeProductKey: keyof typeof pricingProducts =
    productKey in pricingProducts ? productKey : "aip";
  const activeProduct = useMemo(
    () => pricingProducts[activeProductKey],
    [activeProductKey, pricingProducts],
  );
  const activeProductCaption =
    activeProductKey === "aip" ? "AI Platform" : "Access Control Platform";

  function handleProductChange(nextKey: keyof typeof pricingProducts) {
    if (nextKey === activeProductKey) return;
    router.push(getLocalePath(locale, `/plans/${nextKey}`), { scroll: false });
  }

  return (
    <div className={`flex w-full flex-col ${pageSectionGapClassName} ${pageXPaddingClassName} pb-10`}>
      <section className="flex w-full justify-center">
        <div className="flex w-full max-w-[1200px] flex-col gap-[60px] md:gap-[80px]">
          <div className="flex flex-col items-center gap-3">
            <h1 className="m-0 mb-[8px] type-h1 text-center text-fg">{pageCopy.title}</h1>

            {/* 제품군 전환 탭 */}
            <TabGroup>
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
            </TabGroup>

            <p className="m-0 text-center type-body-md text-mute">{activeProductCaption}</p>
          </div>

          {/* 선택된 제품군에 맞는 카드/비교표 렌더링 */}
          <div className="flex flex-col items-center gap-[60px] md:gap-[80px]">
            <div className="grid w-full gap-5 md:grid-cols-3">
              {activeProduct.cards.map((plan, index) => (
                <PlanSummaryCard
                  key={`${activeProductKey}-${plan.name}`}
                  {...plan}
                  href={withLocaleHref(locale, plan.href)}
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
        </div>
      </section>
      <Cta locale={locale} />
    </div>
  );
}
