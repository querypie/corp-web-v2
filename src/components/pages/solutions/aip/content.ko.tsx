import { pageSectionGapClassName, pageXPaddingClassName } from "@/constants/layout";
import Cta from "@/components/sections/Cta";
import YoutubePreviewPlayer from "@/components/content/YoutubePreviewPlayer";
import ThreeCard from "@/components/pages/solutions/aip/ThreeCard";
import FeatureMediaList from "@/components/sections/FeatureMediaList";
import { getLocalePath, type Locale } from "@/constants/i18n";

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

function getFeatureItems(locale: Locale) {
  return [
    {
      body: [
        "Preset Instructions에 간단한 프롬프트만 입력하면 자동 생성 기능이 AI 에이전트 효과를 극대화하는 포괄적이고 최적화된 프롬프트를 만들어줍니다.",
      ],
      imageAlt: "프롬프트 자동 생성",
      imageClassName: "h-auto w-full md:h-[400px] md:w-auto",
      imageSrc: "/assets/products/aip/aip_function_prompt.gif",
      mediaClassName: "aspect-auto h-auto w-full md:h-[400px] md:w-fit md:max-w-full lg:w-fit lg:max-w-none",
      title: ["프롬프트 자동 생성"],
    },
    {
      action: {
        href: getLocalePath(locale, "/solutions/aip/integrations"),
        label: "사용 가능한 AIP 연동 모두 보기",
      },
      body: [
        "OAuth 인증으로 업무 도구를 손쉽게 연결하세요.",
        "제공되는 연동 외에도 맞춤형 도구와 내부 도구를 추가해 비즈니스에 맞는 워크플로 자동화를 구성할 수 있습니다.",
      ],
      imageAlt: "간편한 연동",
      imageClassName: "h-auto w-full md:h-[400px] md:w-auto",
      imageSrc: "/assets/products/aip/aip_function_integration.gif",
      mediaClassName: "aspect-auto h-auto w-full md:h-[400px] md:w-fit md:max-w-full lg:w-fit lg:max-w-none",
      reverse: true,
      title: ["간편한 연동"],
    },
    {
      body: [
        "문서를 지식 번들로 전환해 더 똑똑한 AI 응답을 제공합니다.",
        "RAG 기반 에이전트가 조직 정보를 즉시 참조해 비즈니스 맥락에 맞는 정확한 답변을 생성합니다.",
      ],
      imageAlt: "맥락 기반 지식 번들",
      imageClassName: "h-auto w-full md:h-[400px] md:w-auto",
      imageSrc: "/assets/products/aip/aip_function_knowledge.gif",
      mediaClassName: "aspect-auto h-auto w-full md:h-[400px] md:w-fit md:max-w-full lg:w-fit lg:max-w-none",
      title: ["맥락 기반 지식 번들"],
    },
    {
      body: [
        "풍부한 라이브러리에서 사전 구축된 에이전트를 설치하거나, 운영 요구사항에 맞게 각 에이전트의 기능을 조정한 맞춤형 솔루션을 만들 수 있습니다.",
      ],
      imageAlt: "맞춤형 에이전트 생성",
      imageClassName: "h-auto w-full md:h-[400px] md:w-auto",
      imageSrc: "/assets/products/aip/aip_function_createagent.gif",
      mediaClassName: "aspect-auto h-auto w-full md:h-[400px] md:w-fit md:max-w-full lg:w-fit lg:max-w-none",
      reverse: true,
      title: ["맞춤형 에이전트 생성"],
    },
    {
      body: [
        "차트, 그래프, 인터랙티브 요소로 AI 응답을 더 풍부하게 만듭니다.",
        "복잡한 인사이트를 시각 자료로 쉽게 이해시키고, 이해관계자와 의사결정자를 위한 완성도 높은 보고서로 내보낼 수 있습니다.",
      ],
      imageAlt: "Artifact 시각화",
      imageClassName: "h-auto w-full md:h-[400px] md:w-auto",
      imageSrc: "/assets/products/aip/aip_function_visualization.gif",
      mediaClassName: "aspect-auto h-auto w-full md:h-[400px] md:w-fit md:max-w-full lg:w-fit lg:max-w-none",
      title: ["Artifact 시각화"],
    },
    {
      body: [
        "AI 에이전트를 지정한 주기로 실행해 반복 업무를 자동화합니다.",
        "간단한 에이전트 대화로 정기 작업을 구성해 수작업을 줄이고 일관된 실행을 보장합니다.",
      ],
      imageAlt: "에이전트 스케줄링",
      imageClassName: "h-auto w-full md:h-[400px] md:w-auto",
      imageSrc: "/assets/products/aip/aip_function_schedule.gif",
      mediaClassName: "aspect-auto h-auto w-full md:h-[400px] md:w-fit md:max-w-full lg:w-fit lg:max-w-none",
      reverse: true,
      title: ["에이전트 스케줄링"],
    },
  ];
}

export default function AipKOSolutionContent({ locale }: Props) {
  const featureItems = getFeatureItems(locale);

  return (
    <div className={`flex w-full flex-col ${pageSectionGapClassName} ${pageXPaddingClassName} pb-10`}>
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
              thumbnailAlt="QueryPie AI Platform video thumbnail"
              thumbnailSrc="/assets/products/aip/aip-cover.png"
              title="QueryPie AI Platform video"
              videoSrc="/assets/products/aip/QueryPie%20AIP%20-%20Secure%20Enterprise%20Agentic%20AI%20Platform.mp4"
            />
          </section>
        </div>
      </div>

      <div className="-mx-5 md:-mx-10">
        <ThreeCard locale={locale} />
      </div>

      <div id="features">
        <FeatureMediaList items={featureItems} />
      </div>

      <div>
        <Cta locale={locale} />
      </div>
    </div>
  );
}
