import { pageSectionGapClassName, pageXPaddingClassName } from "@/constants/layout";
import Cta from "@/components/sections/Cta";
import FeatureSection from "@/components/sections/FeatureSection";
import type { Locale } from "@/constants/i18n";

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
    title: ["Pay-Per-Use", "Pricing"],
    body: [
      "고정 비용 없이 사용한 만큼만 지불합니다.",
      "조직 규모와 상관없이 AI 도입 비용을",
      "유연하고 예측 가능하게 운영합니다.",
    ],
    imageAlt: "사용량 기반 가격 정책 미리보기",
    imageSrc: "/images/home/features/feature-panel-a.png",
  },
  {
    title: ["Premium LLM", "Models"],
    body: [
      "OpenAI, Anthropic, Google 등 주요 모델을",
      "한곳에서 선택하고 사용할 수 있습니다.",
      "업무별로 적합한 AI를 빠르게 적용합니다.",
    ],
    imageAlt: "LLM 모델 선택 미리보기",
    imageSrc: "/images/home/features/feature-panel-b.png",
    reverse: true,
  },
  {
    title: ["SSO & Central", "Management"],
    body: [
      "기존 ID 공급자와 SSO로 자연스럽게 연결합니다.",
      "계정, 권한, 관리 정책을 중앙에서 통제해",
      "보안과 운영 효율을 높입니다.",
    ],
    imageAlt: "SSO 및 중앙 관리 미리보기",
    imageSrc: "/images/home/features/feature-panel-a.png",
  },
];

export default function UsageBasedLlmKOSolutionContent({ locale }: Props) {
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
