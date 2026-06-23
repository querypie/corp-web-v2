import type { Locale } from "@/constants/i18n";

export type IntegrationCategoryId =
  | "all"
  | "data-sources"
  | "containers-cloud-services"
  | "sso-identity-providers"
  | "sql-bi-tools"
  | "notification"
  | "siem-soar"
  | "monitoring"
  | "secret-stores";

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
  { id: "data-sources" },
  { id: "containers-cloud-services" },
  { id: "sso-identity-providers" },
  { id: "sql-bi-tools" },
  { id: "notification" },
  { id: "siem-soar" },
  { id: "monitoring" },
  { id: "secret-stores" },
];

export const integrationCategoryLabels: Record<Locale, Record<IntegrationCategoryId, string>> = {
  en: {
    all: "All",
    "data-sources": "Data Sources",
    "containers-cloud-services": "Containers & Cloud Services",
    "sso-identity-providers": "Single Sign-On and Identity Providers",
    "sql-bi-tools": "SQL & BI Tools",
    notification: "Notification",
    "siem-soar": "SIEM / SOAR",
    monitoring: "Monitoring",
    "secret-stores": "Secret Stores",
  },
  ko: {
    all: "전체",
    "data-sources": "데이터 소스",
    "containers-cloud-services": "컨테이너 및 클라우드 서비스",
    "sso-identity-providers": "SSO 및 ID 공급자",
    "sql-bi-tools": "SQL 및 BI 도구",
    notification: "알림",
    "siem-soar": "SIEM / SOAR",
    monitoring: "모니터링",
    "secret-stores": "시크릿 저장소",
  },
  ja: {
    all: "すべて",
    "data-sources": "データソース",
    "containers-cloud-services": "コンテナ・クラウドサービス",
    "sso-identity-providers": "SSO・IDプロバイダー",
    "sql-bi-tools": "SQL・BIツール",
    notification: "通知",
    "siem-soar": "SIEM / SOAR",
    monitoring: "モニタリング",
    "secret-stores": "シークレットストア",
  },
};

const iconBasePath = "/solutions/acp/integration-icon";

