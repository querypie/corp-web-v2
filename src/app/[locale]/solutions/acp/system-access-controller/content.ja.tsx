import type { Locale } from "@/constants/i18n";
import { buildSolutionContentComponents } from "@/features/solutions/contentComponents";

type Props = {
  locale: Locale;
  searchParams?: { category?: string };
};

export const metadata = {
    "title": "QueryPie SAC: System Access Controller",
    "description": "QueryPie SAC は、AWS、GCP、Azure上のクラウドインスタンスを保護するように設計されており、オンプレミス環境にも対応しています。",
    "abstract": "QueryPie SAC は、AWS、GCP、Azure上のクラウドインスタンスを保護するように設計されており、オンプレミス環境にも対応しています。",
    "keywords": [
      "QueryPie SAC",
      "システムアクセスコントローラ",
      "AWS",
      "GCP",
      "Azure",
      "オンプレミス",
      "クラウドセキュリティ"
    ]
} as const;


export default function AcpSystemAccessControllerJASolutionContent({ locale, searchParams }: Props) {
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
  <Box paddingTopSize="lg" center as="section" background="sac">
    <CenterSection gapSize="xxl" center>
      <Box direction="column" gapSize="sm" center>
        <StaticH1>{'System Access Controller'}</StaticH1>
        <StaticHeader color="var(--text-body)">
          {
            'QueryPie SAC は、クラウド環境とオンプレミスの複数のシステム、サーバー、ネットワーク機器など、'
          }
          <br />
          {
            'SSH 接続が可能なすべてのリソースの権限を統合管理することができます。管理者は、ユーザー コマンドを監視し、'
          }
          <br />
          {
            'コマンドが実行されたセッションを再生することで、すべてのプラットフォームでセキュリティと監視を強化できます。'
          }
        </StaticHeader>
      </Box>
      <Youtube src="https://www.youtube.com/embed/h1jlfwQFaiA?si=qvk_Mk0ryxXhwX51" />
    </CenterSection>
  </Box>

  <Box paddingTopSize="ultra" paddingBottomSize="xl" center as="section">
    <CenterSection gapSize="lg">
      <Box direction="column" gapSize="sm">
        <StaticH2>{'SACの注目機能'}</StaticH2>
        <StaticBody color="var(--text-body)">
          {
            'QueryPie SAC はタグベースの権限設定とウェブターミナルを通じてサーバー管理をシンプルにし、'
          }
          <br />
          {'エージェントベースのプロキシアクセスと SSH / SFTP の統合管理に対応しており、シームレスな接続が可能です。'}
        </StaticBody>
      </Box>
      <ThreeColumnList gapSize="md">
        <KeyFeature
          iconFilepath="public/solutions/acp/system-access-controller/server.svg"
          label="効率的なサーバー管理"
          description="サーバーグループ機能とタグフィルタリングを活用することで、サーバーを簡単かつ迅速に管理できます。また、中央で権限やポリシーを効率的に運用し、セキュリティおよびアクセス制御を最適化します。これにより、管理者は複雑なサーバー環境を手軽に管理できるようになります。"
        />
        <KeyFeature
          iconFilepath="public/solutions/acp/system-access-controller/terminal.svg"
          label="Webターミナル対応"
          description="Web ブラウザ内でサーバー接続や作業実行が可能な Web ターミナルおよび Web SFTP を提供することで、一貫したアクセス環境を実現し、すべての作業に対して効率的な権限制御を可能にします。これにより、ユーザーは専用のクライアントソフトを使用することなく、サーバー管理や作業をスムーズに行うことができます。"
        />
        <KeyFeature
          iconFilepath="public/solutions/acp/system-access-controller/server-group.svg"
          label="サーバーグループによる 簡単な権限管理"
          description="サーバーグループを通じて権限を付与し、ポリシーを管理し、アクセス時間などの詳細設定を継承してサーバーおよびユーザーレベルで柔軟に管理できます。 これにより、セキュリティが強化され、管理者の業務効率がさらに高まります。"
        />
        <KeyFeature
          iconFilepath="public/solutions/acp/system-access-controller/proxy.svg"
          label="プロキシアクセスのためのエージェントサポート"
          description="QueryPie は、ユーザーが利用している既存のプログラムを通じて、様々なシステムとサーバー機器に安全に接続できるように、ユーザーにデスクトップエージェントを提供します。"
        />
        <KeyFeature
          iconFilepath="public/solutions/acp/system-access-controller/network.svg"
          label="SSHおよびSFTPアクセス管理"
          description="SSH 経由でアクセス可能なクラウドおよびオンプレミス環境のシステムやサーバーを含む、すべてのリソースの権限を一元管理します。"
        />
      </ThreeColumnList>
    </CenterSection>
  </Box>

  <Box paddingTopSize="xl" paddingBottomSize="xl" center as="section">
    <CenterSection gapSize="xxl">
      <Box direction="column" gapSize="sm">
        <StaticH2>{'QueryPie SACの仕組み'}</StaticH2>
        <StaticBody color="var(--text-body)">
          {
            'QueryPie SAC は、Web ターミナルおよびWeb SFTP を活用してユーザーを接続することで、アクセス制御と監査作業をシンプル化します。'
          }
          <br />
          {
            'ユーザーはQueryPie プロキシサーバーを介してサーバーに簡単に接続でき、セキュリティプロトコルを確保しながらスムーズにアクセスすることが可能です。'
          }
          <br />
          {
            'また、QueryPie SAC アプリは、すべての操作をモニタリングし、サーバーとのやり取りを強固に監視・制御します。'
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
        <StaticH2>{'簡単インストール、簡単操作'}</StaticH2>
        <StaticBody color="var(--text-body)">
          {
            'QueryPie はクラウドネイティブ技術と Web ベースのインターフェースを組み合わせ、さまざまなオペレーティングシステムで簡単にインストールおよび'
          }
          <br />
          {
            '運用できるよう設計されています。Docker パッケージングにより容易に配布可能で、オンプレミスのセキュリティとSaaS のような利便性の高いアップデート'
          }
          <br />
          {
            '方式を組み合わせたハイブリッドアプローチをサポートしています。この設計により、金融、医療、公共部門などでのコンプライアンスを支援するとともに、'
          }
          <br />
          {
            '問題が発生した際には即座にロールバックする機能も提供します。QueryPie は、SaaS の利便性とオンプレミスソリューションの強固なセキュリティを'
          }
          <br />
          {
            '融合させることで、顧客に大きな価値を提供することを目指しています。'
          }
        </StaticBody>
      </Box>
      <Box as="section" center>
        <div style={{ maxWidth: '1000px' }}>
          <FileImage
            alt="Easy Installation, Easy Use"
            filepath="public/solutions/acp/system-access-controller/easy-use-jp.png"
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
            <StaticH4>
              {'Webターミナル &'}
              <br />
              {'SFTPクライアント'}
            </StaticH4>
            <StaticBody color="var(--text-body)">
              {
                'Web ターミナルと SFTPクライアントを使用することで、サーバーへの簡単な接続が可能です。コマンドを実行したりファイルを転送したりできるため、オペレーティングシステムを問わず、ブラウザ上で迅速に作業を完了することができます。'
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
            <StaticH4>{'コマンド権限のアクセス制御と管理'}</StaticH4>
            <StaticBody color="var(--text-body)">
              {
                'サーバーグループまたは個別のサーバーに対して、危険レベルに応じたSSH コマンドの権限設定および管理が可能です。ブロックされたコマンドは通知され、疑わしいアクティビティを迅速に検出する手助けとなります。'
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
            <StaticH4>{'タグベースのリソース管理機能'}</StaticH4>
            <StaticBody color="var(--text-body)">
              {
                '個々のサーバーにタグを付け、それらをグループ化して、権限をすばやく適用できます。 クラウド サービス プロバイダーと同期する際、タグが自動的に同期され、クラウド環境でリソースを簡単に管理できます。'
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
            <StaticH4>
              {'リアルタイムモニタリング &'}
              <br />
              {'セッションリプレイ'}
            </StaticH4>
            <StaticBody color="var(--text-body)">
              {
                'リアルタイムでのモニタリングとセッションの再生により、ユーザーの活動を同じ画面で簡単に確認することができます。また、異常な兆候が検出された場合には、即座にセッションを終了し、リソースを安全に保護することが可能です。'
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
            <StaticH4>{'IaC ベースのアクセス制御'}</StaticH4>
            <StaticBody color="var(--text-body)">
              {
                'ユーザーフレンドリーなGUI とIaC の編集機能により、IAMポリシーを簡単に管理することができます。これにより、一元管理されたポリシーを使用して、リソースや特定のアイテムへのアクセス権を迅速に制御することが可能です。'
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
            <StaticH4>{'様々なプロトコルをサポート'}</StaticH4>
            <StaticBody color="var(--text-body)">
              {
                'SSH、SFTP、RDP、VNC などを使用して安全に接続します。これらのプロトコルは、柔軟なリモートアクセス、ファイル転送、リモートデスクトップ操作をサポートし、セキュリティは徹底的に維持されます。'
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
