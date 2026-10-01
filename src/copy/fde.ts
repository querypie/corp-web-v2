import type { Locale } from "@/constants/i18n";

type Detail = { title: string; body: string };
type Section = { title: string; description: string };

export type FdeCopy = {
  metadata: { title: string; description: string; keywords: readonly string[] };
  hero: { title: readonly [string, string]; description: string; imageAlt: string };
  discovery: Section & {
    cards: readonly Detail[];
  };
  planning: Section & { steps: readonly (Detail & { output: string })[] };
  building: Section & {
    inputs: readonly Detail[];
    agent: Detail;
    outputs: readonly Detail[];
    foundation: Detail;
    examplesLabel: string;
    examples: readonly Detail[];
  };
  operations: Section & {
    checklistTitle: string;
    checklist: readonly Detail[];
    cycleTitle: string;
    cycle: readonly Detail[];
    feedback: Detail;
  };
};

const keywords = ["FDE Services", "Forward Deployed Engineers", "AI agents"] as const;

// Editorial sources: resources/blogs/cnt_000215, AI Crew, AI Dashi and Local LLM.
// Keep this page independent of CMS content and its image lifecycle.
export const fdeCopy: Record<Locale, FdeCopy> = {
  ko: {
    metadata: {
      title: "FDE 서비스",
      description: "전담 엔지니어(FDE)가 업무 흐름을 발굴하고 맞춤형 AI 에이전트를 구축해 AI를 실질적 성과로 전환합니다.",
      keywords,
    },
    hero: {
      title: ["AI 전환 전문가가 함께하는", "FDE 서비스"],
      description: "조직에 밀착한 전담 엔지니어(FDE)가 전략 수립, 개발, 운영까지 AI 전환 전 과정을 지원해 AI 이니셔티브가 실제 성과로 이어지도록 돕습니다.",
      imageAlt: "고객 현장에서 업무 흐름을 살펴보며 협업하는 FDE 엔지니어",
    },
    discovery: {
      title: "문제 발굴",
      description: "AI 도입의 출발점은 현장에 있습니다.\n담당자와 함께 업무 흐름, 데이터, 조직의 제약을 살펴보고 실제로 해결해야 할 문제를 정의합니다.",
      cards: [
        { title: "업무의 병목을 발견", body: "현장 인터뷰와 업무 관찰을 통해 반복 작업, 정보 탐색, 복잡한 승인 과정에서 시간과 비용이 소모되는 지점을 찾습니다." },
        { title: "데이터와 시스템을 연결", body: "흩어진 사내 문서, 데이터베이스, SaaS를 살펴보고 데이터 품질과 연동 가능성, 접근 권한을 확인합니다." },
        { title: "성과를 기준으로 우선순위 설정", body: "처리 시간, 답변 품질, 수작업 부담처럼 현장에서 확인할 수 있는 지표를 정하고 효과와 실현 가능성을 함께 평가합니다." },
      ],
    },
    planning: {
      title: "계획 수립",
      description: "비즈니스 목표를 실행 가능한 설계로 바꿉니다.\n작은 범위에서 검증하되, 처음부터 본 운영에 필요한 연결과 통제를 함께 계획합니다.",
      steps: [
        { title: "목표와 범위 합의", body: "대상 부서와 업무를 정하고 AI가 맡을 작업, 사람이 판단할 지점, 성공을 평가할 기준을 구체화합니다.", output: "우선 과제 · 평가 지표" },
        { title: "데이터·보안 설계", body: "참조 데이터와 연동 시스템을 정하고 모델, RAG, MCP 구성 및 인증·권한·승인 요건을 설계합니다.", output: "연동 구조 · 접근 정책" },
        { title: "프로토타입 검증", body: "실제 업무 데이터를 사용하는 시제품을 만들고 현장 담당자와 답변 품질, 실행 결과, 사용성을 확인합니다.", output: "시제품 · 검증 결과" },
        { title: "본 운영 전환 계획", body: "배포 환경, 운영 담당자, 장애 대응과 사용자 교육을 정리하고 검증된 업무부터 단계적으로 확장합니다.", output: "배포 계획 · 운영 절차" },
      ],
    },
    building: {
      title: "맞춤형 AI 에이전트 구축",
      description: "업무 맥락을 이해하고 실제로 일을 수행하는 에이전트를 만듭니다.\nQueryPie AIP를 기반으로 사내 지식, 모델, 도구를 업무 흐름에 맞게 연결합니다.",
      inputs: [
        { title: "사내 지식 · RAG", body: "업무 문서, 매뉴얼, 데이터베이스에서 필요한 근거를 검색합니다." },
        { title: "업무에 맞는 LLM", body: "요건에 맞춰 모델을 선택하고, 필요하면 Local LLM을 연계합니다." },
      ],
      agent: { title: "맞춤형 AI 에이전트", body: "역할과 작업 순서, 판단 기준을 업무 단위의 워크플로로 구현" },
      outputs: [
        { title: "MCP · API 연동", body: "기존 SaaS와 업무 시스템의 데이터를 조회하고 필요한 작업을 실행합니다." },
        { title: "사람의 확인 · 승인", body: "중요한 판단과 변경은 담당자가 검토하도록 승인 지점을 설계합니다." },
      ],
      foundation: { title: "권한 · 실행 통제 · 감사 추적", body: "데이터 접근과 도구 실행 범위를 정하고, 누가 무엇을 실행했는지 확인할 수 있도록 구성합니다." },
      examplesLabel: "업무에 맞춰 구현하는 활용 예시",
      examples: [
        { title: "사내 지식 검색", body: "흩어진 문서에서 근거를 찾고, 담당자가 검토할 답변 초안을 준비합니다." },
        { title: "반복 업무 자동화", body: "견적 비교, 데이터 정리, 보고서 초안처럼 반복되는 준비 업무를 연결합니다." },
        { title: "서비스에 AI 적용", body: "기존 서비스의 데이터와 API를 연결해 사용자 경험 안에 AI 기능을 통합합니다." },
      ],
    },
    operations: {
      title: "작동하는 AI 구현",
      description: "PoC의 가능성을 현장의 성과로 이어갑니다.\n배포, 사용자 정착, 품질 개선까지 함께하며 실제 업무에서 지속적으로 쓰이는 AI를 만듭니다.",
      checklistTitle: "본 운영을 위한 준비",
      checklist: [
        { title: "안전한 배포", body: "고객 인프라에 맞춘 구성과 인증·인가, 접근 권한, 감사 로그를 점검합니다." },
        { title: "예외와 장애 대응", body: "실패한 작업의 처리 방식, 담당자 알림, 수동 전환 등 운영 절차를 정리합니다." },
        { title: "현장 정착", body: "사용자 교육과 운영 가이드를 마련하고, 실제 사용자의 피드백으로 업무 흐름을 다듬습니다." },
      ],
      cycleTitle: "운영하며 이어가는 개선",
      cycle: [
        { title: "관찰", body: "답변 품질, 처리 시간, 비용과 사용 현황을 확인합니다." },
        { title: "개선", body: "실패 사례와 피드백을 바탕으로 검색, 프롬프트, 실행 흐름을 조정합니다." },
        { title: "확장", body: "검증한 패턴을 재사용해 다른 업무와 부서로 적용 범위를 넓힙니다." },
      ],
      feedback: { title: "현장의 경험이 제품의 개선으로", body: "반복해서 발견되는 연동 요구와 사용성 문제를 제품팀에 전달해 재사용 가능한 기능과 템플릿으로 발전시킵니다." },
    },
  },
  en: {
    metadata: {
      title: "FDE Services",
      description: "Forward Deployed Engineers help identify business workflows, build tailored AI agents, and move AI from pilot to measurable value.",
      keywords,
    },
    hero: {
      title: ["AI Transformation Expert", "at Your Service"],
      description: "Forward Deployed Engineers (FDE) embedded in your organization deliver comprehensive AI transformation—from strategy and development to production operations, ensuring your AI initiatives succeed.",
      imageAlt: "An FDE engineer collaborating with a customer to understand their workflows",
    },
    discovery: {
      title: "Find Problems",
      description: "Start where the work happens. Together with your teams,\nwe examine workflows, data, and organizational constraints to define the problems worth solving.",
      cards: [
        { title: "Locate workflow bottlenecks", body: "Interviews and observation reveal where repetitive tasks, information searches, and complex approvals consume time and resources." },
        { title: "Map data and systems", body: "Review documents, databases, and SaaS tools to understand data quality, integration options, and access permissions." },
        { title: "Prioritize business outcomes", body: "Define practical measures such as turnaround time, answer quality, and manual effort, then assess impact alongside feasibility." },
      ],
    },
    planning: {
      title: "Make Plans",
      description: "Translate business goals into an actionable design. Validate a focused use case\nwhile planning the integrations and controls needed for production from the start.",
      steps: [
        { title: "Align goals and scope", body: "Choose the team and workflow, define what AI will handle, where people will decide, and how success will be evaluated.", output: "Priority use case · Success measures" },
        { title: "Design data and security", body: "Identify data and systems, then design the model, RAG, MCP connections, authentication, permissions, and approvals.", output: "Integration design · Access policies" },
        { title: "Validate a prototype", body: "Build with real business data and work with users to assess answer quality, execution results, and usability.", output: "Working prototype · Evaluation" },
        { title: "Plan production rollout", body: "Define deployment, operational ownership, incident response, and training, then expand from validated workflows.", output: "Rollout plan · Operating procedures" },
      ],
    },
    building: {
      title: "Build Custom AI Agents",
      description: "Build agents that understand business context and perform real tasks.\nWith QueryPie AIP, we connect company knowledge, models, and tools to your workflows.",
      inputs: [
        { title: "Company knowledge · RAG", body: "Retrieve relevant evidence from business documents, manuals, and databases." },
        { title: "The right LLM for the job", body: "Select models for your requirements and connect a Local LLM where needed." },
      ],
      agent: { title: "Custom AI agent", body: "Roles, task sequences, and decision rules built into business workflows" },
      outputs: [
        { title: "MCP · API integrations", body: "Query data and perform tasks through existing SaaS tools and business systems." },
        { title: "Human review · Approval", body: "Design checkpoints so responsible people review critical decisions and changes." },
      ],
      foundation: { title: "Permissions · Execution controls · Audit trails", body: "Define access and tool execution boundaries, with records that show who performed each action." },
      examplesLabel: "Examples tailored to your workflows",
      examples: [
        { title: "Internal knowledge search", body: "Find evidence across scattered documents and prepare draft answers for review." },
        { title: "Repetitive task automation", body: "Connect preparation work such as comparing quotations, organizing data, and drafting reports." },
        { title: "AI in your own service", body: "Connect existing service data and APIs to integrate AI into your user experience." },
      ],
    },
    operations: {
      title: "Make AI Work",
      description: "Turn a promising pilot into everyday value. We support deployment, adoption,\nand quality improvements so AI becomes a lasting part of the way your teams work.",
      checklistTitle: "Ready for production",
      checklist: [
        { title: "Secure deployment", body: "Review infrastructure configuration, authentication, authorization, access permissions, and audit logs." },
        { title: "Exception and incident handling", body: "Define procedures for failed tasks, owner notifications, and a handoff to manual operations." },
        { title: "User adoption", body: "Provide training and operating guides, then refine workflows with feedback from real users." },
      ],
      cycleTitle: "Improve through daily operation",
      cycle: [
        { title: "Observe", body: "Review answer quality, turnaround time, costs, and adoption." },
        { title: "Refine", body: "Use failures and feedback to adjust retrieval, prompts, and execution flows." },
        { title: "Expand", body: "Reuse validated patterns across more workflows and teams." },
      ],
      feedback: { title: "Field experience improves the product", body: "Recurring integration needs and usability issues feed back to the product team, helping shape reusable features and templates." },
    },
  },
  ja: {
    metadata: {
      title: "FDEサービス",
      description: "専任エンジニア（FDE）が業務フローを特定し、カスタムAIエージェントを構築してAIを成果へつなげます。",
      keywords,
    },
    hero: {
      title: ["AI変革の専門家が伴走する", "FDEサービス"],
      description: "組織に入り込む専任エンジニア（FDE）が、戦略、開発、本番運用までAI変革を 包括的に支援し、AI施策を確かな成果へつなげます。",
      imageAlt: "顧客の現場で業務フローを確認しながら協働するFDEエンジニア",
    },
    discovery: {
      title: "課題の発見",
      description: "AI導入の出発点は現場にあります。\n担当者とともに業務フロー、データ、組織の制約を確認し、本当に解くべき課題を定義します。",
      cards: [
        { title: "業務のボトルネックを発見", body: "ヒアリングと業務観察を通じて、反復作業、情報検索、複雑な承認のどこで時間やコストがかかっているかを見極めます。" },
        { title: "データとシステムを把握", body: "分散する社内文書、データベース、SaaSを確認し、データ品質、連携の可能性、アクセス権限を整理します。" },
        { title: "成果を軸に優先順位を設定", body: "処理時間、回答品質、手作業の負担など、現場で確認できる指標を定め、効果と実現可能性を評価します。" },
      ],
    },
    planning: {
      title: "計画の策定",
      description: "事業目標を実行可能な設計へ落とし込みます。\n小さな範囲で検証しながら、本番運用に必要な連携と統制を最初から計画します。",
      steps: [
        { title: "目標と範囲の合意", body: "対象部門と業務を選び、AIに任せる作業、人が判断する場面、成功を評価する基準を具体化します。", output: "優先課題・評価指標" },
        { title: "データ・セキュリティ設計", body: "参照データと連携先を定め、モデル、RAG、MCPの構成と認証・権限・承認要件を設計します。", output: "連携構成・アクセス方針" },
        { title: "プロトタイプの検証", body: "実際の業務データを使う試作版を構築し、担当者と回答品質、実行結果、使いやすさを確認します。", output: "試作版・検証結果" },
        { title: "本番移行の計画", body: "展開環境、運用担当者、障害対応、利用者教育を整理し、検証済みの業務から段階的に広げます。", output: "展開計画・運用手順" },
      ],
    },
    building: {
      title: "カスタムAIエージェント構築",
      description: "業務の文脈を理解し、実際に仕事を進めるエージェントを構築します。\nQueryPie AIPを基盤に、社内知識、モデル、ツールを業務フローに合わせて連携します。",
      inputs: [
        { title: "社内知識・RAG", body: "業務文書、マニュアル、データベースから必要な根拠を検索します。" },
        { title: "業務に合ったLLM", body: "要件に応じたモデルを選び、必要に応じてLocal LLMを連携します。" },
      ],
      agent: { title: "カスタムAIエージェント", body: "役割、作業手順、判断基準を業務単位のワークフローとして実装" },
      outputs: [
        { title: "MCP・API連携", body: "既存のSaaSや業務システムのデータを照会し、必要な作業を実行します。" },
        { title: "人による確認・承認", body: "重要な判断や変更は担当者が確認できるよう、承認ポイントを設計します。" },
      ],
      foundation: { title: "権限・実行統制・監査追跡", body: "データへのアクセスとツールの実行範囲を定め、誰が何を実行したか確認できる構成にします。" },
      examplesLabel: "業務に合わせた活用例",
      examples: [
        { title: "社内ナレッジ検索", body: "分散した文書から根拠を探し、担当者が確認する回答の下書きを準備します。" },
        { title: "反復業務の自動化", body: "見積比較、データ整理、レポートの下書きなど、繰り返す準備作業を連携します。" },
        { title: "自社サービスへのAI導入", body: "既存サービスのデータとAPIをつなぎ、ユーザー体験にAI機能を組み込みます。" },
      ],
    },
    operations: {
      title: "機能するAIの実現",
      description: "PoCで見えた可能性を、現場の成果につなげます。\n展開、利用者への定着、品質改善まで伴走し、実務で継続して使われるAIを実現します。",
      checklistTitle: "本番運用に向けた準備",
      checklist: [
        { title: "安全なデプロイ", body: "顧客インフラに合わせた構成、認証・認可、アクセス権限、監査ログを確認します。" },
        { title: "例外・障害への対応", body: "失敗した作業の扱い、担当者への通知、手動運用への切り替えなどの手順を整えます。" },
        { title: "現場への定着", body: "利用者教育と運用ガイドを用意し、実際のユーザーの声から業務フローを改善します。" },
      ],
      cycleTitle: "運用を通じた継続的な改善",
      cycle: [
        { title: "観察", body: "回答品質、処理時間、コスト、利用状況を確認します。" },
        { title: "改善", body: "失敗事例とフィードバックから、検索、プロンプト、実行フローを調整します。" },
        { title: "展開", body: "検証済みのパターンを再利用し、他の業務や部門へ広げます。" },
      ],
      feedback: { title: "現場の経験をプロダクトの進化へ", body: "共通する連携ニーズや使い勝手の課題を製品チームに還元し、再利用できる機能やテンプレートへと発展させます。" },
    },
  },
};
