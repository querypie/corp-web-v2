"use client";

import { useMemo, useState } from "react";
import IntegrationIcon from "@/components/sections/common/IntegrationIcon";
import type { Locale } from "@/constants/i18n";
import {
  integrationCategories,
  integrationCategoryLabels,
  integrationItems,
  type IntegrationCategoryId,
  type IntegrationItem,
} from "./integrationData";

function cx(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

function getCategoryCount(id: IntegrationCategoryId) {
  if (id === "all") return integrationItems.length;
  return integrationItems.filter((item) => item.categories.includes(id)).length;
}

function IntegrationCard({ darkPlate, enhanceIconContrast, icon, invertIcon, name }: IntegrationItem) {
  return (
    <article className="flex min-h-[128px] flex-col items-center justify-center gap-4 rounded-box bg-bg-content px-3 py-5 text-center md:min-h-[140px]">
      <IntegrationIcon
        className="h-[52px] w-[52px]"
        darkPlate={darkPlate}
        enhanceIconContrast={enhanceIconContrast}
        icon={icon}
        invertIcon={invertIcon}
      />
      <p className="m-0 w-full truncate type-body-sm text-fg" title={name}>
        {name}
      </p>
    </article>
  );
}

type IntegrationsFilterProps = {
  locale: Locale;
};

export default function IntegrationsFilter({ locale }: IntegrationsFilterProps) {
  const [activeCategory, setActiveCategory] = useState<IntegrationCategoryId>("all");
  const labels = integrationCategoryLabels[locale];
  const visibleItems = useMemo(() => {
    if (activeCategory === "all") return integrationItems;
    return integrationItems.filter((item) => item.categories.includes(activeCategory));
  }, [activeCategory]);

  return (
    <section className="flex w-full justify-center">
      <div className="flex w-full max-w-[1200px] flex-col gap-8 md:gap-[60px]">
        <div className="flex flex-wrap gap-2 md:gap-2.5">
          {integrationCategories.map((category) => {
            const isActive = category.id === activeCategory;

            return (
              <button
                aria-pressed={isActive}
                className={cx(
                  "pressable inline-flex min-h-8 items-center justify-center rounded-full border px-3 py-1.5 type-body-sm sm:min-h-10 sm:px-4 sm:py-2 sm:type-body-md",
                  isActive
                    ? "border-fg bg-fg text-bg"
                    : "border-border bg-transparent text-mute hover:border-border-strong hover:text-fg",
                )}
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                type="button"
              >
                {labels[category.id]} ({getCategoryCount(category.id)})
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
          {visibleItems.map((item) => (
            <IntegrationCard key={item.name} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
}
