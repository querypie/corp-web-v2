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
  title: "사용량 기반 LLM",
  description:
    "사용량 기반 제어, 비용 가시성, 거버넌스를 갖춘 엔터프라이즈 LLM 환경을 배포합니다.",
  keywords: ["Usage-Based LLM", "Enterprise AI", "LLM governance"],
} as const;

const featureItems = [
  {
    title: ["사용량 기반 요금제"],
    body: [
      "고정 비용과 낭비 없이 사용한 만큼만 지불합니다. 조직 규모와 상관없이 AI 도입 비용을 유연하고 예측 가능하게 운영합니다.",
    ],
    imageAlt: "사용량 기반 가격 정책 미리보기",
    imageClassName: "h-auto w-full md:h-[400px] md:w-auto",
    imageSrc: "/solutions/aip/usage-based-llm/aip_function_pay.gif",
    mediaClassName: "aspect-auto h-auto w-full md:h-[400px] md:w-fit md:max-w-full lg:w-fit lg:max-w-none",
  },
  {
    title: ["선택 가능한 프리미엄 LLM 모델"],
    body: [
      "OpenAI, Anthropic, Google 등 업계 주요 모델을 사용할 수 있습니다. 요구사항에 맞는 AI를 선택해 팀 생산성을 즉시 높입니다.",
    ],
    imageAlt: "LLM 모델 선택 미리보기",
    imageClassName: "h-auto w-full md:h-[400px] md:w-auto",
    imageSrc: "/solutions/aip/usage-based-llm/aip_function_llmmodel.gif",
    mediaClassName: "aspect-auto h-auto w-full md:h-[400px] md:w-fit md:max-w-full lg:w-fit lg:max-w-none",
    reverse: true,
  },
  {
    title: ["SSO 및 중앙 관리"],
    body: [
      "기존 ID 공급자와 SSO로 자연스럽게 연결합니다. 모든 계정을 중앙에서 관리해 보안과 관리 통제력을 높입니다.",
    ],
    imageAlt: "SSO 및 중앙 관리 미리보기",
    imageClassName: "h-auto w-full md:h-[400px] md:w-auto",
    imageSrc: "/solutions/aip/usage-based-llm/aip_function_sso.gif",
    mediaClassName: "aspect-auto h-auto w-full md:h-[400px] md:w-fit md:max-w-full lg:w-fit lg:max-w-none",
  },
];

const comparisonCopy: ComparisonCopy = {
  rows: {
    monthlyCost: "월간 요금",
    models: "지원 LLM 모델",
    features: "기능",
    annualCost: ["200명 규모", "조직 기준", "연간 비용"],
  },
  competitors: [
    {
      name: "Company O",
      monthlyCost: "$30/month",
      models: ["GPT-4.1, 4o, o3,", "o3-mini, o1,", "and more"],
      features: ["AI 채팅", "개인, 비즈니스 RAG", "라이브 검색", "이미지 생성", "데이터 분석"],
      annualCost: ["$72,000", "per year"],
    },
    {
      name: "Company M",
      monthlyCost: "$20/month",
      models: ["GPT-4o,", "o3-mini, o1"],
      features: ["문서 요약", "문서 작성/편집"],
      annualCost: ["$48,000", "per year"],
    },
    {
      name: "Company A",
      monthlyCost: "$25/month",
      models: ["Claude 4 Opus,", "Claude 4 Sonnet,", "and more"],
      features: ["AI 채팅", "데이터 분석"],
      annualCost: ["$60,000", "per year"],
    },
    {
      name: "Company P",
      monthlyCost: "$40/month",
      models: ["LLaMA 3,", "Deepseek-R1"],
      features: ["AI 채팅", "라이브 검색"],
      annualCost: ["$96,000", "per year"],
    },
  ],
  queryPie: {
    name: "QueryPie",
    monthlyCost: "$0 (사용량 기반)",
    models: ["Claude, GPT, Gemini,", "고객 보유 LLM 모델까지 지원"],
    summary: ["경쟁사 제공 기능을 모두 포함하고", "업무에 필요한 핵심 기능까지", "함께 제공합니다"],
    features: [
      "AI 채팅",
      "개인, 비즈니스 RAG",
      "라이브 검색",
      "이미지 생성",
      "데이터 분석",
      "프롬프트 자동 생성",
      "인프라 관리",
      "AI 에이전트 생성",
      "보안, 모니터링",
      "중앙 관리",
    ],
    annualCost: "$7,200~ per year",
    savings: "(Company O 대비 최대 90% 절감)",
  },
  note: "* 사용량에 따라 달라질 수 있으나 일반적으로 80-90% 비용 절감이 가능합니다.",
};

export default function UsageBasedLlmKOSolutionContent({ locale }: Props) {
  return (
    <div className={`flex w-full flex-col ${pageSectionGapClassName} ${pageXPaddingClassName} pb-10`}>
      <div className="flex w-full flex-col gap-10 md:gap-[80px]">
        <section className="flex w-full justify-center">
          <header className="grid w-full max-w-[1200px] gap-4 sm:gap-5 md:grid-cols-2 md:gap-[30px]">
            <div>
              <h1 className="m-0 text-pretty type-h1 text-fg">
                실제로 작동하는 사용량 기반
                <br className="hidden md:block" /> 엔터프라이즈 AI
              </h1>
            </div>
            <p className="m-0 max-w-[720px] text-pretty type-body-lg leading-relaxed text-fg">
              다운로드, 설정, 고정 비용 없이 브라우저에서 바로 사용하는 플랫폼입니다. ChatGPT 대비
              최대 90% 비용 절감으로 전사 AI 도입을 현실적인 선택지로 만듭니다.
            </p>
          </header>
        </section>
        <Hero
          imageAlt="Usage-Based LLM 제품 미리보기"
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
