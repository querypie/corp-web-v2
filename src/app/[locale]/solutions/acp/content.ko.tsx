import { pageSectionGapClassName, pageXPaddingClassName } from "@/constants/layout";
import Cta from "@/components/sections/Cta";
import FeatureSection from "@/components/sections/FeatureSection";
import type { Locale } from "@/constants/i18n";
import AcpDiagram from "./AcpDiagram";
import AcpIntegrationSection from "./AcpIntegrationSection";

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
      "QueryPie DAC is crafted for data protection in the cloud era, seamlessly connecting various cloud ecosystems.",
      "It automatically identifies sensitive data and personal information, ensuring robust security for your assets.",
    ],
    imageAlt: "데이터베이스 접근 제어 미리보기",
    title: ["DAC -", "Database Access Control"],
    videoSrc: "/solutions/acp/acp-dac.mp4",
  },
  {
    body: [
      "QueryPie SAC is designed for cloud instance protection on AWS, GCP, and Azure, while also supporting on-premises environments.",
      "It enables administrators to monitor user commands and replay sessions, enhancing security and oversight.",
    ],
    imageAlt: "시스템 접근 제어 미리보기",
    reverse: true,
    title: ["SAC -", "System Access Control"],
    videoSrc: "/solutions/acp/acp-sac.mp4",
  },
  {
    body: [
      "QueryPie KAC is a solution for Kubernetes API protection, enabling centralized management of cloud infrastructures like AWS EKS and on-premises clusters.",
      "Administrators can manage access, monitor API requests, and replay container command executions.",
    ],
    imageAlt: "Kubernetes 접근 제어 미리보기",
    title: ["KAC -", "Kubernetes Access Control"],
    videoSrc: "/solutions/acp/acp-kac.mp4",
  },
  {
    body: [
      "QueryPie WAC secures access and logs activities for web applications, including admin portals and SaaS platforms.",
      "It captures logs and screenshots, masks sensitive data, and controls actions like file transfers.",
    ],
    imageAlt: "웹 접근 제어 미리보기",
    reverse: true,
    title: ["WAC -", "Web Access Control"],
    videoSrc: "/solutions/acp/acp-wac.mp4",
  },
  {
    body: [
      "Real-time risk detection, policy-based permissions, and sensitive data masking — all in one unified gateway.",
      "Beyond blocking: intelligent access that adapts to context and compliance.",
    ],
    imageAlt: "관리형 접근 제어 미리보기",
    title: ["MAC -", "MCP Access Controller"],
    videoSrc: "/solutions/acp/acp-mac.mp4",
  },
];

export default function AcpKOSolutionContent({ locale }: Props) {
  return (
    <div className={`flex w-full flex-col ${pageSectionGapClassName} ${pageXPaddingClassName} pb-10`}>
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
          <AcpDiagram locale={locale} />
        </div>
      </div>

      <div>
        <FeatureSection items={featureItems} />
      </div>

      <div className="-mx-5 md:-mx-10">
        <AcpIntegrationSection locale={locale} />
      </div>

      <div>
        <Cta locale={locale} />
      </div>
    </div>
  );
}
