import type { PricingProduct } from "../types";

// QueryPie AIP 구독 요금 원본 (ko): 공개 플랜 카드와 비교표 데이터.
export const aipPricingKo: PricingProduct<"aip"> = {
  productKey: "aip",
  locale: "ko",
  tabLabel: "QueryPie AIP",
  plans: ["Business", "Enterprise"],
  cards: [
    {
      name: "Business",
      description: "함께 협업하고 혁신하세요",
      priceLabel: "$650/월",
      href: "https://app.querypie.com/",
      ctaLabel: "구독하기",
      features: [
        "월간 20,000 크레딧",
        { type: "divider" },
        "커스텀 AI 에이전트 최대 30개",
        "RAG 지식 번들 10개",
        { type: "divider" },
        "감사 로그 (최대 90일)",
        "로그인 IP ACL",
        "MCP 접근 제어",
        "에이전트 접근 제어",
        { value: "SSO", tone: "danger" },
        { value: "DLP", tone: "danger" },
        { type: "divider" },
        { value: "실시간 고객 지원", tone: "danger" },
        { value: "고급 AI 보안 기능", tone: "danger" },
      ],
    },
    {
      name: "Enterprise",
      description: "대규모 조직을 위한 맞춤 플랜",
      priceLabel: "별도 문의",
      href: "/contact-us",
      ctaLabel: "지금 시작하기",
      tone: "primary",
      features: [
        "맞춤형 선불 크레딧",
        { type: "divider" },
        "커스텀 AI 에이전트 무제한",
        "RAG 지식 번들 무제한",
        { type: "divider" },
        "감사 로그 (최대 180일)",
        "로그인 IP ACL",
        "MCP 접근 제어",
        "에이전트 접근 제어",
        "SSO",
        "DLP",
        { type: "divider" },
        "커스텀 브랜딩",
        "고급 AI 보안 기능",
      ],
    },
  ],
  comparisonGroups: [
    {
      title: "일반",
      rows: [
        {
          label: "월간 요금",
          values: [
            { value: "$650/월" },
            { value: "별도 문의" },
          ],
        },
        {
          label: "월간 크레딧",
          values: [
            { value: "20,000 크레딧", tone: "muted" },
            { value: "맞춤 선불 크레딧", tone: "muted" },
          ],
        },
        {
          label: "LLM 채팅",
          values: [
            { value: "Anthropic / OpenAI / Gemini", tone: "muted" },
            { value: "모든 LLM 제공사", tone: "muted" },
          ],
        },
        {
          label: "커스텀 LLM 모델",
          values: [
            { value: "✕", tone: "danger" },
            { value: "○ (Add-on)", tone: "success" },
          ],
        },
      ],
    },
    {
      title: "플랫폼 기능",
      rows: [
        { label: "웹 검색", values: [ { value: "○", tone: "success" }, { value: "○", tone: "success" }] },
        { label: "인사이트 위젯", values: [ { value: "○", tone: "success" }, { value: "○", tone: "success" }] },
        { label: "코드 아티팩트", values: [ { value: "○", tone: "success" }, { value: "○", tone: "success" }] },
        { label: "MCP 연동", values: [ { value: "○", tone: "success" }, { value: "○", tone: "success" }] },
        { label: "MCP 프리셋 생성", values: [ { value: "○", tone: "success" }, { value: "○", tone: "success" }] },
        { label: "MCP 프롬프트 자동 생성", values: [ { value: "○", tone: "success" }, { value: "○", tone: "success" }] },
        { label: "서드파티 앱용 MCP 프리셋", values: [ { value: "○", tone: "success" }, { value: "○", tone: "success" }] },
        { label: "빌트인 에이전트", values: [ { value: "○", tone: "success" }, { value: "○", tone: "success" }] },
        { label: "스킬", values: [ { value: "○", tone: "success" }, { value: "○", tone: "success" }] },
        { label: "이미지 생성", values: [ { value: "○", tone: "success" }, { value: "○", tone: "success" }] },
        { label: "RAG 지식 번들 한도", values: [ { value: "○ 10", tone: "success" }, { value: "○ 무제한", tone: "success" }] },
        { label: "개인 엣지 터널", values: [ { value: "○ 20", tone: "success" }, { value: "○ 무제한", tone: "success" }] },
        { label: "에이전트 스케줄링", values: [ { value: "○ 10", tone: "success" }, { value: "○ 무제한", tone: "success" }] },
        { label: "AI 에이전트 생성 한도", values: [ { value: "○ 30", tone: "success" }, { value: "○ 무제한", tone: "success" }] },
        { label: "My Drive", values: [ { value: "○ 1GB / 사용자", tone: "success" }, { value: "○ 10GB / 사용자", tone: "success" }] },
      ],
    },
    {
      title: "보안 기능",
      rows: [
        { label: "SSO", values: [ { value: "✕", tone: "danger" }, { value: "○", tone: "success" }] },
        { label: "채팅 보관", values: [ { value: "✕", tone: "danger" }, { value: "○", tone: "success" }] },
        { label: "DLP", values: [ { value: "✕", tone: "danger" }, { value: "○", tone: "success" }] },
        { label: "로그인 IP ACL", values: [ { value: "○", tone: "success" }, { value: "○", tone: "success" }] },
        {
          label: "감사 로그",
          values: [
            { value: "○ 최대 90일", tone: "success" },
            { value: "○ 최대 180일", tone: "success" },
          ],
        },
      ],
    },
    {
      title: "조직 기능",
      rows: [
        { label: "사전 구성된 MCP 연동", values: [ { value: "✕", tone: "danger" }, { value: "○", tone: "success" }] },
        { label: "조직 엣지 터널", values: [ { value: "✕", tone: "danger" }, { value: "○", tone: "success" }] },
        { label: "MCP 접근 제어", values: [ { value: "○", tone: "success" }, { value: "○", tone: "success" }] },
        { label: "에이전트 접근 제어", values: [ { value: "○", tone: "success" }, { value: "○", tone: "success" }] },
        { label: "LLM 모델 제어", values: [ { value: "○", tone: "success" }, { value: "○", tone: "success" }] },
      ],
    },
    {
      title: "브랜딩 및 지원",
      rows: [
        { label: "커스텀 브랜딩", values: [ { value: "✕", tone: "danger" }, { value: "○", tone: "success" }] },
        { label: "FDE (Forward Deployed Engineer)", values: [ { value: "✕", tone: "danger" }, { value: "○ (Add-on)", tone: "success" }] },
        {
          label: "고객 지원",
          values: [
            { value: "24시간 내 이메일 지원", tone: "muted" },
            { value: "전담 지원", tone: "muted" },
          ],
        },
      ],
    },
  ],
};
