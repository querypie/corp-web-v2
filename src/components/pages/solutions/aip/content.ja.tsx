import { pageSectionGapClassName, pageXPaddingClassName } from "@/constants/layout";
import Cta from "@/components/sections/Cta";
import YoutubePreviewPlayer from "@/components/content/YoutubePreviewPlayer";
import ThreeCard from "@/components/pages/solutions/aip/ThreeCard";
import FeatureMediaList from "@/components/sections/FeatureMediaList";
import { getLocalePath, type Locale } from "@/constants/i18n";

type Props = {
  locale: Locale;
  searchParams?: { category?: string };
};

export const metadata = {
  title: "QueryPie AIプラットフォーム (AIP)",
  description:
    "QueryPie AIPは、エンタープライズAI変革のためのAIプラットフォームです。",
  keywords: ["QueryPie AI", "AI Platform", "AIP", "MCP Gateway"],
} as const;

function getFeatureItems(locale: Locale) {
  return [
    {
      body: [
        "プリセットされた簡単な指示文（プロンプト）から始めれば、包括的かつ最適化されたプロンプトを自動生成します。",
        "専門知識がなくてもAIエージェントの効果を最大限に引き出せます。",
      ],
      imageAlt: "プロンプト自動生成",
      imageClassName: "h-auto w-full md:h-[400px] md:w-auto",
      imageSrc: "/assets/products/aip/aip_function_prompt.gif",
      mediaClassName: "aspect-auto h-auto w-full md:h-[400px] md:w-fit md:max-w-full lg:w-fit lg:max-w-none",
      title: ["プロンプト自動生成"],
    },
    {
      action: {
        href: getLocalePath(locale, "/solutions/aip/integrations"),
        label: "QueryPie AIPと接続可能な連携ツールの一覧はこちら",
      },
      body: [
        "OAuth認証でお使いのツール（Slack、Googleなど）を簡単に接続。",
        "提供されている統合機能に加えて、カスタムツールや内部ツールも追加でき、ニーズに合わせたビジネスワークフロー自動化を実現します。",
      ],
      imageAlt: "シンプルな統合",
      imageClassName: "h-auto w-full md:h-[400px] md:w-auto",
      imageSrc: "/assets/products/aip/aip_function_integration.gif",
      mediaClassName: "aspect-auto h-auto w-full md:h-[400px] md:w-fit md:max-w-full lg:w-fit lg:max-w-none",
      reverse: true,
      title: ["シンプルな統合"],
    },
    {
      body: [
        "社内文書をアップロードして知識ベース化。",
        "AIが組織の情報を瞬時に取得し、貴社のビジネスに合った正確な回答をします。",
      ],
      imageAlt: "社内文書の学習機能",
      imageClassName: "h-auto w-full md:h-[400px] md:w-auto",
      imageSrc: "/assets/products/aip/aip_function_knowledge.gif",
      mediaClassName: "aspect-auto h-auto w-full md:h-[400px] md:w-fit md:max-w-full lg:w-fit lg:max-w-none",
      title: ["社内文書の学習機能"],
    },
    {
      body: [
        "包括的なライブラリから構築済みのエージェントをインストール、または特定の運用要件に合わせて各エージェントの機能をカスタマイズした独自のソリューションを作成できます。",
      ],
      imageAlt: "カスタムエージェント作成",
      imageClassName: "h-auto w-full md:h-[400px] md:w-auto",
      imageSrc: "/assets/products/aip/aip_function_createagent.gif",
      mediaClassName: "aspect-auto h-auto w-full md:h-[400px] md:w-fit md:max-w-full lg:w-fit lg:max-w-none",
      reverse: true,
      title: ["カスタムエージェント作成"],
    },
    {
      body: [
        "AIの回答をグラフや表、インタラクティブな図で表示。",
        "複雑な分析結果を視覚的にわかりやすく整理し、そのままエクスポートして会議に活用できます。",
      ],
      imageAlt: "ビジュアルレポート作成",
      imageClassName: "h-auto w-full md:h-[400px] md:w-auto",
      imageSrc: "/assets/products/aip/aip_function_visualization.gif",
      mediaClassName: "aspect-auto h-auto w-full md:h-[400px] md:w-fit md:max-w-full lg:w-fit lg:max-w-none",
      title: ["ビジュアルレポート作成"],
    },
    {
      body: [
        "指定した間隔でAIエージェントをスケジュール設定し、定型タスクを自動化。",
        "簡単なエージェント会話を通じて定期的な操作を設定でき、手動作業を削減しながら一貫した実行を保証します。",
      ],
      imageAlt: "エージェントスケジューリング",
      imageClassName: "h-auto w-full md:h-[400px] md:w-auto",
      imageSrc: "/assets/products/aip/aip_function_schedule.gif",
      mediaClassName: "aspect-auto h-auto w-full md:h-[400px] md:w-fit md:max-w-full lg:w-fit lg:max-w-none",
      reverse: true,
      title: ["エージェントスケジューリング"],
    },
  ];
}

export default function AipJASolutionContent({ locale }: Props) {
  const featureItems = getFeatureItems(locale);

  return (
    <div className={`flex w-full flex-col ${pageSectionGapClassName} ${pageXPaddingClassName} pb-10`}>
      <div className="flex flex-col gap-14 md:gap-20">
        <div>
          <section className="flex w-full justify-center">
            <header className="grid w-full max-w-[1200px] gap-4 sm:gap-5 md:grid-cols-2 md:gap-[30px]">
              <h1 className="m-0 type-h1 text-fg">AI Platform</h1>
              <p className="m-0 max-w-[720px] type-body-lg leading-relaxed text-fg">
                経済的でエンタープライズ対応のソリューションにより、企業のAI変革を実現する
                プラットフォームです。使用量ベースのLLMデプロイと包括的なMCPゲートウェイを
                備え、Forward Deployed Engineers (FDE) がカスタムAIエージェントを通じて
                変革を完遂します。
              </p>
            </header>
          </section>
        </div>

        <div>
          <section className="flex w-full justify-center">
            <YoutubePreviewPlayer
              thumbnailAlt="QueryPie AI Platform video thumbnail"
              thumbnailSrc="/assets/products/aip/aip-cover.jpg"
              title="QueryPie AI Platform video"
              videoSrc="/assets/products/aip/QueryPie%20AIP%20-%20Secure%20Enterprise%20Agentic%20AI%20Platform.mp4"
            />
          </section>
        </div>
      </div>

      <div className="-mx-5 md:-mx-10">
        <ThreeCard locale={locale} />
      </div>

      <div id="features">
        <FeatureMediaList items={featureItems} />
      </div>

      <div>
        <Cta locale={locale} />
      </div>
    </div>
  );
}
