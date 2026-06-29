import type { Locale } from "@/constants/i18n";

export type ContentListPageCopy = {
  metadataDescription: string;
  metadataTitle: string;
  title: string;
};

export function getDemoPageCopy(locale: Locale): ContentListPageCopy {
  return {
    en: {
      metadataDescription:
        "Explore QueryPie AI product demos and use cases for enterprise AI and access control workflows.",
      metadataTitle: "Demo",
      title: "Demo",
    },
    ko: {
      metadataDescription:
        "엔터프라이즈 AI와 접근 제어 워크플로를 위한 QueryPie AI 제품 데모와 활용 사례를 확인하세요.",
      metadataTitle: "데모",
      title: "데모",
    },
    ja: {
      metadataDescription:
        "エンタープライズ AI とアクセス制御ワークフローに関する QueryPie AI のデモとユースケースをご覧ください。",
      metadataTitle: "デモ",
      title: "デモ",
    },
  }[locale];
}

export function getDocumentationPageCopy(locale: Locale): ContentListPageCopy {
  return {
    en: {
      metadataDescription:
        "Read QueryPie AI documentation, guides, white papers, blogs, events, manuals, and product resources.",
      metadataTitle: "Documentation",
      title: "Documentation",
    },
    ko: {
      metadataDescription:
        "QueryPie AI 문서, 가이드, 백서, 블로그, 이벤트, 매뉴얼과 제품 자료를 확인하세요.",
      metadataTitle: "문서",
      title: "문서",
    },
    ja: {
      metadataDescription:
        "QueryPie AI のドキュメント、ガイド、ホワイトペーパー、ブログ、イベント、マニュアル、製品資料をご覧ください。",
      metadataTitle: "ドキュメント",
      title: "ドキュメント",
    },
  }[locale];
}

export function getPlansPageCopy(locale: Locale): ContentListPageCopy {
  return {
    en: {
      metadataDescription:
        "Compare QueryPie AI pricing and plans for AIP and ACP, including usage-based enterprise AI and access control options.",
      metadataTitle: "Pricing",
      title: "Pricing",
    },
    ko: {
      metadataDescription:
        "사용량 기반 엔터프라이즈 AI와 접근 제어 옵션을 포함한 QueryPie AI AIP, ACP 가격과 플랜을 비교하세요.",
      metadataTitle: "가격 · 플랜",
      title: "가격 · 플랜",
    },
    ja: {
      metadataDescription:
        "従量課金型エンタープライズ AI とアクセス制御を含む QueryPie AI AIP、ACP の価格とプランを比較できます。",
      metadataTitle: "価格・プラン",
      title: "価格・プラン",
    },
  }[locale];
}
