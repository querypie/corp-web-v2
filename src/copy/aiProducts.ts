import type { Locale } from "@/constants/i18n";
import { aiProductsJapaneseCopy, type AiProductCopy, type AiProductId } from "./aiProducts.ja";

const en: Record<AiProductId, AiProductCopy> = {
  "ai-gateway": {
    menuLabel: "AI Gateway (AIG)",
    metadata: { title: "AI Gateway | Secure enterprise AI connectivity | QueryPie AI", description: "Connect LLMs and MCP tools through one gateway. Manage access, model routing, usage costs, and audit logs across your organization." },
    hero: { eyebrow: "AI Gateway", title: "Every AI request.", accent: "One gateway.", description: ["Scattered API keys, unclear model usage and costs, and separate tool permissions make AI difficult to govern. AI Gateway sits between your agents and LLMs or MCP servers, bringing connectivity, control, and visibility together."], imageLabel: "AI Gateway architecture" },
    sections: [],
    cta: { title: "Start with AI Gateway", description: "Explore a deployment and operating model that fits your LLM and MCP usage, access policies, and cost management needs." },
  },
  qlm: {
    menuLabel: "QueryPie LLM | QLM",
    metadata: { title: "QLM | Enterprise LLM service | QueryPie AI", description: "An open-source-based LLM service selected and operated by QueryPie. A consistent enterprise AI experience as foundation models evolve." },
    hero: { eyebrow: "QueryPie LLM", title: "Enterprise AI,", accent: "powered by QLM.", description: ["QLM is an LLM service built on open-source models selected by QueryPie and refined for enterprise quality and operations.", "Starting with DeepSeek-based models, QLM is designed to adopt the most suitable foundation models over time while maintaining a consistent service experience."], imageLabel: "QLM service: model selection, evaluation, and enterprise delivery" },
    sections: [
      { title: "The value of QLM, beyond the foundation model", description: ["Your team does not need to manage every model selection and update.", "QueryPie evaluates, operates, and improves the service so you can focus on applying AI to your business."], cards: [
        { title: "Models selected by QueryPie", body: "We assess performance, licensing, and operational requirements to select open-source models suited to your use cases." },
        { title: "A consistent service", body: "As foundation models change, QLM maintains consistency across APIs, operations, and support." },
        { title: "Continuous quality improvement", body: "Evaluation and tuning based on real business scenarios help improve practical performance." },
      ] },
      { title: "Evaluate performance where it matters", description: ["QLM is evaluated against business scenarios as well as general benchmarks.", "Model performance, language understanding, and business-task benchmark results will be published progressively."], cards: [
        { title: "Business document understanding", body: "Evaluate how well the model follows instructions and understands long business documents to produce useful answers." },
        { title: "Task-specific benchmarks", body: "Compare performance on summarization, classification, extraction, and reasoning tasks that reflect your needs." },
        { title: "Quality in production", body: "Continuously assess stability, latency, and cost alongside response quality." },
      ] },
    ],
    cta: { title: "Put QLM to work for your business", description: "Discuss how QLM can support your current LLM usage and business requirements." },
  },
  qev: {
    menuLabel: "QueryPie Decision Model | QEV",
    metadata: { title: "QEV | AI for enterprise decisions | QueryPie AI", description: "QueryPie’s decision AI model identifies sensitive data with DLP and selects models with Auto Router to support secure AI operations." },
    hero: { eyebrow: "QueryPie Decision Model", title: "Before AI responds,", accent: "QEV decides.", description: ["QEV is QueryPie’s proprietary AI model that understands a request and makes decisions based on security policies and its purpose.", "Through DLP and Auto Router, it supports data protection and model routing in AI Gateway."], imageLabel: "QEV decision flow: request analysis, DLP, and model routing through AI Gateway" },
    sections: [
      { title: "Two decisions at the heart of AI operations", description: ["Generative AI produces answers. QEV analyzes requests to determine the next action.", "A decision layer before execution puts enterprise policies into practice."], cards: [
        { title: "DLP | Detect sensitive data", body: "Determine whether a request contains personal or confidential information and control whether it can be sent to an external LLM." },
        { title: "Auto Router | Select the model", body: "Choose an appropriate AI model based on the request, quality requirements, cost, and security constraints." },
        { title: "Decisions connected to AIG", body: "Send QEV’s decisions to AI Gateway to execute requests according to your organization’s policies." },
      ] },
      { title: "Better decisions through continuous evaluation", description: ["QEV uses evaluation scenarios close to enterprise data to improve detection accuracy and routing quality.", "Operational feedback informs model updates and strengthens decision reliability."], cards: [
        { title: "Context-aware detection", body: "Consider the data being protected and its business context to apply the appropriate level of protection." },
        { title: "Routing for each use case", body: "Assess a request’s complexity and purpose to balance quality with cost." },
        { title: "Auditable decisions", body: "Record decisions and applied policies so teams can review them later." },
      ] },
    ],
    cta: { title: "Automate AI decisions with QEV", description: "Define your DLP and model routing requirements and explore how QEV fits into AI Gateway." },
  },
};

