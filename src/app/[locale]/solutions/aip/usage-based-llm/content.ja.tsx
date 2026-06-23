import { pageSectionGapClassName, pageXPaddingClassName } from "@/constants/layout";
import AipSolutionHeroMedia from "@/components/sections/AipSolutionHeroMedia";
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
    title: ["使用量ベース料金"],
    body: [
      "固定費や無駄なく、利用した分だけ支払えます。組織規模を問わず、AI導入を柔軟かつ予測可能に運用できます。",
    ],
    imageAlt: "使用量ベース料金プレビュー",
    imageClassName: "h-auto w-full md:h-[400px] md:w-auto",
    imageSrc: "/solutions/aip/usage-based-llm/aip_function_pay.gif",
    mediaClassName: "aspect-auto h-auto w-full md:h-[400px] md:w-fit md:max-w-full lg:w-fit lg:max-w-none",
  },
  {
    title: ["選べるプレミアムLLMモデル"],
    body: [
      "OpenAI、Anthropic、Googleなど業界をリードするモデルを利用できます。ニーズに合ったAIを選択し、チームの生産性をすぐに高めます。",
    ],
    imageAlt: "LLMモデル選択プレビュー",
    imageClassName: "h-auto w-full md:h-[400px] md:w-auto",
    imageSrc: "/solutions/aip/usage-based-llm/aip_function_llmmodel.gif",
    mediaClassName: "aspect-auto h-auto w-full md:h-[400px] md:w-fit md:max-w-full lg:w-fit lg:max-w-none",
    reverse: true,
  },
  {
    title: ["SSOと一元管理"],
    body: [
      "既存のIDプロバイダーとSSOで連携します。すべてのアカウントを一元管理し、セキュリティと管理統制を高めます。",
    ],
    imageAlt: "SSOと一元管理プレビュー",
    imageClassName: "h-auto w-full md:h-[400px] md:w-auto",
    imageSrc: "/solutions/aip/usage-based-llm/aip_function_sso.gif",
    mediaClassName: "aspect-auto h-auto w-full md:h-[400px] md:w-fit md:max-w-full lg:w-fit lg:max-w-none",
  },
];

export default function UsageBasedLlmJASolutionContent({ locale }: Props) {
  return (
    <div className={`flex w-full flex-col ${pageSectionGapClassName} ${pageXPaddingClassName} pb-10`}>
      <div className="flex w-full flex-col gap-10 md:gap-[80px]">
        <section className="flex w-full justify-center">
          <header className="grid w-full max-w-[1200px] gap-4 sm:gap-5 md:grid-cols-2 md:gap-[30px]">
            <div>
              <h1 className="m-0 text-pretty type-h1 text-fg">
                実際に機能する使用量ベースの
                <br className="hidden md:block" /> エンタープライズAI
              </h1>
            </div>
            <p className="m-0 max-w-[720px] text-pretty type-body-lg leading-relaxed text-fg">
              ダウンロード、設定、固定費なしでブラウザからすぐに利用できるプラットフォームです。
              ChatGPTと比べて最大90%のコスト削減により、全社的なAI導入を現実的にします。
            </p>
          </header>
        </section>
        <AipSolutionHeroMedia
          imageAlt="使用量ベースLLM製品プレビュー"
          imageSrc="/solutions/aip/usage-based-llm/usage-based-llm.svg"
        />
      </div>

      <FeatureSection items={featureItems} />

      <div>
        <Cta locale={locale} />
      </div>
    </div>
  );
}
