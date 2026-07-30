"use client";

import { pageSectionGapClassName, pageXPaddingClassName } from "@/constants/layout";
import { useMemo } from "react";
import Button from "@/components/ui/Button";
import { TabLink } from "@/components/ui/Tab";
import TabGroup from "@/components/ui/TabGroup";
import Cta from "@/components/sections/Cta";
import { pricingProductsByLocale, type ComparisonGroup, type ComparisonValue, type PlanCard, type PlanFeature, type PricingProduct } from "@/constants/plans";
import { getLocalePath, type Locale } from "@/constants/i18n";
import { getPlansPageCopy } from "@/copy/contentPages";

type PlansPageProps = {
  enterpriseOnly?: boolean;
  productHrefOverrides?: Partial<Record<"aip" | "acp", string>>;
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
  productHrefOverrides?: Partial<Record<"aip" | "acp", string>>,
) {
  return getLocalePath(locale, productHrefOverrides?.[productKey] ?? `/plans/${productKey}`);
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

function EnterpriseSummaryCard({
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
    <article className="grid w-full gap-8 rounded-box bg-bg-content p-[30px] md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] md:items-start">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-1">
          <h2 className={cx("m-0 type-h2", tone === "primary" ? "text-brand" : "text-fg")}>{name}</h2>
          <p className="m-0 type-body-md text-mute">{description}</p>
        </div>

        <div className="flex flex-col gap-1">
          <p className="m-0 type-h2 text-fg">{priceLabel}</p>
          {billingLabel ? <p className="m-0 type-body-lg text-fg">{billingLabel}</p> : null}
        </div>

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

      <ul className="m-0 grid list-none gap-x-8 gap-y-2 p-0 sm:grid-cols-2">
        {features.map((feature, index) => {
          if (isPlanFeatureDivider(feature)) {
            return (
              <li
                aria-hidden="true"
                className="col-span-full my-2 h-px w-full bg-border"
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
  const gridTemplateColumns = `minmax(180px, 0.9fr) repeat(${plans.length}, minmax(220px, 1fr))`;

  return (
    /* 하단 플랜 비교표 */
    <div className="w-full">
      <div className="overflow-x-auto">
        <div className={cx("mx-auto", plans.length === 2 ? "min-w-[640px] max-w-[960px]" : "min-w-[760px]")}>
          <div className={cx(
            "grid w-full items-center py-4",
            plans.length === 2 ? "grid-cols-2 gap-5" : "",
          )} style={plans.length === 2 ? undefined : { gridTemplateColumns }}>
            {plans.map((plan) => (
              <h2
                key={plan}
                className={cx(
                  "m-0 px-5 text-center type-h2 font-medium",
                  plan === "Enterprise" ? "text-brand" : "text-fg",
                )}
              >
                {plan}
              </h2>
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
                      "grid items-center py-4",
                      rowIndex !== group.rows.length - 1 && "border-b border-border",
                    )}
                    style={{ gridTemplateColumns }}
                  >
                    <div className="px-5 type-body-md text-fg">{row.label}</div>

                    {row.values.slice(-plans.length).map((cell, index) => (
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
  enterpriseOnly = false,
  productHrefOverrides,
  productKey = "aip",
  locale,
}: PlansPageProps) {
  const pricingProducts = pricingProductsByLocale[locale];
  const pageCopy = getPlansPageCopy(locale);
  const activeProductKey: keyof typeof pricingProducts =
    productKey in pricingProducts ? productKey : "aip";
  const activeProduct = useMemo(
    () => pricingProducts[activeProductKey],
    [activeProductKey, pricingProducts],
  );
  const planCards = useMemo(
    () => (
      enterpriseOnly
        ? activeProduct.cards.filter((card) => card.name === "Enterprise")
        : activeProduct.cards
    ),
    [activeProduct.cards, enterpriseOnly],
  );
  const activeProductCaption =
    activeProductKey === "aip" ? "AI Platform" : "Access Control Platform";

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
                  <TabLink
                    aria-current={activeProductKey === key ? "page" : undefined}
                    href={getProductHref(locale, key, productHrefOverrides)}
                    key={key}
                    className="shrink-0"
                    scroll={false}
                    state={activeProductKey === key ? "on" : "off"}
                  >
                    {product.tabLabel}
                  </TabLink>
                ),
              )}
            </TabGroup>

            <p className="m-0 text-center type-body-md text-mute">{activeProductCaption}</p>
          </div>

          {/* 선택된 제품군에 맞는 카드/비교표 렌더링 */}
          <div className="flex flex-col items-center gap-[60px] md:gap-[80px]">
            <div className={cx(
              "grid w-full gap-5",
              !enterpriseOnly && planCards.length === 2 && "mx-auto md:max-w-[960px] md:grid-cols-2",
              !enterpriseOnly && planCards.length !== 2 && "md:grid-cols-3",
            )}>
              {planCards.map((plan) => {
                const href = withLocaleHref(locale, plan.href);

                return enterpriseOnly ? (
                  <EnterpriseSummaryCard
                    key={`${activeProductKey}-${plan.name}`}
                    {...plan}
                    href={href}
                  />
                ) : (
                  <PlanSummaryCard
                    key={`${activeProductKey}-${plan.name}`}
                    {...plan}
                    href={href}
                  />
                );
              })}
            </div>

            {activeProductKey === "aip" && !enterpriseOnly ? (
              <ComparisonTable
                comparisonGroups={activeProduct.comparisonGroups}
                plans={activeProduct.plans}
              />
            ) : null}
          </div>
        </div>
      </section>
      {!enterpriseOnly ? <Cta locale={locale} /> : null}
    </div>
  );
}
