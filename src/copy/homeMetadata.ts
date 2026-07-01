import type { Locale } from "@/constants/i18n";

const homeMetadataDescriptions: Record<Locale, string> = {
  en: "Agentic AI Platform for Enterprises. Securely connect all your data and systems. Operate trusted AI with built-in security and governance.",
  ko: "엔터프라이즈 기업을 위한 Agentic AI Platform. 모든 데이터와 시스템을 안전하게 연결하고, 보안과 거버넌스를 기반으로 신뢰할 수 있는 AI를 운영하세요.",
  ja: "エンタープライズ向け Agentic AI Platform。すべてのデータとシステムを安全に接続し、セキュリティとガバナンスを内蔵した信頼できる AI を運用しましょう。",
};

export function getHomeMetadataDescription(locale: Locale) {
  return homeMetadataDescriptions[locale];
}

export function getHomeMetadataTitle() {
  return "QueryPie AI";
}
