import type { Locale } from "@/constants/i18n";
import { buildSolutionContentComponents } from "@/features/solutions/contentComponents";

type Props = {
  locale: Locale;
  searchParams?: { category?: string };
};

export const metadata = {
    "title": "QueryPie DAC, Database Access Controller",
    "description": "QueryPie DAC is crafted for data protection, seamlessly connectiong various cloud ecosystems. ",
    "keywords": [
      "QueryPie DAC",
      "database access controller",
      "DB access control",
      "data protection",
      "SQL editor",
      "RBAC",
      "ABAC",
      "audit"
    ]
} as const;


export default function AcpDatabaseAccessControllerENSolutionContent({ locale, searchParams }: Props) {
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
<Box direction="column">
    <Box paddingTopSize="lg" center as="section" background="dac">
        <CenterSection gapSize="xxl" center>
            <Box direction="column" gapSize="sm" center>
                <StaticH1>{'Database Access Controller'}</StaticH1>
                <StaticHeader color="var(--text-body)">
                    {
                        'QueryPie DAC is crafted for data protection in the cloud era, seamlessly connecting various cloud ecosystems.'
                    }
                    <br />
                    {
                        'It automatically identifies sensitive data and personal information, ensuring robust security for your assets.'
                    }
                </StaticHeader>
            </Box>
            <Youtube src="https://www.youtube.com/embed/SoACnHF6s3Y?si=1DSZJfMYeXjeT0kU" />
        </CenterSection>
    </Box>

    <Box paddingTopSize="ultra" paddingBottomSize="xl" center as="section">
        <CenterSection gapSize="lg">
            <Box direction="column" gapSize="sm">
                <StaticH2>{'Key Features of DAC'}</StaticH2>
                <StaticBody color="var(--text-body)">
                    {
                        'QueryPie DAC delivers dynamic access control with RBAC and ABAC, letting you manage permissions like a pro.'
                    }
                    <br />
                    {
                        'Enjoy seamless database interactions with our built-in SQL editor, while auditing keeps you updated on user activities across 20+ data sources!'
                    }
                </StaticBody>
            </Box>
            <ThreeColumnList gapSize="md">
                <KeyFeature
                    iconFilepath="public/solutions/acp/database-access-controller/iam.svg"
                    label="RBAC/ABAC Access Control"
                    description="Manage access effortlessly with controls based on user roles and attributes like time, day, IP address, SQL type, and more."
                />
                <KeyFeature
                    iconFilepath="public/solutions/acp/database-access-controller/web-editor.svg"
                    label="Built-in Web SQL Editor "
                    description="Enjoy a web SQL editor that connects you to databases, allowing you to run queries and import/export data directly from your browser—no separate client needed."
                />
                <KeyFeature
                    iconFilepath="public/solutions/acp/database-access-controller/alert.svg"
                    label="Data Audit & Alert"
                    description="Stay informed by tracking user activities, including logins, database access, privilege changes, SQL commands, and query results to catch any unusual behavior."
                />
                <KeyFeature
                    iconFilepath="public/solutions/acp/database-access-controller/table-access-control.svg"
                    label="Table/Column Level Access Control"
                    description="Protect sensitive information by applying data masking policies and set access limits on important tables and columns with specific query rules."
                />
                <KeyFeature
                    iconFilepath="public/solutions/acp/database-access-controller/workflow.svg"
                    label="Just-in-Time Access Requests"
                    description="Request access when you need it, and let admins approve and grant permissions on the spot, with seamless integrations like Slack."
                />
            </ThreeColumnList>
        </CenterSection>
    </Box>

    <Box paddingTopSize="xl" paddingBottomSize="xl" center as="section">
        <CenterSection gapSize="xxl">
            <Box direction="column" gapSize="sm">
                <StaticH2>{'How QueryPie DAC Works'}</StaticH2>
                <StaticBody color="var(--text-body)">
                    {
                        "QueryPie adapts to your enterprise's unique environment, offering flexible workspaces to enhance security."
                    }
                    <br />
                    {'Utilize the browser-based QueryPie web SQL editor to strengthen data leakage controls.'}
                    <br />
                    {
                        'For 3rd-party tools, access the QueryPie Proxy Server via Agent or Agentless (URL Proxy) methods for seamless integration and protection.'
                    }
                </StaticBody>
            </Box>
            <Box as="section" center>
                <div style={{ maxWidth: '1000px' }}>
                    <FileImage
                        alt="How QueryPie DAC Works"
                        filepath="public/solutions/acp/database-access-controller/works.png"
                        width={1000}
                        height={400}
                        responsive
                    />
                </div>
            </Box>
        </CenterSection>
    </Box>

    <Box paddingTopSize="xl" paddingBottomSize="xl" center as="section">
        <CenterSection gapSize="xxl">
            <Box direction="column" gapSize="sm">
                <StaticH2>
                    {'QueryPie Universal Analyzer:'}
                    <br />
                    {'Speak Any Query Language'}
                </StaticH2>
                <StaticBody color="var(--text-body)">
                    {
                        "QueryPie bridges the gap between diverse data sources with its unique query analyzer. It interprets and simplifies complex queries from any platform, transforming them into a unified format. This allows you to apply generalized access control policies effortlessly, ensuring seamless and consistent data security across your entire environment. Unlock universal compatibility with QueryPie!"
                    }
                </StaticBody>
            </Box>
            <Box as="section" center>
                <div style={{ maxWidth: '1000px' }}>
                    <LottiePlayer src="/solutions/acp/database-access-controller/dac-analyzer.json" loop>
                        <FileImage
                            alt="QueryPie Universal Analyzer"
                            filepath="public/solutions/acp/database-access-controller/analyzer.png"
                            width={1000}
                            height={420}
                            responsive
                        />
                    </LottiePlayer>
                </div>
            </Box>
        </CenterSection>
    </Box>

    <Box paddingTopSize="xl" paddingBottomSize="ultra" center as="section">
        <CenterSection gapSize="xl">
            <Box direction="column" gapSize="sm">
                <StaticH2>{'Easy Installation, Easy Use'}</StaticH2>
                <StaticBody color="var(--text-body)">
                    {
                        'QueryPie merges cloud-native technology with a web-based interface for effortless installation and operation across various operating systems.'
                    }
                    <br />
                    {
                        'Packaged with Docker, it enables easy deployment and a hybrid approach that blends on-premises security with SaaS-like update convenience.'
                    }
                    <br />
                    {
                        'This design supports compliance in finance, healthcare, and public sectors while allowing for immediate rollback if issues arise.'
                    }
                    <br />
                    {
                        'QueryPie offers the best of both worlds: the convenience of SaaS and the robust security of on-premises solutions, all focused on delivering customer value.'
                    }
                </StaticBody>
            </Box>
            <Box as="section" center>
                <div style={{ maxWidth: '1000px' }}>
                    <FileImage
                        alt="Easy Installation, Easy Use"
                        filepath="public/solutions/acp/database-access-controller/easy-use.png"
                        width={1000}
                        height={440}
                        responsive
                    />
                </div>
            </Box>
        </CenterSection>
    </Box>

    <Box paddingTopSize="md" paddingBottomSize="md" center as="section" background="gray">
        <CenterSection>
            <SplitView gapSize="xxl" breakpoint="md" useNoGapWhenMobile>
                <SplitView.View verticalCenter>
                    <Box direction="column" gapSize="sm">
                        <StaticH4>{'User-friendly Web SQL Editor'}</StaticH4>
                        <StaticBody color="var(--text-body)">
                            {
                                'Forget about needing a separate IDE! Our Web SQL Editor lets you easily run queries, import, export, and do various tasks right in your browser, no matter what operating system you use.'
                            }
                        </StaticBody>
                    </Box>
                </SplitView.View>
                <SplitView.View fixWidth="51.7%">
                    <FileImage
                        alt="User-friendly Web SQL Editor"
                        filepath="public/solutions/acp/database-access-controller/sql-editor.png"
                        width={620}
                        height={530}
                        responsive
                    />
                </SplitView.View>
            </SplitView>
        </CenterSection>
    </Box>

    <Box paddingTopSize="md" paddingBottomSize="md" center as="section">
        <CenterSection>
            <SplitView gapSize="xxl" breakpoint="md" reverse useNoGapWhenMobile>
                <SplitView.View fixWidth="50%">
                    <FileImage
                        alt="Secure Proxy Access for 3rd Party Tools"
                        filepath="public/solutions/acp/database-access-controller/third-party-tools.png"
                        width={600}
                        height={380}
                        responsive
                    />
                </SplitView.View>
                <SplitView.View verticalCenter>
                    <Box direction="column" gapSize="sm">
                        <StaticH4>
                            {'Secure Proxy Access for'}
                            <br />
                            {'3rd Party Tools'}
                        </StaticH4>
                        <StaticBody color="var(--text-body)">
                            {
                                'Connect to your databases safely with our Proxy Server for third-party tools! With both Agent and Agentless options, you get the same strong access control and policies as you do with QueryPie.'
                            }
                        </StaticBody>
                    </Box>
                </SplitView.View>
            </SplitView>
        </CenterSection>
    </Box>

    <Box paddingTopSize="md" paddingBottomSize="md" center as="section" background="gray">
        <CenterSection>
            <SplitView gapSize="xxl" breakpoint="md" useNoGapWhenMobile>
                <SplitView.View verticalCenter>
                    <Box direction="column" gapSize="sm">
                        <StaticH4>{'Control of Execution Statements Integrated with Database'}</StaticH4>
                        <StaticBody color="var(--text-body)">
                            {
                                'Manage your execution statements with ease! Use standard SQL for DML, DCL, and DDL while overseeing access across RDBMS, Data Warehouses, and NoSQL. Redis users can manage over 200 commands, and MongoDB Shell supports standard SQL control too!'
                            }
                        </StaticBody>
                    </Box>
                </SplitView.View>
                <SplitView.View fixWidth="53.3%">
                    <FileImage
                        alt="Control of Execution Statements Integrated with Database"
                        filepath="public/solutions/acp/database-access-controller/db-control.png"
                        width={640}
                        height={760}
                        responsive
                    />
                </SplitView.View>
            </SplitView>
        </CenterSection>
    </Box>

    <Box paddingTopSize="md" paddingBottomSize="md" center as="section">
        <CenterSection>
            <SplitView gapSize="xxl" breakpoint="md" reverse useNoGapWhenMobile>
                <SplitView.View fixWidth="53.3%">
                    <FileImage
                        alt="Sensitive Data Masking Processing Protection"
                        filepath="public/solutions/acp/database-access-controller/data-masking.png"
                        width={640}
                        height={660}
                        responsive
                    />
                </SplitView.View>
                <SplitView.View verticalCenter>
                    <Box direction="column" gapSize="sm">
                        <StaticH4>{'Sensitive Data Masking Processing Protection'}</StaticH4>
                        <StaticBody color="var(--text-body)">
                            {
                                'Keep your data safe! Our masking features protect sensitive and personal information with preset patterns and custom rules, ensuring unauthorized users can’t access it.'
                            }
                        </StaticBody>
                    </Box>
                </SplitView.View>
            </SplitView>
        </CenterSection>
    </Box>

    <Box paddingTopSize="md" paddingBottomSize="md" center as="section" background="gray">
        <CenterSection>
            <SplitView gapSize="xxl" breakpoint="md" useNoGapWhenMobile>
                <SplitView.View verticalCenter>
                    <Box direction="column" gapSize="sm">
                        <StaticH4>{'Control of Ledger Tables'}</StaticH4>
                        <StaticBody color="var(--text-body)">
                            {
                                'Manage your data easily with built-in workflows that approve changes to important tables. Track results before and after changes for smooth configuration management!'
                            }
                        </StaticBody>
                    </Box>
                </SplitView.View>
                <SplitView.View fixWidth="53.3%">
                    <FileImage
                        alt="Control of Ledger Tables"
                        filepath="public/solutions/acp/database-access-controller/ledger.png"
                        width={640}
                        height={670}
                        responsive
                    />
                </SplitView.View>
            </SplitView>
        </CenterSection>
    </Box>

    <Box paddingTopSize="md" paddingBottomSize="lg" center as="section">
        <CenterSection>
            <SplitView gapSize="xxl" breakpoint="md" reverse useNoGapWhenMobile>
                <SplitView.View fixWidth="51.7%">
                    <FileImage
                        alt="Process Automation of Authorization & SQL Approval"
                        filepath="public/solutions/acp/database-access-controller/workflow.png"
                        width={620}
                        height={670}
                        responsive
                    />
                </SplitView.View>
                <SplitView.View verticalCenter>
                    <Box direction="column" gapSize="sm">
                        <StaticH4>{'Process Automation of Authorization & SQL Approval'}</StaticH4>
                        <StaticBody color="var(--text-body)">
                            {
                                'Simplify your workflow with customizable templates that let admins set up approval processes! When users without permission request database access or changes, our automated workflow steps in to ensure everything runs smoothly.'
                            }
                        </StaticBody>
                    </Box>
                </SplitView.View>
            </SplitView>
        </CenterSection>
    </Box>
</Box>
  );
}
