import { publicCategoryPaths } from "@/features/content/publicPathConfig";
import type { PricingProduct } from "../types";

export const aipPricingJa: PricingProduct<"aip"> = {
  productKey: "aip",
  locale: "ja",
  tabLabel: "QueryPie AIP",
  plans: ["Business", "Enterprise"],
  cards: [
    {
      name: "Business",
      description: "チームでの協働作業に最適",
      priceLabel: "$650/月",
      href: publicCategoryPaths.resources.all,
      ctaLabel: "利用を開始する",
      features: [
        "月間20,000クレジット",
        { type: "divider" },
        "カスタムAIエージェント\n最大30個まで",
        "社内文書学習 (RAG)\n10個まで",
        { type: "divider" },
        "操作履歴の記録\n(最大90日間)",
        "IPアドレス制限 (ACL)",
        "連携ツールのアクセス管理",
        "エージェントのアクセス管理",
        { value: "シングルサインオン (SSO)", tone: "danger" },
        { value: "データ漏洩防止 (DLP)", tone: "danger" },
        { type: "divider" },
        { value: "リアルタイムカスタマーサポート", tone: "danger" },
        { value: "高度な AI セキュリティ機能", tone: "danger" },
      ],
    },
    {
      name: "Enterprise",
      description: "大規模組織向けの包括的プラン",
      priceLabel: "個別見積もり",
      href: publicCategoryPaths.resources.all,
      ctaLabel: "今すぐ試す",
      tone: "primary",
      features: [
        "カスタムクレジット",
        { type: "divider" },
        "カスタムAIエージェント\n無制限",
        "社内文書学習 (RAG) 無制限",
        { type: "divider" },
        "操作履歴の記録\n(最大180日間)",
        "IPアドレス制限 (ACL)",
        "連携ツールのアクセス管理",
        "エージェントのアクセス管理",
        "シングルサインオン (SSO)",
        "データ漏洩防止 (DLP)",
        { type: "divider" },
        "カスタムブランディング",
        "高度な AI セキュリティ機能",
      ],
    },
  ],
  comparisonGroups: [
    {
      title: "一般",
      rows: [
        {
          label: "料金",
          values: [
            { value: "$650/月" },
            { value: "カスタム価格 (年間契約)" },
          ],
        },
        {
          label: "AI利用クレジット",
          values: [
            { value: "20,000クレジット/月", tone: "muted" },
            { value: "カスタム前払いクレジット", tone: "muted" },
          ],
        },
        {
          label: "利用可能なAIモデル",
          values: [
            { value: "Claude / ChatGPT / Gemini", tone: "muted" },
            { value: "主要LLMを自由に選択可", tone: "muted" },
          ],
        },
        {
          label: "独自AIモデルの利用",
          values: [
            { value: "✕", tone: "danger" },
            { value: "○ (Add-on)", tone: "success" },
          ],
        },
      ],
    },
    {
      title: "プラットフォーム機能",
      rows: [
        { label: "Web検索", values: [ { value: "○", tone: "success" }, { value: "○", tone: "success" }] },
        { label: "データ可視化ウィジェット", values: [ { value: "○", tone: "success" }, { value: "○", tone: "success" }] },
        { label: "コード生成・実行", values: [ { value: "○", tone: "success" }, { value: "○", tone: "success" }] },
        { label: "外部ツール連携 (MCP)", values: [ { value: "○", tone: "success" }, { value: "○", tone: "success" }] },
        { label: "MCP連携設定の作成", values: [ { value: "○", tone: "success" }, { value: "○", tone: "success" }] },
        { label: "MCPプロンプト自動生成", values: [ { value: "○", tone: "success" }, { value: "○", tone: "success" }] },
        { label: "外部アプリでの連携利用", values: [ { value: "○", tone: "success" }, { value: "○", tone: "success" }] },
        { label: "組み込みエージェント利用", values: [ { value: "○", tone: "success" }, { value: "○", tone: "success" }] },
        { label: "スキル", values: [ { value: "○", tone: "success" }, { value: "○", tone: "success" }] },
        { label: "画像生成", values: [ { value: "○", tone: "success" }, { value: "○", tone: "success" }] },
        { label: "文書学習の登録数 (RAG)", values: [ { value: "○ 10", tone: "success" }, { value: "○ 無制限", tone: "success" }] },
        { label: "Personal Edge Tunnels", values: [ { value: "○ 20", tone: "success" }, { value: "○ 無制限", tone: "success" }] },
        { label: "エージェント自動実行", values: [ { value: "○ 10", tone: "success" }, { value: "○ 無制限", tone: "success" }] },
        { label: "AIエージェント作成数", values: [ { value: "○ 30", tone: "success" }, { value: "○ 無制限", tone: "success" }] },
        { label: "My Drive", values: [ { value: "○ 1GB / user", tone: "success" }, { value: "○ 10GB / user", tone: "success" }] },
      ],
    },
    {
      title: "セキュリティ機能",
      rows: [
        { label: "シングルサインオン (SSO)", values: [ { value: "✕", tone: "danger" }, { value: "○", tone: "success" }] },
        { label: "チャット保持", values: [ { value: "✕", tone: "danger" }, { value: "○", tone: "success" }] },
        { label: "データ漏洩防止 (DLP)", values: [ { value: "✕", tone: "danger" }, { value: "○", tone: "success" }] },
        { label: "IPアドレス制限 (ACL)", values: [ { value: "○", tone: "success" }, { value: "○", tone: "success" }] },
        {
          label: "操作履歴の保存期間",
          values: [
            { value: "○ 最大90日間", tone: "success" },
            { value: "○ 最大180日間", tone: "success" },
          ],
        },
      ],
    },
    {
      title: "組織機能",
      rows: [
        { label: "組織共通の外部ツール連携設定", values: [ { value: "✕", tone: "danger" }, { value: "○", tone: "success" }] },
        { label: "組織共通の社内システム暗号化接続", values: [ { value: "✕", tone: "danger" }, { value: "○", tone: "success" }] },
        { label: "連携ツールのアクセス管理", values: [ { value: "○", tone: "success" }, { value: "○", tone: "success" }] },
        { label: "エージェントのアクセス管理", values: [ { value: "○", tone: "success" }, { value: "○", tone: "success" }] },
        { label: "LLMモデル制御", values: [ { value: "○", tone: "success" }, { value: "○", tone: "success" }] },
      ],
    },
    {
      title: "ブランディングとサポート",
      rows: [
        { label: "カスタムブランディング", values: [ { value: "✕", tone: "danger" }, { value: "○", tone: "success" }] },
        { label: "FDE (Forward Deployed Engineer)", values: [ { value: "✕", tone: "danger" }, { value: "○ (Add-on)", tone: "success" }] },
        {
          label: "サポート体制",
          values: [
            { value: "24時間以内のメールサポート", tone: "muted" },
            { value: "専任サポート", tone: "muted" },
          ],
        },
      ],
    },
  ],
};
