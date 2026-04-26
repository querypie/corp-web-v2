import type { Locale } from "@/constants/i18n";
import type { SolutionStaticMetadata } from "../../_shared/pageHelpers";
import { createGenerateMetadata, createSolutionPage } from "../../_shared/pageHelpers";
import ContentEN from "./content.en";
import ContentKO from "./content.ko";
import ContentJA from "./content.ja";

export const metadataByLocale: Record<Locale, SolutionStaticMetadata> = {
  "en": {
    "title": "QueryPie AIP: AI Transformation Expert at Your Service",
    "description": "Forward Deployed Engineers (FDE) embedded in your organization deliver comprehensive AI transformation—from strategy and development to production operations, ensuring your AI initiatives succeed.",
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
    "title": "QueryPie AIP: AI Transformation Expert at Your Service",
    "description": "Forward Deployed Engineers (FDE) embedded in your organization deliver comprehensive AI transformation—from strategy and development to production operations, ensuring your AI initiatives succeed.",
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
    "title": "QueryPie AIP：あなたのためのAI変革エキスパート",
    "description": "組織に組み込まれたフォワードデプロイドエンジニア（FDE）が、戦略と開発から本番運用まで包括的なAI変革を提供し、AIイニシアチブの成功を保証。",
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


export const generateMetadata = createGenerateMetadata("aip-fde-services", metadataByLocale);

export default createSolutionPage({
  en: ContentEN,
  ko: ContentKO,
  ja: ContentJA,
});
