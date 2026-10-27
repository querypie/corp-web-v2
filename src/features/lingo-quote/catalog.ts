export const LINGO_QUOTE_SKUS = {
  production: {
    sku: "QP-AIP0615Prod-Credit",
    description: "AIP Production Credit",
    termMonths: 12,
    credit: 240_000,
    users: "Unlimited",
    retailPrice: 1_200_000,
  },
  application: {
    sku: "QP-AIP0615APP-Credit",
    description: "AIP Application Credit (Lingo or NotePie)",
    termMonths: 12,
    credit: 72_000,
    users: "Unlimited",
    retailPrice: 360_000,
  },
} as const;

export type LingoQuotePlan = keyof typeof LINGO_QUOTE_SKUS;

export function isLingoQuotePlan(value: unknown): value is LingoQuotePlan {
  return value === "production" || value === "application";
}

export function getLingoQuotePlan(value: unknown): LingoQuotePlan | undefined {
  if (isLingoQuotePlan(value)) return value;

  if (value === LINGO_QUOTE_SKUS.production.sku) return "production";
  if (value === LINGO_QUOTE_SKUS.application.sku) return "application";

  return undefined;
}

export function formatJapaneseDate(date: Date) {
  const parts = new Intl.DateTimeFormat("ja-JP", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${values.year}/${values.month}/${values.day}`;
}

export function formatQuoteNumber(date: Date, sequence: number) {
  const parts = new Intl.DateTimeFormat("ja-JP", {
    timeZone: "Asia/Tokyo",
    year: "2-digit",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  const suffix = String(Math.max(0, Math.min(999, sequence))).padStart(3, "0");
  return `QPJ-${values.year}${values.month}${values.day}-${suffix}`;
}
