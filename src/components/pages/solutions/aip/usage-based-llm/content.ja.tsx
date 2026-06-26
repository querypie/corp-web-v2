import { pageSectionGapClassName, pageXPaddingClassName } from "@/constants/layout";
import Hero from "@/components/pages/solutions/aip/Hero";
import Cta from "@/components/sections/Cta";
import FeatureMediaList from "@/components/sections/FeatureMediaList";
import type { Locale } from "@/constants/i18n";
import UsageBasedLlmComparisonTable, { type ComparisonCopy } from "./UsageBasedLlmComparisonTable";

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

const comparisonCopy: ComparisonCopy = {
  rows: {
    monthlyCost: "月額費用",
    models: "対応LLMモデル",
    features: "機能",
    annualCost: ["200ユーザー", "組織の", "年間費用"],
  },
  competitors: [
    {
      name: "Company O",
      monthlyCost: "$30/month",
      models: ["GPT-4.1, 4o, o3,", "o3-mini, o1,", "and more"],
      features: ["AIチャット", "個人, ビジネスRAG", "ライブ検索", "画像生成", "データ分析"],
      annualCost: ["$72,000", "per year"],
    },
    {
      name: "Company M",
      monthlyCost: "$20/month",
      models: ["GPT-4o,", "o3-mini, o1"],
      features: ["ドキュメント要約", "ドキュメント作成/編集"],
      annualCost: ["$48,000", "per year"],
    },
    {
      name: "Company A",
      monthlyCost: "$25/month",
      models: ["Claude 4 Opus,", "Claude 4 Sonnet,", "and more"],
      features: ["AIチャット", "データ分析"],
      annualCost: ["$60,000", "per year"],
    },
    {
      name: "Company P",
      monthlyCost: "$40/month",
      models: ["LLaMA 3,", "Deepseek-R1"],
      features: ["AIチャット", "ライブ検索"],
      annualCost: ["$96,000", "per year"],
    },
  ],
  queryPie: {
    name: "QueryPie",
    monthlyCost: "$0 (使用量ベース)",
    models: ["Claude, GPT, Gemini,", "お客様所有のLLMモデルにも対応"],
    summary: ["競合が提供する機能を備え、", "ビジネスに必要な主要機能も", "あわせて提供します"],
    features: [
      "AIチャット",
      "個人, ビジネスRAG",
      "ライブ検索",
      "画像生成",
      "データ分析",
      "プロンプト自動生成",
      "インフラ管理",
      "AIエージェント作成",
      "セキュリティ, 監視",
      "一元管理",
    ],
    annualCost: "$7,200~ per year",
    savings: "(Company O比で最大90%削減)",
  },
  note: "* 使用量により変動しますが、通常は80-90%のコスト削減が可能です。",
};

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
        <Hero
          imageAlt="使用量ベースLLM製品プレビュー"
          imageSrc="/solutions/aip/usage-based-llm/usage-based-llm.svg"
        />
      </div>

      <FeatureMediaList items={featureItems} />

      <UsageBasedLlmComparisonTable copy={comparisonCopy} />

      <div>
        <Cta locale={locale} />
      </div>
    </div>
  );
}
