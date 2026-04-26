import type { Locale } from "@/constants/i18n";
import { buildSolutionContentComponents } from "@/features/solutions/contentComponents";

type Props = {
  locale: Locale;
  searchParams?: { category?: string };
};

export default function AipIntegrationsJASolutionContent({ locale, searchParams }: Props) {
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
                {'AIPインテグレーション'}
            </StaticH1>
            <StaticHeader color="var(--text-body)">
                {
                    'MCPサーバーを介してお使いのビジネスツールに接続。システム、アプリ、サービス間のワークフローを自動化します。'
                }
                <br />
                {'Slack、GitHub、AWS、データベース、ワークフロープラットフォームなど、AI統合であらゆるニーズに対応します。'}
            </StaticHeader>
        </Box>

        <Integrations
            basePath="/solutions/aip/integrations"
            allLabel="全て"
            categories={[
                { id: '0', label: 'ワークフロー自動化' },
                { id: '1', label: 'コミュニケーション & コラボレーション' },
                { id: '2', label: '顧客関係管理' },
                { id: '3', label: 'Googleサービス' },
                { id: '4', label: 'Microsoftサービス' },                
                { id: '5', label: 'プロジェクト管理' },
                { id: '6', label: '開発 & DevOps' },
                { id: '7', label: 'データベース接続' },
                { id: '8', label: '検索 & ナビゲーション' },
                { id: '9', label: 'ローカル統合' },
            ]}
            products={[
                {
                    categoryIds: ['7'],
                    label: 'AirTable',
                    svgFilename: 'airtable',
                },
                {
                    categoryIds: ['6'],
                    label: 'AWS',
                    svgFilename: 'aws-icon',
                },
                {
                    categoryIds: ['8'],
                    label: 'Brave Search',
                    svgFilename: 'brave-search',
                },
                {
                    categoryIds: ['7'],
                    label: 'ClickHouse',
                    svgFilename: 'clickhouse',
                },
                {
                    categoryIds: ['6'],
                    label: 'Code Executor',
                    svgFilename: 'querypie',
                },
                {
                    categoryIds: ['5'],
                    label: 'Confluence Cloud',
                    svgFilename: 'confluence',
                },
                {
                    categoryIds: ['6'],
                    label: 'Context7',
                    svgFilename: 'context7',
                },
                {
                    categoryIds: ['6'],
                    label: 'Datadog',
                    svgFilename: 'datadog',
                },
                {
                    categoryIds: ['8'],
                    label: 'Daum Search',
                    svgFilename: 'daum-search',
                },
                {
                    categoryIds: ['0'],
                    label: 'Dify API Access',
                    svgFilename: 'dify',
                },
                {
                    categoryIds: ['1'],
                    label: 'Discord',
                    svgFilename: 'discord',
                },
                {
                    categoryIds: ['1'],
                    label: 'Discord with OAuth',
                    svgFilename: 'discord',
                },
                {
                    categoryIds: ['6','9'],
                    label: 'Filesystem',
                    svgFilename: 'mcp',
                },
                {
                    categoryIds: ['1'],
                    label: 'GitHub',
                    svgFilename: 'github',
                },
                {
                    categoryIds: ['3'],
                    label: 'Google Calendar',
                    svgFilename: 'google-calendar',
                },
                {
                    categoryIds: ['3'],
                    label: 'Google Drive',
                    svgFilename: 'google-drive',
                },
                {
                    categoryIds: ['3'],
                    label: 'Google Gmail',
                    svgFilename: 'google-gmail',
                },
                {
                    categoryIds: ['3'],
                    label: 'Google Sheets',
                    svgFilename: 'google-sheets',
                },
                {
                    categoryIds: ['3'],
                    label: 'Google Slides',
                    svgFilename: 'google-slides',
                },
                {
                    categoryIds: ['6'],
                    label: 'Grafana',
                    svgFilename: 'grafana',
                },
                {
                    categoryIds: ['5'],
                    label: 'Jira Cloud',
                    svgFilename: 'jira',
                },
                {
                    categoryIds: ['8'],
                    label: 'Kakao Map',
                    svgFilename: 'kakao',
                },
                {
                    categoryIds: ['8'],
                    label: 'Kakao Navigation',
                    svgFilename: 'kakao',
                },
                {
                    categoryIds: ['6'],
                    label: 'Kubernetes',
                    svgFilename: 'kubernetes-icon',
                },
                {
                    categoryIds: ['7'],
                    label: 'MariaDB',
                    svgFilename: 'maria-db-icon',
                },
                {
                    categoryIds: ['4'],
                    label: 'Microsoft 365',
                    svgFilename: 'microsoft-365',
                },
                {
                    categoryIds: ['7'],
                    label: 'MySQL',
                    svgFilename: 'mysql-icon',
                },
                {
                    categoryIds: ['0'],
                    label: 'n8n Chat',
                    svgFilename: 'n8n-chat',
                },
                {
                    categoryIds: ['0'],
                    label: 'n8n Webhook',
                    svgFilename: 'n8n-webhook',
                },
                {
                    categoryIds: ['8'],
                    label: 'Naver Search',
                    svgFilename: 'naver-search',
                },
                {
                    categoryIds: ['1'],
                    label: 'Notion',
                    svgFilename: 'notion',
                },
                {
                    categoryIds: ['7'],
                    label: 'Oracle Database',
                    svgFilename: 'oracle-icon',
                },
                {
                    categoryIds: ['8'],
                    label: 'Perplexity Ask',
                    svgFilename: 'perplexity-ask',
                },
                {
                    categoryIds: ['7'],
                    label: 'PostgreSQL',
                    svgFilename: 'postgresql-icon',
                },
                {
                    categoryIds: ['6'],
                    label: 'QueryPie Customer Center',
                    svgFilename: 'querypie',
                },
                {
                    categoryIds: ['7'],
                    label: 'Redis',
                    svgFilename: 'redis-icon',
                },
                {
                    categoryIds: ['2'],
                    label: 'Salesforce',
                    svgFilename: 'salesforce',
                },
                {
                    categoryIds: ['2'],
                    label: 'Salesforce with OAuth',
                    svgFilename: 'salesforce',
                },
                {
                    categoryIds: ['0'],
                    label: 'Sequential Thinking',
                    svgFilename: 'querypie',
                },
                {
                    categoryIds: ['1'],
                    label: 'Slack',
                    svgFilename: 'slack-icon',
                },
                {
                    categoryIds: ['7'],
                    label: 'Snowflake',
                    svgFilename: 'snowflake-icon',
                },
                {
                    categoryIds: ['7'],
                    label: 'SQL Server',
                    svgFilename: 'sql-server-icon',
                },
                {
                    categoryIds: ['6'],
                    label: 'SSH',
                    svgFilename: 'ssh',
                },
                {
                    categoryIds: ['6', '7'],
                    label: 'Supabase',
                    svgFilename: 'supabase',
                },
                {
                    categoryIds: ['6','9'],
                    label: 'Terminal',
                    svgFilename: 'ssh',
                },
            ]}
        />
    </CenterSection>
</Box>
  );
}
