import type { Locale } from "@/constants/i18n";

export type IntegrationCategoryId =
  | "all"
  | "workflow-automation"
  | "communication-collaboration"
  | "customer-relationship-management"
  | "google-services"
  | "microsoft-services"
  | "project-management"
  | "development-devops"
  | "database-connections"
  | "search-navigation"
  | "local-integrations";

export type IntegrationItem = {
  categories: Exclude<IntegrationCategoryId, "all">[];
  enhanceIconContrast?: boolean;
  icon: string;
  invertIcon?: boolean;
  name: string;
};

export const integrationCategories: ReadonlyArray<{
  id: IntegrationCategoryId;
}> = [
  { id: "all" },
  { id: "workflow-automation" },
  { id: "communication-collaboration" },
  { id: "customer-relationship-management" },
  { id: "google-services" },
  { id: "microsoft-services" },
  { id: "project-management" },
  { id: "development-devops" },
  { id: "database-connections" },
  { id: "search-navigation" },
  { id: "local-integrations" },
];

export const integrationCategoryLabels: Record<Locale, Record<IntegrationCategoryId, string>> = {
  en: {
    all: "All",
    "workflow-automation": "Workflow Automation",
    "communication-collaboration": "Communication & Collaboration",
    "customer-relationship-management": "Customer Relationship Management",
    "google-services": "Google Services",
    "microsoft-services": "Microsoft Services",
    "project-management": "Project Management",
    "development-devops": "Development & DevOps",
    "database-connections": "Database Connections",
    "search-navigation": "Search & Navigation",
    "local-integrations": "Local Integrations",
  },
  ko: {
    all: "전체",
    "workflow-automation": "워크플로 자동화",
    "communication-collaboration": "커뮤니케이션 및 협업",
    "customer-relationship-management": "고객 관계 관리",
    "google-services": "Google 서비스",
    "microsoft-services": "Microsoft 서비스",
    "project-management": "프로젝트 관리",
    "development-devops": "개발 및 DevOps",
    "database-connections": "데이터베이스 연결",
    "search-navigation": "검색 및 내비게이션",
    "local-integrations": "로컬 연동",
  },
  ja: {
    all: "すべて",
    "workflow-automation": "ワークフロー自動化",
    "communication-collaboration": "コミュニケーション・コラボレーション",
    "customer-relationship-management": "顧客関係管理",
    "google-services": "Googleサービス",
    "microsoft-services": "Microsoftサービス",
    "project-management": "プロジェクト管理",
    "development-devops": "開発・DevOps",
    "database-connections": "データベース接続",
    "search-navigation": "検索・ナビゲーション",
    "local-integrations": "ローカル連携",
  },
};

const iconBasePath = "/solutions/aip/integration-icon";