const ko: Record<AiProductId, AiProductCopy> = {
  "ai-gateway": {
    menuLabel: "AI Gateway (AIG)",
    metadata: { title: "AI Gateway | 기업 AI 연결과 통합 관리 | QueryPie AI", description: "LLM과 MCP 도구를 하나의 게이트웨이로 연결하세요. 접근 권한, 모델 라우팅, 사용 비용, 감사 로그를 통합 관리합니다." },
    hero: { eyebrow: "AI Gateway", title: "모든 AI 요청을,", accent: "하나의 게이트웨이로.", description: ["흩어진 API 키, 파악하기 어려운 모델 사용량과 비용, 제각각 설정된 도구 권한. AI Gateway는 AI 에이전트와 LLM·MCP 사이에 공통 관리 지점을 두어 연결·제어·가시성을 하나로 통합합니다."], imageLabel: "AI Gateway 아키텍처" },
    sections: [],
    cta: { title: "AI Gateway로 시작하세요", description: "LLM·MCP 활용 현황과 접근 제어, 비용 관리 과제에 맞춰 도입 구성과 운영 방법을 제안합니다." },
  },
  qlm: {
    menuLabel: "QueryPie LLM | QLM",
    metadata: { title: "QLM | 기업을 위한 LLM 서비스 | QueryPie AI", description: "QueryPie가 선정하고 운영하는 오픈소스 기반 LLM 서비스. 기반 모델이 바뀌어도 일관된 기업 AI 경험을 제공합니다." },
    hero: { eyebrow: "QueryPie LLM", title: "기업의 LLM 활용,", accent: "QLM", accentAfter: "으로 최적화하세요.", description: ["QLM은 QueryPie가 오픈소스 모델을 선정하고, 기업 활용에 필요한 품질과 운영성을 높여 제공하는 LLM 서비스입니다.", "초기에는 DeepSeek 계열 모델을 활용하며, 앞으로 더 적합한 기반 모델로 유연하게 전환하면서도 QLM의 일관된 서비스 경험을 제공합니다."], imageLabel: "QLM 서비스 구성: 모델 선정, 평가, 기업 서비스 제공" },
    sections: [
      { title: "기반 모델을 넘어, QLM의 가치를 제공합니다", description: ["오픈소스 모델의 선정과 업데이트를 고객이 일일이 관리할 필요가 없습니다.", "QueryPie가 평가·운영·개선을 이어가며 기업이 안심하고 활용할 수 있는 LLM 서비스를 제공합니다."], cards: [
        { title: "QueryPie가 선정하는 모델", body: "성능, 라이선스, 운영성을 평가해 활용 목적에 적합한 오픈소스 모델을 채택합니다." },
        { title: "모델이 바뀌어도 일관된 서비스", body: "기반 모델이 바뀌더라도 QLM의 API·운영·지원 경험은 일관되게 유지합니다." },
        { title: "지속적인 품질 개선", body: "실제 업무 시나리오에 기반한 평가와 튜닝을 반복해 실용적인 성능을 높입니다." },
      ] },
      { title: "업무에 필요한 성능을 검증합니다", description: ["일반적인 벤치마크 점수와 함께 기업의 업무 시나리오를 기준으로 QLM을 평가합니다.", "모델 성능, 언어 이해, 업무별 벤치마크 결과를 단계적으로 공개할 예정입니다."], cards: [
        { title: "업무 문서 이해", body: "지시사항과 긴 업무 문서를 정확히 이해하고, 실무에 활용할 수 있는 답변을 제공하는지 평가합니다." },
        { title: "태스크별 벤치마크", body: "요약·분류·추출·추론 등 실제 활용 목적과 가까운 작업으로 성능을 비교합니다." },
        { title: "운영까지 고려한 평가", body: "답변 품질뿐 아니라 안정성·응답 속도·비용까지 지속적으로 검증합니다." },
      ] },
    ],
    cta: { title: "QLM을 우리 업무에 적용해 보세요", description: "현재 LLM 활용 현황과 업무 요건에 맞춰 QLM 활용 방안을 안내합니다." },
  },
  qev: {
    menuLabel: "QueryPie Decision Model | QEV",
    metadata: { title: "QEV | 기업 AI를 위한 의사결정 모델 | QueryPie AI", description: "QueryPie가 자체 개발한 의사결정 AI 모델. DLP로 민감정보를 판별하고 Auto Router로 적합한 모델을 선택합니다." },
    hero: { eyebrow: "QueryPie Decision Model", title: "AI가 답하기 전에,", accent: "QEV", accentAfter: "가 판단합니다.", description: ["QEV는 요청의 내용을 이해하고 보안 정책과 목적에 맞는 판단을 내리는 QueryPie 자체 AI 모델입니다.", "DLP와 Auto Router를 통해 AI Gateway의 안전한 데이터 보호와 모델 라우팅을 지원합니다."], imageLabel: "QEV 의사결정 흐름: 요청 분석, DLP 판별, AI Gateway 모델 라우팅" },
    sections: [
      { title: "기업의 AI 운영을 위한 두 가지 판단", description: ["생성형 AI가 답변을 만드는 동안, QEV는 요청을 분석해 다음 행동을 결정합니다.", "AI 실행 전의 판단 계층으로 기업 정책을 실제 운영에 반영합니다."], cards: [
        { title: "DLP | 민감정보 판별", body: "개인정보나 기밀정보가 포함되어 있는지 판단하고, 외부 LLM으로 전송할 수 있는지 제어합니다." },
        { title: "Auto Router | 모델 선택", body: "요청 내용, 품질 요건, 비용, 보안 조건에 따라 적합한 AI 모델을 선택합니다." },
        { title: "AIG와 연결되는 판단 기반", body: "QEV의 판단 결과를 AI Gateway에 전달해 기업별 정책에 맞는 처리를 실행합니다." },
      ] },
      { title: "지속적인 평가로 판단의 신뢰도를 높입니다", description: ["기업의 실제 데이터와 가까운 평가 시나리오로 탐지 정확도와 라우팅 품질을 개선합니다.", "운영 과정에서 쌓이는 피드백을 모델 업데이트에 반영합니다."], cards: [
        { title: "맥락을 고려한 민감정보 탐지", body: "보호 대상과 업무 맥락을 함께 고려해 필요한 수준의 보호를 적용합니다." },
        { title: "용도에 맞는 모델 배분", body: "질문의 난이도와 목적을 파악해 품질과 비용의 균형을 맞춥니다." },
        { title: "감사 가능한 판단", body: "판단 결과와 적용된 정책을 기록해 이후에도 근거를 확인할 수 있도록 지원합니다." },
      ] },
    ],
    cta: { title: "QEV로 AI의 판단을 안전하게 자동화하세요", description: "DLP와 모델 라우팅 요건을 정리하고 AI Gateway에 적용하는 방법을 제안합니다." },
  },
};

