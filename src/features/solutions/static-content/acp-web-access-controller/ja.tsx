import type { Locale } from "@/constants/i18n";
import { buildSolutionMdxComponents } from "@/features/solutions/mdxComponents";

type Props = {
  locale: Locale;
  searchParams?: { category?: string };
};

export default function AcpWebAccessControllerJASolutionContent({ locale, searchParams }: Props) {
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
            'QueryPie WAC（Web Access Controller） は、Web アプリケーションへのアクセスを保護するとともに、ユーザーの活動を記録する機能を'
          }
          <br />
          {
            '備えています。オンプレミスの管理者向けサイトやSaaS プラットフォームを含むWebアプリケーションに対して、権限を持つユーザーのみが'
          }
          <br />
          {
            'アクセスできるようにし、さらに、ログやスクリーンショットのキャプチャ、機密データのマスキング、ファイル転送といった操作の'
          }
          <br />
          {
            '制御を通じて、セキュリティを強化します。'
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
        <StaticH2>{'WACの注目機能'}</StaticH2>
        <StaticBody color="var(--text-body)">
          {
            'QueryPie WAC（Web Access Controller） は、すべてのWeb アプリケーションを統合し、シームレスなRBAC（ロールベースのアクセス制御）と権限管理を'
          }
          <br />
          {
            'サポートすることで、セキュリティ上の脆弱性を効果的に防ぎます。また、タイムラインベースの履歴機能によりユーザーのアクティビティを記録し、'
          }
          <br />
          {
            '詳細なログとスクリーンショットを活用して、活動状況の可視性を高めます。'
          }
        </StaticBody>
      </Box>
      <ThreeColumnList gapSize="md">
        <KeyFeature
          iconFilepath="public/solutions/acp/web-access-controller/web.svg"
          label="Webアプリケーションの統合アクセス制御"
          description="自社開発ソリューションからSaaSまで、すべてのウェブアプリケーションを統合し、RBACと権限管理を可能にすることにより、セキュリティのギャップを埋めることができます。"
        />
        <KeyFeature
          iconFilepath="public/solutions/acp/web-access-controller/activity-recording.svg"
          label="ブラウザタイムラインベースのユーザーアクティビティ履歴"
          description="URL のナビゲーション、リンクのクリック、クリップボードへのコピーなどのユーザーアクションをスクリーンショットで詳細に記録します。さらに、HTTP リクエストを解析することで、イベントをわかりやすく可視化します。"
        />
        <KeyFeature
          iconFilepath="public/solutions/acp/web-access-controller/tracking.svg"
          label="イベントとコンテンツベースのユーザーアクティビティの追跡"
          description="クリック、入力、クリップボードの使用、ファイル転送など、ユーザーのアクティビティを追跡します。ボタンのクリックなどの詳細をスクリーンショットとともに記録し、簡単に確認できます。"
        />
      </ThreeColumnList>
    </CenterSection>
  </Box>

  <Box paddingTopSize="xl" paddingBottomSize="xl" center as="section">
    <CenterSection gapSize="xxl">
      <Box direction="column" gapSize="sm">
        <StaticH2>{'WACの仕組み'}</StaticH2>
        <StaticBody color="var(--text-body)">
          {'QueryPie WAC は、ユーザーとWebアプリケーションの間にセキュアなゲートウェイとして機能し、安全なアクセスを確保するために'}
          <br />
          {
            'ロールベースのアクセス制御（RBAC）を実施します。また、機密情報をマスキングしつつ、URL のナビゲーション、クリック操作、ファイル転送など、'
          }
          <br />
          {
            'ユーザーのアクティビティを詳細に記録します。さらに、リアルタイムでのモニタリングやイベントトラッキングに加え、SIEM との容易な統合を実現し、'
          }
          <br />
          {
            'Web アプリケーションにおける高度なセキュリティとコンプライアンスを提供します。'
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
            <StaticH4>{'集中管理'}</StaticH4>
            <StaticBody color="var(--text-body)">
              {
                'Web プロキシとChrome 拡張機能を通じて、社内Web アプリケーション（SaaS、社内アプリケーションなど）をシームレスに管理します。 セキュリティレベルが低いSaaS アプリケーションでも、一貫したアクセス制御とログ記録を確保します。同時に、社内GUI コンソールにも同じ制御を適用することで、セキュリティ上の盲点を排除します。'
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
            <StaticH4>
              {'ロールと属性ベースの'}
              <br />
              {'アクセス制御'}
            </StaticH4>
            <StaticBody color="var(--text-body)">
              {
                'ユーザーロール（RBAC）に基づいてWebアプリケーションのアクセス権とポリシーを管理し、SaaS と社内アプリケーションの両方に対してログイン認証とアクセス制御をシームレスに統合します。セキュリティ機能が制限されたSaaS アプリケーションに対しても承認とロギングを提供し、最も必要な場所でセキュリティを強化します。'
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
            <StaticH4>
              {'タイムラインベースの'}
              <br />
              {'ブラウザ監視'}
            </StaticH4>
            <StaticBody color="var(--text-body)">
              {
                'Web アプリケーションにおけるユーザーの行動をタイムラインベースで追跡します。QueryPie は、ユーザーのアクティビティをスクリーンショットとしてキャプチャし、権限の管理を行い、すべての対話をリアルタイムで明確に確認できるようにします。リアルタイムでのタイムラインモニタリングにより、管理者は異常の兆候を迅速に把握し、社内アプリケーションとSaaS アプリケーションの両方において優れたセキュリティを維持することができます。'
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
            <StaticH4>
              {'イベントとコンテンツベースの'}
              <br />
              {'ユーザーアクティビティの追跡'}
            </StaticH4>
            <StaticBody color="var(--text-body)">
              {
                'Web アプリケーションは、ユーザーのクリック、スクロール、入力など、すべてのアクティビティをリアルタイムで追跡し、URL の閲覧からファイル転送に至るまで、ユーザーの行動を完全に把握します。これにより、機密性の高いやりとりに対して、完全な可視性を確保することができます。'
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
            <StaticH4>{'ワンクリック SIEM 連動'}</StaticH4>
            <StaticBody color="var(--text-body)">
              {
                'QueryPie では、記録されたすべてのイベントのログストリーミングをシンプル化し、Web アクセス、監査、ユーザーアクティビティなどのデータをリアルタイムで監視することができます。これにより、管理者は重要なイベントを追跡し、ユーザーの行動を分析して、アクセスパターンを確認することができ、セキュリティを強化するための貴重な洞察を提供します。'
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
            <StaticH4>{'URLパスの管理'}</StaticH4>
            <StaticBody color="var(--text-body)">
              {
                'タグベースのRBAC およびABAC ルールを使用して、サブURLへのアクセスを制御します。管理者はWeb アプリケーションのアクセスを制限し、ユーザーが自分の役割に基づいて許可されたページやコンテンツのみにアクセスできるように設定します。'
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
            <StaticH4>
              {'Web アプリケーションでの'}
              <br />
              {'データマスキング'}
            </StaticH4>
            <StaticBody color="var(--text-body)">
              {
                'Web アプリケーションから機密情報をマスキングすることで、不正アクセスや情報漏洩を防ぎます。マスキング技術を適用することにより、インプレッションへのリスクを軽減し、データセキュリティ規制に準拠するとともに、ユーザーのプライバシーを保護することができます。'
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
