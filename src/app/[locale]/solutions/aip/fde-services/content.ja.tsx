import { pageSectionGapClassName, pageXPaddingClassName } from "@/constants/layout";
import Cta from "@/components/sections/Cta";
import FeatureSection from "@/components/sections/FeatureSection";
import type { Locale } from "@/constants/i18n";

type Props = {
  locale: Locale;
  searchParams?: { category?: string };
};

export const metadata = {
  title: "FDE Services",
  description:
    "Forward Deployed Engineersが業務フローを特定し、カスタムAIエージェントを構築してAIを成果へつなげます。",
  keywords: ["FDE Services", "Forward Deployed Engineers", "AI agents"],
} as const;

const featureItems = [
  {
    title: ["Find", "Problems"],
    body: [
      "AI専門家が変革を妨げる課題を特定します。",
      "時間とコストが膨らむ前にボトルネックを見つけ、",
      "実行可能な優先順位を整理します。",
    ],
    imageAlt: "AI変革の課題発見プレビュー",
    imageSrc: "/images/home/features/feature-panel-a.png",
  },
  {
    title: ["Make", "Plans"],
    body: [
      "事業に合ったAIアプローチを専門家と設計します。",
      "複雑な課題を明確で実行可能な",
      "アクションプランへ落とし込みます。",
    ],
    imageAlt: "AI変革計画プレビュー",
    imageSrc: "/images/home/features/feature-panel-b.png",
    reverse: true,
  },
  {
    title: ["Build Custom", "AI Agents"],
    body: [
      "初期アイデアから完成したプロダクトまで支援します。",
      "実際の業務フローに合わせたAIエージェントを",
      "設計、構築、改善します。",
    ],
    imageAlt: "カスタムAIエージェント構築プレビュー",
    imageSrc: "/images/home/features/feature-panel-a.png",
  },
  {
    title: ["Make AI", "Work"],
    body: [
      "AIが本番環境で機能するよう継続的に支援します。",
      "専門家のガイドにより、デモから",
      "持続的な価値へつなげます。",
    ],
    imageAlt: "本番AI運用プレビュー",
    imageSrc: "/images/home/features/feature-panel-b.png",
    reverse: true,
  },
];

export default function FdeServicesJASolutionContent({ locale }: Props) {
  return (
    <div className={`flex w-full flex-col ${pageSectionGapClassName} ${pageXPaddingClassName} pb-10`}>
      <section className="flex w-full justify-center">
        <header className="grid w-full max-w-[1200px] gap-4 sm:gap-5 md:grid-cols-2 md:gap-[30px]">
          <div>
            <h1 className="m-0 type-h1 text-fg">
              <span className="block">AI Transformation Expert</span>
              <span className="block">at Your Service</span>
            </h1>
          </div>
          <p className="m-0 max-w-[720px] type-body-lg leading-relaxed text-fg">
            Forward Deployed Engineers (FDE) embedded in your organization deliver comprehensive AI
            transformation—from strategy and development to production operations, ensuring your AI
            initiatives succeed.
          </p>
        </header>
      </section>

      <FeatureSection items={featureItems} />

      <div>
        <Cta locale={locale} />
      </div>
    </div>
  );
}
