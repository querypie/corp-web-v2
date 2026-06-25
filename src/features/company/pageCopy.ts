import type { Locale } from "@/constants/i18n";

export type CompanyNewsPageCopy = {
  metadataDescription: string;
  metadataTitle: string;
  title: string;
};

export function getAboutUsMetadataTitle(locale: Locale) {
  return {
    en: "About Us",
    ko: "About Us",
    ja: "会社概要",
  }[locale];
}

export function getAboutUsMetadataDescription(locale: Locale) {
  return {
    en: "Learn about QueryPie AI, the company building a smarter standard for secure enterprise AI transformation.",
    ko: "안전한 엔터프라이즈 AI 전환의 새로운 기준을 만들어가는 QueryPie AI를 소개합니다.",
    ja: "安全なエンタープライズ AI 変革の新しい基準をつくる QueryPie AI についてご紹介します。",
  }[locale];
}

export function getCertificationsMetadataTitle(locale: Locale) {
  return {
    en: "QueryPie AI Certifications",
    ko: "QueryPie AI Certifications",
    ja: "QueryPie AI: 認証",
  }[locale];
}

export function getCertificationsMetadataDescription(locale: Locale) {
  return {
    en: "Review QueryPie AI security, privacy, cloud, and AI management certifications including SOC 2, ISO, ISMS-P, and CSA STAR.",
    ko: "SOC 2, ISO, ISMS-P, CSA STAR 등 QueryPie AI의 보안, 개인정보, 클라우드, AI 관리 인증을 확인하세요.",
    ja: "SOC 2、ISO、ISMS-P、CSA STAR など QueryPie AI のセキュリティ、プライバシー、クラウド、AI 管理認証をご確認ください。",
  }[locale];
}

export function getNewsPageCopy(locale: Locale): CompanyNewsPageCopy {
  return {
    en: {
      metadataDescription:
        "Read the latest QueryPie AI news, product announcements, company updates, and enterprise AI insights.",
      metadataTitle: "QueryPie News",
      title: "News",
    },
    ko: {
      metadataDescription:
        "QueryPie AI의 최신 뉴스, 제품 발표, 회사 소식과 엔터프라이즈 AI 인사이트를 확인하세요.",
      metadataTitle: "QueryPie News",
      title: "뉴스",
    },
    ja: {
      metadataDescription:
        "QueryPie AI の最新ニュース、製品発表、会社情報、エンタープライズ AI のインサイトをご覧ください。",
      metadataTitle: "QueryPie: ニュース",
      title: "News",
    },
  }[locale];
}
