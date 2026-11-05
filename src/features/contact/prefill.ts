import { getLocalePath, type Locale } from "@/constants/i18n";
import { contactInquiryLabels, contactProductLabels } from "@/copy/contact";

type SearchParams = Record<string, string | string[] | undefined>;
type ContactProduct = keyof typeof contactProductLabels;
type ContactInquiry = keyof typeof contactInquiryLabels;

export function getContactHref(locale: Locale, product: ContactProduct, inquiry: ContactInquiry = "ai-consulting") {
  const query = new URLSearchParams({ inquiry, product });
  return `${getLocalePath(locale, "/contact-us")}?${query}`;
}

function getLabel<T extends string>(labels: Record<T, Partial<Record<Locale, string>>>, value: SearchParams[string], locale: Locale) {
  return typeof value === "string" && Object.hasOwn(labels, value)
    ? labels[value as T][locale]
    : undefined;
}

export function getContactInitialInquiry(locale: Locale, searchParams: SearchParams) {
  return getLabel(contactInquiryLabels, searchParams.inquiry, locale);
}

export function getContactProductFromQuery(locale: Locale, searchParams: SearchParams) {
  return getLabel(contactProductLabels, searchParams.product, locale);
}
