import type { Locale } from "@/constants/i18n";
import { buildSolutionMdxComponents } from "@/features/solutions/mdxComponents";

type Props = {
  locale: Locale;
  searchParams?: { category?: string };
};

export default function AipIntegrationsKOSolutionContent({ locale, searchParams }: Props) {
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
  } = buildSolutionMdxComponents({ locale, searchParams }) as any;

  return (
<Box center>
    <CenterSection paddingTopSize="lg" paddingBottomSize="xl" gapSize="xxl">
        <Box direction="column" gapSize="sm">
            <StaticH1>
                {'AIP Integrations'}
            </StaticH1>
            <StaticHeader color="var(--text-body)">
                {
                    'Connect to your favorite business tools through MCP servers and automate workflows across systems, apps, and services. '
                }
                <br />
                {'Whether it\'s Slack, GitHub, AWS, databases, or workflow platforms—you\'re totally covered with AI integration!'}
            </StaticHeader>
        </Box>

        <Integrations
            basePath="/solutions/aip/integrations"
            allLabel="All"
            categories={[
                { id: '0', label: 'Workflow Automation' },
                { id: '1', label: 'Communication & Collaboration' },
                { id: '2', label: 'Customer Relationship Management' },
                { id: '3', label: 'Google Services' },
                { id: '4', label: 'Microsoft Services' },
                { id: '5', label: 'Project Management' },
                { id: '6', label: 'Development & DevOps' },
                { id: '7', label: 'Database Connections' },
                { id: '8', label: 'Search & Navigation' },
                { id: '9', label: 'Local Integrations' },
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
