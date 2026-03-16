import type { Locale } from "./i18n";

export type PlanCard = {
  ctaLabel: string;
  description: string;
  features: string[];
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
          href: "/docs",
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
          href: "/docs",
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
          href: "/docs",
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
              label: "Available LLM Providers",
              values: [
                { value: "Anthropic", tone: "muted" },
                { value: "Anthropic / OpenAI / Gemini", tone: "muted" },
                { value: "Any LLM Provider", tone: "muted" },
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
                { value: "○", tone: "success" },
                { value: "○", tone: "success" },
                { value: "○", tone: "success" },
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
              label: "Custom LLM Model",
              values: [
                { value: "○", tone: "success" },
                { value: "✕", tone: "danger" },
                { value: "✕", tone: "danger" },
              ],
            },
            {
              label: "Support",
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
      plans: ["Starter", "Team", "Enterprise"],
      cards: [
        {
          name: "Starter",
          description: "Secure core access control quickly",
          priceLabel: "$29/mo",
          href: "/docs",
          ctaLabel: "Subscribe",
          features: [
            "Basic policy management",
            "10 connected resources",
            "30-day audit logs",
            "Login IP ACL",
            "Email support",
          ],
        },
        {
          name: "Team",
          description: "Operate identity and permissions at scale",
          priceLabel: "$590/mo",
          href: "/docs",
          ctaLabel: "Subscribe",
          features: [
            "Advanced policy management",
            "Unlimited connected resources",
            "90-day audit logs",
            "DLP",
            "Approval workflows",
            "Priority support",
          ],
        },
        {
          name: "Enterprise",
          description: "Govern large-scale access and compliance",
          priceLabel: "Let's Talk",
          href: "/docs",
          ctaLabel: "Try Now",
          tone: "primary",
          features: [
            "Unlimited policy templates",
            "SSO / SCIM",
            "180-day audit logs",
            "Dedicated support",
            "Custom compliance controls",
            "Advanced AI security features",
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
          description: "첫 번째 AI 워크플로를 시작하세요",
          priceLabel: "$20/월",
          href: "/docs",
          ctaLabel: "구독하기",
          features: [
            "월 800 크레딧",
            "커스텀 AI 에이전트 (현재 무제한)",
            "RAG 지식 번들 3개",
            "감사 로그 (최대 30일)",
            "로그인 IP ACL",
          ],
        },
        {
          name: "Team",
          description: "팀과 함께 더 빠르게 운영하세요",
          priceLabel: "$500/월",
          href: "/docs",
          ctaLabel: "구독하기",
          features: [
            "월 20,000 크레딧",
            "커스텀 AI 에이전트 (현재 무제한)",
            "RAG 지식 번들 10개",
            "감사 로그 (최대 90일)",
            "DLP",
            "로그인 IP ACL",
          ],
        },
        {
          name: "Enterprise",
          description: "엔터프라이즈 운영을 위한 완전한 제어",
          priceLabel: "문의하기",
          href: "/docs",
          ctaLabel: "지금 시작",
          tone: "primary",
          features: [
            "맞춤 선불 크레딧",
            "무제한 커스텀 AI 에이전트",
            "무제한 RAG 지식 번들",
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
              label: "월 과금",
              values: [
                { value: "$20/월" },
                { value: "$500/월" },
                { value: "맞춤 요금" },
              ],
            },
            {
              label: "월 크레딧",
              values: [
                { value: "800 크레딧", tone: "muted" },
                { value: "20,000 크레딧", tone: "muted" },
                { value: "맞춤 선불 크레딧", tone: "muted" },
              ],
            },
            {
              label: "사용 가능한 LLM 공급자",
              values: [
                { value: "Anthropic", tone: "muted" },
                { value: "Anthropic / OpenAI / Gemini", tone: "muted" },
                { value: "모든 LLM 공급자", tone: "muted" },
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
            { label: "AI 에이전트 생성 제한", values: [{ value: "○", tone: "success" }, { value: "○", tone: "success" }, { value: "○", tone: "success" }] },
            { label: "내장 에이전트", values: [{ value: "○", tone: "success" }, { value: "○", tone: "success" }, { value: "○", tone: "success" }] },
            { label: "에이전트 스케줄링", values: [{ value: "○", tone: "success" }, { value: "○", tone: "success" }, { value: "○", tone: "success" }] },
            { label: "커스텀 LLM 모델", values: [{ value: "○", tone: "success" }, { value: "✕", tone: "danger" }, { value: "✕", tone: "danger" }] },
            {
              label: "지원",
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
      plans: ["Starter", "Team", "Enterprise"],
      cards: [
        {
          name: "Starter",
          description: "핵심 접근 제어를 빠르게 시작",
          priceLabel: "$29/월",
          href: "/docs",
          ctaLabel: "구독하기",
          features: [
            "기본 정책 관리",
            "연결 리소스 10개",
            "감사 로그 30일",
            "로그인 IP ACL",
            "이메일 지원",
          ],
        },
        {
          name: "Team",
          description: "대규모 권한 운영을 지원",
          priceLabel: "$590/월",
          href: "/docs",
          ctaLabel: "구독하기",
          features: [
            "고급 정책 관리",
            "무제한 연결 리소스",
            "감사 로그 90일",
            "DLP",
            "승인 워크플로",
            "우선 지원",
          ],
        },
        {
          name: "Enterprise",
          description: "대규모 접근제어와 컴플라이언스 운영",
          priceLabel: "문의하기",
          href: "/docs",
          ctaLabel: "지금 시작",
          tone: "primary",
          features: [
            "무제한 정책 템플릿",
            "SSO / SCIM",
            "감사 로그 180일",
            "전담 지원",
            "맞춤 컴플라이언스 제어",
            "고급 AI 보안 기능",
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
          description: "最初の AI ワークフローを始める",
          priceLabel: "$20/月",
          href: "/docs",
          ctaLabel: "購読する",
          features: [
            "月 800 クレジット",
            "カスタム AI エージェント (現時点で無制限)",
            "RAG ナレッジバンドル 3個",
            "監査ログ (最大30日)",
            "ログイン IP ACL",
          ],
        },
        {
          name: "Team",
          description: "チームでより速く運用する",
          priceLabel: "$500/月",
          href: "/docs",
          ctaLabel: "購読する",
          features: [
            "月 20,000 クレジット",
            "カスタム AI エージェント (現時点で無制限)",
            "RAG ナレッジバンドル 10個",
            "監査ログ (最大90日)",
            "DLP",
            "ログイン IP ACL",
          ],
        },
        {
          name: "Enterprise",
          description: "エンタープライズ運用のための完全な制御",
          priceLabel: "お問い合わせ",
          href: "/docs",
          ctaLabel: "今すぐ始める",
          tone: "primary",
          features: [
            "カスタム前払いクレジット",
            "無制限カスタム AI エージェント",
            "無制限 RAG ナレッジバンドル",
            "監査ログ (最大180日)",
            "SSO",
            "DLP",
            "ログイン IP ACL",
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
              label: "月額課金",
              values: [
                { value: "$20/月" },
                { value: "$500/月" },
                { value: "カスタム価格" },
              ],
            },
            {
              label: "月間クレジット",
              values: [
                { value: "800 クレジット", tone: "muted" },
                { value: "20,000 クレジット", tone: "muted" },
                { value: "カスタム前払いクレジット", tone: "muted" },
              ],
            },
            {
              label: "利用可能な LLM プロバイダ",
              values: [
                { value: "Anthropic", tone: "muted" },
                { value: "Anthropic / OpenAI / Gemini", tone: "muted" },
                { value: "任意の LLM プロバイダ", tone: "muted" },
              ],
            },
          ],
        },
        {
          title: "プラットフォーム機能",
          rows: [
            { label: "Web Search", values: [{ value: "○", tone: "success" }, { value: "○", tone: "success" }, { value: "○", tone: "success" }] },
            { label: "Insight Widgets", values: [{ value: "○", tone: "success" }, { value: "○", tone: "success" }, { value: "○", tone: "success" }] },
            { label: "Code Artifacts", values: [{ value: "○", tone: "success" }, { value: "○", tone: "success" }, { value: "○", tone: "success" }] },
            { label: "MCP Integrations", values: [{ value: "○", tone: "success" }, { value: "○", tone: "success" }, { value: "○", tone: "success" }] },
            { label: "MCP Preset Creation", values: [{ value: "○", tone: "success" }, { value: "○", tone: "success" }, { value: "○", tone: "success" }] },
            { label: "MCP Prompt Auto-Generation", values: [{ value: "○", tone: "success" }, { value: "○", tone: "success" }, { value: "○", tone: "success" }] },
            { label: "MCP Preset on 3rd Party Apps", values: [{ value: "○", tone: "success" }, { value: "○", tone: "success" }, { value: "○", tone: "success" }] },
            { label: "AI Agent Creation Limit", values: [{ value: "○", tone: "success" }, { value: "○", tone: "success" }, { value: "○", tone: "success" }] },
            { label: "Available Built-in Agents", values: [{ value: "○", tone: "success" }, { value: "○", tone: "success" }, { value: "○", tone: "success" }] },
            { label: "Agent Scheduling", values: [{ value: "○", tone: "success" }, { value: "○", tone: "success" }, { value: "○", tone: "success" }] },
            { label: "Custom LLM Model", values: [{ value: "○", tone: "success" }, { value: "✕", tone: "danger" }, { value: "✕", tone: "danger" }] },
            {
              label: "サポート",
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
      plans: ["Starter", "Team", "Enterprise"],
      cards: [
        {
          name: "Starter",
          description: "コアなアクセス制御をすばやく開始",
          priceLabel: "$29/月",
          href: "/docs",
          ctaLabel: "購読する",
          features: [
            "基本ポリシー管理",
            "接続リソース 10個",
            "監査ログ 30日",
            "ログイン IP ACL",
            "メールサポート",
          ],
        },
        {
          name: "Team",
          description: "大規模な権限運用を支援",
          priceLabel: "$590/月",
          href: "/docs",
          ctaLabel: "購読する",
          features: [
            "高度なポリシー管理",
            "無制限接続リソース",
            "監査ログ 90日",
            "DLP",
            "承認ワークフロー",
            "優先サポート",
          ],
        },
        {
          name: "Enterprise",
          description: "大規模アクセス制御とコンプライアンス運用",
          priceLabel: "お問い合わせ",
          href: "/docs",
          ctaLabel: "今すぐ始める",
          tone: "primary",
          features: [
            "無制限ポリシーテンプレート",
            "SSO / SCIM",
            "監査ログ 180日",
            "専任サポート",
            "カスタムコンプライアンス制御",
            "高度な AI セキュリティ機能",
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
