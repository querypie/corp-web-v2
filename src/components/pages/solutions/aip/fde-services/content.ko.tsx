import { pageSectionGapClassName, pageXPaddingClassName } from "@/constants/layout";
import AipHero from "@/components/sections/AipHero";
import Cta from "@/components/sections/common/Cta";
import FeatureMediaList from "@/components/sections/common/FeatureMediaList";
import type { Locale } from "@/constants/i18n";

type Props = {
  locale: Locale;
  searchParams?: { category?: string };
};

export const metadata = {
  title: "FDE 서비스",
  description:
    "전담 엔지니어(FDE)가 업무 흐름을 발굴하고 맞춤형 AI 에이전트를 구축해 AI를 실질적 성과로 전환합니다.",
  keywords: ["FDE Services", "Forward Deployed Engineers", "AI agents"],
} as const;

const featureItems = [
  {
    title: ["문제 발굴"],
    body: [
      "AI 전문가가 전환을 가로막는 문제를 찾습니다. 시간과 비용이 커지기 전에 문제를 조기에 파악합니다.",
    ],
    imageAlt: "AI 전환 문제 발굴 미리보기",
    imageClassName: "h-auto w-full md:h-[400px] md:w-auto",
    imageSrc: "/solutions/aip/fde-services/find-problems.webp",
    mediaClassName: "aspect-auto h-auto w-full md:h-[400px] md:w-fit md:max-w-full lg:w-fit lg:max-w-none",
  },
  {
    title: ["계획 수립"],
    body: [
      "비즈니스에 맞는 AI 접근 방식을 함께 설계합니다. 복잡한 과제를 명확하고 실행 가능한 액션 플랜으로 전환합니다.",
    ],
    imageAlt: "AI 전환 계획 미리보기",
    imageClassName: "h-auto w-full md:h-[400px] md:w-auto",
    imageSrc: "/solutions/aip/fde-services/make-plans.webp",
    mediaClassName: "aspect-auto h-auto w-full md:h-[400px] md:w-fit md:max-w-full lg:w-fit lg:max-w-none",
    reverse: true,
  },
  {
    title: ["맞춤형 AI 에이전트 구축"],
    body: [
      "초기 아이디어부터 완성된 제품까지 AI 에이전트 구축을 지원합니다. 모든 단계를 함께 안내합니다.",
    ],
    imageAlt: "맞춤형 AI 에이전트 구축 미리보기",
    imageClassName: "h-auto w-full md:h-[400px] md:w-auto",
    imageSrc: "/solutions/aip/fde-services/build-custom-ai-agents.webp",
    mediaClassName: "aspect-auto h-auto w-full md:h-[400px] md:w-fit md:max-w-full lg:w-fit lg:max-w-none",
  },
  {
    title: ["작동하는 AI 구현"],
    body: [
      "AI가 실제 운영 환경에서 작동하도록 지원합니다. 전문가 가이드가 AI 전환이 실제로 성공하도록 돕습니다.",
    ],
    imageAlt: "프로덕션 AI 운영 미리보기",
    imageClassName: "h-auto w-full md:h-[400px] md:w-auto",
    imageSrc: "/solutions/aip/fde-services/make-ai-work.webp",
    mediaClassName: "aspect-auto h-auto w-full md:h-[400px] md:w-fit md:max-w-full lg:w-fit lg:max-w-none",
    reverse: true,
  },
];

export default function FdeServicesKOSolutionContent({ locale }: Props) {
  return (
    <div className={`flex w-full flex-col ${pageSectionGapClassName} ${pageXPaddingClassName} pb-10`}>
      <div className="flex w-full flex-col gap-10 md:gap-[80px]">
        <section className="flex w-full justify-center">
          <header className="grid w-full max-w-[1200px] gap-4 sm:gap-5 md:grid-cols-2 md:gap-[30px]">
            <div>
              <h1 className="m-0 text-pretty type-h1 text-fg">
                AI 전환 전문가가 함께하는
                <br className="hidden md:block" /> FDE 서비스
              </h1>
            </div>
            <p className="m-0 max-w-[720px] text-pretty type-body-lg leading-relaxed text-fg">
              조직에 밀착한 전담 엔지니어(FDE)가 전략 수립, 개발, 운영까지 AI
              전환 전 과정을 지원해 AI 이니셔티브가 실제 성과로 이어지도록 돕습니다.
            </p>
          </header>
        </section>
        <AipHero
          imageAlt="FDE Services 제품 미리보기"
          imageSrc="/solutions/aip/fde-services/fde.svg"
        />
      </div>

      <FeatureMediaList items={featureItems} />

      <div>
        <Cta locale={locale} />
      </div>
    </div>
  );
}
