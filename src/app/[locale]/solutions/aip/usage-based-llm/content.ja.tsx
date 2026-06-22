import { pageSectionGapClassName, pageXPaddingClassName } from "@/constants/layout";
import Cta from "@/components/sections/Cta";
import FeatureSection from "@/components/sections/FeatureSection";
import type { Locale } from "@/constants/i18n";

type Props = {
  locale: Locale;
  searchParams?: { category?: string };
};

export const metadata = {
  title: "使用量ベースLLM",
  description:
    "使用量ベースの制御、コスト可視化、ガバナンスを備えたエンタープライズLLM環境を提供します。",
  keywords: ["Usage-Based LLM", "Enterprise AI", "LLM governance"],
} as const;

const featureItems = [
  {
    title: ["Pay-Per-Use", "Pricing"],
    body: [
      "固定費なしで、利用した分だけ支払えます。",
      "組織規模を問わず、AI導入を",
      "柔軟かつ予測可能に運用できます。",
    ],
    imageAlt: "使用量ベース料金プレビュー",
    imageSrc: "/images/home/features/feature-panel-a.png",
  },
  {
    title: ["Premium LLM", "Models"],
    body: [
      "OpenAI、Anthropic、Googleなどの主要モデルを",
      "ひとつの場所から選択して利用できます。",
      "業務ごとに最適なAIをすばやく適用します。",
    ],
    imageAlt: "LLMモデル選択プレビュー",
    imageSrc: "/images/home/features/feature-panel-b.png",
    reverse: true,
  },
  {
    title: ["SSO & Central", "Management"],
    body: [
      "既存のIDプロバイダーとSSOで連携します。",
      "アカウント、権限、管理ポリシーを一元管理し、",
      "セキュリティと運用効率を高めます。",
    ],
    imageAlt: "SSOと一元管理プレビュー",
    imageSrc: "/images/home/features/feature-panel-a.png",
  },
];

export default function UsageBasedLlmJASolutionContent({ locale }: Props) {
  return (
    <div className={`flex w-full flex-col ${pageSectionGapClassName} ${pageXPaddingClassName} pb-10`}>
      <section className="flex w-full justify-center">
        <header className="grid w-full max-w-[1200px] gap-4 sm:gap-5 md:grid-cols-2 md:gap-[30px]">
          <div>
            <h1 className="m-0 type-h1 text-fg">
              <span className="block">Usage-Based Enterprise AI</span>
              <span className="block">That Works</span>
            </h1>
          </div>
          <p className="m-0 max-w-[720px] type-body-lg leading-relaxed text-fg">
            Browser-based platform with instant access—no downloads, no setup, no fixed costs. Up to
            90% savings vs. ChatGPT makes enterprise-wide AI adoption finally achievable.
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
