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
    "QueryPie ACP is the platform that delivers comprehensive access management across data and infrastructure.",
  keywords: ["QueryPie ACP", "Access Control Platform", "ACP", "access control"],
} as const;

const featureItems = [
  {
    body: [
      "QueryPie DAC is crafted for data protection in the cloud era, seamlessly connecting various cloud ecosystems.",
      "It automatically identifies sensitive data and personal information, ensuring robust security for your assets.",
    ],
    imageAlt: "Database access control preview",
    title: ["DAC -", "Database Access Control"],
    videoSrc: "/solutions/acp/acp-dac.mp4",
  },
  {
    body: [
      "QueryPie SAC is designed for cloud instance protection on AWS, GCP, and Azure, while also supporting on-premises environments.",
      "It enables administrators to monitor user commands and replay sessions, enhancing security and oversight.",
    ],
    imageAlt: "System access control preview",
    reverse: true,
    title: ["SAC -", "System Access Control"],
    videoSrc: "/solutions/acp/acp-sac.mp4",
  },
  {
    body: [
      "QueryPie KAC is a solution for Kubernetes API protection, enabling centralized management of cloud infrastructures like AWS EKS and on-premises clusters.",
      "Administrators can manage access, monitor API requests, and replay container command executions.",
    ],
    imageAlt: "Kubernetes access control preview",
    title: ["KAC -", "Kubernetes Access Control"],
    videoSrc: "/solutions/acp/acp-kac.mp4",
  },
  {
    body: [
      "QueryPie WAC secures access and logs activities for web applications, including admin portals and SaaS platforms.",
      "It captures logs and screenshots, masks sensitive data, and controls actions like file transfers.",
    ],
    imageAlt: "Web access control preview",
    reverse: true,
    title: ["WAC -", "Web Access Control"],
    videoSrc: "/solutions/acp/acp-wac.mp4",
  },
  {
    body: [
      "Real-time risk detection, policy-based permissions, and sensitive data masking — all in one unified gateway.",
      "Beyond blocking: intelligent access that adapts to context and compliance.",
    ],
    imageAlt: "Managed access control preview",
    title: ["MAC -", "MCP Access Controller"],
    videoSrc: "/solutions/acp/acp-mac.mp4",
  },
];

export default function AcpENSolutionContent({ locale }: Props) {
  return (
    <div className={`flex w-full flex-col ${pageSectionGapClassName} ${pageXPaddingClassName} pb-10`}>
      <div className="flex flex-col gap-14 md:gap-20">
        <div>
          <section className="flex w-full justify-center">
            <header className="grid w-full max-w-[1200px] gap-4 sm:gap-5 md:grid-cols-2 md:gap-[30px]">
              <h1 className="m-0 type-h1 text-fg">Access Control Platform</h1>
              <p className="m-0 max-w-[720px] type-body-lg leading-relaxed text-fg">
                QueryPie ACP centralizes access control for databases, systems, Kubernetes, and web
                applications, helping teams grant least-privilege access, monitor privileged activity,
                and maintain audit-ready governance across complex enterprise environments.
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
