import type { Locale } from "@/constants/i18n";
import DlpSolutionContent from "./DlpSolutionContent";

type Props = {
  locale: Locale;
  searchParams?: { category?: string };
};

export const metadata = {
  title: "QueryPie データ損失防止 (DLP)",
  description:
    "QueryPie DLPは、ルールと軽量AIで多言語の入力に含まれる機密情報のリスクをすばやく選別し、必要な入力から機密情報の種類と実際に記載された内容を見つけます。",
  keywords: ["QueryPie DLP", "多言語DLP", "データ損失防止", "機密情報検出", "AIセキュリティ"],
} as const;

export default function DlpJASolutionContent({ locale }: Props) {
  return (
    <DlpSolutionContent
      locale={locale}
      copy={{
        benefitItems: [
          {
            title: "ルールと軽量AIで高速に選別",
            body: "形式が明確な値は正規表現・キーワードルールで先に確認し、ルールに一致しない入力はELECTRAベースの軽量モデルがリスクスコアで選別します。CPU環境での大量入力処理も想定しています。",
          },
          {
            title: "機密情報の種類と実際の記載内容を特定",
            body: "高精度な小型言語モデルが機密情報の種類と入力に実際に記載された内容を見つけます。別のプログラムが原文と照合し、正確な位置を計算します。",
          },
          {
            title: "多言語の業務データに対応した検出",
            body: "韓国語・英語・日本語の業務文、コード、表記の揺れを考慮し、21種類の機密情報を扱います。韓国語の軽量モデルは内部評価で平均約17.3ms、F1約94%を記録しました。",
          },
        ],
        demoEmbedTitle: "DLP検出デモ",
        description:
          "生成AIを業務で利用するほど、会話、文書、コード、プロンプトに含まれる機密情報を文脈の中で見つける必要があります。QueryPie DLPは、韓国語・英語・日本語の入力からリスクをすばやく選別し、必要な入力だけを詳しく分析して機密情報の種類と実際に記載された内容を見つけます。",
        fullScreenDemoLabel: "全画面デモを起動",
        heading: "データ損失防止",
        huggingFaceDescription:
          "QueryPieが公開した多言語の機密情報検出モデル、モデルカード、利用資料をHugging Faceで確認して活用できます。",
        huggingFaceLabel: "Hugging Faceを開く",
        huggingFaceTitle: "Hugging FaceでDLPモデルを利用する",
        label: "QueryPie DLP",
        modelSections: [
          {
            role: "高速なリスク選別",
            title: "大量の入力からリスクの兆候をすばやく絞り込みます。",
            description:
              "QueryPie DLPは、ELECTRAベースの軽量モデルで、ルールだけでは判断しにくい文章に含まれる機密情報のリスクをすばやく評価します。大量の入力から、詳しい確認が必要な内容を絞り込めます。",
            flowTitle: "高速なリスク選別の機能",
            flow: [
              { label: "文脈を確認", value: "パターンや形式だけでは判断しにくい文章も確認します。" },
              { label: "リスクを表示", value: "機密情報が含まれる可能性をスコアで示します。" },
              { label: "確認対象を選別", value: "高リスクや判断が曖昧な入力を詳しい確認の対象にします。" },
            ],
          },
          {
            role: "機密情報の精密抽出",
            title: "機密情報の種類と実際に記載された内容を見つけます。",
            description:
              "QueryPie DLPは、SLMベースの高精度モデルで文脈を分析し、機密情報の種類と入力に実際に記載された内容を見つけます。保護が必要な部分を具体的に確認できます。",
            flowTitle: "機密情報の精密抽出の機能",
            flow: [
              { label: "情報の種類を区別", value: "氏名・口座情報・認証情報などの機密情報を区別します。" },
              { label: "実際の内容を確認", value: "機密情報が入力に実際にどう記載されているかを見つけます。" },
              { label: "文脈を踏まえて判断", value: "決まった形式に当てはまらない表現も、周囲の文章を読んで機密情報かどうか判断します。" },
            ],
          },
        ],
        processTitle: "ルール検査からリスク選別、機密情報の抽出まで",
        processDescription:
          "正規表現で確認し、ELECTRAベースのモデルで選別し、SLMベースのモデルで機密情報を抽出します。",
        processSteps: [
          {
            title: "ルールですぐに確認",
            body: "正規表現とキーワードで形式が明確な機密情報を先に見つけます。明確な一致はAI分析を待たずに判断できます。",
          },
          {
            title: "ELECTRAベースのモデルでリスクを選別",
            body: "ルールに一致しない文章を軽量な分類モデルがすばやく読み、リスクスコアを算出します。高リスクや曖昧な入力を詳しい確認の対象にします。",
          },
          {
            title: "SLMベースのモデルで機密情報を抽出",
            body: "精密分析が必要な入力から、機密情報の種類と実際に記載された内容を見つけます。別のプログラムが原文と照合し、正確な位置を算出します。",
          },
        ],
      }}
    />
  );
}
