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
    "Forward Deployed Engineers가 업무 흐름을 발굴하고 맞춤형 AI 에이전트를 구축해 AI를 실질적 성과로 전환합니다.",
  keywords: ["FDE Services", "Forward Deployed Engineers", "AI agents"],
} as const;

const featureItems = [
  {
    title: ["Find", "Problems"],
    body: [
      "AI 전문가가 전환을 가로막는 문제를 찾습니다.",
      "시간과 비용이 커지기 전에 병목을 파악해",
      "실행 가능한 우선순위를 세웁니다.",
    ],
    imageAlt: "AI 전환 문제 발굴 미리보기",
    imageSrc: "/images/home/features/feature-panel-a.png",
  },
  {
    title: ["Make", "Plans"],
    body: [
      "비즈니스에 맞는 AI 접근 방식을 함께 설계합니다.",
      "복잡한 과제를 명확하고 실행 가능한",
      "액션 플랜으로 전환합니다.",
    ],
    imageAlt: "AI 전환 계획 미리보기",
    imageSrc: "/images/home/features/feature-panel-b.png",
    reverse: true,
  },
  {
    title: ["Build Custom", "AI Agents"],
    body: [
      "아이디어 단계부터 완성된 제품까지 지원합니다.",
      "실제 업무 흐름에 맞춘 AI 에이전트를",
      "설계하고 구축하고 개선합니다.",
    ],
    imageAlt: "맞춤형 AI 에이전트 구축 미리보기",
    imageSrc: "/images/home/features/feature-panel-a.png",
  },
  {
    title: ["Make AI", "Work"],
    body: [
      "AI가 실제 운영 환경에서 작동하도록 지원합니다.",
      "전문가 가이드를 통해 데모를 넘어",
      "지속 가능한 가치로 연결합니다.",
    ],
    imageAlt: "프로덕션 AI 운영 미리보기",
    imageSrc: "/images/home/features/feature-panel-b.png",
    reverse: true,
  },
];

export default function FdeServicesKOSolutionContent({ locale }: Props) {
  return (
    <div className="flex w-full flex-col gap-14 px-5 pb-10 md:gap-[160px] md:px-10">
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
