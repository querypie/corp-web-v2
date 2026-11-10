import type { Locale } from "@/constants/i18n";

export const aiDashiCopy = {
  en: {
    metadata: {
      title: "Turn your service into an AI-powered SaaS, faster | AI Dashi",
      description: "Embed an enterprise-grade AI foundation into your SaaS or web service while preserving your brand experience.",
      keywords: ["AI Dashi", "embedded AI", "AI SaaS", "QueryPie AIP"],
    },
    hero: {
      title: ["Turn your service into", "an AI-powered SaaS", "faster"],
      description: [
        "If an AI-powered competitor appeared tomorrow, would customers keep choosing your service?",
        "As LLMs evolve, software value is shifting from SaaS operated manually through screens to SaaS where AI completes work autonomously.",
        "As newer services with embedded AI agents win market share through superior automation, delayed AI adoption is no longer a simple feature gap—it is a strategic risk tied directly to product obsolescence and customer churn.",
      ],
      action: "Get a free consultation and estimate",
      imageAlt: "AI Dashi embedded AI foundation",
    },
    concept: {
      title: "Why AI Dashi?",
      paragraphs: [
        "A good dashi stock does not overpower the main ingredients; it lifts the flavor of the entire dish.",
        "AI should play the same role in SaaS and web services. Rather than becoming the star, it must dramatically elevate the core product value you have built from behind the scenes.",
        "QueryPie AI’s AI Platform (AIP) blends completely into your UI and brand world. It is the highest-quality AI foundation—AI Dashi—designed to give users the ultimate experience: ‘This service just became incredibly convenient!’",
      ],
      imageAlt: "AI Dashi concept",
    },
    values: {
      title: "Three values delivered by QueryPie AIP",
      description: "Go beyond adding AI features to elevate product value and business growth at the same time.",
      items: [
        { icon: "spark", number: "01", title: "Establish competitive advantage", headline: "Seamlessly launch it as your own original feature", headlineAccent: "your own original feature", body: "Instead of attaching another company’s generic AI tool, embed AI deep behind your product. Preserve the brand experience while directly strengthening competitiveness and customer loyalty." },
        { icon: "layers", number: "02", title: "Optimize development resources", headline: "Avoid the technical debt of AI development and focus on your core business", headlineAccent: "technical debt", body: "QueryPie AIP handles fast-moving LLM updates and complex infrastructure maintenance. Reduce the cost and risk of building from scratch so engineers can devote their valuable time to core product development." },
        { icon: "analysis", number: "03", title: "Accelerate business growth", headline: "Maximize time to market and create new revenue streams", headlineAccent: "time to market", body: "Bring an enterprise-grade secure AI foundation that would take over a year to build from scratch to market in as little as one month. Accelerate upsells and the launch of new plans." },
      ],
    },
    risks: {
      title: "Three critical risks that block in-house AI development",
      description: "Calling an LLM API is easy. But when teams try to implement it as commercial-grade SaaS, many projects run into the following barriers and stall.",
      items: [
        { icon: "people", title: "Talent and technology scarcity", body: "Beyond the difficulty of hiring AI engineers, keeping pace with constantly evolving architectures consumes development resources and brings progress on the core business to a halt." },
        { icon: "document", title: "The data readiness quagmire", body: "Making AI accurately read proprietary databases through RAG requires enormous effort, and releases can be delayed indefinitely without reaching production-grade accuracy." },
        { icon: "layers", title: "Ballooning infrastructure maintenance", body: "After launch, model updates, prompt adjustments, infrastructure monitoring, and other unexpected maintenance costs continue to accumulate and squeeze margins." },
      ],
    },
    security: {
      title: "Connecting an LLM is not enough to sell to enterprise customers",
      description: "Even a working AI feature will be rejected during procurement unless it meets the rigorous security requirements of large enterprises. QueryPie AIP is an AI foundation designed to clear these requirements from the start.",
      items: [
        { icon: "people", title: "B2B-grade access control (RBAC)", body: "Implement granular API-based access control for organizational hierarchies and individual users to prevent the critical risk of data leakage." },
        { icon: "shield", title: "Guardrails against hallucinations", body: "Enforce factual answers based only on proprietary data and prevent AI falsehoods that are unacceptable in B2B operations." },
        { icon: "document", title: "Audit logs and compliance readiness", body: "An ISO/IEC 42001, SOC 2, and ISO 27001-level security foundation helps pass the rigorous security questionnaires and procurement reviews of enterprise customers." },
      ],
    },
    comparison: {
      title: "QueryPie AIP compared with in-house development",
      description: [
        "While competitors advance their AI transformation, spending more than six months on development means missing the market opportunity.",
        "With QueryPie AIP, you can launch your own AI service in as little as one month.",
      ],
      headers: ["", "Adopt QueryPie AIP", "In-house development"],
      headerDescriptions: ["", "Embedded AI foundation", "Full scratch"],
      recommended: "Recommended",
      note: "Time and cost estimates are based on standard implementations and may vary by requirements.",
      rows: [
        { label: "Development time", aip: ["As little as one month (API integration only)", "Ready for immediate market launch"], inHouse: ["Six months to over a year (continuous trial and error)", "Competitors move first and the market opportunity is lost"] },
        { label: "Initial infrastructure investment", aip: ["Zero upfront investment (no infrastructure required)", "Start small with usage-based pricing and pay only for what you use"], inHouse: ["Upfront investment in the tens of millions of yen", "Server and validation expenses become unrecoverable sunk costs"] },
        { label: "Securing specialist engineers", aip: ["QueryPie AI FDEs (specialist engineers) work alongside your team", "No specialized AI knowledge required"], inHouse: ["Hiring AI talent is essential (extremely difficult)", "Rising personnel costs can prevent hiring"] },
        { label: "Security", aip: ["Enterprise-grade foundation (ISO/IEC 42001, SOC 2, ISO 27001)", "Strict role-based access control (RBAC) included"], inHouse: ["Build a zero-trust architecture from scratch", "Critical data-leakage risk and endless certification effort"] },
        { label: "Hallucination safeguards", aip: ["Fact-only answers with enterprise RAG", "Built-in guardrails support reliable B2B use"], inHouse: ["Insufficient accuracy prevents production release", "Connecting proprietary data and LLMs, including chunking, becomes a quagmire"] },
        { label: "Operations and maintenance", aip: ["24/7/365 infrastructure monitoring and continuous updates", "Offload LLM evolution and operations to focus on the core business"], inHouse: ["Internal engineers are consumed by operations and maintenance", "Prompt tuning and infrastructure management halt progress on the core business"] },
      ],
    },
    valueVisual: {
      title: "Bring your brand, AI foundation, and specialist support together",
      description: "When competitors are moving quickly on AI, a long development cycle means losing the market window. QueryPie AIP helps you launch a reliable AI service under your own brand, faster.",
      badges: ["Your Service UI", "QueryPie AIP", "FDE Guided Launch"],
      imageAlt: "Three values provided by AI Dashi",
    },
    support: {
      title: "Comprehensive support from QueryPie AI",
      description: "More than a tool, we provide everything needed to launch and reliably operate an AI service under your own brand.",
      items: [
        { icon: "layers", title: "A fully customizable AI foundation", subtitle: "The core system for the fastest path to market", points: ["UI and UX tailored to your brand", "High-performance AI agent foundation", "API integration with existing services and databases", "A development environment ready to launch in as little as 1–3 months"] },
        { icon: "people", title: "Development support from specialists", subtitle: "Co-create the right AI alongside your team", points: ["FDE participation from requirements definition", "Design that combines domain expertise with AI knowledge", "Initial setup and technical training", "Continuous support through launch"] },
        { icon: "shield", title: "Continuous infrastructure and operations", subtitle: "Offload platform management after release", points: ["Secure, highly available AI infrastructure", "Continuous monitoring and incident response", "Updates to the latest AI models", "Reduce operational work and focus on business growth"] },
      ],
    },
    rollout: {
      titleEyebrow: "The fastest path to market",
      title: "Do not miss the market opportunity—",
      titleAccent: "launch with unmatched speed",
      description: [
        "There is no need to build AI from scratch and waste time through trial and error.",
        "Our specialist engineers (FDEs) work with you end to end, from requirements definition to production launch, enabling a fast rollout ahead of the competition.",
      ],
      steps: [
        ["01", "1–2 weeks", "Discovery and requirements", "Review the business model, current systems, and desired AI capabilities, then define the optimal architecture and implementation approach."],
        ["02", "2–3 weeks", "Prototype", "Build a brand-aligned UI and UX with an initial AI model to validate real behavior and the customer experience."],
        ["03", "4–6 weeks", "Integration and testing", "Integrate existing services and databases through APIs, tune answer quality, and validate access control and security requirements."],
        ["04", "As little as 1–3 months", "Production launch and operations", "Launch for customers and continue improving with platform monitoring and ongoing FDE support."],
      ],
    },
    whitepaper: {
      badges: ["For product leaders", "SaaS strategy", "Embedded AI"],
      title: "The End of SaaS—or Its Evolution?",
      description: "Explore how AI agents are reshaping the SaaS business, the strategies SaaS companies should take, and the path toward becoming an AI-native company.",
      action: "Download for free",
      imageAlt: "The End of SaaS—or Its Evolution white paper",
    },
    cta: { title: "Shall we design the AI evolution of your service together?", description: "Talk to us about integration ideas, implementation scope, and estimates.", action: "Get a free consultation and estimate" },
  },
  ko: {
    metadata: {
      title: "자사 서비스를 AI SaaS로 가장 빠르게 진화시키다 | AI Dashi",
      description: "자사 SaaS와 웹 서비스에 엔터프라이즈급 AI 기반을 내장해 브랜드 경험을 유지하면서 AI 서비스로 진화시키세요.",
      keywords: ["AI Dashi", "임베디드 AI", "AI SaaS", "QueryPie AIP"],
    },
    hero: {
      title: ["자사 서비스를", "AI SaaS로", "가장 빠르게 진화시키다"],
      description: [
        "내일 AI를 탑재한 경쟁사가 등장한다면, 고객은 계속 우리 서비스를 선택할까요?",
        "LLM의 발전으로 소프트웨어의 가치 기준은 사람이 화면을 조작하는 SaaS에서 AI가 자율적으로 업무를 완결하는 SaaS로 이동하고 있습니다.",
        "AI 에이전트를 내장한 후발 서비스가 자동화 경험으로 시장을 가져가는 지금, AI 구현 지연은 단순한 기능 차이가 아니라 서비스 노후화와 고객 이탈로 직결되는 경영 위험입니다.",
      ],
      action: "무료 도입 상담·견적",
      imageAlt: "AI Dashi 임베디드 AI 기반",
    },
    concept: {
      title: "왜 AI Dashi인가요?",
      paragraphs: [
        "좋은 육수는 주재료를 방해하지 않으면서 요리 전체의 감칠맛을 끌어올립니다.",
        "SaaS와 웹 서비스의 AI도 마찬가지입니다. AI 자체가 주인공이 되는 것이 아니라 기업이 지금까지 쌓아 온 ‘제품의 핵심 가치’를 뒤에서 압도적으로 끌어올리는 존재여야 합니다.",
        "QueryPie AI가 제공하는 AI 플랫폼(AIP)은 기업의 UI와 브랜드 세계관에 완전히 녹아들어 사용자에게 ‘이 서비스, 정말 편리해졌다!’라는 최고의 경험을 제공하는 최고 품질의 AI 기반, AI Dashi입니다.",
      ],
      imageAlt: "AI Dashi 콘셉트",
    },
    values: {
      title: "QueryPie AIP가 제공하는 3가지 가치",
      description: "AI 기능을 덧붙이는 데 그치지 않고 제품 가치와 사업 성장을 함께 높입니다.",
      items: [
        { icon: "spark", number: "01", title: "경쟁 우위 확립", headline: "자사만의 고유 기능으로 자연스럽게 출시", headlineAccent: "자사만의 고유 기능", body: "타사의 범용 AI 도구를 외부에 붙이는 대신 자사 제품의 내부에 깊이 통합합니다. 브랜드 경험을 해치지 않으면서 직접적인 경쟁력과 고객 충성도를 높입니다." },
        { icon: "layers", number: "02", title: "개발 리소스 최적화", headline: "AI 개발의 기술 부채를 피하고 핵심 비즈니스에 집중", headlineAccent: "기술 부채를 피하고", body: "빠르게 변화하는 LLM 대응과 복잡한 인프라 유지보수는 모두 QueryPie AIP가 담당합니다. 처음부터 자체 개발하는 비용과 위험을 줄여 엔지니어가 소중한 시간을 본연의 제품 개발에 집중할 수 있습니다." },
        { icon: "analysis", number: "03", title: "사업 성장 가속", headline: "타임 투 마켓을 극대화해 새로운 수익원으로", headlineAccent: "타임 투 마켓", body: "처음부터 개발하면 1년 이상 걸리는 엔터프라이즈 수준의 안전한 AI 기반을 최단 1개월 만에 시장에 출시합니다. 업셀과 신규 요금제 출시를 가속합니다." },
      ],
    },
    risks: {
      title: "자체 AI 개발을 가로막는 3가지 치명적 위험",
      description: "LLM API를 호출하는 일은 간단하지만 이를 ‘상용 수준의 SaaS’로 구현하려 하면 많은 프로젝트가 다음과 같은 장벽에 부딪혀 좌초합니다.",
      items: [
        { icon: "people", title: "인재와 기술의 고갈", body: "AI 전문 엔지니어 채용난에 더해 빠르게 변화하는 최신 아키텍처를 따라가는 데 개발 리소스가 소진되어 본래 핵심 사업의 발전이 멈춥니다." },
        { icon: "document", title: "데이터 정비의 늪", body: "자사 데이터베이스를 AI가 정확히 읽도록 RAG를 구축하려면 막대한 공수가 필요하며, 실무 수준의 정확도에 도달하지 못한 채 출시가 무기한 연기될 수 있습니다." },
        { icon: "layers", title: "비대해지는 인프라 유지보수", body: "출시 후에도 모델 업데이트, 프롬프트 조정, 인프라 모니터링 등 예상하지 못한 유지보수 비용이 지속적으로 발생해 수익을 압박합니다." },
      ],
    },
    security: {
      title: "LLM 연결만으로는 엔터프라이즈 고객에게 판매할 수 없습니다",
      description: "AI 기능을 구현해도 대기업이 요구하는 엄격한 보안 요건을 충족하지 못하면 도입 심사에서 탈락합니다. QueryPie AIP는 이러한 요건을 미리 충족한 AI 기반입니다.",
      items: [
        { icon: "people", title: "B2B 기준의 권한 관리(RBAC)", body: "조직 계층과 사용자별 세밀한 접근 제어를 API로 구현해 정보 유출이라는 치명적인 위험을 방지합니다." },
        { icon: "shield", title: "할루시네이션 방지 가드레일", body: "자사 데이터에만 근거한 사실 기반 답변을 제공해 B2B 업무에서 절대 허용할 수 없는 ‘AI의 거짓말’을 방지합니다." },
        { icon: "document", title: "감사 로그와 컴플라이언스 대응", body: "ISO/IEC 42001, SOC 2, ISO 27001 수준의 보안 기반으로 엔터프라이즈 고객의 엄격한 보안 설문과 도입 심사를 통과할 수 있습니다." },
      ],
    },
    comparison: {
      title: "QueryPie AIP와 자체 개발 비교",
      description: [
        "경쟁사가 AI 전환을 추진하는 가운데 개발에 6개월 이상을 들이면 시장 기회를 놓칩니다.",
        "QueryPie AIP를 활용하면 최단 1개월 만에 자체 AI 서비스를 출시할 수 있습니다.",
      ],
      headers: ["", "QueryPie AIP 도입", "자체 개발"],
      headerDescriptions: ["", "임베디드 AI 기반", "풀스크래치"],
      recommended: "추천",
      note: "기간과 비용은 일반적인 도입 사례를 기준으로 한 예상치이며 요구사항에 따라 달라질 수 있습니다.",
      rows: [
        { label: "개발 기간", aip: ["최단 1개월(API 연동만 진행)", "즉시 시장 출시 가능"], inHouse: ["6개월~1년 이상(시행착오의 연속)", "경쟁사에 선점당해 시장 기회를 놓침"] },
        { label: "초기 인프라 투자", aip: ["초기 투자 0원(인프라 불필요)", "사용한 만큼만 과금해 작게 시작 가능"], inHouse: ["수천만 엔 규모의 선행 투자", "서버비와 검증 비용 등 회수할 수 없는 매몰 비용 발생"] },
        { label: "전문 엔지니어 확보", aip: ["QueryPie AI FDE(전문 엔지니어)가 밀착 지원", "AI 전문 지식 불필요"], inHouse: ["AI 인재 채용 필수(극도로 어려움)", "인건비 상승으로 채용이 진행되지 않을 위험"] },
        { label: "보안", aip: ["엔터프라이즈급 기반(ISO/IEC 42001/SOC 2/ISO 27001)", "엄격한 권한 관리(RBAC) 기본 제공"], inHouse: ["제로 트러스트 아키텍처를 처음부터 구축", "치명적인 정보 유출 위험과 끝없는 인증 획득 업무"] },
        { label: "할루시네이션 대응", aip: ["엔터프라이즈 RAG를 통한 사실 기반 답변", "내장된 가드레일로 B2B 업무에서도 안심하고 사용"], inHouse: ["정확도가 오르지 않아 운영 환경 출시 불가", "자사 데이터와 LLM 연동(청킹 등)이 난항에 빠짐"] },
        { label: "운영·유지보수", aip: ["24시간 365일 인프라 모니터링과 지속 업데이트", "LLM 발전 대응과 운영을 모두 위임하고 핵심 사업에 집중"], inHouse: ["자사 엔지니어가 운영·유지보수에 매달림", "프롬프트 조정과 인프라 관리로 핵심 사업의 발전이 멈춤"] },
      ],
    },
    valueVisual: {
      title: "브랜드, AI 기반, 전문 지원을 하나로",
      description: "경쟁사가 AI 전환을 추진하는 동안 개발에 오랜 시간이 걸리면 시장 기회를 놓칩니다. QueryPie AIP로 자사 브랜드의 AI 서비스를 빠르고 안정적으로 출시하세요.",
      badges: ["Your Service UI", "QueryPie AIP", "FDE Guided Launch"],
      imageAlt: "AI Dashi가 제공하는 3가지 가치",
    },
    support: {
      title: "QueryPie AI의 종합 지원 체계",
      description: "단순한 도구 제공을 넘어 자사 브랜드의 AI 서비스를 출시하고 안정적으로 운영하는 데 필요한 요소를 한 번에 제공합니다.",
      items: [
        { icon: "layers", title: "자유롭게 맞춤화하는 AI 기반", subtitle: "가장 빠른 시장 출시를 위한 핵심 시스템", points: ["브랜드에 맞춘 UI·UX", "고성능 AI 에이전트 기반", "기존 서비스·DB와 API 연동", "최단 1~3개월 내 출시 가능한 개발 환경"] },
        { icon: "people", title: "전문 엔지니어의 개발 지원", subtitle: "기업 팀과 함께 최적의 AI를 공동 설계", points: ["요구사항 정의부터 FDE 참여", "도메인 지식과 AI 전문성을 결합한 설계", "초기 설정과 기술 교육", "출시까지 이어지는 지속 지원"] },
        { icon: "shield", title: "지속적인 인프라·운영 관리", subtitle: "출시 후 기반 관리를 위임", points: ["안전하고 가용성 높은 AI 인프라", "지속적인 모니터링과 장애 대응", "최신 AI 모델 업데이트", "운영 부담을 줄이고 사업 성장에 집중"] },
      ],
    },
    rollout: {
      titleEyebrow: "가장 빠르게 시장으로",
      title: "시장 기회를 놓치지 않는,",
      titleAccent: "압도적인 도입 속도",
      description: [
        "AI를 처음부터 자체 개발하며 시행착오로 시간을 낭비할 필요가 없습니다.",
        "당사의 전문 엔지니어(FDE)가 요구사항 정의부터 본 서비스 공개까지 전 과정을 함께하며, 경쟁사보다 앞선 빠른 출시를 실현합니다.",
      ],
      steps: [
        ["01", "1~2주", "인터뷰·요구사항 정의", "비즈니스 모델, 기존 시스템, 구현할 AI 기능을 정리하고 최적의 아키텍처와 구현 방향을 수립합니다."],
        ["02", "2~3주", "프로토타입 제작", "브랜드에 맞춘 UI·UX와 초기 AI 모델을 구축해 실제 동작과 고객 경험을 확인합니다."],
        ["03", "4~6주", "통합 개발·테스트", "기존 서비스와 DB를 API로 연동하고 답변 품질, 권한 관리, 보안 요건을 검증합니다."],
        ["04", "최단 1~3개월", "운영 출시·운영 시작", "고객에게 공개한 뒤에도 기반 모니터링과 FDE의 지속적인 개선을 지원합니다."],
      ],
    },
    whitepaper: {
      badges: ["제품 책임자용", "SaaS 전략", "임베디드 AI"],
      title: "SaaS의 종말인가, 진화인가",
      description: "AI 에이전트가 SaaS 비즈니스에 미치는 영향과 SaaS 기업이 취해야 할 전략, AI Native 기업으로 전환하기 위한 관점을 정리했습니다.",
      action: "무료 다운로드",
      imageAlt: "SaaS의 종말인가, 진화인가 백서",
    },
    cta: { title: "자사 서비스의 AI 전환을 함께 설계해 볼까요?", description: "구체적인 연동 아이디어부터 구현 범위와 견적까지 편하게 상담해 주세요.", action: "무료 도입 상담·견적" },
  },
} as const;

export function getAiDashiCopy(locale: Locale) {
  return locale === "ja" ? null : aiDashiCopy[locale];
}
