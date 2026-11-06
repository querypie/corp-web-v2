import type { Locale } from "@/constants/i18n";
import { aiGatewayContentCopy } from "./aiGateway";
import { aiGatewayVisualCopy } from "./japanAiSolutions";

type Content = typeof aiGatewayContentCopy;
const en: Content = {
  challenges: { title: "AI operational challenges", description: "As AI usage grows, connections, API keys, and tool permissions become fragmented. Teams need a consistent way to manage usage, costs, and access.", items: [
    { title: "API keys everywhere", body: "Provider keys spread across applications and teams, making secure management difficult." },
    { title: "Inconsistent tool permissions", body: "Each agent has its own configuration. It becomes hard to know who can use which tools." },
    { title: "Costs visible only after use", body: "Understanding which team used which resources—and at what cost—takes extra effort." },
    { title: "Model changes mean reconfiguration", body: "Switching models or providers requires reviewing connections across applications." },
  ] },
  features: {
    title: "Unified AI management", description: "Manage model connections, API keys, usage limits, and logs through one gateway. Developers keep their familiar tools while working within your organization’s policies.",
    visuals: { ...aiGatewayContentCopy.features.visuals, active: "Connected", standby: "Alternative", protected: "Provider keys protected", budget: "Monthly budget", budgetUsage: "64% used", example: "Example", logColumns: ["Target", "Result", "Latency"], allowed: "Allowed", denied: "Denied" },
    cards: [
      { id: "connection", title: "Multiple models, one API", body: "Access models from OpenAI, Anthropic, and Gemini through OpenAI- and Anthropic-compatible APIs. Standardize connections across providers and simplify application integration." },
      { id: "routing", title: "Switch models without redeploying", body: "Map the model alias used by your application to an underlying model in the gateway. Update routing without changing the model name in your application." },
      { id: "credentials", title: "Secure API key management", body: "Store provider API keys encrypted. Users connect with project-specific Gateway Keys, so you do not need to distribute provider credentials." },
      { id: "tools", title: "Bring MCP tools together", body: "Select tools from multiple MCP servers and expose them through one endpoint. Project policies are checked at execution so only permitted tools can run." },
      { id: "budget", title: "Control usage and costs", body: "Set project limits for requests, tokens, monthly budgets, and request rates. Budgets use estimated costs from pricing tables; models without pricing are marked as unavailable for cost verification." },
      { id: "audit", title: "Unified LLM and MCP logs", body: "Record who used which model or tool and the outcome. Review tokens, estimated costs, and latency in logs and dashboards for daily operations and audits." },
    ],
  },
  policy: { title: "Access control for every role", description: "Assign roles to users and teams at the organization and project level. Give administrators, AI users, and auditors the permissions they need.", roles: [
    { name: "Organization admin", code: "org-admin", body: "Register providers and MCP servers and manage the organization.", organization: true, project: false },
    { name: "Project admin", code: "project-admin", body: "Configure project policies, budgets, and usage limits.", organization: false, project: true },
    { name: "AI user", code: "ai-user", body: "Issue Gateway Keys and access approved AI resources.", organization: false, project: true },
    { name: "Auditor", code: "audit-viewer", body: "Review logs and dashboards with read-only access.", organization: true, project: true },
  ], scopeTitle: "Permission scope by role", columns: ["Role", "Organization", "Project"], assigned: "Assignable", unassigned: "Not applicable" },
  toolset: { title: "Your MCP tools, one endpoint", description: "Select the tools your teams need from multiple MCP servers and combine them into a single endpoint. Deliver a focused toolset for each agent.", diagramLabel: "Selected tools from GitHub, Slack, Notion, and Google Drive connect through one MCP endpoint", endpoint: "Toolset Endpoint", selected: "Selected tool", notSelected: "Unselected tool", sources: [
    { id: "github", name: "GitHub", tools: ["Code", "Branches", "More"] },
    { id: "slack", name: "Slack", tools: ["Messages", "Members", "More"] },
    { id: "notion", name: "Notion", tools: ["Documents", "Search", "More"] },
    { id: "google-drive", name: "Google Drive", tools: ["Files", "Members", "More"] },
  ] },
};
const ko: Content = {
  challenges: { title: "AI 운영의 과제", description: "AI 사용이 확대되면 연결 대상, API 키, 도구 권한이 분산됩니다. 사용 현황과 비용을 파악하고 일관된 정책으로 관리할 체계가 필요합니다.", items: [
    { title: "곳곳에 흩어진 API 키", body: "프로바이더별 키가 애플리케이션과 담당자마다 분산되어 안전한 관리가 어려워집니다." },
    { title: "제각각인 도구 권한", body: "에이전트마다 설정이 달라 누가 어떤 도구를 사용할 수 있는지 파악하기 어렵습니다." },
    { title: "사용 후에야 드러나는 비용", body: "어떤 팀이 무엇을 얼마나 사용했는지, 지출 내역을 한눈에 파악하기 어렵습니다." },
    { title: "모델을 바꿀 때마다 재설정", body: "모델이나 프로바이더를 변경할 때마다 각 애플리케이션의 연결 설정을 점검해야 합니다." },
  ] },
  features: {
    title: "AI 통합 관리", description: "모델 연결부터 API 키, 사용 한도, 로그까지 하나의 게이트웨이에서 관리합니다. 개발자는 익숙한 도구로 조직의 정책에 맞게 AI를 사용할 수 있습니다.",
    visuals: { ...en.features.visuals, alias: "모델 별칭", active: "연결 중", standby: "전환 대상", protected: "프로바이더 키 보호", toolset: "내 도구 모음", tools: ["코드", "메시지", "문서"], budget: "월간 예산", budgetUsage: "64% 사용", example: "표시 예시", logs: "활동 로그", logColumns: ["대상", "결과", "응답 시간"], allowed: "허용", denied: "거부" },
    cards: [
      { id: "connection", title: "여러 모델을 하나의 API로 연결", body: "OpenAI·Anthropic·Gemini 등의 모델을 OpenAI·Anthropic 호환 API로 이용할 수 있습니다. 프로바이더마다 다른 연결 방식을 통합해 애플리케이션 연동을 단순화합니다." },
      { id: "routing", title: "재배포 없이 모델 전환", body: "애플리케이션에서 사용하는 모델 별칭과 실제 모델을 Gateway에서 연결합니다. 앱의 모델명을 수정하지 않고 라우팅 설정으로 연결 대상을 바꿀 수 있습니다." },
      { id: "credentials", title: "API 키를 안전하게 통합 관리", body: "프로바이더 API 키는 암호화해 보관합니다. 사용자는 프로젝트에 연결된 Gateway Key로 접속하므로 원본 API 키를 각 앱이나 사용자에게 배포할 필요가 없습니다." },
      { id: "tools", title: "필요한 MCP 도구를 한곳에", body: "여러 MCP 서버에서 필요한 도구를 선택해 하나의 연결 지점으로 통합합니다. 실행 시 프로젝트 정책을 확인하여 허용된 도구만 사용할 수 있습니다." },
      { id: "budget", title: "비용과 사용량 제어", body: "프로젝트별 요청 수·토큰 수·월간 예산·요청 속도 제한을 설정합니다. 단가표에 기반한 추정 비용으로 예산을 관리하며, 가격 정보가 없는 모델은 비용 확인 불가로 표시합니다." },
      { id: "audit", title: "LLM·MCP 로그 통합 기록", body: "누가 어떤 모델이나 도구를 사용했고 어떤 결과가 나왔는지 기록합니다. 토큰 수·추정 비용·응답 시간도 확인할 수 있어 일상적인 운영과 감사를 지원합니다." },
    ],
  },
  policy: { title: "역할에 맞는 접근 제어", description: "사용자와 팀에 역할을 부여하고 조직·프로젝트별 작업 범위를 설정합니다. 관리자, AI 사용자, 감사 담당자에게 필요한 권한을 제공합니다.", roles: [
    { name: "조직 관리자", code: "org-admin", body: "프로바이더와 MCP 서버를 등록하고 조직 전체를 관리합니다.", organization: true, project: false },
    { name: "프로젝트 관리자", code: "project-admin", body: "프로젝트의 사용 정책·예산·한도를 설정합니다.", organization: false, project: true },
    { name: "AI 사용자", code: "ai-user", body: "Gateway Key를 발급하고 허용된 AI를 사용합니다.", organization: false, project: true },
    { name: "감사 담당자", code: "audit-viewer", body: "로그와 대시보드를 읽기 전용으로 확인합니다.", organization: true, project: true },
  ], scopeTitle: "역할별 권한 범위", columns: ["역할", "조직", "프로젝트"], assigned: "할당 가능", unassigned: "해당 없음" },
  toolset: { title: "MCP 도구를 하나로 통합", description: "여러 MCP 서버에서 업무에 필요한 도구를 선택해 하나의 엔드포인트로 통합합니다. 에이전트별로 필요한 도구 모음을 제공할 수 있습니다.", diagramLabel: "GitHub·Slack·Notion·Google Drive에서 선택한 도구를 하나의 MCP 엔드포인트로 통합하는 구성도", endpoint: "Toolset Endpoint", selected: "선택한 도구", notSelected: "선택하지 않은 도구", sources: [
    { id: "github", name: "GitHub", tools: ["코드", "브랜치", "기타"] },
    { id: "slack", name: "Slack", tools: ["메시지", "멤버", "기타"] },
    { id: "notion", name: "Notion", tools: ["문서", "검색", "기타"] },
    { id: "google-drive", name: "Google Drive", tools: ["파일", "멤버", "기타"] },
  ] },
};

