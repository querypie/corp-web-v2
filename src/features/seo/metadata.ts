import type { Metadata } from "next";

import type { Locale } from "@/constants/i18n";

type DynamicOgImageOptions = {
  description?: string | null;
  image?: {
    alt?: string;
    height?: number;
    url: string;
    width?: number;
  };
  locale: Locale;
  title: string;
};

const defaultOgDescription: Record<Locale, string> = {
  en: "QueryPie AI transforms how enterprises work with AI.",
  ko: "QueryPie AI는 기업이 AI로 일하는 방식을 새롭게 바꿉니다.",
  ja: "QueryPie AI は、企業の AI 活用と働き方を変革します。",
};

const defaultOgImageSize = {
  width: 1600,
  height: 840,
} as const;

function createDynamicOgImageUrl({ description, locale, title }: DynamicOgImageOptions) {
  const params = new URLSearchParams({
    locale,
    title,
  });

  if (description) {
    params.set("description", description);
  }

  return `/api/og?${params.toString()}`;
}

function getCanonicalUrl(metadata: Metadata) {
  const canonical = metadata.alternates?.canonical;

  if (!canonical) return undefined;
  if (typeof canonical === "string") return canonical;
  if (canonical instanceof URL) return canonical.toString();
  if (typeof canonical === "object" && "url" in canonical) {
    const url = canonical.url;
    if (typeof url === "string") return url;
    if (url instanceof URL) return url.toString();
  }

  return undefined;
}

export function withDynamicOgImage(
  metadata: Metadata,
  options: DynamicOgImageOptions,
): Metadata {
  const description = options.description ?? defaultOgDescription[options.locale];
  const imageUrl = createDynamicOgImageUrl({ ...options, description });
  const canonicalUrl = getCanonicalUrl(metadata);
  const ogImage = {
    url: options.image?.url ?? imageUrl,
    width: options.image?.width ?? defaultOgImageSize.width,
    height: options.image?.height ?? defaultOgImageSize.height,
    alt: options.image?.alt ?? options.title,
  };

  return {
    ...metadata,
    description: metadata.description ?? description,
    openGraph: {
      ...metadata.openGraph,
      title: options.title,
      description,
      url: metadata.openGraph?.url ?? canonicalUrl,
      images: [ogImage],
    },
    twitter: {
      ...metadata.twitter,
      card: "summary_large_image",
      title: options.title,
      description,
      images: [ogImage.url],
    },
  };
}
