import type { Locale } from "@/constants/i18n";
import type { SolutionStaticMetadata } from "../../_shared/pageHelpers";

export const metadataByLocale: Record<Locale, SolutionStaticMetadata> = {
  "en": {
    "title": "QueryPie AIP Integrations",
    "description": "Connect to your favorite business tools through MCP servers and automate workflows across systems, apps, and services.",
    "keywords": [
      "QueryPie AIP integrations",
      "MCP integrations",
      "QueryPie AI"
    ]
  },
  "ko": {
    "title": "QueryPie AIP Integrations",
    "description": "Connect to your favorite business tools through MCP servers and automate workflows across systems, apps, and services.",
    "keywords": [
      "QueryPie AIP integrations",
      "MCP integrations",
      "QueryPie AI"
    ]
  },
  "ja": {
    "title": "QueryPie AI: インテグレーション",
    "description": "MCPサーバーを通じてお気に入りのビジネスツールに接続し、システム、アプリ、サービス全体のワークフローを自動化。",
    "keywords": [
      "QueryPie AIの統合",
      "MCPサーバーの統合",
      "QueryPie AI"
    ]
  }
} as const;

export default metadataByLocale;
