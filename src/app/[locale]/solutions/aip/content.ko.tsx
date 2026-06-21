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
  title: "QueryPie AI Platform (AIP)",
  description:
    "QueryPie AIP는 엔터프라이즈 AI 전환을 위한 AI 플랫폼입니다.",
  keywords: ["QueryPie AI", "AI Platform", "AIP", "MCP Gateway"],
} as const;

const featureItems = [
  {
    body: [
      "사용량 기반 제어, 비용 가시성,",
      "프로덕션 팀을 위한 거버넌스로",
      "엔터프라이즈 LLM 환경을 운영합니다.",
    ],
    imageAlt: "사용량 기반 LLM 배포 미리보기",
    imageSrc: "/images/home/features/feature-panel-a.png",
    title: ["실용적인", "엔터프라이즈 AI를 시작하세요"],
  },
  {
    body: [
      "관리형 MCP 게이트웨이로 AI 에이전트를",
      "도구와 데이터에 연결하고, 정책 적용과",
      "감사 로그까지 한곳에서 확인합니다.",
    ],
    imageAlt: "MCP 게이트웨이 미리보기",
    imageSrc: "/images/home/features/feature-panel-b.png",
    reverse: true,
    title: ["모든 MCP 연결을", "거버넌스하세요"],
  },
  {
    body: [
      "Forward Deployed Engineers가 비즈니스 업무를 찾고,",
      "맞춤형 에이전트를 구축해 AI 파일럿을",
      "측정 가능한 가치로 전환합니다.",
    ],
    imageAlt: "Forward Deployed Engineer 워크플로우 미리보기",
    imageSrc: "/images/home/features/feature-panel-a.png",
    title: ["실제 업무에 맞춘", "에이전트를 구축하세요"],
  },
  {
    body: [
      "프롬프트, 모델, 도구, 사용 활동을",
      "하나의 운영 레이어로 모아 보안팀과",
      "비즈니스팀이 AI를 자신 있게 확장합니다.",
    ],
    imageAlt: "AI 운영 가시성 미리보기",
    imageSrc: "/images/home/features/feature-panel-b.png",
    reverse: true,
    title: ["엔터프라이즈 제어로", "AI를 확장하세요"],
  },
];

export default function AipKOSolutionContent({ locale }: Props) {
  return (
    <div className="flex w-full flex-col gap-14 px-5 pb-10 md:gap-[160px] md:px-10">
      <div className="flex flex-col gap-14 md:gap-20">
        <div>
          <section className="flex w-full justify-center">
            <header className="grid w-full max-w-[1200px] gap-4 sm:gap-5 md:grid-cols-2 md:gap-[30px]">
              <h1 className="m-0 type-h1 text-fg">AI Platform</h1>
              <p className="m-0 max-w-[720px] type-body-lg leading-relaxed text-fg">
                경제적이고 엔터프라이즈에 적합한 솔루션으로 기업의 AI 전환을 구현하는
                플랫폼입니다. 사용량 기반 LLM 배포와 포괄적인 MCP 게이트웨이를 제공하며,
                Forward Deployed Engineers (FDE)가 맞춤형 AI 에이전트를 통해 완전한 전환을
                지원합니다.
              </p>
            </header>
          </section>
        </div>

        <div>
          <section className="flex w-full justify-center">
            <YoutubePreviewPlayer
              embedSrc="https://www.youtube.com/embed/nJGSCd6itUE?si=2wccYas88jLRO7q2"
              thumbnailAlt="QueryPie AI Platform video thumbnail"
              thumbnailSrc="/solutions/aip/aip-cover.jpg"
              title="QueryPie AI Platform video"
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
