import type { Locale } from "@/constants/i18n";
import { buildSolutionMdxComponents } from "@/features/solutions/mdxComponents";

type Props = {
  locale: Locale;
  searchParams?: { category?: string };
};

export default function AcpWebAccessControllerENSolutionContent({ locale, searchParams }: Props) {
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
  <Box paddingTopSize="lg" center as="section" background="wac">
    <CenterSection gapSize="xxl" center>
      <Box direction="column" gapSize="sm" center>
        <StaticH1>{'Web Access Controller'}</StaticH1>
        <StaticHeader color="var(--text-body)">
          {
            'QueryPie WAC secures access and logs activities for web applications, including admin portals and SaaS platforms.'
          }
          <br />
          {
            'It grants access to authorized users, captures logs and screenshots, masks sensitive data, and controls actions like file transfers.'
          }
        </StaticHeader>
      </Box>
      <div style={{ maxWidth: '1000px' }}>
        <FileImage
          alt="Web Access Controller"
          filepath="public/solutions/acp/web-access-controller/main.png"
          width={1000}
          height={520}
          responsive
        />
      </div>
    </CenterSection>
  </Box>

  <Box paddingTopSize="mega" paddingBottomSize="xl" center as="section">
    <CenterSection gapSize="lg">
      <Box direction="column" gapSize="sm">
        <StaticH2>{'Key Features of WAC'}</StaticH2>
        <StaticBody color="var(--text-body)">
          {
            'QueryPie WAC integrates all your web applications for seamless RBAC and permission management, closing security gaps.'
          }
          <br />
          {
            'It captures user actions with timeline-based recording, providing insights into activity through detailed logs and screenshots.'
          }
        </StaticBody>
      </Box>
      <ThreeColumnList gapSize="md">
        <KeyFeature
          iconFilepath="public/solutions/acp/web-access-controller/web.svg"
          label="Integrated Access Control for Web Applications"
          description="Unite all your web apps, from homegrown solutions to SaaS, to enable RBAC and permission management that fills security gaps."
        />
        <KeyFeature
          iconFilepath="public/solutions/acp/web-access-controller/activity-recording.svg"
          label="Browser Timeline-Based User Activity Recording"
          description="Record user actions like navigating URLs, clicking links, and copying to the clipboard with screenshots, while analyzing HTTP requests for a clear view of events."
        />
        <KeyFeature
          iconFilepath="public/solutions/acp/web-access-controller/tracking.svg"
          label="Event and Content-Based User Activity Tracking"
          description="Keep track of user activities, including clicks, typing, clipboard use, and file transfers. Log details like button clicks along with screenshots for easy reviewing."
        />
      </ThreeColumnList>
    </CenterSection>
  </Box>

  <Box paddingTopSize="xl" paddingBottomSize="xl" center as="section">
    <CenterSection gapSize="xxl">
      <Box direction="column" gapSize="sm">
        <StaticH2>{'How QueryPie WAC Works'}</StaticH2>
        <StaticBody color="var(--text-body)">
          {'QueryPie integrates seamlessly into existing data environments.'}
          <br />
          {
            'QueryPie WAC acts as a secure gateway between users and web applications, enforcing role-based access control (RBAC) for safe access.'
          }
          <br />
          {
            'It logs user activities such as URL navigation, clicks, and file transfers while masking sensitive information.'
          }
          <br />
          {
            'With real-time monitoring, event tracking, and easy SIEM integration, WAC delivers exceptional security and compliance for your web applications.'
          }
        </StaticBody>
      </Box>
      <Box as="section" center>
        <div style={{ maxWidth: '1000px' }}>
          <FileImage
            alt="How QueryPie WAC Works"
            filepath="public/solutions/acp/web-access-controller/works.png"
            width={1000}
            height={400}
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
            <StaticH4>{'Centralized Management'}</StaticH4>
            <StaticBody color="var(--text-body)">
              {
                'Manage all your in-house web apps (SaaS, In-house Apps, etc.) seamlessly through a web proxy and Chrome extension. Ensure consistent access control and logging, even for less secure SaaS apps, while extending the same control to in-house GUI consoles to eliminate security blind spots.'
              }
            </StaticBody>
          </Box>
        </SplitView.View>
        <SplitView.View fixWidth="53.3%">
          <FileImage
            alt="Centralized Management"
            filepath="public/solutions/acp/web-access-controller/management.png"
            width={640}
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
        <SplitView.View fixWidth="53.3%">
          <FileImage
            alt="RBAC & ABAC-Based Permission Control"
            filepath="public/solutions/acp/web-access-controller/pac.png"
            width={640}
            height={470}
            responsive
          />
        </SplitView.View>
        <SplitView.View verticalCenter>
          <Box direction="column" gapSize="sm">
            <StaticH4>{'RBAC & ABAC-Based Permission Control'}</StaticH4>
            <StaticBody color="var(--text-body)">
              {
                'Manage access rights and policies for web applications based on user roles, seamlessly integrating login authentication and access control for both SaaS and in-house apps. It also provides authorization and logging for SaaS apps with limited security features, enhancing protection where it’s needed most.'
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
            <StaticH4>{'Timeline-Based Browser Monitoring'}</StaticH4>
            <StaticBody color="var(--text-body)">
              {
                'Track user behavior across web applications in a seamless, timeline-based view. QueryPie captures screenshots of user actions and manages permissions, providing clear insights into every interaction as it happens. With real-time, timeline-based monitoring, admins can quickly identify anomalies and ensure top-notch security across all apps, both in-house and SaaS.'
              }
            </StaticBody>
          </Box>
        </SplitView.View>
        <SplitView.View fixWidth="53.3%">
          <FileImage
            alt="Timeline-Based Browser Monitoring"
            filepath="public/solutions/acp/web-access-controller/monitoring.png"
            width={640}
            height={490}
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
            alt="Event and Content-Based User Activity Tracking"
            filepath="public/solutions/acp/web-access-controller/tracking.png"
            width={640}
            height={590}
            responsive
          />
        </SplitView.View>
        <SplitView.View verticalCenter>
          <Box direction="column" gapSize="sm">
            <StaticH4>{'Event and Content-Based User Activity Tracking'}</StaticH4>
            <StaticBody color="var(--text-body)">
              {
                'Track user actions in real-time with detailed logs, capturing every click, scroll, and input in web applications. From URLs to file transfers, get the full picture of user behavior and ensure complete visibility into sensitive interactions.'
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
            <StaticH4>{'One-Click SIEM Integration'}</StaticH4>
            <StaticBody color="var(--text-body)">
              {
                'Streamline log streaming for all recorded events in QueryPie, covering web access, audits, and user activities. This real-time monitoring helps administrators track critical events, analyze user behavior, and review access patterns for enhanced security and insights.'
              }
            </StaticBody>
          </Box>
        </SplitView.View>
        <SplitView.View fixWidth="53.3%">
          <FileImage
            alt="One-Click SIEM Integration"
            filepath="public/solutions/acp/web-access-controller/siem.png"
            width={640}
            height={630}
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
            alt="URL Path Management"
            filepath="public/solutions/acp/web-access-controller/url-path-management.png"
            width={640}
            height={460}
            responsive
          />
        </SplitView.View>
        <SplitView.View verticalCenter>
          <Box direction="column" gapSize="sm">
            <StaticH4>{'URL Path Management'}</StaticH4>
            <StaticBody color="var(--text-body)">
              {
                'Take control of sub-URL access with tag-based RBAC and ABAC rules. Admins can lock down web applications, ensuring users can only access the pages and content their roles permit.'
              }
            </StaticBody>
          </Box>
        </SplitView.View>
      </SplitView>
    </CenterSection>
  </Box>

  <Box paddingTopSize="md" paddingBottomSize="ultra" center as="section" background="gray">
    <CenterSection>
      <SplitView gapSize="xxl" breakpoint="md" useNoGapWhenMobile>
        <SplitView.View verticalCenter>
          <Box direction="column" gapSize="sm">
            <DarkBadge>{'Coming Soon'}</DarkBadge>
            <StaticH4>{'Data Masking in Web Applications'}</StaticH4>
            <StaticBody color="var(--text-body)">
              {
                'Protect sensitive information in web applications by masking it, ensuring unauthorized access and leaks are prevented. Apply masking techniques to reduce exposure risk, stay compliant with data security regulations, and safeguard user privacy.'
              }
            </StaticBody>
          </Box>
        </SplitView.View>
        <SplitView.View fixWidth="50%">
          <FileImage
            alt="Data Masking in Web Applications"
            filepath="public/solutions/acp/web-access-controller/data-masking.png"
            width={600}
            height={450}
            responsive
          />
        </SplitView.View>
      </SplitView>
    </CenterSection>
  </Box>
</Box>
  );
}
