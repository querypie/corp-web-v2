import type { Locale } from "@/constants/i18n";
import type { SolutionStaticMetadata } from "../_shared/pageHelpers";
import { createGenerateMetadata, createSolutionPage } from "../_shared/pageHelpers";
import ContentEN from "./content.en";
import ContentKO from "./content.ko";
import ContentJA from "./content.ja";

export const metadataByLocale: Record<Locale, SolutionStaticMetadata> = {
  "en": {
    "title": "QueryPie AI Platform (AIP)",
    "description": "QueryPie AIP is the platform that delivers enterprise AI transformation through economical, enterprise-ready solutions—featuring usage-based LLM deployment and comprehensive MCP gateway.Complete transformation through Forward Deployed Engineers (FDE) delivering tailored AI agents.",
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
    "title": "QueryPie: Secure Enterprise AI Hub",
    "description": "보안 때문에 망설였던 AI, 이젠 쉽고 안전하게 사용하세요. AI가 데이터를 분석하고, 인프라를 운영하며, 보안을 강화하는 하나의 자율 보안 운영 플랫폼. 당신의 AI는 더 스마트해지고 보안은 더 강력해집니다.",
    "keywords": [
      "쿼리파이",
      "QueryPie",
      "AI PAM",
      "PAM",
      "AI",
      "MCP 보안",
      "Zero Trust",
      "접근 제어",
      "보안 자동화",
      "자율 보안",
      "인프라 운영",
      "QueryPie AI Agent"
    ]
  },
  "ja": {
    "title": "QueryPie AIプラットフォーム (AIP)",
    "description": "経済的でエンタープライズ対応のソリューションを通じてエンタープライズAI変革を実現するプラットフォーム—使用量ベースのLLM導入と包括的なMCPゲートウェイを特徴とする。カスタマイズされたAIエージェントを提供するフォワードデプロイドエンジニア（FDE）による完全な変革。",
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


export const generateMetadata = createGenerateMetadata("aip", metadataByLocale);

export default createSolutionPage({
  en: ContentEN,
  ko: ContentKO,
  ja: ContentJA,
});
