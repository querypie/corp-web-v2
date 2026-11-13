import type { Locale } from "@/constants/i18n";

export const acpLabNotesCopy = {
  title: "직접 해보는 ACP 노트",
  label: "ACP 실습 노트",
  description: "설치부터 DB·서버·Kubernetes 접근 제어까지, QueryPie ACP를 직접 사용하며 확인한 과정과 결과를 담았습니다.",
  topicsLabel: "주제별 탐색",
  all: "전체",
  contents: "전체 목차",
  version: "실습 환경",
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
    description: "From installation to database, server, and Kubernetes access control, explore what we configured and verified while using QueryPie ACP firsthand.",
    topicsLabel: "Browse by topic",
    all: "All",
    contents: "All lab notes",
    version: "Lab environment",
    tryLabel: "Get started with ACP Community Edition",
    docsLabel: "ACP documentation",
    tryHref: "https://docs.querypie.com/en/installation/querypie-acp-community-edition",
    docsHref: "https://docs.querypie.com/en",
  },
  ja: {
    title: "実践で学ぶ ACP ノート",
    label: "ACP 実習ノート",
    description: "インストールからデータベース・サーバー・Kubernetesのアクセス制御まで、QueryPie ACPを実際に使って設定・検証した過程と結果を紹介します。",
    topicsLabel: "トピックから探す",
    all: "すべて",
    contents: "実習ノート一覧",
    version: "検証環境",
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
  "시작하기": { ko: "시작하기", en: "Getting started", ja: "はじめに" },
  "DB 접근 제어": { ko: "DB 접근 제어", en: "Database access control", ja: "DBアクセス制御" },
  "승인": { ko: "승인", en: "Approvals", ja: "承認" },
  "감사": { ko: "감사", en: "Auditing", ja: "監査" },
  "운영": { ko: "운영", en: "Operations", ja: "運用" },
  "서버 접근 제어": { ko: "서버 접근 제어", en: "Server access control", ja: "サーバーアクセス制御" },
  "MCP 연동": { ko: "MCP 연동", en: "MCP integration", ja: "MCP連携" },
  "Kubernetes 접근 제어": { ko: "Kubernetes 접근 제어", en: "Kubernetes access control", ja: "Kubernetesアクセス制御" },
};
