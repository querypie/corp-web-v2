import type { Locale } from "@/constants/i18n";

export type ContentListPageCopy = {
  metadataTitle: string;
  title: string;
};

export function getDemoPageCopy(locale: Locale): ContentListPageCopy {
  return {
    en: { metadataTitle: "Demo", title: "Demo" },
    ko: { metadataTitle: "데모", title: "데모" },
    ja: { metadataTitle: "デモ", title: "デモ" },
  }[locale];
}

export function getDocumentationPageCopy(locale: Locale): ContentListPageCopy {
  return {
    en: { metadataTitle: "Documentation", title: "Documentation" },
    ko: { metadataTitle: "문서", title: "문서" },
    ja: { metadataTitle: "ドキュメント", title: "ドキュメント" },
  }[locale];
}

export function getPlansPageCopy(locale: Locale): ContentListPageCopy {
  return {
    en: { metadataTitle: "Pricing", title: "Pricing" },
    ko: { metadataTitle: "가격 · 플랜", title: "가격 · 플랜" },
    ja: { metadataTitle: "価格・プラン", title: "価格・プラン" },
  }[locale];
}