export const aiGatewayCopy: Record<Locale, Content> = { en, ko, ja: aiGatewayContentCopy };
export const aiGatewayManualLabel: Record<Locale, string> = { en: "AI Gateway Manual", ko: "AI Gateway 매뉴얼", ja: "AI Gateway マニュアル" };
type Architecture = Pick<typeof aiGatewayVisualCopy.architecture, "diagramLabel" | "agents" | "organization" | "sso" | "sync" | "rbac" | "key" | "modules" | "providerLabel" | "localLlm" | "remote" | "saas" | "internalTools">;
export const aiGatewayArchitectureCopy: Record<Locale, Architecture> = {
  ja: aiGatewayVisualCopy.architecture,
  en: { diagramLabel: "AI agents and organization controls connect to LLMs and MCP servers through AI Gateway", agents: "AI agents", organization: "Organization & members", sso: "SSO", sync: "Okta sync", rbac: "RBAC", key: "Gateway Key", modules: [{ title: "LLM Gateway", points: [] }, { title: "MCP Gateway", points: [] }, { title: "Access control", points: [] }, { title: "Logs & audit", points: [] }], providerLabel: "LLM providers", localLlm: "Local LLM", remote: "MCP servers", saas: "SaaS", internalTools: "Internal tools" },
  ko: { diagramLabel: "AI 에이전트와 조직 관리에서 AI Gateway를 거쳐 LLM·MCP로 연결되는 구성도", agents: "AI 에이전트 연결", organization: "조직·멤버 관리", sso: "SSO", sync: "Okta 동기화", rbac: "RBAC", key: "Gateway Key", modules: [{ title: "LLM Gateway", points: [] }, { title: "MCP Gateway", points: [] }, { title: "접근 제어", points: [] }, { title: "로그·감사", points: [] }], providerLabel: "LLM 프로바이더", localLlm: "로컬 LLM", remote: "MCP 서버", saas: "SaaS", internalTools: "사내 도구" },
};
