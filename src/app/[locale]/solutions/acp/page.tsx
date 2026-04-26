import type { Locale } from "@/constants/i18n";
import type { SolutionStaticMetadata } from "../_shared/pageHelpers";
import { createGenerateMetadata, createSolutionPage } from "../_shared/pageHelpers";
import ContentEN from "./content.en";
import ContentKO from "./content.ko";
import ContentJA from "./content.ja";

export const metadataByLocale: Record<Locale, SolutionStaticMetadata> = {
  "en": {
    "title": "QueryPie Access Control Platform (ACP)",
    "description": "The platform that delivers comprehensive access management across data and infrastructure—optimized for AI agent connectivity and automated governance capabilities.",
    "keywords": [
      "QueryPie ACP",
      "Access Control Platform",
      "database access control",
      "data access control",
      "system access control",
      "kubernetes access control",
      "web access control",
      "data protection",
      "SQL editor",
      "AI Agent connectivity",
      "RBAC",
      "ABAC",
      "audit"
    ]
  },
  "ko": {
    "title": "QueryPie Access Control Platform (ACP)",
    "description": "The platform that delivers comprehensive access management across data and infrastructure—optimized for AI agent connectivity and automated governance capabilities.",
    "keywords": [
      "QueryPie ACP",
      "Access Control Platform",
      "database access control",
      "data access control",
      "system access control",
      "kubernetes access control",
      "web access control",
      "data protection",
      "SQL editor",
      "AI Agent connectivity",
      "RBAC",
      "ABAC",
      "audit"
    ]
  },
  "ja": {
    "title": "QueryPie アクセス制御プラットフォーム (ACP)",
    "description": "アクセス制御プラットフォームはデータベースとインフラ全体にわたる包括的なアクセス管理を提供するプラットフォームです。",
    "keywords": [
      "クエリパイ ACP",
      "Access Control Platform",
      "ACP",
      "データベースアクセス制御",
      "システムアクセス制御",
      "Kubernetesアクセス制御",
      "Webアクセス制御",
      "SQLエディター",
      "AIエージェント",
      "RBAC",
      "ABAC",
      "リアルタイム監視"
    ]
  }
} as const;


export const generateMetadata = createGenerateMetadata("acp", metadataByLocale);

export default createSolutionPage({
  en: ContentEN,
  ko: ContentKO,
  ja: ContentJA,
});
