import type { Locale } from "@/constants/i18n";

export const acpLabNotesCopy = {
  title: "직접 해보는 ACP 노트",
  label: "ACP 실습 노트",
  writer: "QueryPie 기술 검증 팀",
  introduction: "기업의 DB·서버 보안 현장에서 마주하는 과제를 바탕으로, QueryPie를 직접 검증한 과정과 결과를 공유합니다.",
  description: "설치부터 DB·서버·Kubernetes 접근 제어까지, QueryPie ACP를 직접 사용하며 확인한 과정과 결과를 담았습니다.",
  topicsLabel: "주제별 탐색",
  all: "전체",
  version: "실습 환경",
  resourcesLabel: "더 알아보기:",
  tryLabel: "ACP 커뮤니티 에디션 시작하기",
  docsLabel: "ACP 공식 문서",
  tryHref: "https://docs.querypie.com/ko/installation/querypie-acp-community-edition",
  docsHref: "https://docs.querypie.com/ko",
};

const localizedCopy = {
  ko: acpLabNotesCopy,
  en: {
    title: "Hands-on ACP Lab Notes",
    label: "ACP Lab Notes",
    writer: "QueryPie Technical Validation Team",
    introduction: "Drawing on real-world database and server security challenges, we share how we tested QueryPie and what we found.",
    description: "From installation to database, server, and Kubernetes access control, explore what we configured and verified while using QueryPie ACP firsthand.",
    topicsLabel: "Browse by topic",
    all: "All",
    version: "Lab environment",
    resourcesLabel: "Learn more:",
    tryLabel: "Get started with ACP Community Edition",
    docsLabel: "ACP documentation",
    tryHref: "https://docs.querypie.com/en/installation/querypie-acp-community-edition",
    docsHref: "https://docs.querypie.com/en",
  },
  ja: {
    title: "実践で学ぶ ACP ノート",
    label: "ACP 実習ノート",
    writer: "QueryPie 技術検証チーム",
    introduction: "企業のデータベースやサーバーのセキュリティ課題を題材に、QueryPieを実際に検証した過程と結果をお届けします。",
    description: "インストールからデータベース・サーバー・Kubernetesのアクセス制御まで、QueryPie ACPを実際に使って設定・検証した過程と結果を紹介します。",
    topicsLabel: "トピックから探す",
    all: "すべて",
    version: "検証環境",
    resourcesLabel: "詳しく見る：",
    tryLabel: "ACP Community Editionを始める",
    docsLabel: "ACP公式ドキュメント",
    tryHref: "https://docs.querypie.com/en/installation/querypie-acp-community-edition",
    docsHref: "https://docs.querypie.com/en",
  },
};

export function getAcpLabNotesCopy(locale: Locale) {
  return localizedCopy[locale];
}

export const acpLabNoteTopics: Record<string, Record<Locale, string>> = {
  "도입 가이드": { ko: "도입 가이드", en: "Adoption guide", ja: "導入ガイド" },
  "DB 접근 제어": { ko: "DB 접근 제어", en: "Database access control", ja: "DBアクセス制御" },
  "운영 관리": { ko: "운영 관리", en: "Operations management", ja: "運用管理" },
  "서버 접근 제어": { ko: "서버 접근 제어", en: "Server access control", ja: "サーバーアクセス制御" },
  "Kubernetes 접근 제어": { ko: "Kubernetes 접근 제어", en: "Kubernetes access control", ja: "Kubernetesアクセス制御" },
};
