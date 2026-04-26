import type { Locale } from "@/constants/i18n";
import type { SolutionStaticMetadata } from "../../_shared/pageHelpers";
import { createGenerateMetadata, createSolutionPage } from "../../_shared/pageHelpers";
import ContentEN from "./content.en";
import ContentKO from "./content.ko";
import ContentJA from "./content.ja";

export const metadataByLocale: Record<Locale, SolutionStaticMetadata> = {
  "en": {
    "title": "QueryPie AIP: Usage-Based Enterprise AI That Works",
    "description": "Browser-based platform with instant access—no downloads, no setup, no fixed costs. Up to 90% savings vs. ChatGPT makes enterprise-wide AI adoption finally achievable.",
    "keywords": [
      "QueryPie AI",
      "AI Platform",
      "MCP management",
      "access control",
      "QueryPie",
      "streamlined operations",
      "MCP servers",
      "Usage-based Enterprise AI",
      "MCP Gateway",
      "FDE Service"
    ]
  },
  "ko": {
    "title": "QueryPie AIP: Usage-Based Enterprise AI That Works",
    "description": "Browser-based platform with instant access—no downloads, no setup, no fixed costs. Up to 90% savings vs. ChatGPT makes enterprise-wide AI adoption finally achievable.",
    "keywords": [
      "QueryPie AI",
      "AI Platform",
      "MCP management",
      "access control",
      "QueryPie",
      "streamlined operations",
      "MCP servers",
      "Usage-based Enterprise AI",
      "MCP Gateway",
      "FDE Service"
    ]
  },
  "ja": {
    "title": "QueryPie AIP：実際使用量ベースエンタープライズAI",
    "description": "ブラウザベースプラットフォームで即座にアクセス—ダウンロード不要、セットアップ不要、固定費用なし。ChatGPTと比較して最大90%のコスト削減により、企業全体でのAI導入がついに実現可能に。",
    "keywords": [
      "クエリパイ AI",
      "QueryPie AI",
      "AI Platform",
      "AIP",
      "AI",
      "MCPゲートウェイ",
      "アクセス制御",
      "カスタムAIエージェント",
      "インフラ運用",
      "QueryPie AI Agent",
      "使用量ベース",
      "フォワードデプロイドエンジニア",
      "FDE"
    ]
  }
} as const;


export const generateMetadata = createGenerateMetadata("aip-usage-based-llm", metadataByLocale);

export default createSolutionPage({
  en: ContentEN,
  ko: ContentKO,
  ja: ContentJA,
});
