import type { Locale } from "@/constants/i18n";

const categoryDescriptions: Record<Locale, Record<string, string>> = {
  en: {
    introduction: "Explore QueryPie AI product introductions for enterprise AI platforms, access control, and security services.",
    glossary: "Understand enterprise AI and security concepts with the QueryPie AI glossary, from AI agents and MCP to access control.",
    manuals: "Find QueryPie AI manuals and practical guides for configuring, operating, and managing your products.",
    "white-papers": "Explore QueryPie AI white papers on enterprise AI adoption, data security, access control, and digital transformation.",
    blogs: "Read QueryPie AI insights on enterprise AI, AI agents, access control, and data security, with practical product guidance.",
    voc: "Discover how customers use QueryPie AI to address enterprise AI and security challenges through their experiences and stories.",
    events: "Explore QueryPie AI events, webinars, and seminars on enterprise AI, access control, and security.",
    "aip-features": "Watch QueryPie AIP demos and explore AI agents, MCP integrations, and enterprise workflow automation in action.",
    "acp-features": "Watch QueryPie ACP demos covering database, server, Kubernetes, and web application access control and auditing.",
  },
  ko: {
    introduction: "기업 AI 플랫폼, 접근 제어, 보안 서비스까지 QueryPie AI 제품의 주요 기능과 도입 가치를 소개 자료로 확인하세요.",
    glossary: "AI 에이전트, MCP, 접근 제어 등 기업 AI와 보안의 핵심 개념을 QueryPie AI 용어집에서 확인하세요.",
    manuals: "QueryPie AI 제품의 설정, 운영, 관리에 필요한 매뉴얼과 실무 가이드를 확인하세요.",
    "white-papers": "기업 AI 도입, 데이터 보안, 접근 제어와 디지털 전환을 다루는 QueryPie AI 화이트페이퍼를 확인하세요.",
    blogs: "기업 AI, AI 에이전트, 접근 제어, 데이터 보안에 관한 인사이트와 제품 활용 방법을 QueryPie AI 블로그에서 확인하세요.",
    voc: "QueryPie AI를 활용해 기업 AI와 보안 과제를 해결한 고객의 경험과 도입 사례를 확인하세요.",
    events: "기업 AI, 접근 제어, 보안에 관한 QueryPie AI 행사와 웨비나, 세미나 정보를 확인하세요.",
    "aip-features": "QueryPie AIP 데모로 AI 에이전트, MCP 연동, 기업 업무 자동화 기능과 실제 활용 방법을 확인하세요.",
    "acp-features": "QueryPie ACP 데모로 데이터베이스, 서버, Kubernetes, 웹 애플리케이션 접근 제어와 감사 기능을 확인하세요.",
  },
  ja: {
    introduction: "企業向けAIプラットフォーム、アクセス制御、セキュリティサービスなど、QueryPie AIの機能と導入価値を製品資料でご紹介します。",
    glossary: "AIエージェント、MCP、アクセス制御など、企業のAI活用とセキュリティに関する主要な概念をQueryPie AIの用語集で解説します。",
    manuals: "QueryPie AI製品の設定、運用、管理に必要なマニュアルと実践ガイドをご覧ください。",
    "white-papers": "企業のAI導入、データセキュリティ、アクセス制御、DXに関するQueryPie AIのホワイトペーパーをご覧ください。",
    blogs: "企業のAI活用、AIエージェント、アクセス制御、データセキュリティの知見と製品活用方法をQueryPie AIブログでご紹介します。",
    voc: "QueryPie AIを活用して企業のAI・セキュリティ課題に取り組むお客様の声と導入事例をご紹介します。",
    events: "企業向けAI、アクセス制御、セキュリティに関するQueryPie AIのイベント、ウェビナー、セミナー情報をご覧ください。",
    "aip-features": "QueryPie AIPのデモで、AIエージェント、MCP連携、企業の業務自動化の機能と活用方法をご覧ください。",
    "acp-features": "QueryPie ACPのデモで、データベース、サーバー、Kubernetes、Webアプリのアクセス制御と監査機能をご覧ください。",
  },
};

export function getCategorySeoCopy(locale: Locale, category: string, label: string, fallback: { metadataTitle: string; metadataDescription: string }) {
  return {
    metadataTitle: `${category === "all" ? fallback.metadataTitle : label} | QueryPie AI`,
    metadataDescription: categoryDescriptions[locale][category] ?? fallback.metadataDescription,
  };
}

export function getPlanSeoCopy(locale: Locale, product: "aip" | "acp") {
  const name = product.toUpperCase();
  return {
    en: { title: `QueryPie ${name} Pricing and Plans`, description: product === "aip" ? "Explore QueryPie AIP pricing and plans for enterprise AI agents, workflow automation, and usage-based AI operations." : "Explore QueryPie ACP pricing and plans for infrastructure access control, permission management, and security auditing." },
    ko: { title: `QueryPie ${name} 가격 및 플랜`, description: product === "aip" ? "기업용 AI 에이전트, 업무 자동화, 사용량 기반 AI 운영을 위한 QueryPie AIP 가격과 플랜을 확인하세요." : "인프라 접근 제어, 권한 관리, 보안 감사를 위한 QueryPie ACP 가격과 플랜을 확인하세요." },
    ja: { title: `QueryPie ${name}の料金・プラン`, description: product === "aip" ? "企業向けAIエージェント、業務自動化、従量制AI運用のためのQueryPie AIPの料金・プランをご確認ください。" : "インフラへのアクセス制御、権限管理、セキュリティ監査のためのQueryPie ACPの料金・プランをご確認ください。" },
  }[locale];
}
