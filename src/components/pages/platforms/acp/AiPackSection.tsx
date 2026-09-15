import type { Locale } from "@/constants/i18n";
import AiPackVideo from "./AiPackVideo";

type AiPackSectionProps = {
  locale: Locale;
};

const copy = {
  en: {
    title: "ACP - AI Pack",
    description: [
      "ACP AI Pack extends ACP’s access control, authorization, policy, and audit framework for AI Chat and AI Agents.",
      "It helps them safely perform tool calls, retrieve data, detect approval-bypass risks, and control abnormal behavior.",
    ],
    cards: [
      {
        description:
          "Users perform analysis, authorization, and audit tasks using natural language within QueryPie.",
        title: "AI Chat",
      },
      {
        description:
          "External agents, such as Claude, AIP, and internal agents, call QueryPie functions via the MCP tool.",
        title: "ACP MCP",
      },
      {
        description:
          "Automate repetitive security tasks, such as creating audit reports and organizing authorization change history.",
        title: "AI Skills",
      },
    ],
    imageAlt: "ACP AI Pack preview",
  },
  ko: {
    title: "ACP - AI Pack",
    description: [
      "ACP AI Pack은 ACP의 접근 제어, 권한, 정책, 감사 체계를 AI Chat과 AI Agent로 확장합니다.",
      "도구 호출, 데이터 조회, 승인 우회 리스크 감지, 이상 행위 제어를 안전하게 수행하도록 돕습니다.",
    ],
    cards: [
      {
        description:
          "사용자는 QueryPie 안에서 자연어로 분석, 권한 처리, 감사 업무를 수행합니다.",
        title: "AI Chat",
      },
      {
        description:
          "Claude, AIP, 내부 에이전트 같은 외부 에이전트가 MCP 도구를 통해 QueryPie 기능을 호출합니다.",
        title: "ACP MCP",
      },
      {
        description:
          "감사 리포트 생성, 권한 변경 이력 정리 같은 반복 보안 업무를 자동화합니다.",
        title: "AI Skills",
      },
    ],
    imageAlt: "ACP AI Pack 미리보기",
  },
  ja: {
    title: "ACP - AI Pack",
    description: [
      "ACP AI Packは、ACPのアクセス制御、認可、ポリシー、監査の枠組みをAI ChatとAI Agentへ拡張します。",
      "ツール呼び出し、データ取得、承認回避リスクの検知、異常行動の制御を安全に実行できるよう支援します。",
    ],
    cards: [
      {
        description:
          "ユーザーはQueryPie内で自然言語を使い、分析、認可、監査タスクを実行します。",
        title: "AI Chat",
      },
      {
        description:
          "Claude、AIP、社内エージェントなどの外部エージェントがMCPツールを通じてQueryPie機能を呼び出します。",
        title: "ACP MCP",
      },
      {
        description:
          "監査レポート作成や認可変更履歴の整理など、反復的なセキュリティタスクを自動化します。",
        title: "AI Skills",
      },
    ],
    imageAlt: "ACP AI Packプレビュー",
  },
} satisfies Record<Locale, {
  cards: Array<{
    description: string;
    title: string;
  }>;
  description: string[];
  imageAlt: string;
  title: string;
}>;

export default function AiPackSection({ locale }: AiPackSectionProps) {
  const content = copy[locale];

  return (
    <section className="flex w-full justify-center bg-bg-deep px-5 py-14 md:px-10 md:py-[100px]">
      <div className="flex w-full max-w-[1200px] flex-col items-start gap-10 md:gap-[60px]">
        <header className="flex w-full flex-col items-center gap-5 text-center">
          <h2 className="m-0 w-full type-h1 font-normal tracking-[0] text-fg md:tracking-[-0.2px]">
            {content.title}
          </h2>
          <p className="m-0 flex w-full flex-col text-pretty type-body-lg leading-[26px] text-mute">
            {content.description.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </p>
        </header>

        <div className="flex w-full flex-col-reverse gap-8 lg:flex-row-reverse lg:items-start lg:gap-[60px]">
          <div className="flex w-full min-w-0 flex-col gap-2.5 lg:flex-1">
            {content.cards.map((card) => (
              <article
                className="flex min-h-[138px] w-full flex-col items-start justify-start rounded-box bg-bg p-[30px]"
                key={card.title}
              >
                <div className="flex w-full flex-col gap-2.5">
                  <h3 className="m-0 w-full type-h3 font-medium tracking-[0] text-fg md:tracking-[-0.2px]">
                    {card.title}
                  </h3>
                  <p className="m-0 w-full type-body-md leading-[22px] text-mute">
                    {card.description}
                  </p>
                </div>
              </article>
            ))}
          </div>

          <div className="relative w-full overflow-hidden rounded-box lg:w-[790px] lg:max-w-[65%] lg:shrink-0">
            <AiPackVideo title={content.imageAlt} />
          </div>
        </div>
      </div>
    </section>
  );
}
