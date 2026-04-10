import type { Locale } from "./i18n";

export type PlanCard = {
  ctaLabel: string;
  description: string;
  features: Array<string | ComparisonValue>;
  href: string;
  name: string;
  priceLabel: string;
  tone?: "primary" | "secondary";
};

export type ComparisonValue = {
  tone?: "danger" | "muted" | "success";
  value: string;
};

export type ComparisonRow = {
  label: string;
  values: ComparisonValue[];
};

export type ComparisonGroup = {
  rows: ComparisonRow[];
  title: string;
};

export type PricingProduct = {
  cards: PlanCard[];
  comparisonGroups: ComparisonGroup[];
  plans: string[];
  tabLabel: string;
};

export type PricingProducts = Record<"aip" | "acp", PricingProduct>;

export const pricingProductsByLocale: Record<Locale, PricingProducts> = {
  en: {
    aip: {
      tabLabel: "QueryPie AIP",
      plans: ["Starter", "Team", "Enterprise"],
      cards: [
        {
          name: "Starter",
          description: "Build your first AI workflow",
          priceLabel: "$20/mo",
          href: "/features/documentation",
          ctaLabel: "Subscribe",
          features: [
            "800 monthly credits",
            "Custom AI agents (Unlimited for now)",
            "3 RAG knowledge bundles",
            "Audit logs (max 30 days)",
            "Login IP ACL",
          ],
        },
        {
          name: "Team",
          description: "Collaborate and innovate together",
          priceLabel: "$500/mo",
          href: "/features/documentation",
          ctaLabel: "Subscribe",
          features: [
            "20,000 monthly credits",
            "Custom AI agents (Unlimited for now)",
            "10 RAG knowledge bundles",
            "Audit logs (max 90 days)",
            "DLP",
            "Login IP ACL",
          ],
        },
        {
          name: "Enterprise",
          description: "Enterprise power unleashed",
          priceLabel: "Let's Talk",
          href: "/features/documentation",
          ctaLabel: "Try Now",
          tone: "primary",
          features: [
            "Custom Prepaid Credits",
            "Unlimited custom AI agents",
            "Unlimited RAG knowledge bundles",
            "Audit logs (max 180 days)",
            "SSO",
            "DLP",
            "Login IP ACL",
            "Custom Branding",
            "Advanced AI Security Features",
          ],
        },
      ],
      comparisonGroups: [
        {
          title: "General",
          rows: [
            {
              label: "Monthly Billing",
              values: [
                { value: "$20/month" },
                { value: "$500/month" },
                { value: "Custom Pricing" },
              ],
            },
            {
              label: "Monthly Credits",
              values: [
                { value: "800 credits", tone: "muted" },
                { value: "20,000 credits", tone: "muted" },
                { value: "Custom Prepaid Credits", tone: "muted" },
              ],
            },
            {
              label: "LLM Chat",
              values: [
                { value: "Anthropic", tone: "muted" },
                { value: "Anthropic / OpenAI / Gemini", tone: "muted" },
                { value: "Any LLM Provider", tone: "muted" },
              ],
            },
            {
              label: "Custom LLM Model",
              values: [
                { value: "✕", tone: "danger" },
                { value: "✕", tone: "danger" },
                { value: "○ (Add-on)", tone: "success" },
              ],
            },
          ],
        },
        {
          title: "Platform Features",
          rows: [
            {
              label: "Web Search",
              values: [
                { value: "○", tone: "success" },
                { value: "○", tone: "success" },
                { value: "○", tone: "success" },
              ],
            },
            {
              label: "Insight Widgets",
              values: [
                { value: "○", tone: "success" },
                { value: "○", tone: "success" },
                { value: "○", tone: "success" },
              ],
            },
            {
              label: "Code Artifacts",
              values: [
                { value: "○", tone: "success" },
                { value: "○", tone: "success" },
                { value: "○", tone: "success" },
              ],
            },
            {
              label: "MCP Integrations",
              values: [
                { value: "○", tone: "success" },
                { value: "○", tone: "success" },
                { value: "○", tone: "success" },
              ],
            },
            {
              label: "MCP Preset Creation",
              values: [
                { value: "○", tone: "success" },
                { value: "○", tone: "success" },
                { value: "○", tone: "success" },
              ],
            },
            {
              label: "MCP Prompt Auto-Generation",
              values: [
                { value: "○", tone: "success" },
                { value: "○", tone: "success" },
                { value: "○", tone: "success" },
              ],
            },
            {
              label: "MCP Preset on 3rd Party Apps",
              values: [
                { value: "○", tone: "success" },
                { value: "○", tone: "success" },
                { value: "○", tone: "success" },
              ],
            },
            {
              label: "AI Agent Creation Limit",
              values: [
                { value: "Temporarily Unlimited", tone: "muted" },
                { value: "Temporarily Unlimited", tone: "muted" },
                { value: "Unlimited", tone: "muted" },
              ],
            },
            {
              label: "Available Built-in Agents",
              values: [
                { value: "○", tone: "success" },
                { value: "○", tone: "success" },
                { value: "○", tone: "success" },
              ],
            },
            {
              label: "Agent Scheduling",
              values: [
                { value: "○", tone: "success" },
                { value: "○", tone: "success" },
                { value: "○", tone: "success" },
              ],
            },
            {
              label: "RAG Knowledge Bundle Limit",
              values: [
                { value: "3", tone: "muted" },
                { value: "10", tone: "muted" },
                { value: "Unlimited", tone: "muted" },
              ],
            },
          ],
        },
        {
          title: "Security Features",
          rows: [
            {
              label: "SSO",
              values: [
                { value: "✕", tone: "danger" },
                { value: "✕", tone: "danger" },
                { value: "○", tone: "success" },
              ],
            },
            {
              label: "Audit Logs",
              values: [
                { value: "○ Max 30 days", tone: "success" },
                { value: "○ Max 90 days", tone: "success" },
                { value: "○ Max 180 days", tone: "success" },
              ],
            },
            {
              label: "DLP",
              values: [
                { value: "✕", tone: "danger" },
                { value: "○", tone: "success" },
                { value: "○", tone: "success" },
              ],
            },
            {
              label: "Login IP ACL",
              values: [
                { value: "○", tone: "success" },
                { value: "○", tone: "success" },
                { value: "○", tone: "success" },
              ],
            },
          ],
        },
        {
          title: "Organizational Features",
          rows: [
            {
              label: "Pre-configured MCP Integration",
              values: [
                { value: "✕", tone: "danger" },
                { value: "✕", tone: "danger" },
                { value: "○", tone: "success" },
              ],
            },
            {
              label: "Organizational Edge Tunnels",
              values: [
                { value: "✕", tone: "danger" },
                { value: "✕", tone: "danger" },
                { value: "○", tone: "success" },
              ],
            },
            {
              label: "MCP Access Control",
              values: [
                { value: "✕", tone: "danger" },
                { value: "○", tone: "success" },
                { value: "○", tone: "success" },
              ],
            },
            {
              label: "Agent Access Control",
              values: [
                { value: "✕", tone: "danger" },
                { value: "○", tone: "success" },
                { value: "○", tone: "success" },
              ],
            },
          ],
        },
        {
          title: "Branding & Support",
          rows: [
            {
              label: "Custom Branding",
              values: [
                { value: "✕", tone: "danger" },
                { value: "✕", tone: "danger" },
                { value: "○", tone: "success" },
              ],
            },
            {
              label: "Customer Support",
              values: [
                { value: "Email support within 48 hrs", tone: "muted" },
                { value: "Email support within 24 hrs", tone: "muted" },
                { value: "Dedicated", tone: "muted" },
              ],
            },
          ],
        },
      ],
    },
    acp: {
      tabLabel: "QueryPie ACP",
      plans: ["Community", "Standard", "Enterprise"],
      cards: [
        {
          name: "Community",
          description: "Download and secure a free license for the Community edition with the same quality",
          priceLabel: "Free",
          href: "/features/documentation",
          ctaLabel: "Install Now",
          features: [
            "Limited to 5 Users",
            "Database Access Control",
            "System Access Control",
            "Kubernetes Access Control",
            "Web Access Control",
            "Request and Approval Workflows",
          ],
        },
        {
          name: "Standard",
          description: "Offered exclusively to users who are satisfied with the Community edition; billed annually",
          priceLabel: "$50/mo/user",
          href: "/features/documentation",
          ctaLabel: "Contact Us",
          features: [
            "At least 10 users",
            "Database Access Control",
            "System Access Control",
            "Kubernetes Access Control",
            "Web Access Control",
            "Request and Approval Workflows",
            "Online Technical Support",
            { value: "Technical Onboarding", tone: "danger" },
            { value: "Software Upgrade Support", tone: "danger" },
          ],
        },
        {
          name: "Enterprise",
          description: "Recommended for teams seeking professional deployment support and services",
          priceLabel: "Let's Talk",
          href: "/features/documentation",
          ctaLabel: "Contact Us",
          tone: "primary",
          features: [
            "Flexible User Capacity",
            "Database Access Control",
            "System Access Control",
            "Kubernetes Access Control",
            "Web Access Control",
            "Request and Approval Workflows",
            "Technical Support",
            "Technical Onboarding",
            "Software Upgrade Support",
          ],
        },
      ],
      comparisonGroups: [
        {
          title: "General",
          rows: [
            {
              label: "Monthly Billing",
              values: [
                { value: "$29/month" },
                { value: "$590/month" },
                { value: "Custom Pricing" },
              ],
            },
            {
              label: "Connected Resources",
              values: [
                { value: "10 resources", tone: "muted" },
                { value: "Unlimited", tone: "muted" },
                { value: "Unlimited", tone: "muted" },
              ],
            },
            {
              label: "Deployment",
              values: [
                { value: "Shared Cloud", tone: "muted" },
                { value: "Shared Cloud", tone: "muted" },
                { value: "Private / Hybrid", tone: "muted" },
              ],
            },
          ],
        },
        {
          title: "Platform Features",
          rows: [
            {
              label: "Policy Management",
              values: [
                { value: "○", tone: "success" },
                { value: "○", tone: "success" },
                { value: "○", tone: "success" },
              ],
            },
            {
              label: "Role-based Access Control",
              values: [
                { value: "○", tone: "success" },
                { value: "○", tone: "success" },
                { value: "○", tone: "success" },
              ],
            },
            {
              label: "Approval Workflows",
              values: [
                { value: "✕", tone: "danger" },
                { value: "○", tone: "success" },
                { value: "○", tone: "success" },
              ],
            },
            {
              label: "DLP",
              values: [
                { value: "✕", tone: "danger" },
                { value: "○", tone: "success" },
                { value: "○", tone: "success" },
              ],
            },
            {
              label: "SSO / SCIM",
              values: [
                { value: "✕", tone: "danger" },
                { value: "✕", tone: "danger" },
                { value: "○", tone: "success" },
              ],
            },
            {
              label: "Audit Log Retention",
              values: [
                { value: "30 days", tone: "muted" },
                { value: "90 days", tone: "muted" },
                { value: "180 days", tone: "muted" },
              ],
            },
          ],
        },
      ],
    },
  },
  ko: {
    aip: {
      tabLabel: "QueryPie AIP",
      plans: ["Starter", "Team", "Enterprise"],
      cards: [
        {
          name: "Starter",
          description: "첫 AI 워크플로우를 구축하세요",
          priceLabel: "$20/월",
          href: "/features/documentation",
          ctaLabel: "구독하기",
          features: [
            "월간 800 크레딧",
            "커스텀 AI 에이전트\n(현재 무제한)",
            "RAG 지식 번들 3개",
            "감사 로그 (최대 30일)",
            "로그인 IP ACL",
          ],
        },
        {
          name: "Team",
          description: "함께 협업하고 혁신하세요",
          priceLabel: "$500/월",
          href: "/features/documentation",
          ctaLabel: "구독하기",
          features: [
            "월간 20,000 크레딧",
            "커스텀 AI 에이전트\n(현재 무제한)",
            "RAG 지식 번들 10개",
            "감사 로그 (최대 90일)",
            "DLP",
            "로그인 IP ACL",
          ],
        },
        {
          name: "Enterprise",
          description: "대규모 조직을 위한 맞춤 플랜",
          priceLabel: "별도 문의",
          href: "/features/documentation",
          ctaLabel: "지금 시작하기",
          tone: "primary",
          features: [
            "맞춤형 선불 크레딧",
            "커스텀 AI 에이전트 무제한",
            "RAG 지식 번들 무제한",
            "감사 로그 (최대 180일)",
            "SSO",
            "DLP",
            "로그인 IP ACL",
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
                { value: "$20/월" },
                { value: "$500/월" },
                { value: "별도 문의" },
              ],
            },
            {
              label: "월간 크레딧",
              values: [
                { value: "800 크레딧", tone: "muted" },
                { value: "20,000 크레딧", tone: "muted" },
                { value: "맞춤 선불 크레딧", tone: "muted" },
              ],
            },
            {
              label: "LLM 채팅",
              values: [
                { value: "Anthropic", tone: "muted" },
                { value: "Anthropic / OpenAI / Gemini", tone: "muted" },
                { value: "모든 LLM 제공사", tone: "muted" },
              ],
            },
            {
              label: "커스텀 LLM 모델",
              values: [
                { value: "✕", tone: "danger" },
                { value: "✕", tone: "danger" },
                { value: "○ (Add-on)", tone: "success" },
              ],
            },
          ],
        },
        {
          title: "플랫폼 기능",
          rows: [
            { label: "웹 검색", values: [{ value: "○", tone: "success" }, { value: "○", tone: "success" }, { value: "○", tone: "success" }] },
            { label: "인사이트 위젯", values: [{ value: "○", tone: "success" }, { value: "○", tone: "success" }, { value: "○", tone: "success" }] },
            { label: "코드 아티팩트", values: [{ value: "○", tone: "success" }, { value: "○", tone: "success" }, { value: "○", tone: "success" }] },
            { label: "MCP 연동", values: [{ value: "○", tone: "success" }, { value: "○", tone: "success" }, { value: "○", tone: "success" }] },
            { label: "MCP 프리셋 생성", values: [{ value: "○", tone: "success" }, { value: "○", tone: "success" }, { value: "○", tone: "success" }] },
            { label: "MCP 프롬프트 자동 생성", values: [{ value: "○", tone: "success" }, { value: "○", tone: "success" }, { value: "○", tone: "success" }] },
            { label: "서드파티 앱용 MCP 프리셋", values: [{ value: "○", tone: "success" }, { value: "○", tone: "success" }, { value: "○", tone: "success" }] },
            { label: "AI 에이전트 생성 한도", values: [{ value: "현재 무제한", tone: "muted" }, { value: "현재 무제한", tone: "muted" }, { value: "무제한", tone: "muted" }] },
            { label: "빌트인 에이전트", values: [{ value: "○", tone: "success" }, { value: "○", tone: "success" }, { value: "○", tone: "success" }] },
            { label: "에이전트 스케줄링", values: [{ value: "○", tone: "success" }, { value: "○", tone: "success" }, { value: "○", tone: "success" }] },
            { label: "RAG 지식 번들 한도", values: [{ value: "3", tone: "muted" }, { value: "10", tone: "muted" }, { value: "무제한", tone: "muted" }] },
          ],
        },
        {
          title: "보안 기능",
          rows: [
            { label: "SSO", values: [{ value: "✕", tone: "danger" }, { value: "✕", tone: "danger" }, { value: "○", tone: "success" }] },
            {
              label: "감사 로그",
              values: [
                { value: "○ 최대 30일", tone: "success" },
                { value: "○ 최대 90일", tone: "success" },
                { value: "○ 최대 180일", tone: "success" },
              ],
            },
            { label: "DLP", values: [{ value: "✕", tone: "danger" }, { value: "○", tone: "success" }, { value: "○", tone: "success" }] },
            { label: "로그인 IP ACL", values: [{ value: "○", tone: "success" }, { value: "○", tone: "success" }, { value: "○", tone: "success" }] },
          ],
        },
        {
          title: "조직 기능",
          rows: [
            { label: "사전 구성된 MCP 연동", values: [{ value: "✕", tone: "danger" }, { value: "✕", tone: "danger" }, { value: "○", tone: "success" }] },
            { label: "조직 엣지 터널", values: [{ value: "✕", tone: "danger" }, { value: "✕", tone: "danger" }, { value: "○", tone: "success" }] },
            { label: "MCP 접근 제어", values: [{ value: "✕", tone: "danger" }, { value: "○", tone: "success" }, { value: "○", tone: "success" }] },
            { label: "에이전트 접근 제어", values: [{ value: "✕", tone: "danger" }, { value: "○", tone: "success" }, { value: "○", tone: "success" }] },
          ],
        },
        {
          title: "브랜딩 및 지원",
          rows: [
            { label: "커스텀 브랜딩", values: [{ value: "✕", tone: "danger" }, { value: "✕", tone: "danger" }, { value: "○", tone: "success" }] },
            {
              label: "고객 지원",
              values: [
                { value: "48시간 내 이메일 지원", tone: "muted" },
                { value: "24시간 내 이메일 지원", tone: "muted" },
                { value: "전담 지원", tone: "muted" },
              ],
            },
          ],
        },
      ],
    },
    acp: {
      tabLabel: "QueryPie ACP",
      plans: ["커뮤니티", "스탠다드", "엔터프라이즈"],
      cards: [
        {
          name: "커뮤니티",
          description: "동일한 품질의 Community 에디션 무료 라이선스를 다운로드하세요",
          priceLabel: "무료",
          href: "/features/documentation",
          ctaLabel: "지금 설치하기",
          features: [
            "최대 5명 사용자",
            "데이터베이스 액세스 제어",
            "시스템 액세스 제어",
            "Kubernetes 액세스 제어",
            "웹 액세스 제어",
            "요청 및 승인 워크플로우",
          ],
        },
        {
          name: "스탠다드",
          description: "Community 에디션에 만족하신 사용자에게만 제공되며, 연간 결제만 가능합니다",
          priceLabel: "$50/월/사용자",
          href: "/features/documentation",
          ctaLabel: "구매하기",
          features: [
            "최소 10명 사용자",
            "데이터베이스 액세스 제어",
            "시스템 액세스 제어",
            "Kubernetes 액세스 제어",
            "웹 액세스 제어",
            "요청 및 승인 워크플로우",
            "온라인 기술 지원",
            { value: "기술 온보딩", tone: "danger" },
            { value: "소프트웨어 업그레이드 지원", tone: "danger" },
          ],
        },
        {
          name: "Enterprise",
          description: "전문적인 도입 지원과 서비스를 원하는 팀에 추천합니다",
          priceLabel: "별도 문의",
          href: "/features/documentation",
          ctaLabel: "문의하기",
          tone: "primary",
          features: [
            "유연한 사용자 수 설정",
            "데이터베이스 액세스 제어",
            "시스템 액세스 제어",
            "Kubernetes 액세스 제어",
            "웹 액세스 제어",
            "요청 및 승인 워크플로우",
            "기술 지원",
            "기술 온보딩",
            "소프트웨어 업그레이드 지원",
          ],
        },
      ],
      comparisonGroups: [
        {
          title: "일반",
          rows: [
            {
              label: "월 과금",
              values: [
                { value: "$29/월" },
                { value: "$590/월" },
                { value: "맞춤 요금" },
              ],
            },
            {
              label: "연결 리소스",
              values: [
                { value: "10개 리소스", tone: "muted" },
                { value: "무제한", tone: "muted" },
                { value: "무제한", tone: "muted" },
              ],
            },
            {
              label: "배포 방식",
              values: [
                { value: "공용 클라우드", tone: "muted" },
                { value: "공용 클라우드", tone: "muted" },
                { value: "프라이빗 / 하이브리드", tone: "muted" },
              ],
            },
          ],
        },
        {
          title: "플랫폼 기능",
          rows: [
            { label: "정책 관리", values: [{ value: "○", tone: "success" }, { value: "○", tone: "success" }, { value: "○", tone: "success" }] },
            { label: "RBAC", values: [{ value: "○", tone: "success" }, { value: "○", tone: "success" }, { value: "○", tone: "success" }] },
            { label: "승인 워크플로", values: [{ value: "✕", tone: "danger" }, { value: "○", tone: "success" }, { value: "○", tone: "success" }] },
            { label: "DLP", values: [{ value: "✕", tone: "danger" }, { value: "○", tone: "success" }, { value: "○", tone: "success" }] },
            { label: "SSO / SCIM", values: [{ value: "✕", tone: "danger" }, { value: "✕", tone: "danger" }, { value: "○", tone: "success" }] },
            {
              label: "감사 로그 보관",
              values: [
                { value: "30일", tone: "muted" },
                { value: "90일", tone: "muted" },
                { value: "180일", tone: "muted" },
              ],
            },
          ],
        },
      ],
    },
  },
  ja: {
    aip: {
      tabLabel: "QueryPie AIP",
      plans: ["Starter", "Team", "Enterprise"],
      cards: [
        {
          name: "Starter",
          description: "はじめての利用に最適",
          priceLabel: "$20/月",
          href: "/features/documentation",
          ctaLabel: "利用を開始する",
          features: [
            "月間800クレジット",
            "カスタムAIエージェント\n(現在無制限)",
            "社内文書学習 (RAG) 3つまで",
            "操作履歴の記録\n(最大30日間)",
            "IPアドレス制限 (ACL)",
          ],
        },
        {
          name: "Team",
          description: "チームでの協働作業に最適",
          priceLabel: "$500/月",
          href: "/features/documentation",
          ctaLabel: "利用を開始する",
          features: [
            "月間20,000クレジット",
            "カスタムAIエージェント\n(現在無制限)",
            "社内文書学習 (RAG)\n10個まで",
            "操作履歴の記録\n(最大90日間)",
            "DLP",
            "IPアドレス制限 (ACL)",
          ],
        },
        {
          name: "Enterprise",
          description: "大規模組織向けの包括的プラン",
          priceLabel: "個別見積もり",
          href: "/features/documentation",
          ctaLabel: "今すぐ試す",
          tone: "primary",
          features: [
            "カスタムクレジット",
            "カスタムAIエージェント\n無制限",
            "社内文書学習 (RAG) 無制限",
            "操作履歴の記録\n(最大180日間)",
            "シングルサインオン (SSO)",
            "データ漏洩防止 (DLP)",
            "IPアドレス制限 (ACL)",
            "カスタムブランディング",
            "高度な AI セキュリティ機能",
          ],
        },
      ],
      comparisonGroups: [
        {
          title: "一般",
          rows: [
            {
              label: "料金",
              values: [
                { value: "$20/月" },
                { value: "$500/月" },
                { value: "カスタム価格 (年間契約)" },
              ],
            },
            {
              label: "AI利用クレジット",
              values: [
                { value: "800クレジット/月", tone: "muted" },
                { value: "20,000クレジット/月", tone: "muted" },
                { value: "カスタム前払いクレジット", tone: "muted" },
              ],
            },
            {
              label: "利用可能なAIモデル",
              values: [
                { value: "Claude", tone: "muted" },
                { value: "Claude / ChatGPT / Gemini", tone: "muted" },
                { value: "主要LLMを自由に選択可", tone: "muted" },
              ],
            },
            {
              label: "独自AIモデルの利用",
              values: [
                { value: "✕", tone: "danger" },
                { value: "✕", tone: "danger" },
                { value: "○ (Add-on)", tone: "success" },
              ],
            },
          ],
        },
        {
          title: "プラットフォーム機能",
          rows: [
            { label: "Web検索", values: [{ value: "○", tone: "success" }, { value: "○", tone: "success" }, { value: "○", tone: "success" }] },
            { label: "データ可視化ウィジェット", values: [{ value: "○", tone: "success" }, { value: "○", tone: "success" }, { value: "○", tone: "success" }] },
            { label: "コード生成・実行", values: [{ value: "○", tone: "success" }, { value: "○", tone: "success" }, { value: "○", tone: "success" }] },
            { label: "外部ツール連携 (MCP)", values: [{ value: "○", tone: "success" }, { value: "○", tone: "success" }, { value: "○", tone: "success" }] },
            { label: "MCP連携設定の作成", values: [{ value: "○", tone: "success" }, { value: "○", tone: "success" }, { value: "○", tone: "success" }] },
            { label: "MCPプロンプト自動生成", values: [{ value: "○", tone: "success" }, { value: "○", tone: "success" }, { value: "○", tone: "success" }] },
            { label: "外部アプリでの連携利用", values: [{ value: "○", tone: "success" }, { value: "○", tone: "success" }, { value: "○", tone: "success" }] },
            { label: "AIエージェント作成数", values: [{ value: "一時的に無制限", tone: "muted" }, { value: "一時的に無制限", tone: "muted" }, { value: "無制限", tone: "muted" }] },
            { label: "組み込みエージェント利用", values: [{ value: "○", tone: "success" }, { value: "○", tone: "success" }, { value: "○", tone: "success" }] },
            { label: "エージェント自動実行", values: [{ value: "○", tone: "success" }, { value: "○", tone: "success" }, { value: "○", tone: "success" }] },
            { label: "文書学習の登録数 (RAG)", values: [{ value: "3", tone: "muted" }, { value: "10", tone: "muted" }, { value: "無制限", tone: "muted" }] },
          ],
        },
        {
          title: "セキュリティ機能",
          rows: [
            { label: "シングルサインオン (SSO)", values: [{ value: "✕", tone: "danger" }, { value: "✕", tone: "danger" }, { value: "○", tone: "success" }] },
            {
              label: "操作履歴の保存期間",
              values: [
                { value: "○ 最大30日間", tone: "success" },
                { value: "○ 最大90日間", tone: "success" },
                { value: "○ 最大180日間", tone: "success" },
              ],
            },
            { label: "データ漏洩防止 (DLP)", values: [{ value: "✕", tone: "danger" }, { value: "○", tone: "success" }, { value: "○", tone: "success" }] },
            { label: "IPアドレス制限 (ACL)", values: [{ value: "○", tone: "success" }, { value: "○", tone: "success" }, { value: "○", tone: "success" }] },
          ],
        },
        {
          title: "組織機能",
          rows: [
            { label: "組織共通の外部ツール連携設定", values: [{ value: "✕", tone: "danger" }, { value: "✕", tone: "danger" }, { value: "○", tone: "success" }] },
            { label: "組織共通の社内システム暗号化接続", values: [{ value: "✕", tone: "danger" }, { value: "✕", tone: "danger" }, { value: "○", tone: "success" }] },
            { label: "連携ツールのアクセス管理", values: [{ value: "✕", tone: "danger" }, { value: "○", tone: "success" }, { value: "○", tone: "success" }] },
            { label: "エージェントのアクセス管理", values: [{ value: "✕", tone: "danger" }, { value: "○", tone: "success" }, { value: "○", tone: "success" }] },
          ],
        },
        {
          title: "ブランディングとサポート",
          rows: [
            { label: "カスタムブランディング", values: [{ value: "✕", tone: "danger" }, { value: "✕", tone: "danger" }, { value: "○", tone: "success" }] },
            {
              label: "サポート体制",
              values: [
                { value: "48時間以内のメールサポート", tone: "muted" },
                { value: "24時間以内のメールサポート", tone: "muted" },
                { value: "専任サポート", tone: "muted" },
              ],
            },
          ],
        },
      ],
    },
    acp: {
      tabLabel: "QueryPie ACP",
      plans: ["コミュニティ", "スタンダード", "エンタープライズ"],
      cards: [
        {
          name: "コミュニティ",
          description: "同じ品質のCommunity版の無料ライセンスをダウンロードして取得",
          priceLabel: "$0/月",
          href: "/features/documentation",
          ctaLabel: "今すぐダウンロード",
          features: [
            "最大5ユーザーまで利用可能",
            "データベースアクセス制御",
            "システムアクセス制御",
            "Kubernetesアクセス制御",
            "Webアクセス制御",
            "申請・承認ワークフロー",
          ],
        },
        {
          name: "スタンダード",
          description: "コミュニティ版にご満足の利用者に限定して提供。年間契約のみ。",
          priceLabel: "$50/人・月",
          href: "/features/documentation",
          ctaLabel: "お問い合わせ",
          features: [
            "10ユーザー以上",
            "データベースアクセス制御",
            "システムアクセス制御",
            "Kubernetesアクセス制御",
            "Webアクセス制御",
            "申請・承認ワークフロー",
            "オンラインテクニカルサポート",
            { value: "導入サポート・オンボーディング", tone: "danger" },
            { value: "アップデートサポート", tone: "danger" },
          ],
        },
        {
          name: "Enterprise",
          description: "プロフェッショナルな導入サポートとサービスを求めるチームにおすすめ",
          priceLabel: "個別見積もり",
          href: "/features/documentation",
          ctaLabel: "お問い合わせ",
          tone: "primary",
          features: [
            "柔軟なユーザー数の設定",
            "データベースアクセス制御",
            "システムアクセス制御",
            "Kubernetesアクセス制御",
            "Webアクセス制御",
            "申請・承認ワークフロー",
            "テクニカルサポート",
            "導入サポート・オンボーディング",
            "アップデートサポート",
          ],
        },
      ],
      comparisonGroups: [
        {
          title: "一般",
          rows: [
            {
              label: "月額課金",
              values: [
                { value: "$29/月" },
                { value: "$590/月" },
                { value: "カスタム価格" },
              ],
            },
            {
              label: "接続リソース",
              values: [
                { value: "10 リソース", tone: "muted" },
                { value: "無制限", tone: "muted" },
                { value: "無制限", tone: "muted" },
              ],
            },
            {
              label: "デプロイ方式",
              values: [
                { value: "共有クラウド", tone: "muted" },
                { value: "共有クラウド", tone: "muted" },
                { value: "プライベート / ハイブリッド", tone: "muted" },
              ],
            },
          ],
        },
        {
          title: "プラットフォーム機能",
          rows: [
            { label: "ポリシー管理", values: [{ value: "○", tone: "success" }, { value: "○", tone: "success" }, { value: "○", tone: "success" }] },
            { label: "RBAC", values: [{ value: "○", tone: "success" }, { value: "○", tone: "success" }, { value: "○", tone: "success" }] },
            { label: "承認ワークフロー", values: [{ value: "✕", tone: "danger" }, { value: "○", tone: "success" }, { value: "○", tone: "success" }] },
            { label: "DLP", values: [{ value: "✕", tone: "danger" }, { value: "○", tone: "success" }, { value: "○", tone: "success" }] },
            { label: "SSO / SCIM", values: [{ value: "✕", tone: "danger" }, { value: "✕", tone: "danger" }, { value: "○", tone: "success" }] },
            {
              label: "監査ログ保持",
              values: [
                { value: "30日", tone: "muted" },
                { value: "90日", tone: "muted" },
                { value: "180日", tone: "muted" },
              ],
            },
          ],
        },
      ],
    },
  },
};
