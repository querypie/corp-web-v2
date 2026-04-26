import type { Locale } from "@/constants/i18n";
import type { SolutionStaticMetadata } from "../../_shared/pageHelpers";
import { createGenerateMetadata, createSolutionPage } from "../../_shared/pageHelpers";
import ContentEN from "./content.en";
import ContentKO from "./content.ko";
import ContentJA from "./content.ja";

export const metadataByLocale: Record<Locale, SolutionStaticMetadata> = {
  "en": {
    "title": "QueryPie Integrations",
    "description": "Connect straight to your data sources and get full visibility across all your systems, apps, and services.",
    "keywords": [
      "QueryPie integrations",
      "integrate data source",
      "system integration",
      "QueryPie"
    ]
  },
  "ko": {
    "title": "QueryPie Integrations",
    "description": "데이터 소스에 직접 연결하여 모든 시스템, 앱, 서비스에 걸쳐 완벽한 가시성을 확보하세요.",
    "keywords": [
      "QueryPie integrations",
      "데이터 소스 연동",
      "시스템 연동",
      "QueryPie"
    ]
  },
  "ja": {
    "title": "QueryPie: インテグレーション",
    "description": "データソースに直接接続し、すべてのシステム、アプリケーション、およびサービスを完全に把握することが可能です。",
    "keywords": [
      "QueryPieの統合",
      "データソースの統合",
      "システムの統合",
      "QueryPie"
    ]
  }
} as const;


export const generateMetadata = createGenerateMetadata("acp-integrations", metadataByLocale);

export default createSolutionPage({
  en: ContentEN,
  ko: ContentKO,
  ja: ContentJA,
});