export const integrationItems: IntegrationItem[] = [
  { name: "AirTable", icon: `${iconBasePath}/airtable.svg`, categories: ["database-connections"] },
  { name: "AWS", icon: `${iconBasePath}/aws.svg`, categories: ["development-devops"] },
  { name: "Brave Search", icon: `${iconBasePath}/brave-search.svg`, categories: ["search-navigation"] },
  { name: "ClickHouse", icon: `${iconBasePath}/clickhouse.svg`, categories: ["database-connections"] },
  { name: "Code Executor", icon: `${iconBasePath}/querypie.svg`, categories: ["development-devops"] },
  { name: "Confluence Cloud", icon: `${iconBasePath}/confluence.svg`, categories: ["project-management"] },
  { name: "Context7", icon: `${iconBasePath}/context7.svg`, categories: ["development-devops"] },
  { name: "Datadog", icon: `${iconBasePath}/datadog.svg`, categories: ["development-devops"] },
  { name: "Daum Search", icon: `${iconBasePath}/daum-search.svg`, invertIcon: true, categories: ["search-navigation"] },
  { name: "Dify API Access", icon: `${iconBasePath}/dify.svg`, categories: ["workflow-automation"] },
  { name: "Discord", icon: `${iconBasePath}/discord.svg`, categories: ["communication-collaboration"] },
  { name: "Discord with OAuth", icon: `${iconBasePath}/discord.svg`, categories: ["communication-collaboration"] },
  { name: "Filesystem", icon: `${iconBasePath}/mcp.svg`, invertIcon: true, categories: ["development-devops", "local-integrations"] },
  { name: "GitHub", icon: `${iconBasePath}/github.svg`, invertIcon: true, categories: ["communication-collaboration"] },
  { name: "Google Calendar", icon: `${iconBasePath}/google-calendar.svg`, categories: ["google-services"] },
  { name: "Google Drive", icon: `${iconBasePath}/google-drive.svg`, categories: ["google-services"] },
  { name: "Google Gmail", icon: `${iconBasePath}/google-gmail.svg`, categories: ["google-services"] },
  { name: "Google Sheets", icon: `${iconBasePath}/google-sheets.svg`, categories: ["google-services"] },
  { name: "Google Slides", icon: `${iconBasePath}/google-slides.svg`, categories: ["google-services"] },
  { name: "Grafana", icon: `${iconBasePath}/grafana.svg`, categories: ["development-devops"] },
  { name: "Jira Cloud", icon: `${iconBasePath}/jira.svg`, categories: ["project-management"] },
  { name: "Kakao Map", icon: `${iconBasePath}/kakao.svg`, categories: ["search-navigation"] },
  { name: "Kakao Navigation", icon: `${iconBasePath}/kakao.svg`, categories: ["search-navigation"] },
  { name: "Kubernetes", icon: `${iconBasePath}/kubernetes.svg`, categories: ["development-devops"] },
  { name: "MariaDB", icon: `${iconBasePath}/maria-db.svg`, categories: ["database-connections"] },
  { name: "Microsoft 365", icon: `${iconBasePath}/microsoft-365.svg`, categories: ["microsoft-services"] },
  { name: "MySQL", icon: `${iconBasePath}/mysql.svg`, categories: ["database-connections"] },
  { name: "n8n Chat", icon: `${iconBasePath}/n8n-chat.svg`, invertIcon: true, categories: ["workflow-automation"] },
  { name: "n8n Webhook", icon: `${iconBasePath}/n8n-webhook.svg`, invertIcon: true, categories: ["workflow-automation"] },
  { name: "Naver Search", icon: `${iconBasePath}/naver-search.svg`, categories: ["search-navigation"] },
  { name: "Notion", icon: `${iconBasePath}/notion.svg`, categories: ["communication-collaboration"] },
  { name: "Oracle Database", icon: `${iconBasePath}/oracle.svg`, categories: ["database-connections"] },
  { name: "Perplexity Ask", icon: `${iconBasePath}/perplexity-ask.svg`, categories: ["search-navigation"] },
  { name: "PostgreSQL", icon: `${iconBasePath}/postgresql.svg`, categories: ["database-connections"] },
  { name: "QueryPie Customer Center", icon: `${iconBasePath}/querypie.svg`, categories: ["development-devops"] },
  { name: "Redis", icon: `${iconBasePath}/redis.svg`, categories: ["database-connections"] },
  { name: "Salesforce", icon: `${iconBasePath}/salesforce.svg`, categories: ["customer-relationship-management"] },
  { name: "Salesforce with OAuth", icon: `${iconBasePath}/salesforce.svg`, categories: ["customer-relationship-management"] },
  { name: "Sequential Thinking", icon: `${iconBasePath}/querypie.svg`, categories: ["workflow-automation"] },
  { name: "Slack", icon: `${iconBasePath}/slack.svg`, categories: ["communication-collaboration"] },
  { name: "Snowflake", icon: `${iconBasePath}/snowflake.svg`, categories: ["database-connections"] },
  { name: "SQL Server", icon: `${iconBasePath}/sql-server.svg`, categories: ["database-connections"] },
  { name: "SSH", icon: `${iconBasePath}/ssh.svg`, categories: ["development-devops"] },
  { name: "Supabase", icon: `${iconBasePath}/supabase.svg`, categories: ["development-devops", "database-connections"] },
  { name: "Terminal", icon: `${iconBasePath}/ssh.svg`, categories: ["development-devops", "local-integrations"] },
];