export const integrationItems: IntegrationItem[] = [
  { name: "Agit", icon: `${iconBasePath}/agit.svg`, categories: ["notification"] },
  { name: "AKS", icon: `${iconBasePath}/aks.svg`, categories: ["containers-cloud-services"] },
  { name: "Athena", icon: `${iconBasePath}/athena.svg`, categories: ["data-sources"] },
  { name: "Auth0", icon: `${iconBasePath}/auth0.svg`, categories: ["sso-identity-providers"] },
  { name: "AWS", icon: `${iconBasePath}/aws.svg`, enhanceIconContrast: true, categories: ["containers-cloud-services"] },
  { name: "Azure", icon: `${iconBasePath}/azure.svg`, categories: ["containers-cloud-services"] },
  { name: "Azure AD", icon: `${iconBasePath}/azure-ad.svg`, categories: ["sso-identity-providers"] },
  { name: "Azure SQL", icon: `${iconBasePath}/azure-sql.svg`, categories: ["data-sources"] },
  { name: "BigQuery", icon: `${iconBasePath}/big-query.svg`, categories: ["data-sources"] },
  { name: "Cassandra", icon: `${iconBasePath}/cassandra.svg`, categories: ["data-sources"] },
  { name: "ClickHouse", icon: `${iconBasePath}/clickhouse.svg`, categories: ["data-sources"] },
  { name: "Cloud SQL", icon: `${iconBasePath}/cloud-sql.svg`, categories: ["containers-cloud-services"] },
  { name: "CloudWatch", icon: `${iconBasePath}/cloud-watch.svg`, categories: ["monitoring"] },
  { name: "Databricks", icon: `${iconBasePath}/databricks.svg`, categories: ["sql-bi-tools"] },
  { name: "DataGrip", icon: `${iconBasePath}/datagrip.svg`, categories: ["sql-bi-tools"] },
  { name: "DigitalOcean", icon: `${iconBasePath}/digital-ocean.svg`, categories: ["containers-cloud-services"] },
  { name: "Docker", icon: `${iconBasePath}/docker.svg`, categories: ["containers-cloud-services"] },
  { name: "DocumentDB", icon: `${iconBasePath}/document-db.svg`, categories: ["data-sources"] },
  { name: "Dr.Sum", icon: `${iconBasePath}/dr-sum.svg`, categories: ["sql-bi-tools"] },
  { name: "DynamoDB", icon: `${iconBasePath}/dynamo-db.svg`, categories: ["data-sources"] },
  { name: "ECS", icon: `${iconBasePath}/ecs.svg`, categories: ["containers-cloud-services"] },
  { name: "EKS", icon: `${iconBasePath}/eks.svg`, categories: ["containers-cloud-services"] },
  { name: "GCP", icon: `${iconBasePath}/gcp.svg`, categories: ["containers-cloud-services"] },
  { name: "GKE", icon: `${iconBasePath}/gke.svg`, categories: ["containers-cloud-services"] },
  { name: "Gsuite", icon: `${iconBasePath}/gsuite.svg`, categories: ["sso-identity-providers"] },
  { name: "HashiCorp Vault", icon: `${iconBasePath}/hashicorp-vault.svg`, invertIcon: true, categories: ["secret-stores"] },
  { name: "HBase", icon: `${iconBasePath}/h-base.svg`, invertIcon: true, categories: ["data-sources"] },
  { name: "Heroku", icon: `${iconBasePath}/heroku.svg`, categories: ["containers-cloud-services"] },
  { name: "Hive", icon: `${iconBasePath}/hive.svg`, categories: ["sql-bi-tools"] },
  { name: "HTTP", icon: `${iconBasePath}/http.svg`, invertIcon: true, categories: ["notification"] },
  { name: "Impala", icon: `${iconBasePath}/impala.svg`, categories: ["data-sources"] },
  { name: "Kubernetes", icon: `${iconBasePath}/kubernetes.svg`, categories: ["containers-cloud-services"] },
  { name: "Looker", icon: `${iconBasePath}/looker.svg`, categories: ["sql-bi-tools"] },
  { name: "MariaDB", icon: `${iconBasePath}/maria-db.svg`, categories: ["data-sources"] },
  { name: "Mode", icon: `${iconBasePath}/mode.svg`, categories: ["sql-bi-tools"] },
  { name: "MongoDB", icon: `${iconBasePath}/mongodb.svg`, categories: ["data-sources"] },
  { name: "MySQL", icon: `${iconBasePath}/mysql.svg`, invertIcon: true, categories: ["data-sources"] },
  { name: "Okta", icon: `${iconBasePath}/okta.svg`, invertIcon: true, categories: ["sso-identity-providers"] },
  { name: "OneLogin", icon: `${iconBasePath}/one-login.svg`, categories: ["sso-identity-providers"] },
  { name: "OpenLDAP", icon: `${iconBasePath}/open-ldap.svg`, categories: ["sso-identity-providers"] },
  { name: "Oracle", icon: `${iconBasePath}/oracle.svg`, categories: ["data-sources"] },
  { name: "PostgreSQL", icon: `${iconBasePath}/postgresql.svg`, categories: ["data-sources"] },
  { name: "Power BI", icon: `${iconBasePath}/power-bi.svg`, invertIcon: true, categories: ["sql-bi-tools"] },
  { name: "Presto", icon: `${iconBasePath}/presto.svg`, categories: ["data-sources"] },
  { name: "Prometheus", icon: `${iconBasePath}/prometheus.svg`, categories: ["monitoring"] },
  { name: "Redis", icon: `${iconBasePath}/redis-icon.svg`, categories: ["data-sources"] },
  { name: "Redshift", icon: `${iconBasePath}/redshift.svg`, categories: ["data-sources"] },
  { name: "SAML", icon: `${iconBasePath}/saml.svg`, categories: ["sso-identity-providers"] },
  { name: "SAP HANA", icon: `${iconBasePath}/sap-hana.svg`, categories: ["data-sources"] },
  { name: "ScyllaDB", icon: `${iconBasePath}/scylla-db.svg`, categories: ["data-sources"] },
  { name: "SingleStore", icon: `${iconBasePath}/single-store.svg`, invertIcon: true, categories: ["data-sources"] },
  { name: "Slack", icon: `${iconBasePath}/slack.svg`, categories: ["notification"] },
  { name: "Snowflake", icon: `${iconBasePath}/snowflake.svg`, categories: ["data-sources"] },
  { name: "Spanner", icon: `${iconBasePath}/spanner.svg`, categories: ["data-sources"] },
  { name: "Splunk", icon: `${iconBasePath}/splunk.svg`, categories: ["siem-soar"] },
  { name: "SQL Server", icon: `${iconBasePath}/sql-server.svg`, categories: ["data-sources"] },
  { name: "SwivelSecure", icon: `${iconBasePath}/swivel-secure.svg`, categories: ["data-sources"] },
  { name: "Syslog", icon: `${iconBasePath}/syslog.svg`, invertIcon: true, categories: ["siem-soar"] },
  { name: "Tableau", icon: `${iconBasePath}/tableau.svg`, categories: ["sql-bi-tools"] },
  { name: "TmaxTibero", icon: `${iconBasePath}/tmax-tibero.svg`, categories: ["data-sources"] },
  { name: "Trino", icon: `${iconBasePath}/trino.svg`, categories: ["data-sources"] },
  { name: "Vertica", icon: `${iconBasePath}/vertica.svg`, invertIcon: true, categories: ["data-sources"] },
  { name: "Workbench", icon: `${iconBasePath}/workbench.svg`, categories: ["sql-bi-tools"] },
  { name: "Zeppelin", icon: `${iconBasePath}/zeppelin.svg`, categories: ["sql-bi-tools"] },
];
