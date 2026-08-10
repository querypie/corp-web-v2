import { pageSectionGapClassName, pageXPaddingClassName } from "@/constants/layout";
import Hero from "@/components/pages/solutions/aip/Hero";
import Cta from "@/components/sections/Cta";
import FeatureMediaList from "@/components/sections/FeatureMediaList";
import type { Locale } from "@/constants/i18n";

type Props = {
  locale: Locale;
  searchParams?: { category?: string };
};

export const metadata = {
  title: "MCP Gateway",
  description:
    "AI 에이전트를 엔터프라이즈 도구와 데이터에 연결하는 거버넌스형 MCP 게이트웨이입니다.",
  keywords: ["MCP Gateway", "Model Context Protocol", "AI governance"],
} as const;

const featureItems = [
  {
    title: ["스마트 엣지 터널링"],
    body: [
      "보안 터널링 기술로 내부 시스템에 접근합니다. 방화벽으로 보호된 리소스를 기존 보안 인프라 변경 없이 연결합니다.",
    ],
    imageAlt: "스마트 엣지 터널링 미리보기",
    imageClassName: "h-auto w-full md:h-[400px] md:w-auto",
    imageSrc: "/assets/products/aip/mcp-gateway/aip_function_tunneling.gif",
    mediaClassName: "aspect-auto h-auto w-full md:h-[400px] md:w-fit md:max-w-full lg:w-fit lg:max-w-none",
  },
  {
    title: ["간편한 MCP 프록시 접근"],
    body: [
      "보안 로컬 MCP 프록시를 통해 외부 도구에서 MCP 프리셋을 사용합니다. 커스텀 프리셋을 Cursor IDE, Claude Desktop, Windsurf에서 직접 연결해 사용할 수 있습니다.",
    ],
    imageAlt: "MCP 프록시 접근 미리보기",
    imageClassName: "h-auto w-full md:h-[400px] md:w-auto",
    imageSrc: "/assets/products/aip/mcp-gateway/aip_function_mcpproxy.gif",
    mediaClassName: "aspect-auto h-auto w-full md:h-[400px] md:w-fit md:max-w-full lg:w-fit lg:max-w-none",
    reverse: true,
  },
  {
    title: ["조직 단위 MCP 관리"],
    body: [
      "세분화된 권한으로 사용자가 접근할 수 있는 MCP 도구를 제어합니다. AI 도구 사용의 활성화, 비활성화, 거버넌스를 조직 전체에서 중앙 관리합니다.",
    ],
    imageAlt: "조직 단위 MCP 관리 미리보기",
    imageClassName: "h-auto w-full md:h-[400px] md:w-auto",
    imageSrc: "/assets/products/aip/mcp-gateway/aip_function_mcpmanagement.gif",
    mediaClassName: "aspect-auto h-auto w-full md:h-[400px] md:w-fit md:max-w-full lg:w-fit lg:max-w-none",
  },
  {
    title: ["감사 로깅"],
    body: [
      "조직 전반의 모든 이벤트를 완전한 가시성으로 추적합니다. 사용자 활동과 시스템 변경을 모니터링해 보안과 컴플라이언스 요구를 지원합니다.",
    ],
    imageAlt: "감사 로그 미리보기",
    imageClassName: "h-auto w-full md:h-[400px] md:w-auto",
    imageSrc: "/assets/products/aip/mcp-gateway/aip_function_audit.gif",
    mediaClassName: "aspect-auto h-auto w-full md:h-[400px] md:w-fit md:max-w-full lg:w-fit lg:max-w-none",
    reverse: true,
  },
  {
    title: ["데이터 손실 방지 (DLP)"],
    body: [
      "민감 정보가 AI 대화로 유입되는 것을 자동으로 차단합니다. 신용카드, SSN, API 키와 기밀 정보 노출을 즉시 방지합니다.",
    ],
    imageAlt: "데이터 손실 방지 미리보기",
    imageClassName: "h-auto w-full md:h-[400px] md:w-auto",
    imageSrc: "/assets/products/aip/mcp-gateway/aip_function_dlp.gif",
    mediaClassName: "aspect-auto h-auto w-full md:h-[400px] md:w-fit md:max-w-full lg:w-fit lg:max-w-none",
  },
];

export default function McpGatewayKOSolutionContent({ locale }: Props) {
  return (
    <div className={`flex w-full flex-col ${pageSectionGapClassName} ${pageXPaddingClassName}`}>
      <div className="flex w-full flex-col gap-10 md:gap-[80px]">
        <section className="flex w-full justify-center">
          <header className="grid w-full max-w-[1200px] gap-4 sm:gap-5 md:grid-cols-2 md:gap-[30px]">
            <div>
              <h1 className="m-0 text-pretty type-h1 text-fg">
                모든 것을 연결하는
                <br className="hidden md:block" /> MCP 허브
              </h1>
            </div>
            <p className="m-0 max-w-[720px] text-pretty type-body-lg leading-relaxed text-fg">
              모든 MCP 서버와 도구를 하나의 플랫폼에서 중앙 관리합니다. 분산도, 복잡성도, 한계도
              줄이고 기술 스택 전반의 AI 워크플로우를 간소화합니다.
            </p>
          </header>
        </section>
        <Hero
          imageAlt="MCP Gateway 제품 미리보기"
          imageSrc="/assets/products/aip/mcp-gateway/mcp-gateway.png"
        />
      </div>

      <FeatureMediaList items={featureItems} />

      <div>
        <Cta locale={locale} />
      </div>
    </div>
  );
}
