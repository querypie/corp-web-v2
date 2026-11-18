"use client";

import { pageSectionGapClassName, pageXPaddingClassName } from "@/constants/layout";
import { useMemo } from "react";
import Button from "@/components/ui/Button";
import { TabLink } from "@/components/ui/Tab";
import TabGroup from "@/components/ui/TabGroup";
import Cta from "@/components/sections/common/Cta";
import { pricingProductsByLocale, type ComparisonGroup, type ComparisonValue, type PlanCard, type PlanFeature, type PricingProduct } from "@/copy/plans";
import { getLocalePath, type Locale } from "@/constants/i18n";
import { getPlansPageCopy } from "@/copy/contentPages";
import { getContactHref } from "@/features/contact/prefill";

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

function getProductHref(
  locale: Locale,
  productKey: "aip" | "acp",
) {
  return getLocalePath(locale, `/plans/${productKey}`);
}

function getExternalLinkProps(href: string) {
  if (!href.startsWith("http")) return {};
  return {
    rel: "noreferrer noopener",
    target: "_blank",
  };
}

function isPlanFeatureDivider(feature: PlanFeature): feature is Extract<PlanFeature, { type: "divider" }> {
  return typeof feature === "object" && "type" in feature && feature.type === "divider";
}

function PlanSummaryCard({
  billingLabel,
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

        <div className="flex flex-col gap-1">
          <p className="m-0 type-h2 text-fg">{priceLabel}</p>
          {billingLabel ? <p className="m-0 type-body-lg text-fg">{billingLabel}</p> : null}
        </div>

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
                className="flex items-start gap-1.5 type-body-md text-fg"
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
        <a className="inline-flex" href={href} {...getExternalLinkProps(href)}>
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
  const cellPadding = "px-2 py-2.5 md:px-4 md:py-3";
  const labelPadding = "pl-4 md:pl-5";

  return (
    <div className="w-full max-w-[900px] overflow-x-auto">
      <table className="w-full min-w-[600px] table-fixed border-collapse type-body-md">
        <colgroup>
          <col className="w-[31%]" />
          {plans.map((plan) => <col key={plan} />)}
        </colgroup>
        <thead>
          <tr>
            <td />
            {plans.map((plan) => (
              <th
                key={plan}
                scope="col"
                className={cx(
                  "px-5 py-4 text-center type-h2 font-medium",
                  plan === "Enterprise" ? "text-brand" : "text-fg",
                )}
              >
                {plan}
              </th>
            ))}
          </tr>
        </thead>
        {comparisonGroups.map((group, groupIndex) => (
          <tbody key={group.title}>
            <tr className="border-y border-border bg-bg-content">
              <th
                className={cx(labelPadding, "py-2 pr-2 text-left type-body-sm text-mute md:pr-4")}
                colSpan={plans.length + 1}
                scope="rowgroup"
              >
                {group.title}
              </th>
            </tr>
            {group.rows.map((row, rowIndex) => (
              <tr key={row.label} className={rowIndex < group.rows.length - 1 ? "border-b border-border" : undefined}>
                <th scope="row" className={cx(cellPadding, labelPadding, "text-left font-normal text-fg")}>
                  {row.label}
                </th>
                {row.values.map((cell, index) => (
                  <td key={plans[index]} className={cx(cellPadding, "text-center tabular-nums")}>
                    {renderComparisonValue(cell)}
                  </td>
                ))}
              </tr>
            ))}
            {groupIndex < comparisonGroups.length - 1 && (
              <tr aria-hidden="true">
                <td className="h-4 p-0 md:h-5" colSpan={plans.length + 1} />
              </tr>
            )}
          </tbody>
        ))}
      </table>
    </div>
  );
}

export default function PlansPage({
  productKey = "acp",
  locale,
}: PlansPageProps) {
  const pricingProducts = pricingProductsByLocale[locale];
  const pageCopy = getPlansPageCopy(locale);
  const activeProductKey: keyof typeof pricingProducts =
    productKey in pricingProducts ? productKey : "acp";
  const activeProduct = useMemo(
    () => pricingProducts[activeProductKey],
    [activeProductKey, pricingProducts],
  );
  return (
    <div className={`flex w-full flex-col ${pageSectionGapClassName} ${pageXPaddingClassName}`}>
      <section className="flex w-full justify-center">
        <div className="flex w-full max-w-[1200px] flex-col gap-[60px] md:gap-[80px]">
          <div className="flex flex-col items-center gap-3">
            <h1 className="m-0 mb-[8px] type-h1 text-center text-fg">{pageCopy.title}</h1>

            {/* 제품군 전환 탭 */}
            <TabGroup>
              {(["acp", "aip"] as const).map(
                (key) => (
                  <TabLink
                    aria-current={activeProductKey === key ? "page" : undefined}
                    href={getProductHref(locale, key)}
                    key={key}
                    className="shrink-0"
                    scroll={false}
                    state={activeProductKey === key ? "on" : "off"}
                  >
                    {pricingProducts[key].tabLabel}
                  </TabLink>
                ),
              )}
            </TabGroup>
          </div>

          {/* 선택된 제품군에 맞는 카드/비교표 렌더링 */}
          <div className="flex flex-col items-center gap-[60px] md:gap-[80px]">
            <div className={cx(
              "grid w-full gap-5",
              activeProduct.cards.length === 2 && "mx-auto md:max-w-[900px] md:grid-cols-2",
              activeProduct.cards.length !== 2 && "md:grid-cols-3",
            )}>
              {activeProduct.cards.map((plan) => {
                const href = plan.href === "/contact-us"
                  ? getContactHref(locale, activeProductKey, "pricing")
                  : withLocaleHref(locale, plan.href);

                return (
                  <PlanSummaryCard
                    key={`${activeProductKey}-${plan.name}`}
                    {...plan}
                    href={href}
                  />
                );
              })}
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
