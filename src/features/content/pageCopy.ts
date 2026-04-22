import type { Locale } from "@/constants/i18n";

export type ContentListPageCopy = {
  metadataTitle: string;
  title: string;
};

export function getDemoPageCopy(locale: Locale): ContentListPageCopy {
  return {
    en: { metadataTitle: "Demo", title: "Demo" },
    ko: { metadataTitle: "Demo", title: "Demo" },
    ja: { metadataTitle: "デモ", title: "デモ" },
  }[locale];
}

export function getDocumentationPageCopy(locale: Locale): ContentListPageCopy {
  return {
    en: { metadataTitle: "Documentation", title: "Documentation" },
    ko: { metadataTitle: "Documentation", title: "Documentation" },
    ja: { metadataTitle: "ドキュメント", title: "ドキュメント" },
  }[locale];
}

export function getPlansPageCopy(locale: Locale): ContentListPageCopy {
  return {
    en: { metadataTitle: "Pricing", title: "Pricing" },
    ko: { metadataTitle: "Pricing", title: "Pricing" },
    ja: { metadataTitle: "Pricing", title: "Pricing" },
  }[locale];
}
