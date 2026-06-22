import { pageSectionGapClassName, pageXPaddingClassName } from "@/constants/layout";
import Cta from "@/components/sections/Cta";
import YoutubePreviewPlayer from "@/components/common/YoutubePreviewPlayer";
import AipThreeCardSection from "@/components/sections/AipThreeCardSection";
import FeatureSection from "@/components/sections/FeatureSection";
import type { Locale } from "@/constants/i18n";

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

const featureItems = [
  {
    body: [
      "使用量ベースの制御、コスト可視化、",
      "本番チーム向けのガバナンスにより、",
      "エンタープライズLLM環境を運用します。",
    ],
    imageAlt: "使用量ベースLLMデプロイのプレビュー",
    imageSrc: "/images/home/features/feature-panel-a.png",
    title: ["実用的な", "エンタープライズAIを開始"],
  },
  {
    body: [
      "管理されたMCPゲートウェイを通じて",
      "AIエージェントをツールとデータに接続し、",
      "ポリシー適用と監査ログを一元化します。",
    ],
    imageAlt: "MCPゲートウェイのプレビュー",
    imageSrc: "/images/home/features/feature-panel-b.png",
    reverse: true,
    title: ["すべてのMCP接続を", "ガバナンス"],
  },
  {
    body: [
      "Forward Deployed Engineersが業務ワークフローを特定し、",
      "カスタムエージェントを構築して、AIのPoCを",
      "測定可能な価値へ移行します。",
    ],
    imageAlt: "Forward Deployed Engineerワークフロープレビュー",
    imageSrc: "/images/home/features/feature-panel-a.png",
    title: ["実業務に合わせた", "エージェントを構築"],
  },
  {
    body: [
      "プロンプト、モデル、ツール、利用状況を",
      "ひとつの運用レイヤーに集約し、セキュリティと",
      "事業部門が安心してAIを拡張できるようにします。",
    ],
    imageAlt: "AI運用可視性のプレビュー",
    imageSrc: "/images/home/features/feature-panel-b.png",
    reverse: true,
    title: ["エンタープライズ制御で", "AIを拡張"],
  },
];

export default function AipJASolutionContent({ locale }: Props) {
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
              thumbnailSrc="/solutions/aip/aip-cover.jpg"
              title="QueryPie AI Platform video"
              videoSrc="/solutions/aip/QueryPie%20AIP%20-%20Secure%20Enterprise%20Agentic%20AI%20Platform.mp4"
            />
          </section>
        </div>
      </div>

      <div className="-mx-5 md:-mx-10">
        <AipThreeCardSection locale={locale} />
      </div>

      <div id="features">
        <FeatureSection items={featureItems} />
      </div>

      <div>
        <Cta locale={locale} />
      </div>
    </div>
  );
}
