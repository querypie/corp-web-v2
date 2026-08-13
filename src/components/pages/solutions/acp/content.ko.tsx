import { pageSectionGapClassName, pageXPaddingClassName } from "@/constants/layout";
import Cta from "@/components/sections/Cta";
import FeatureMediaList from "@/components/sections/FeatureMediaList";
import type { Locale } from "@/constants/i18n";
import AiPackSection from "./AiPackSection";
import Diagram from "./Diagram";
import IntegrationSection from "./IntegrationSection";

type Props = {
  locale: Locale;
  searchParams?: { category?: string };
};

export const metadata = {
  title: "QueryPie Access Control Platform (ACP)",
  description:
    "QueryPie ACP는 데이터와 인프라 전반의 접근 관리를 제공하는 접근 제어 플랫폼입니다.",
  keywords: ["QueryPie ACP", "Access Control Platform", "ACP", "access control"],
} as const;

const featureItems = [
  {
    body: [
      "QueryPie DAC는 다양한 클라우드 생태계를 매끄럽게 연결하며 클라우드 시대의 데이터 보호를 위해 설계되었습니다.",
      "민감 데이터와 개인정보를 자동으로 식별해 핵심 데이터 자산을 견고하게 보호합니다.",
    ],
    imageAlt: "데이터베이스 접근 제어 미리보기",
    title: ["DAC", "Database Access Control"],
    titleLeadAsH1: true,
    videoSrc: "/assets/products/acp/acp-dac.mp4",
  },
  {
    body: [
      "QueryPie SAC는 AWS, GCP, Azure의 클라우드 인스턴스 보호는 물론 온프레미스 환경까지 지원합니다.",
      "관리자는 사용자 명령을 모니터링하고 세션을 재생해 보안성과 관리 가시성을 높일 수 있습니다.",
    ],
    imageAlt: "시스템 접근 제어 미리보기",
    reverse: true,
    title: ["SAC", "System Access Control"],
    titleLeadAsH1: true,
    videoSrc: "/assets/products/acp/acp-sac.mp4",
  },
  {
    body: [
      "QueryPie KAC는 Kubernetes API 보호 솔루션으로, AWS EKS 같은 클라우드 인프라와 온프레미스 클러스터를 중앙에서 관리할 수 있게 합니다.",
      "관리자는 접근 권한을 관리하고 API 요청을 모니터링하며 컨테이너 명령 실행을 재생할 수 있습니다.",
    ],
    imageAlt: "Kubernetes 접근 제어 미리보기",
    title: ["KAC", "Kubernetes Access Control"],
    titleLeadAsH1: true,
    videoSrc: "/assets/products/acp/acp-kac.mp4",
  },
  {
    body: [
      "QueryPie WAC는 관리자 포털과 SaaS 플랫폼을 포함한 웹 애플리케이션 접근을 보호하고 활동을 기록합니다.",
      "로그와 스크린샷을 수집하고 민감 데이터를 마스킹하며 파일 전송 같은 작업을 제어합니다.",
    ],
    imageAlt: "웹 접근 제어 미리보기",
    reverse: true,
    title: ["WAC", "Web Access Control"],
    titleLeadAsH1: true,
    videoSrc: "/assets/products/acp/acp-wac.mp4",
  },
  {
    body: [
      "실시간 위험 탐지, 정책 기반 권한, 민감 데이터 마스킹을 하나의 통합 게이트웨이에서 제공합니다.",
      "단순 차단을 넘어, 상황과 컴플라이언스 요구에 맞춰 적응하는 지능형 접근 제어를 제공합니다.",
    ],
    imageAlt: "관리형 접근 제어 미리보기",
    title: ["MAC", "MCP Access Controller"],
    titleLeadAsH1: true,
    videoSrc: "/assets/products/acp/acp-mac.mp4",
  },
];

export default function AcpKOSolutionContent({ locale }: Props) {
  return (
    <div className={`flex w-full flex-col ${pageSectionGapClassName} ${pageXPaddingClassName}`}>
      <div className="flex flex-col gap-14 md:gap-20">
        <div>
          <section className="flex w-full justify-center">
            <header className="grid w-full max-w-[1200px] gap-4 sm:gap-5 md:grid-cols-2 md:gap-[30px]">
              <h1 className="m-0 type-h1 text-fg">Access Control Platform</h1>
              <p className="m-0 max-w-[720px] type-body-lg leading-relaxed text-fg">
                QueryPie ACP는 데이터베이스, 시스템, Kubernetes, 웹 애플리케이션 전반의 접근
                제어를 중앙화해 최소 권한 접근을 부여하고, 권한 사용을 모니터링하며, 복잡한
                엔터프라이즈 환경에서도 감사 대응 가능한 거버넌스를 유지하도록 돕습니다.
              </p>
            </header>
          </section>
        </div>

        <div>
          <Diagram locale={locale} />
        </div>
      </div>

      <div>
        <FeatureMediaList items={featureItems} />
      </div>

      <div className="-mx-5 md:-mx-10">
        <AiPackSection locale={locale} />
      </div>

      <div>
        <IntegrationSection locale={locale} />
      </div>

      <div>
        <Cta
          actionHref="https://docs.querypie.com/ko/installation/querypie-acp-community-edition"
          actionLabel="ACP Community Edition"
          locale={locale}
          secondaryActionHref=""
          secondaryActionLabel=""
        />
      </div>
    </div>
  );
}
