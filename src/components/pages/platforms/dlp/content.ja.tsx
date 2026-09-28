import type { Locale } from "@/constants/i18n";
import DlpSolutionContent from "./DlpSolutionContent";

type Props = {
  locale: Locale;
  searchParams?: { category?: string };
};

export const metadata = {
  title: "QueryPie データ損失防止 (DLP)",
  description:
    "QueryPieの多言語DLP研究は、ルール検査、軽量AIによる選別、原文フレーズの精密抽出を組み合わせ、AI入力の機密情報リスクを識別します。",
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
            title: "タイプと原文フレーズを精密に抽出",
            body: "精密な小型言語モデルが機密情報のタイプと原文に現れるフレーズを抽出し、別プログラムが原文との照合によって正確な位置を計算します。",
          },
          {
            title: "多言語の業務データを対象に研究",
            body: "韓国語・英語・日本語の業務文、コード、表記の揺れを反映し、21種類の機密情報タイプを整理しています。韓国語の軽量モデルは内部評価で平均約17.3ms、F1約94%を記録しました。",
          },
        ],
        description:
          "生成AIを業務で利用するほど、会話、文書、コード、プロンプトに含まれる機密情報を文脈の中で探す必要があります。QueryPieは、高速なリスク選別と原文フレーズの精密抽出を分け、多言語DLP研究として必要な入力だけに深い分析を適用する構造を設計しています。",
        featureBody:
          "固定ルールだけでは見つけにくい文脈上の氏名、コード内の認証情報、空白や特殊文字で変形された表現まで考慮します。低リスクは通過させ、高リスクと曖昧なグレーゾーンは追加判定と精密抽出へ進めます。",
        featureImageAlt: "データ損失防止検出アーキテクチャ",
        featureImageSrc: "/resources/white-papers/dlp-detection-architecture-ja.png",
        featureTitle: "高速なリスク選別と精密な原文抽出を組み合わせます。",
        heading: "データ損失防止",
        huggingFaceDescription:
          "QueryPieが公開した多言語の機密情報検出モデル、モデルカード、利用資料をHugging Faceで確認して活用できます。",
        huggingFaceLabel: "Hugging Faceを開く",
        huggingFaceTitle: "Hugging FaceでDLPモデルを利用する",
        label: "QueryPie DLP Research",
        tutorialTitle: "DLPデモ動画",
      }}
    />
  );
}
