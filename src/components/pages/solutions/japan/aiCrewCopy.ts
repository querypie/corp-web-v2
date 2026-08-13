import type { Locale } from "@/constants/i18n";

const shared = {
  platformKicker: "Secure Enterprise AI",
  platformTitle: "QueryPie AIP",
} as const;

export const aiCrewCopy = {
  en: {
    ...shared,
    metadata: {
      title: "Do less busywork. Create more impact. | AI Crew",
      description: "Delegate research, data organization, drafting, and other preparation work to AI to improve productivity and profitability.",
      keywords: ["AI Crew", "work automation", "AI agent", "QueryPie AIP"],
    },
    hero: {
      title: ["Move beyond AI tools.", "Work with an AI Crew."],
      descriptions: [
        "We believe AI should be more than a convenient tool. It should join your team as a new colleague.",
        "QueryPie AIP builds task-specific AI agents that understand your workflows and rules. As part of your AI Crew, they autonomously handle research, data organization, drafting, and other preparation so people can focus on judgment and creativity while the whole team accomplishes more.",
      ],
      primaryAction: "Discuss AI for your workflow",
      secondaryAction: "Explore use cases",
      imageAlt: "AI Crew sharing work as part of a team",
    },
    whitepaper: {
      badges: ["Executive guide", "AI transformation", "Japan market"],
      title: "Why Japanese Enterprises Are Accelerating Their AI Transformation Now",
      description: "A concise executive guide to Japan’s AI gap and a practical roadmap for turning AI into enterprise-wide productivity and growth.",
      action: "Download for free",
      imageAlt: "AI Transformation white paper",
    },
    beforeAfter: {
      titleLines: ["Let AI handle the preparation,", "so people can focus on judgment and creativity"],
      description: "Let AI handle pre-decision work so people can focus on what matters most.",
      beforeTitle: "Initial responses take too long",
      beforePoints: ["Scattered information makes research and verification slow", "Preparation crowds out the time needed for judgment"],
      afterTitle: "Clear roles let teams focus on their core work",
      decisionLabel: "Final decisions by people",
      humanLabel: "People",
      humanTasks: ["Final decisions", "Customer communication", "Proposals", "Planning", "Improvement"],
      crewLabel: "AI",
      crewTasks: ["Research", "Organization", "First drafts", "Analysis preparation", "Risk detection"],
    },
    introduction: {
      title: "Five steps to adoption, starting small with work that is easy to delegate",
      description: "We support the entire journey from problem discovery and pilot design to prototyping, production rollout, and continuous improvement.",
      action: "Discuss the rollout",
      steps: [
        ["01", "Workflow discovery", "Identify time-consuming work, fragmented data, and tasks to delegate, then locate where work is getting stuck."],
        ["02", "Use-case and test design", "Define the target team, data, integrations, expected outcomes, and success metrics, starting with work where impact is most likely."],
        ["03", "Prototype development", "Design the AI role, steps, reference data, and output format around the real workflow and build a hands-on prototype."],
        ["04", "PoC and evaluation", "Validate answer quality, time savings, and operational fit under conditions close to real work."],
        ["05", "Production and expansion", "Deploy proven workflows, then expand while strengthening integrations, permissions, and continuous improvement."],
      ],
    },
    platform: {
      title: "QueryPie AIP for secure AI operations",
      description: "An enterprise AI foundation that supports both the practical performance and governance of autonomous AI agents.",
      coreBody: "The core foundation for AI agent performance and governance",
      items: [
        { icon: "brain", label: "Brain", title: "Brain", tag: "Multi-LLM / Data protection", points: ["Use the best LLM for each type of work", "Internal input data is never used for external training"], position: "top" },
        { icon: "connect", label: "Connect", title: "Connect", tag: "Internal integration / Access control", points: ["Connect to internal systems under zero-trust principles and understand context", "Strict access control backed by QueryPie expertise"], position: "right" },
        { icon: "knowledge", label: "Knowledge", title: "Knowledge", tag: "Workflow reproduction / Grounding", points: ["Remember procedures and reduce hallucinations", "Reference trusted company data"], position: "bottom" },
        { icon: "shield", label: "Governance", title: "Governance", tag: "Audit logs / Human approval", points: ["Enterprise-grade audit logs", "Reduce shadow AI and data leakage risks"], position: "left" },
      ],
    },
    useCases: {
      title: "Start with the work carrying the heaviest load",
      description: "Begin where improvement will have the greatest impact, then design around your workflows and operating rules. Start small where results are easiest to see; below are representative use cases we discuss most often.",
      action: "Explore all use cases",
      items: [
        { id: "seo-analyst", imageSrc: "/demo/use-cases/aip-use-case-2.webp", tags: ["Marketing", "SEO"], title: "SEO analysis", body: "Support site analysis, prioritize improvements, and build dashboards that make the next action clear." },
        { id: "quotation-analyze-ai-agent", imageSrc: "/demo/use-cases/aip-use-case-1.webp", tags: ["Sales", "Quote analysis"], title: "Quote operations", body: "Analyze, compare, and prepare quotes while reducing time spent reviewing and transferring information." },
        { id: "dev-insight-ai-agent", imageSrc: "/demo/use-cases/aip-use-case-15.webp", tags: ["Engineering", "DevOps"], title: "Development insights", body: "Connect Git, PRs, tickets, CI/CD, and incidents to reveal status and risk through conversation." },
        { id: "data-analytics-agent", imageSrc: "/demo/use-cases/aip-use-case-6.webp", tags: ["Analytics", "Visualization"], title: "Data analysis", body: "Support data extraction, visualization, and insight development from natural-language questions." },
        { id: "work-collaboration-agent", imageSrc: "/demo/use-cases/aip-use-case-11.webp", tags: ["Collaboration", "Work automation"], title: "Work collaboration", body: "Connect Slack, Jira, and Confluence to automate routine coordination and keep information moving across teams." },
        { id: "security-audit-agent", imageSrc: "/demo/use-cases/aip-use-case-10.webp", tags: ["Security", "Audit"], title: "Security audit", body: "Investigate access patterns, detect anomalies, and generate compliance reports through natural-language requests." },
      ],
    },
    voices: {
      title: "Teams feel the speed of execution; leaders see the return on investment",
      items: [
        ["MK", "Marketing specialist", "B2B company", "It feels less like adding another AI tool and more like gaining a new colleague who supports real work."],
        ["CS", "Customer support lead", "SaaS operations team", "Initial responses to inquiries became dramatically faster, allowing the team to focus on difficult cases and proactive customer success work where their time matters most."],
        ["BD", "Business planning manager", "Growth-stage company", "Market data and meeting notes are organized before meetings, greatly reducing the preparation burden on analysts."],
        ["OP", "Operations lead", "Business support organization", "Rather than changing everything at once, we started small with a single workflow, which made adoption smooth for the frontline team."],
      ],
    },
    pricing: {
      title: "Credits based on work volume, not fixed fees",
      description: "Pricing is based on how much work AI supports, not headcount. Start with the biggest bottleneck without a large upfront investment.",
      cards: [
        ["analysis", "Use only what you need", "Adjust usage around busy and quiet periods for a more efficient operation."],
        ["people", "Manage across departments", "Share credits across teams and keep rollout costs easy to understand."],
      ],
    },
    cta: { title: "Shall we identify the best workflow to start with?", description: "You do not need a perfectly defined use case. We can work with you from bottleneck discovery through PoC and production rollout.", action: "Discuss how to get started", secondaryAction: "View use cases" },
  },
  ko: {
    ...shared,
    metadata: {
      title: "작업은 줄이고, 성과는 높이다 | AI Crew",
      description: "조사, 데이터 정리, 초안 작성 같은 사전 업무를 AI에 맡겨 기업의 생산성과 수익성 향상을 지원합니다.",
      keywords: ["AI Crew", "업무 효율화", "AI 에이전트", "QueryPie AIP"],
    },
    hero: {
      title: ["AI를 도구가 아닌,", "함께 일하는 AI Crew로"],
      descriptions: [
        "AI를 단순한 편의 도구가 아니라 팀에 합류하는 ‘새로운 동료’로 맞이하는 것, 그것이 QueryPie AI의 생각입니다.",
        "QueryPie AIP는 기업의 업무 흐름과 규칙을 이해하는 업무별 AI 에이전트를 구축합니다. 현장의 AI Crew로서 정보 수집·데이터 정리·초안 작성 같은 사전 업무를 자율적으로 분담해, 사람은 판단과 창의에 집중하고 팀 전체는 더 높은 생산성과 성과를 만듭니다.",
      ],
      primaryAction: "우리 업무에 맞는 AI 활용 상담",
      secondaryAction: "활용 사례 보기",
      imageAlt: "AI Crew가 팀의 일원으로 업무를 분담하는 모습",
    },
    whitepaper: {
      badges: ["경영진 가이드", "AI 전환", "일본 시장"],
      title: "일본 기업이 지금 AI 전환을 가속화하는 이유",
      description: "일본의 AI 격차를 진단하고 AI를 기업 전체의 생산성과 성장으로 전환하기 위한 실용적인 로드맵을 제공합니다.",
      action: "무료 다운로드",
      imageAlt: "AI Transformation 백서",
    },
    beforeAfter: {
      titleLines: ["사전 업무는 AI에게 맡기고,", "사람은 판단과 창의에 집중합니다"],
      description: "판단 전 업무는 AI에게 맡기고, 사람은 본질적인 일에 집중합니다.",
      beforeTitle: "1차 대응에 시간이 걸린다",
      beforePoints: ["정보가 흩어져 조사와 확인에 시간이 걸린다.", "아래 준비가 많고 본래 판단에 시간을 사용할 수 없다"],
      afterTitle: "역할 분담이 정리되어 본래 업무에 집중합니다",
      decisionLabel: "사람에 의한 최종 판단",
      humanLabel: "사람",
      humanTasks: ["최종 판단", "고객 대응", "제안", "기획", "개선"],
      crewLabel: "AI",
      crewTasks: ["조사", "정리", "1차 초안", "분석 준비", "위험 감지"],
    },
    introduction: {
      title: "5단계로 도입하고, 맡기기 쉬운 업무부터 작게 시작합니다",
      description: "과제 정리, 테스트 도입, 프로토타입, 운영 배포, 개선까지 전 과정을 지원합니다.",
      action: "도입 방법 상담하기",
      steps: [
        ["01", "업무 과제 인터뷰", "시간이 오래 걸리는 업무, 흩어진 데이터, 맡기고 싶은 작업 범위를 정리해 병목 지점을 찾습니다."],
        ["02", "대상 업무 선정·테스트 설계", "대상 부서, 활용 데이터, 연동 대상, 기대 성과와 평가 지표를 정하고 효과가 큰 업무부터 시작합니다."],
        ["03", "프로토타입 구축", "업무 흐름에 맞춰 AI의 역할, 절차, 참조 데이터, 결과 형식을 설계하고 직접 사용할 수 있는 형태로 만듭니다."],
        ["04", "PoC 수행·평가", "실제 업무와 유사한 조건에서 답변 품질, 시간 절감, 운영 편의성을 검증합니다."],
        ["05", "운영 도입·확산", "효과가 검증된 업무부터 운영에 적용하고 시스템 연동과 권한을 정비하며 범위를 확대합니다."],
      ],
    },
    platform: {
      title: "안전한 실무 AI 활용을 지원하는 QueryPie AIP",
      description: "자율형 AI 에이전트의 실무 성능과 거버넌스를 함께 지원하는 엔터프라이즈 AI 기반입니다.",
      coreBody: "AI 에이전트의 실무 성능과 거버넌스를 지원하는 핵심 기반",
      items: [
        { icon: "brain", label: "두뇌", title: "Brain", tag: "멀티 LLM / 데이터 보호", points: ["업무 특성에 따라 최적의 LLM을 구분해 사용", "입력한 사내 데이터는 외부 학습에 사용하지 않음"], position: "top" },
        { icon: "connect", label: "연결", title: "Connect", tag: "사내 연동 / 접근 제어", points: ["제로 트러스트 기준으로 사내 시스템과 연결해 맥락 이해", "QueryPie의 엄격한 접근 제어"], position: "right" },
        { icon: "knowledge", label: "업무 지식", title: "Knowledge", tag: "업무 재현 / 사실 참조", points: ["업무 절차를 기억해 할루시네이션 억제", "신뢰할 수 있는 사내 데이터 참조"], position: "bottom" },
        { icon: "shield", label: "통제", title: "Governance", tag: "감사 로그 / 사람의 승인", points: ["엔터프라이즈 수준의 감사 로그", "섀도 AI와 정보 유출 위험 감소"], position: "left" },
      ],
    },
    useCases: {
      title: "가장 부담이 큰 업무부터 시작합니다",
      description: "효과를 확인하기 쉬운 영역부터 작게 시작할 수 있으며, 아래는 실제 상담이 많은 대표 유즈케이스입니다.",
      action: "모든 활용 사례 보기",
      items: [
        { id: "seo-analyst", imageSrc: "/demo/use-cases/aip-use-case-2.webp", tags: ["마케팅", "SEO"], title: "SEO 분석", body: "사이트 분석, 개선 항목 정리, 대시보드 구성을 지원해 다음 실행 과제를 명확하게 합니다." },
        { id: "quotation-analyze-ai-agent", imageSrc: "/demo/use-cases/aip-use-case-1.webp", tags: ["견적·영업", "견적 분석"], title: "견적 업무", body: "견적서 분석, 비교, 작성을 지원해 확인과 정보 입력에 드는 시간을 줄입니다." },
        { id: "dev-insight-ai-agent", imageSrc: "/demo/use-cases/aip-use-case-15.webp", tags: ["개발", "DevOps"], title: "개발 인사이트", body: "Git, PR, 티켓, CI/CD, 인시던트를 연결해 상황과 위험을 대화형으로 보여줍니다." },
        { id: "data-analytics-agent", imageSrc: "/demo/use-cases/aip-use-case-6.webp", tags: ["분석·경영", "데이터 시각화"], title: "데이터 분석", body: "자연어 질문을 바탕으로 데이터 추출, 시각화, 인사이트 정리까지 지원합니다." },
        { id: "work-collaboration-agent", imageSrc: "/demo/use-cases/aip-use-case-11.webp", tags: ["협업", "업무 자동화"], title: "업무 협업", body: "Slack, Jira, Confluence를 연결해 반복적인 협업 업무와 부서 간 정보 공유를 자동화합니다." },
        { id: "security-audit-agent", imageSrc: "/demo/use-cases/aip-use-case-10.webp", tags: ["보안", "감사"], title: "보안 감사", body: "자연어 요청으로 접근 패턴을 조사하고 이상 징후를 탐지하며 컴플라이언스 보고서를 생성합니다." },
      ],
    },
    voices: {
      title: "현장은 업무 속도를, 경영진은 투자 효과를 체감합니다",
      items: [
        ["MK", "마케팅 담당자", "B2B 사업 기업", "AI 도구를 하나 더 추가한 느낌이 아니라 실무를 지원하는 새로운 동료가 생긴 느낌입니다."],
        ["CS", "고객지원 책임자", "SaaS 운영팀", "문의 대응의 초기 대응이 압도적으로 빨라져 담당자가 정말 시간을 써야 하는 난도 높은 문제와 선제적인 고객 성공 업무에 집중할 수 있게 됐습니다."],
        ["BD", "사업기획 매니저", "성장 단계 기업", "회의 전에 시장 데이터와 회의록이 정리되어 분석 담당자의 준비 부담이 크게 줄었습니다."],
        ["OP", "운영 총괄", "업무 지원 조직", "처음부터 크게 바꾸지 않고 우선 이 한 가지 업무만 작게 시작할 수 있어 현장 도입도 순조로웠습니다."],
      ],
    },
    pricing: {
      title: "고정비가 아닌 업무량 기반 크레딧 방식",
      description: "인원수가 아니라 AI가 지원한 업무량을 기준으로 비용을 설계합니다. 큰 초기 비용 없이 가장 큰 병목 업무부터 시작할 수 있습니다.",
      cards: [
        ["analysis", "필요한 만큼 사용", "성수기와 비수기에 맞춰 사용량을 조정해 낭비를 줄일 수 있습니다."],
        ["people", "부서 통합 관리", "여러 부서가 공통 크레딧을 사용하고 확산 비용을 쉽게 파악할 수 있습니다."],
      ],
    },
    cta: { title: "어떤 업무부터 시작할지 함께 정리해 볼까요?", description: "대상 업무가 명확하지 않아도 괜찮습니다. 병목 정리부터 PoC, 운영 배포까지 함께합니다.", action: "도입 방법 상담하기", secondaryAction: "활용 사례 보기" },
  },
} as const;

export type AiCrewLocale = keyof typeof aiCrewCopy;

export function getAiCrewCopy(locale: Locale) {
  return locale === "ja" ? null : aiCrewCopy[locale];
}
