import type { Locale } from "@/constants/i18n";
import { getSolutionHref } from "@/features/solutions/routes";
import TextButton from "@/components/ui/TextButton";

type ThreeCardProps = {
  locale: Locale;
};

const copy = {
  en: {
    title: "Enterprise AI That Actually Delivers",
    description:
      "AI automation that connects everything, costs less, and comes with expert deployment support.",
    learnMore: "Learn more",
    cards: [
      {
        id: "usage-based-llm",
        title: ["Usage-Based", "Enterprise AI"],
        description: [
          "Replace expensive ChatGPT subscriptions with cost-effective, usage-based enterprise LLM deployment that scales with your needs.",
          "Perfect for organizations seeking flexible, budget-friendly AI solutions with enterprise-grade security and compliance capabilities.",
        ],
      },
      {
        id: "mcp-gateway",
        title: ["Unified", "MCP Gateway"],
        description: [
          "Centrally manage, monitor, and integrate 45+ pre-built MCP tools and custom MCP servers through our comprehensive gateway platform.",
          "Streamline AI workflows across your entire tech stack with unified governance and seamless tool connectivity.",
        ],
      },
      {
        id: "fde-services",
        title: ["Forward Deployed", "Engineer (FDE) Service"],
        description: [
          "Complete AI transformation from strategy consulting to custom AI agent development through our expert team.",
          "Accelerate your AI journey with dedicated Forward Deployed Engineers (FDEs) who deliver tailored, production-ready solutions for your business.",
        ],
      },
    ],
  },
  ko: {
    title: "실제로 성과를 만드는 엔터프라이즈 AI",
    description: "모든 것을 연결하고 비용을 낮추며 전문가 배포 지원까지 제공하는 AI 자동화입니다.",
    learnMore: "자세히 보기",
    cards: [
      {
        id: "usage-based-llm",
        title: ["사용량 기반", "엔터프라이즈 AI"],
        description: [
          "고정형 ChatGPT 구독 비용을 사용량 기반 엔터프라이즈 LLM 배포로 대체해 필요한 만큼 유연하게 확장합니다.",
          "엔터프라이즈급 보안과 컴플라이언스를 갖춘 예산 친화적 AI 솔루션이 필요한 조직에 적합합니다.",
        ],
      },
      {
        id: "mcp-gateway",
        title: ["통합", "MCP Gateway"],
        description: [
          "45개 이상의 사전 구축 MCP 도구와 커스텀 MCP 서버를 하나의 게이트웨이에서 중앙 관리, 모니터링, 통합합니다.",
          "통합 거버넌스와 원활한 도구 연결로 전체 기술 스택의 AI 워크플로우를 간소화합니다.",
        ],
      },
      {
        id: "fde-services",
        title: ["Forward Deployed", "Engineer (FDE) Service"],
        description: [
          "전략 컨설팅부터 맞춤형 AI 에이전트 개발까지 전문가 팀을 통해 완전한 AI 전환을 지원합니다.",
          "전담 Forward Deployed Engineer가 비즈니스에 맞춘 프로덕션 준비 솔루션을 제공해 AI 여정을 가속합니다.",
        ],
      },
    ],
  },
  ja: {
    title: "成果につながるエンタープライズAI",
    description: "すべてをつなぎ、コストを抑え、専門家による導入支援まで提供するAI自動化です。",
    learnMore: "詳しく見る",
    cards: [
      {
        id: "usage-based-llm",
        title: ["使用量ベース", "エンタープライズAI"],
        description: [
          "高額な固定型ChatGPTサブスクリプションを、必要に応じて拡張できる使用量ベースのエンタープライズLLM導入に置き換えます。",
          "エンタープライズ級のセキュリティとコンプライアンスを備えた、柔軟で予算に合うAIソリューションを求める組織に最適です。",
        ],
      },
      {
        id: "mcp-gateway",
        title: ["統合", "MCP Gateway"],
        description: [
          "45以上の事前構築MCPツールとカスタムMCPサーバーを、包括的なゲートウェイで一元管理、監視、統合します。",
          "統合ガバナンスとシームレスなツール接続により、技術スタック全体のAIワークフローを効率化します。",
        ],
      },
      {
        id: "fde-services",
        title: ["Forward Deployed", "Engineer (FDE) Service"],
        description: [
          "戦略コンサルティングからカスタムAIエージェント開発まで、専門チームがAI変革を包括的に支援します。",
          "専任のForward Deployed Engineerが、事業に合わせた本番対応ソリューションを提供し、AI活用を加速します。",
        ],
      },
    ],
  },
} satisfies Record<Locale, {
  cards: Array<{
    description: string[];
    id: "usage-based-llm" | "mcp-gateway" | "fde-services";
    title: string[];
  }>;
  description: string;
  learnMore: string;
  title: string;
}>;

export default function ThreeCard({ locale }: ThreeCardProps) {
  const content = copy[locale];

  return (
    <section className="flex w-full justify-center bg-bg-deep px-5 py-14 md:px-10 md:py-[100px]">
      <div className="flex w-full max-w-[1200px] flex-col items-center gap-10">
        <header className="flex w-full flex-col items-center gap-5 text-center">
          <h2 className="m-0 w-full type-h1 font-normal tracking-[0] text-fg md:tracking-[-0.2px]">
            {content.title}
          </h2>
          <p className="m-0 w-full type-body-lg font-normal text-mute">
            {content.description}
          </p>
        </header>

        <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {content.cards.map((card) => (
            <article
              className="flex min-w-0 flex-col items-start gap-6 rounded-box bg-bg px-5 pb-8 pt-7 md:gap-10 md:px-7.5 md:pb-15 md:pt-10"
              key={card.title.join(" ")}
            >
              <h3 className="m-0 w-full type-h2 font-medium text-fg">
                {card.title.map((line) => (
                  <span className="block" key={line}>
                    {line}
                  </span>
                ))}
              </h3>
              <div className="w-full type-body-md font-normal text-mute">
                {card.description.map((line) => (
                  <p className="m-0" key={line}>
                    {line}
                  </p>
                ))}
              </div>
              <TextButton
                className="mt-auto font-normal"
                href={getSolutionHref(locale, card.id)}
              >
                {content.learnMore}
              </TextButton>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
