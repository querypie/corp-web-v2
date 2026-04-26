import type { Locale } from "@/constants/i18n";
import type { SolutionStaticMetadata } from "../../_shared/pageHelpers";

export const metadataByLocale: Record<Locale, SolutionStaticMetadata> = {
  "en": {
    "title": "QueryPie AIP: MCP Hub That Connects Everything",
    "description": "Single platform centrally managing all MCP servers and tools—no fragmentation, no complexity, no limits. Streamline AI workflows across your entire tech stack while we handle the complexity behind the scenes.",
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
    "title": "QueryPie AIP: MCP Hub That Connects Everything",
    "description": "Single platform centrally managing all MCP servers and tools—no fragmentation, no complexity, no limits. Streamline AI workflows across your entire tech stack while we handle the complexity behind the scenes.",
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
    "title": "QueryPie AIP：すべてを接続するMCPハブ",
    "description": "すべてのMCPサーバーとツールを一元管理する単一プラットフォーム—分散なし、複雑さなし、制限なし。舞台裏の複雑さは私たちが処理し、技術スタック全体のAIワークフローを効率化。",
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

export default metadataByLocale;
