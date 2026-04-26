import type { Locale } from "@/constants/i18n";
import { buildSolutionMdxComponents } from "@/features/solutions/mdxComponents";

type Props = {
  locale: Locale;
  searchParams?: { category?: string };
};

export default function AcpSystemAccessControllerENSolutionContent({ locale, searchParams }: Props) {
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
<Box direction="column">
  <Box paddingTopSize="lg" center as="section" background="sac">
    <CenterSection gapSize="xxl" center>
      <Box direction="column" gapSize="sm" center>
        <StaticH1>{'System Access Controller'}</StaticH1>
        <StaticHeader color="var(--text-body)">
          {
            'QueryPie SAC is designed for cloud instance protection on AWS, GCP, and Azure, while also supporting on-premises environments.'
          }
          <br />
          {
            'It enables administrators to monitor user commands and replay sessions, enhancing security and oversight across all platforms.'
          }
        </StaticHeader>
      </Box>
      <Youtube src="https://www.youtube.com/embed/h1jlfwQFaiA?si=qvk_Mk0ryxXhwX51" />
    </CenterSection>
  </Box>

  <Box paddingTopSize="ultra" paddingBottomSize="xl" center as="section">
    <CenterSection gapSize="lg">
      <Box direction="column" gapSize="sm">
        <StaticH2>{'Key Features of SAC'}</StaticH2>
        <StaticBody color="var(--text-body)">
          {
            'QueryPie SAC simplifies server management with tag-based permissions and a web terminal for easy access.'
          }
          <br />
          {'It also supports agent-based proxy access and unified SSH/SFTP management for seamless connectivity.'}
        </StaticBody>
      </Box>
      <ThreeColumnList gapSize="md">
        <KeyFeature
          iconFilepath="public/solutions/acp/system-access-controller/server.svg"
          label="Server Management"
          description="Efficiently manage servers with server group functionality and tag filtering to centrally operate permissions and policies."
        />
        <KeyFeature
          iconFilepath="public/solutions/acp/system-access-controller/terminal.svg"
          label="Built-in Web Terminal"
          description="Access a web terminal and FTP client for server connections and task execution within web browsers, ensuring consistent access and permission control."
        />
        <KeyFeature
          iconFilepath="public/solutions/acp/system-access-controller/server-group.svg"
          label="Easy permission through server groups"
          description="Grant permissions and manage policies across server groups, inheriting settings like access times while enabling flexible management at both server and user levels."
        />
        <KeyFeature
          iconFilepath="public/solutions/acp/system-access-controller/proxy.svg"
          label="Agent Support for Proxy Access"
          description="QueryPie provides a desktop agent that allows users to connect to various systems and server equipment through existing access programs."
        />
        <KeyFeature
          iconFilepath="public/solutions/acp/system-access-controller/network.svg"
          label="Unified SSH & SFTP Access Management"
          description="Manage permissions centrally for all resources, including systems and servers across cloud and on-premises environments, accessible via SSH."
        />
      </ThreeColumnList>
    </CenterSection>
  </Box>

  <Box paddingTopSize="xl" paddingBottomSize="xl" center as="section">
    <CenterSection gapSize="xxl">
      <Box direction="column" gapSize="sm">
        <StaticH2>{'How QueryPie SAC Works'}</StaticH2>
        <StaticBody color="var(--text-body)">
          {
            'QueryPie SAC streamlines access control and auditing by connecting users through a web terminal and web SFTP.'
          }
          <br />
          {
            'Users can easily connect to servers via the QueryPie Proxy Server, allowing seamless access while maintaining security protocols.'
          }
          <br />
          {
            'The QueryPie SAC App ensures that all actions are monitored, providing robust oversight and control over server interactions.'
          }
        </StaticBody>
      </Box>
      <Box as="section" center>
        <div style={{ maxWidth: '1000px' }}>
          <FileImage
            alt="How QueryPie SAC Works"
            filepath="public/solutions/acp/system-access-controller/works.png"
            width={1000}
            height={520}
            responsive
          />
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
            filepath="public/solutions/acp/system-access-controller/easy-use.png"
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
            <StaticH4>{'Web Terminal & SFTP Client'}</StaticH4>
            <StaticBody color="var(--text-body)">
              {
                'Easily connect to servers and get things done with our Web Terminal and SFTP client. Execute commands and transfer files right from your browser—no matter what operating system you use!'
              }
            </StaticBody>
          </Box>
        </SplitView.View>
        <SplitView.View fixWidth="53.3%">
          <FileImage
            alt="Web Terminal & SFTP Client"
            filepath="public/solutions/acp/system-access-controller/web-client.png"
            width={640}
            height={680}
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
            alt="Command Right Access Control & Management"
            filepath="public/solutions/acp/system-access-controller/access-control.png"
            width={600}
            height={600}
            responsive
          />
        </SplitView.View>
        <SplitView.View verticalCenter>
          <Box direction="column" gapSize="sm">
            <StaticH4>{'Command Right Access Control & Management'}</StaticH4>
            <StaticBody color="var(--text-body)">
              {
                'Set and manage SSH command permissions based on risk levels for server groups or individual servers. Blocked commands trigger alerts, helping you catch any suspicious activity.'
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
            <StaticH4>{'Tag-based resource management functionality'}</StaticH4>
            <StaticBody color="var(--text-body)">
              {
                'Tag individual servers and create groups to apply permissions quickly. During cloud sync, your tags will automatically sync with your Cloud Service Provider, simplifying the process!'
              }
            </StaticBody>
          </Box>
        </SplitView.View>
        <SplitView.View fixWidth="53.3%">
          <FileImage
            alt="Tag-based resource management functionality"
            filepath="public/solutions/acp/system-access-controller/tag-based-management.png"
            width={640}
            height={570}
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
            alt="Real-time Monitoring & Session Replay"
            filepath="public/solutions/acp/system-access-controller/session-replay.png"
            width={600}
            height={530}
            responsive
          />
        </SplitView.View>
        <SplitView.View verticalCenter>
          <Box direction="column" gapSize="sm">
            <StaticH4>{'Real-time Monitoring & Session Replay'}</StaticH4>
            <StaticBody color="var(--text-body)">
              {
                'Keep an eye on user activity with real-time monitoring and session replay, all visible on one screen. If anything looks off, the system can instantly end the session to keep your resources safe.'
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
            <StaticH4>{'IaC-based Access Control'}</StaticH4>
            <StaticBody color="var(--text-body)">
              {
                'Easily manage IAM policies with both a user-friendly GUI and IaC editing. Quickly control access to resources or specific items with centrally managed policies.'
              }
            </StaticBody>
          </Box>
        </SplitView.View>
        <SplitView.View fixWidth="51.7%">
          <FileImage
            alt="IaC-based Access Control"
            filepath="public/solutions/acp/system-access-controller/iac.png"
            width={620}
            height={480}
            responsive
          />
        </SplitView.View>
      </SplitView>
    </CenterSection>
  </Box>

  <Box paddingTopSize="md" paddingBottomSize="lg" center as="section">
    <CenterSection>
      <SplitView gapSize="xxl" breakpoint="md" reverse useNoGapWhenMobile>
        <SplitView.View fixWidth="50%">
          <FileImage
            alt="Support for Various Protocols"
            filepath="public/solutions/acp/system-access-controller/protocol.png"
            width={600}
            height={540}
            responsive
          />
        </SplitView.View>
        <SplitView.View verticalCenter>
          <Box direction="column" gapSize="sm">
            <StaticH4>{'Support for Various Protocols'}</StaticH4>
            <StaticBody color="var(--text-body)">
              {
                'Connect securely using SSH, SFTP, Telnet, FTP, RDP, and VNC. These protocols provide flexible remote access, file transfers, and remote desktop operations while keeping security tight.'
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