const placeholderCopy = {
  en: { description: "We’re preparing the details of this service.", visual: "Visual content coming soon", sections: ["Service overview", "Use cases"], cards: ["Content 01", "Content 02", "Content 03"], pending: "Content coming soon", cta: "CTA content coming soon" },
  ko: { description: "서비스 소개 내용을 준비하고 있습니다.", visual: "비주얼 준비 중", sections: ["서비스 소개", "활용 사례"], cards: ["콘텐츠 01", "콘텐츠 02", "콘텐츠 03"], pending: "콘텐츠 준비 중", cta: "CTA 문구 준비 중" },
  ja: { description: "サービスの紹介内容を準備しています。", visual: "ビジュアル準備中", sections: ["サービス紹介", "活用シーン"], cards: ["コンテンツ 01", "コンテンツ 02", "コンテンツ 03"], pending: "コンテンツ準備中", cta: "CTAコピー準備中" },
};

function modelPlaceholder(locale: Locale, id: "qlm" | "qev"): AiProductCopy {
  const text = placeholderCopy[locale];
  const name = id === "qlm" ? "QueryPie LLM" : "QueryPie Decision Model";
  const label = id.toUpperCase();
  return {
    menuLabel: `${name} | ${label}`,
    metadata: { title: `${label} | ${name} | QueryPie AI`, description: text.description },
    hero: { eyebrow: name, title: label, accent: name, description: [text.description], imageLabel: text.visual },
    sections: text.sections.map(title => ({ title, description: [text.description], cards: text.cards.map(title => ({ title, body: text.pending })) })),
    cta: { title: text.cta, description: text.pending },
  };
}

export const aiProductsCopy: Record<Locale, Record<AiProductId, AiProductCopy>> = {
  en: { "ai-gateway": en["ai-gateway"], qlm: modelPlaceholder("en", "qlm"), qev: modelPlaceholder("en", "qev") },
  ko: { "ai-gateway": ko["ai-gateway"], qlm: modelPlaceholder("ko", "qlm"), qev: modelPlaceholder("ko", "qev") },
  ja: { "ai-gateway": aiProductsJapaneseCopy["ai-gateway"], qlm: modelPlaceholder("ja", "qlm"), qev: modelPlaceholder("ja", "qev") },
};
export const aiProductAction = { en: "Talk to us", ko: "도입 문의", ja: "相談する" };
