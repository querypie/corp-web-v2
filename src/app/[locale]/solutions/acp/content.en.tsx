import type { Locale } from "@/constants/i18n";
import { buildSolutionContentComponents } from "@/features/solutions/contentComponents";

type Props = {
  locale: Locale;
  searchParams?: { category?: string };
};

export const metadata = {
    "title": "QueryPie Access Control Platform (ACP)",
    "description": "The platform that delivers comprehensive access management across data and infrastructure—optimized for AI agent connectivity and automated governance capabilities.",
    "keywords": [
      "QueryPie ACP",
      "Access Control Platform",
      "database access control",
      "data access control",
      "system access control",
      "kubernetes access control",
      "web access control",
      "data protection",
      "SQL editor",
      "AI Agent connectivity",
      "RBAC",
      "ABAC",
      "audit"
    ]
} as const;


export default function AcpENSolutionContent({ locale, searchParams }: Props) {
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
                <StaticH1>{'QueryPie Access Control Platform (ACP)'}</StaticH1>
                <StaticHeader color="var(--text-body)">
                    {
                        'The platform that delivers comprehensive access management across data and infrastructure—'
                    }
                    <br />
                    {
                        'optimized for AI agent connectivity and automated governance capabilities.'
                    }
                    <br />
                    {
                        'Transform complex infrastructure into an AI-accessible ecosystem.'
                    }
                </StaticHeader>
            </Box>
            <Youtube src="https://www.youtube.com/embed/AWnknC76Jpo?si=5M5QNi83zyyHD2V3" />
        </CenterSection>
    </Box>

    <Box paddingTopSize="xl" paddingBottomSize="ultra" center as="section">
        <CenterSection gapSize="xl">
            <Box direction="column" gapSize="sm">
                <StaticH2>{'Easy Installation, Easy Use'}</StaticH2>
                <StaticBody color="var(--text-body)">
                    {
                        'QueryPie ACP combines cloud-native technology with a web-based interface for effortless deployment across any operating system.'
                    }
                    <br />
                    {
                        'Docker packaging enables hybrid deployment—on-premises security with SaaS-like convenience and automatic updates.'
                    }
                </StaticBody>
            </Box>
            <Box as="section" center>
                <div style={{ maxWidth: '1000px' }}>
                    <FileImage
                        alt="Easy Installation, Easy Use"
                        filepath="public/solutions/acp/easy-use.png"
                        width={1000}
                        height={440}
                        responsive
                    />
                </div>
            </Box>
        </CenterSection>
    </Box>

    <KillerFeatures title="What QueryPie ACP Can Do">
        <KillerFeatureCategory label="Database Access Control">
            <KillerFeature
                title="Agentless Cloud DB Synchronization"
                description="Automatically sync data assets from AWS, GCP, and Azure without individual setup. Administrators get automated, agentless integration that streamlines operations and lets you focus on what really matters."
                image="public/solutions/acp/dac1.gif"
            >
                <LearnMoreLink
                    href="https://docs.querypie.com/en/administrator-manual/databases/connection-management/cloud-providers"
                    external={true}
                    style={{ display: 'inline-flex', alignItems: 'center' }}
                >Learn More</LearnMoreLink>
            </KillerFeature>
            <KillerFeature
                title="Generalized DB Permission Control"
                description="QueryPie ACP's query analyzer interprets complex queries from any platform and transforms them into a unified format. Apply consistent access control policies across all data sources with universal compatibility."
                image="public/solutions/acp/dac2.gif"
            >
                <LearnMoreLink
                    href="https://docs.querypie.com/en/administrator-manual/databases/db-access-control/privilege-type"
                    external={true}
                    style={{ display: 'inline-flex', alignItems: 'center' }}
                >Learn More</LearnMoreLink>
            </KillerFeature>
            <KillerFeature
                title="Sensitive Data Masking"
                description="Protect sensitive and personal data using preset masking patterns and custom rules, ensuring unauthorized users can't access critical data. Maintain compliance and data privacy while enabling secure access across your organization."
                image="public/solutions/acp/dac3.gif"
            >
                <LearnMoreLink
                    href="https://docs.querypie.com/en/administrator-manual/databases/policies/data-masking"
                    external={true}
                    style={{ display: 'inline-flex', alignItems: 'center' }}
                >Learn More</LearnMoreLink>
            </KillerFeature>
            <KillerFeature
                title="User-friendly Web SQL Editor"
                description="Forget about needing a separate IDE! Our Web SQL Editor lets you easily run queries, import, export, and do various tasks right in your browser, no matter what operating system you use."
                image="public/solutions/acp/dac4.gif"
            >
                <LearnMoreLink
                    href="https://docs.querypie.com/en/user-manual/database-access-control/connecting-with-web-sql-editor"
                    external={true}
                    style={{ display: 'inline-flex', alignItems: 'center' }}
                >Learn More</LearnMoreLink>
            </KillerFeature>
        </KillerFeatureCategory>
        <KillerFeatureCategory label="System Access Control">
            <KillerFeature
                title="Agentless Cloud Infrastructure Synchronization"
                description="Automatically sync and manage infrastructure across multiple cloud platforms. Handles all infrastructure assets including auto-scaling resources seamlessly, so you can focus on strategic work that matters."
                image="public/solutions/acp/sac1.gif"
            >
                <LearnMoreLink
                    href="https://docs.querypie.com/en/administrator-manual/servers/connection-management/cloud-providers"
                    external={true}
                    style={{ display: 'inline-flex', alignItems: 'center' }}
                >Learn More</LearnMoreLink>
            </KillerFeature>
            <KillerFeature
                title="System Access Policy as Code"
                description="YAML-based access policies control when, where, and how users access systems. RBAC roles combine multiple policies for easy infrastructure management. Infrastructure as Code approach for scalable, auditable access control."
                image="public/solutions/acp/sac2.gif"
            >
                <LearnMoreLink
                    href="https://docs.querypie.com/en/administrator-manual/servers/server-access-control/policies"
                    external={true}
                    style={{ display: 'inline-flex', alignItems: 'center' }}
                >Learn More</LearnMoreLink>
            </KillerFeature>
            <KillerFeature
                title="Web Terminal & SFTP Client"
                description="Access servers and execute commands directly from your web browser interface. Transfer files seamlessly using the built-in SFTP client without installing additional software. Cross-platform compatibility ensures consistent access regardless of your operating system."
                image="public/solutions/acp/sac3.gif"
            >
                <LearnMoreLink
                    href="https://docs.querypie.com/en/user-manual/server-access-control/using-web-terminal"
                    external={true}
                    style={{ display: 'inline-flex', alignItems: 'center' }}
                >Learn More</LearnMoreLink>
            </KillerFeature>
            <KillerFeature
                title="Real-time Monitoring & Session Replay"
                description="Real-time session recording captures every user interaction for comprehensive audit trails. Replay sessions for security analysis and compliance reviews without operational disruption. Complete visibility into all activities ensures secure, compliant server environments."
                image="public/solutions/acp/sac4.gif"
            >
                <LearnMoreLink
                    href="https://docs.querypie.com/en/administrator-manual/audit/server-logs/session-logs"
                    external={true}
                    style={{ display: 'inline-flex', alignItems: 'center' }}
                >Learn More</LearnMoreLink>
            </KillerFeature>
        </KillerFeatureCategory>
        <KillerFeatureCategory label="Kubernetes Access Control">
            <KillerFeature
                title="Easy Kubernetes Enrollment"
                description="Single-script automatically collects credentials and connects Kubernetes clusters anywhere. Supports seamless integration across on-premises and cloud environments. Includes auto synchronization support for cloud platform clusters."
                image="public/solutions/acp/kac1.gif"
            >
                <LearnMoreLink
                    href="https://docs.querypie.com/en/administrator-manual/kubernetes/connection-management/clusters/manually-registering-kubernetes-clusters"
                    external={true}
                    style={{ display: 'inline-flex', alignItems: 'center' }}
                >Learn More</LearnMoreLink>
            </KillerFeature>
            <KillerFeature
                title="Integrated RBAC in Multi-K8S Environment"
                description="Manage permissions from a single console without individual RBAC configuration per cluster. Apply identical policies across multiple environments using wildcards for streamlined control. Eliminates complexity and reduces administrative overhead significantly."
                image="public/solutions/acp/kac2.gif"
            >
                <LearnMoreLink
                    href="https://docs.querypie.com/en/administrator-manual/kubernetes/k8s-access-control/policies/setting-kubernetes-policies"
                    external={true}
                    style={{ display: 'inline-flex', alignItems: 'center' }}
                >Learn More</LearnMoreLink>
            </KillerFeature>
            <KillerFeature
                title="Kubernetes API History Logging"
                description="QueryPie ACP's proxy logs all K8s API requests across clusters, focusing on essential actions only. Clean, focused audit trails replace confusing Kubernetes logs for better visibility. Efficient tracking of critical operations with reduced complexity."
                image="public/solutions/acp/kac3.gif"
            >
                <LearnMoreLink
                    href="https://docs.querypie.com/en/administrator-manual/audit/kubernetes-logs/request-audit"
                    external={true}
                    style={{ display: 'inline-flex', alignItems: 'center' }}
                >Learn More</LearnMoreLink>
            </KillerFeature>
            <KillerFeature
                title="Live Container Session Recording"
                description="Session recordings capture all user activities in containers with full replay capabilities. Monitor and review actions after pod connections for comprehensive oversight. Complete visibility and control over container operations."
                image="public/solutions/acp/kac4.gif"
            >
                <LearnMoreLink
                    href="https://docs.querypie.com/en/administrator-manual/audit/kubernetes-logs/pod-session-recordings"
                    external={true}
                    style={{ display: 'inline-flex', alignItems: 'center' }}
                >Learn More</LearnMoreLink>
            </KillerFeature>
        </KillerFeatureCategory>
        <KillerFeatureCategory label="Web Access Control">
            <KillerFeature
                title="Centralized Web Application Management"
                description="Manage all web applications—AI tools, SaaS platforms, and in-house apps—through integrated web proxy and Chrome extension. Eliminate security blind spots with unified governance across GUI consoles and platforms."
                image="public/solutions/acp/wac1.gif"
            >
                <LearnMoreLink
                    href="https://docs.querypie.com/en/user-manual/web-access-control/accessing-web-applications-websites"
                    external={true}
                    style={{ display: 'inline-flex', alignItems: 'center' }}
                >Learn More</LearnMoreLink>
            </KillerFeature>
            <KillerFeature
                title="Just-in-time (JIT) Permission Control"
                description="Request and grant temporary web application access through built-in workflows. Manage time-limited access to SaaS and in-house applications effortlessly. Enhance security for limited-feature apps with comprehensive controls."
                image="public/solutions/acp/wac2.gif"
            >
                <LearnMoreLink
                    href="https://docs.querypie.com/en/administrator-manual/web-apps/connection-management/web-app-configurations"
                    external={true}
                    style={{ display: 'inline-flex', alignItems: 'center' }}
                >Learn More</LearnMoreLink>
            </KillerFeature>
            <KillerFeature
                title="Dynamic Web Application Watermarking"
                description="Apply dynamic watermarks on controlled web application screens. Strengthen end-user security posture by maintaining visible accountability. Prevent unauthorized screen sharing and data leakage with persistent user ID overlays."
                image="public/solutions/acp/wac3.gif"
            >
                <LearnMoreLink
                    href="https://docs.querypie.com/en/administrator-manual/web-apps/connection-management/web-app-configurations"
                    external={true}
                    style={{ display: 'inline-flex', alignItems: 'center' }}
                >Learn More</LearnMoreLink>
            </KillerFeature>
            <KillerFeature
                title="Timeline-Based Browser Monitoring"
                description="Capture user actions across applications with timeline views and automated screenshots. Monitor real-time interactions to identify security anomalies instantly. Ensure comprehensive protection across all applications with complete visibility."
                image="public/solutions/acp/wac4.gif"
            >
                <LearnMoreLink
                    href="https://docs.querypie.com/en/administrator-manual/audit/web-app-logs/user-activity-recordings"
                    external={true}
                    style={{ display: 'inline-flex', alignItems: 'center' }}
                >Learn More</LearnMoreLink>
            </KillerFeature>
        </KillerFeatureCategory>
        <KillerFeatureCategory label="Workflows & Integrations">
            <KillerFeature
                title="Identity Provider (IdP) Integration"
                description="Connect IdPs like Okta and AD/LDAP through SAML SSO and SCIM protocols. Streamline user management and lifecycle processes with centralized control. Enhance organizational security through unified authentication and access control."
                image="public/solutions/acp/workflow1.gif"
            >
                <LearnMoreLink
                    href="https://docs.querypie.com/en/administrator-manual/general/user-management/authentication"
                    external={true}
                    style={{ display: 'inline-flex', alignItems: 'center' }}
                >Learn More</LearnMoreLink>
            </KillerFeature>
            <KillerFeature
                title="Built-in Access Request Workflows"
                description="Streamline just-in-time access management with built-in request and approval workflows. Enable approvers to make decisions directly through Slack for faster response times. Ensure efficient operations with effective access control and reduced approval delays."
                image="public/solutions/acp/workflow2.gif"
            >
                <LearnMoreLink
                    href="https://docs.querypie.com/en/user-manual/workflow"
                    external={true}
                    style={{ display: 'inline-flex', alignItems: 'center' }}
                >Learn More</LearnMoreLink>
            </KillerFeature>
            <KillerFeature
                title="Secret Store Integration"
                description="Integrate HashiCorp Vault to manage credentials directly from existing secret stores. Secure storage with ready access for authorized operations and workflows. Streamlined credential management with full control over security infrastructure."
                image="public/solutions/acp/workflow3.gif"
            >
                <LearnMoreLink
                    href="https://docs.querypie.com/en/administrator-manual/general/system/integrations/integrating-with-secret-store"
                    external={true}
                    style={{ display: 'inline-flex', alignItems: 'center' }}
                >Learn More</LearnMoreLink>
            </KillerFeature>
            <KillerFeature
                title="Effortless Log Streaming"
                description="Stream security data to centralized monitoring with simple configuration. Correlate logs in real-time to identify threats across your infrastructure. Respond to emerging threats with comprehensive monitoring and alerting."
                image="public/solutions/acp/workflow4.gif"
            >
                <LearnMoreLink
                    href="https://docs.querypie.com/en/administrator-manual/general/system/integrations/integrating-with-syslog"
                    external={true}
                    style={{ display: 'inline-flex', alignItems: 'center' }}
                >Learn More</LearnMoreLink>
            </KillerFeature>
        </KillerFeatureCategory>
    </KillerFeatures>

    <Box paddingTopSize="md" paddingBottomSize="md" center as="section" background="gray">
        <CenterSection>
            <SplitView gapSize="xxl" breakpoint="md" useNoGapWhenMobile>
                <SplitView.View verticalCenter>
                    <Box direction="column" gapSize="sm">
                        <StaticH4>
                            {
                                'One Platform'
                            }
                            <br />
                            {
                                'All Infrastructure'
                            }
                        </StaticH4>
                        <StaticBody color="var(--text-body)">
                            {
                                'Seamlessly integrate with 50+ systems—databases, servers, Kubernetes, web applications, identity providers, and security tools— for unified permission control across your entire infrastructure ecosystem.'
                            }
                        </StaticBody>
                        <Link href="/solutions/acp/integrations">
                            {
                                'See All Available ACP Integrations >'
                            }
                        </Link>
                    </Box>
                </SplitView.View>
                <SplitView.View fixWidth="53.3%">
                    <FileImage
                        alt="ACP Integrations"
                        filepath="public/solutions/acp/acp-integration.png"
                        width={640}
                        height={670}
                        responsive
                    />
                </SplitView.View>
            </SplitView>
        </CenterSection>
    </Box>
</Box>
  );
}
