import Cta from "@/components/sections/Cta";
import FeatureSection from "@/components/sections/FeatureSection";
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
    title: ["Smart Edge", "Tunneling"],
    body: [
      "보안 터널링으로 내부 시스템에 접근합니다.",
      "방화벽으로 보호된 리소스를 기존 보안 인프라",
      "변경 없이 연결합니다.",
    ],
    imageAlt: "스마트 엣지 터널링 미리보기",
    imageSrc: "/images/home/features/feature-panel-a.png",
  },
  {
    title: ["Easy MCP", "Proxy Access"],
    body: [
      "보안 로컬 MCP 프록시를 통해 외부 도구에서",
      "MCP 프리셋을 사용할 수 있습니다.",
      "Cursor IDE, Claude Desktop, Windsurf와 연결됩니다.",
    ],
    imageAlt: "MCP 프록시 접근 미리보기",
    imageSrc: "/images/home/features/feature-panel-b.png",
    reverse: true,
  },
  {
    title: ["Org-Level MCP", "Management"],
    body: [
      "세분화된 권한으로 MCP 도구 접근을 제어합니다.",
      "활성화, 비활성화, 거버넌스를",
      "조직 단위에서 중앙 관리합니다.",
    ],
    imageAlt: "조직 단위 MCP 관리 미리보기",
    imageSrc: "/images/home/features/feature-panel-a.png",
  },
  {
    title: ["Audit", "Logging"],
    body: [
      "조직 전반의 모든 이벤트를 추적합니다.",
      "사용자 활동과 시스템 변경을 모니터링해",
      "보안과 컴플라이언스 요구를 지원합니다.",
    ],
    imageAlt: "감사 로그 미리보기",
    imageSrc: "/images/home/features/feature-panel-b.png",
    reverse: true,
  },
  {
    title: ["Data Loss", "Prevention"],
    body: [
      "민감 정보가 AI 대화로 유입되는 것을",
      "자동으로 차단합니다.",
      "API 키와 기밀 정보를 보호합니다.",
    ],
    imageAlt: "데이터 손실 방지 미리보기",
    imageSrc: "/images/home/features/feature-panel-a.png",
  },
];

export default function McpGatewayKOSolutionContent({ locale }: Props) {
  return (
    <div className="flex w-full flex-col gap-14 px-5 pb-10 md:gap-[160px] md:px-10">
      <section className="flex w-full justify-center">
        <header className="grid w-full max-w-[1200px] gap-4 sm:gap-5 md:grid-cols-2 md:gap-[30px]">
          <div>
            <h1 className="m-0 type-h1 text-fg">
              <span className="block">MCP Hub</span>
              <span className="block">That Connects Everything</span>
            </h1>
          </div>
          <p className="m-0 max-w-[720px] type-body-lg leading-relaxed text-fg">
            Single platform centrally managing all MCP servers and tools—no fragmentation, no
            complexity, no limits. Streamline AI workflows across your entire tech stack while we
            handle the complexity behind the scenes.
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
