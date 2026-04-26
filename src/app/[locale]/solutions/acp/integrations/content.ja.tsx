import type { Locale } from "@/constants/i18n";
import { buildSolutionContentComponents } from "@/features/solutions/contentComponents";

type Props = {
  locale: Locale;
  searchParams?: { category?: string };
};

export default function AcpIntegrationsJASolutionContent({ locale, searchParams }: Props) {
  const {
    Box,
    CenterSection,
    DarkBadge,
    FileImage,
    Integrations,
    IntroducingQueryPie,
    KeyFeature,
    KillerFeature,
    KillerFeatureCategory,
    KillerFeatures,
    LearnMoreLink,
    Link,
    LottiePlayer,
    MainFeatureDescription,
    SplitView,
    StaticBody,
    StaticH1,
    StaticH2,
    StaticH4,
    StaticHeader,
    ThreeColumnList,
    ThumbnailYoutube,
    Youtube
  } = buildSolutionContentComponents({ locale, searchParams }) as any;

  return (
<Box center>
    <CenterSection paddingTopSize="lg" paddingBottomSize="xl" gapSize="xxl">
        <Box direction="column" gapSize="sm">
            <StaticH1>
                {'ACP統合機能'}
            </StaticH1>
            <StaticHeader color="var(--text-body)">
                {
                    '50種類以上の組み込み統合機能を装備し、アクセス制御を一元管理。'
                }
                <br />
                {
                    'お使いのデータソースに直接接続し、すべてのシステム、アプリ、サービスを完全に可視化します。'
                }
                <br />
                {
                    'データベース、サーバー、Kubernetes、Webアプリケーションなど、幅広く対応しています。'
                }
            </StaticHeader>
        </Box>

        <Integrations
            basePath="/solutions/acp/integrations"
            allLabel="すべて"
            categories={[
                { id: '0', label: 'データソース' },
                { id: '1', label: 'コンテナとクラウドサービス' },
                { id: '2', label: 'シングルサインオンとアイデンティティプロバイダー' },
                { id: '3', label: 'SQL および BI ツール' },
                { id: '4', label: '通知' },
                { id: '5', label: 'SIEM / SOAR' },
                { id: '6', label: 'モニタリング' },
                { id: '7', label: 'シークレットストア' },
            ]}
            products={[
                {
                    categoryIds: ['4'],
                    label: 'Agit',
                    svgFilename: 'agit-icon',
                },
                {
                    categoryIds: ['1'],
                    label: 'AKS',
                    svgFilename: 'aks-icon',
                },
                {
                    categoryIds: ['0'],
                    label: 'Athena',
                    svgFilename: 'athena-icon',
                },
                {
                    categoryIds: ['2'],
                    label: 'Auth0',
                    svgFilename: 'auth0-icon',
                },
                {
                    categoryIds: ['1'],
                    label: 'AWS',
                    svgFilename: 'aws-icon',
                },
                {
                    categoryIds: ['1'],
                    label: 'Azure',
                    svgFilename: 'azure-icon',
                },
                {
                    categoryIds: ['2'],
                    label: 'Azure AD',
                    svgFilename: 'azure-ad-icon',
                },
                {
                    categoryIds: ['0'],
                    label: 'Azure SQL',
                    svgFilename: 'azure-sql-icon',
                },
                {
                    categoryIds: ['0'],
                    label: 'BigQuery',
                    svgFilename: 'big-query-icon',
                },
                {
                    categoryIds: ['0'],
                    label: 'Cassandra',
                    svgFilename: 'cassandra-icon',
                },
                {
                    categoryIds: ['0'],
                    label: 'ClickHouse',
                    svgFilename: 'clickhouse',
                },
                {
                    categoryIds: ['1'],
                    label: 'Cloud SQL',
                    svgFilename: 'cloud-sql-icon',
                },
                {
                    categoryIds: ['6'],
                    label: 'CloudWatch',
                    svgFilename: 'cloud-watch-icon',
                },
                {
                    categoryIds: ['3'],
                    label: 'Databricks',
                    svgFilename: 'databricks-icon',
                },
                {
                    categoryIds: ['3'],
                    label: 'DataGrip',
                    svgFilename: 'datagrip-icon',
                },
                {
                    categoryIds: ['1'],
                    label: 'DigitalOcean',
                    svgFilename: 'digital-ocean-icon',
                },
                {
                    categoryIds: ['1'],
                    label: 'Docker',
                    svgFilename: 'docker-icon',
                },
                {
                    categoryIds: ['0'],
                    label: 'DocumentDB',
                    svgFilename: 'document-db-icon',
                },
                {
                    categoryIds: ['3'],
                    label: 'Dr.Sum',
                    svgFilename: 'dr-sum-icon',
                },
                {
                    categoryIds: ['0'],
                    label: 'DynamoDB',
                    svgFilename: 'dynamo-db-icon',
                },
                {
                    categoryIds: ['1'],
                    label: 'ECS',
                    svgFilename: 'ecs-icon',
                },
                {
                    categoryIds: ['1'],
                    label: 'EKS',
                    svgFilename: 'eks-icon',
                },
                {
                    categoryIds: ['1'],
                    label: 'GCP',
                    svgFilename: 'gcp-icon',
                },
                {
                    categoryIds: ['1'],
                    label: 'GKE',
                    svgFilename: 'gke-icon',
                },
                {
                    categoryIds: ['2'],
                    label: 'Gsuite',
                    svgFilename: 'gsuite-icon',
                },
                {
                    categoryIds: ['0'],
                    label: 'HBase',
                    svgFilename: 'h-base-icon',
                },
                {
                    categoryIds: ['7'],
                    label: 'HashiCorp Vault',
                    svgFilename: 'hashicorp-vault-icon',
                },
                {
                    categoryIds: ['1'],
                    label: 'Heroku',
                    svgFilename: 'heroku-icon',
                },
                {
                    categoryIds: ['3'],
                    label: 'Hive',
                    svgFilename: 'hive-icon',
                },
                {
                    categoryIds: ['4'],
                    label: 'HTTP',
                    svgFilename: 'http-icon',
                },
                {
                    categoryIds: ['0'],
                    label: 'Impala',
                    svgFilename: 'impala-icon',
                },
                {
                    categoryIds: ['1'],
                    label: 'Kubernetes',
                    svgFilename: 'kubernetes-icon',
                },
                {
                    categoryIds: ['3'],
                    label: 'Looker',
                    svgFilename: 'looker-icon',
                },
                {
                    categoryIds: ['0'],
                    label: 'MariaDB',
                    svgFilename: 'maria-db-icon',
                },
                {
                    categoryIds: ['3'],
                    label: 'Mode',
                    svgFilename: 'mode-icon',
                },
                {
                    categoryIds: ['0'],
                    label: 'MongoDB',
                    svgFilename: 'mongodb-icon',
                },
                {
                    categoryIds: ['0'],
                    label: 'MySQL',
                    svgFilename: 'mysql-icon',
                },
                {
                    categoryIds: ['2'],
                    label: 'Okta',
                    svgFilename: 'okta-icon',
                },
                {
                    categoryIds: ['2'],
                    label: 'OneLogin',
                    svgFilename: 'one-login-icon',
                },
                {
                    categoryIds: ['2'],
                    label: 'OpenLDAP',
                    svgFilename: 'open-ldap-icon',
                },
                {
                    categoryIds: ['0'],
                    label: 'Oracle',
                    svgFilename: 'oracle-icon',
                },
                {
                    categoryIds: ['0'],
                    label: 'PostgreSQL',
                    svgFilename: 'postgresql-icon',
                },
                {
                    categoryIds: ['3'],
                    label: 'Power BI',
                    svgFilename: 'power-bi-icon',
                },
                {
                    categoryIds: ['0'],
                    label: 'Presto',
                    svgFilename: 'presto-icon',
                },
                {
                    categoryIds: ['6'],
                    label: 'Prometheus',
                    svgFilename: 'prometheus-icon',
                },
                {
                    categoryIds: ['0'],
                    label: 'Redis',
                    svgFilename: 'redis-icon',
                },
                {
                    categoryIds: ['0'],
                    label: 'Redshift',
                    svgFilename: 'redshift-icon',
                },
                {
                    categoryIds: ['2'],
                    label: 'SAML',
                    svgFilename: 'saml-icon',
                },
                {
                    categoryIds: ['0'],
                    label: 'SAP HANA',
                    svgFilename: 'sap-hana-icon',
                },
                {
                    categoryIds: ['0'],
                    label: 'ScyllaDB',
                    svgFilename: 'scylla-db-icon',
                },
                {
                    categoryIds: ['0'],
                    label: 'SingleStore',
                    svgFilename: 'single-store-icon',
                },
                {
                    categoryIds: ['4'],
                    label: 'Slack',
                    svgFilename: 'slack-icon',
                },
                {
                    categoryIds: ['0'],
                    label: 'Snowflake',
                    svgFilename: 'snowflake-icon',
                },
                {
                    categoryIds: ['0'],
                    label: 'Spanner',
                    svgFilename: 'spanner-icon',
                },
                {
                    categoryIds: ['5'],
                    label: 'Splunk',
                    svgFilename: 'splunk-icon',
                },
                {
                    categoryIds: ['0'],
                    label: 'SQL Server',
                    svgFilename: 'sql-server-icon',
                },
                {
                    categoryIds: ['0'],
                    label: 'SwivelSecure',
                    svgFilename: 'swivel-secure-icon',
                },
                {
                    categoryIds: ['5'],
                    label: 'Syslog',
                    svgFilename: 'syslog-icon',
                },
                {
                    categoryIds: ['3'],
                    label: 'Tableau',
                    svgFilename: 'tableau-icon',
                },
                {
                    categoryIds: ['0'],
                    label: 'TmaxTibero',
                    svgFilename: 'tmax-tibero-icon',
                },
                {
                    categoryIds: ['0'],
                    label: 'Trino',
                    svgFilename: 'trino-icon',
                },
                {
                    categoryIds: ['0'],
                    label: 'Vertica',
                    svgFilename: 'vertica-icon',
                },
                {
                    categoryIds: ['3'],
                    label: 'Workbench',
                    svgFilename: 'workbench-icon',
                },
                {
                    categoryIds: ['3'],
                    label: 'Zeppelin',
                    svgFilename: 'zeppelin-icon',
                },
            ]}
        />
    </CenterSection>
</Box>
  );
}
