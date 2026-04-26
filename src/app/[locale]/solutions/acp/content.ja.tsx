import type { Locale } from "@/constants/i18n";
import { buildSolutionContentComponents } from "@/features/solutions/contentComponents";

type Props = {
  locale: Locale;
  searchParams?: { category?: string };
};

export const metadata = {
    "title": "QueryPie アクセス制御プラットフォーム (ACP)",
    "description": "アクセス制御プラットフォームはデータベースとインフラ全体にわたる包括的なアクセス管理を提供するプラットフォームです。",
    "keywords": [
      "クエリパイ ACP",
      "Access Control Platform",
      "ACP",
      "データベースアクセス制御",
      "システムアクセス制御",
      "Kubernetesアクセス制御",
      "Webアクセス制御",
      "SQLエディター",
      "AIエージェント",
      "RBAC",
      "ABAC",
      "リアルタイム監視"
    ]
} as const;


export default function AcpJASolutionContent({ locale, searchParams }: Props) {
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
                <StaticH1>{'QueryPie アクセス制御プラットフォーム (ACP)'}</StaticH1>
                <StaticHeader color="var(--text-body)">
                    {
                        'アクセス制御プラットフォームはデータベースとインフラ全体にわたる包括的なアクセス管理を提供するプラットフォームです。'
                    }
                    <br />
                    {
                        'AIエージェントによるデータベース接続やインフラへのアクセスを最適化し、複雑なインフラをAIエージェントがアクセス可能なエコシステムに転換します。'
                    }
                </StaticHeader>
            </Box>
            <Youtube src="https://www.youtube.com/embed/AWnknC76Jpo?si=5M5QNi83zyyHD2V3" />
        </CenterSection>
    </Box>

    <Box paddingTopSize="xl" paddingBottomSize="ultra" center as="section">
        <CenterSection gapSize="xl">
            <Box direction="column" gapSize="sm">
                <StaticH2>{'簡単インストール、簡単使用'}</StaticH2>
                <StaticBody color="var(--text-body)">
                    {
                        'QueryPie ACPは、クラウド技術とWebベースのインターフェースを組み合わせ、あらゆるオペレーティングシステムで簡単に導入できます。'
                    }
                    <br />
                    {
                        'Dockerパッケージングによりハイブリッド導入も可能で、 オンプレミスのセキュリティとSaaS並みの利便性と自動更新を実装しています。'
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

    <KillerFeatures title="QueryPie ACPができること">
        <KillerFeatureCategory label="データベースアクセス制御">
            <KillerFeature
                title="エージェントレスクラウド"
                description="DB同期 AWS、GCP、Azureからデータ資産を個別設定なしで自動同期。 管理者は運用を効率化し、本当に重要なことに集中できる 自動化されたエージェントレス統合を取得します。"
                image="public/solutions/acp/dac1.gif"
            >
                <LearnMoreLink
                    href="https://docs.querypie.com/ja/administrator-manual/databases/connection-management/cloud-providers"
                    external={true}
                    style={{ display: 'inline-flex', alignItems: 'center' }}
                >Learn More</LearnMoreLink>
            </KillerFeature>
            <KillerFeature
                title="汎用DB権限制御"
                description="QueryPieのクエリアナライザ があらゆるプラットフォームの複雑なクエリを解釈し、 統一フォーマットに変換します。 汎用的な互換性により、すべてのデータソースに一貫したアクセス制御ポリシーを適用します。"
                image="public/solutions/acp/dac2.gif"
            >
                <LearnMoreLink
                    href="https://docs.querypie.com/ja/administrator-manual/databases/db-access-control/privilege-type"
                    external={true}
                    style={{ display: 'inline-flex', alignItems: 'center' }}
                >Learn More</LearnMoreLink>
            </KillerFeature>
            <KillerFeature
                title="機密データマスキング"
                description="プリセットのマスキングパターンとカスタムルールを使用して機密データと個人データを保護し、未承認ユーザーが重要データにアクセスできないことを保証します。組織全体で安全なアクセスを可能にしながら、コンプライアンスとデータプライバシーを維持します。"
                image="public/solutions/acp/dac3.gif"
            >
                <LearnMoreLink
                    href="https://docs.querypie.com/ja/administrator-manual/databases/policies/data-masking"
                    external={true}
                    style={{ display: 'inline-flex', alignItems: 'center' }}
                >Learn More</LearnMoreLink>
            </KillerFeature>
            <KillerFeature
                title="ユーザーフレンドリーなWeb SQLエディター"
                description="Web SQLエディターにより、使用するオペレーティングシステムに関係なく、ブラウザ上で 直接クエリの実行、インポート、エクスポート、その他のさまざまなタスクを簡単に実行できます。"
                image="public/solutions/acp/dac4.gif"
            >
                <LearnMoreLink
                    href="https://docs.querypie.com/ja/user-manual/database-access-control/connecting-with-web-sql-editor"
                    external={true}
                    style={{ display: 'inline-flex', alignItems: 'center' }}
                >Learn More</LearnMoreLink>
            </KillerFeature>
        </KillerFeatureCategory>
        <KillerFeatureCategory label="システムアクセス制御">
            <KillerFeature
                title="エージェントレスクラウド"
                description="複数のクラウドプラットフォーム全体でインフラを自動同期・管理します。自動スケーリングリソースを含むすべてのインフラ資産をシームレスに処理して、 重要な業務に集中することを可能にします。"
                image="public/solutions/acp/sac1.gif"
            >
                <LearnMoreLink
                    href="https://docs.querypie.com/ja/administrator-manual/servers/connection-management/cloud-providers"
                    external={true}
                    style={{ display: 'inline-flex', alignItems: 'center' }}
                >Learn More</LearnMoreLink>
            </KillerFeature>
            <KillerFeature
                title="コードとしてのシステムアクセスポリシー"
                description="YAMLベースのアクセスポリシーがユーザー のシステムアクセスのタイミング、場所、方法を制御します。 RBACが複数のポリシーを組み合わせ、インフラ管理を簡素化。 拡張可能で監査可能なアクセス制御のためのインフラストラクチャ・アズ・コード(IaC)アプローチ。"
                image="public/solutions/acp/sac2.gif"
            >
                <LearnMoreLink
                    href="https://docs.querypie.com/ja/administrator-manual/servers/server-access-control/policies"
                    external={true}
                    style={{ display: 'inline-flex', alignItems: 'center' }}
                >Learn More</LearnMoreLink>
            </KillerFeature>
            <KillerFeature
                title="Webターミナル & SFTPクライアント"
                description="Webブラウザインターフェースから直接サーバーにアクセスしコマンドを実行できます。追加ソフトウェアのインストールなしに内蔵SFTPクライアントを使用してファイルを転送できます。クロスプラットフォーム互換性により、オペレーティングシステムに関係なくアクセスを保証します。"
                image="public/solutions/acp/sac3.gif"
            >
                <LearnMoreLink
                    href="https://docs.querypie.com/ja/user-manual/server-access-control/using-web-terminal"
                    external={true}
                    style={{ display: 'inline-flex', alignItems: 'center' }}
                >Learn More</LearnMoreLink>
            </KillerFeature>
            <KillerFeature
                title="リアルタイム監視 & セッション再生"
                description="すべてのユーザーインタラクションを捉えて、包括的な監査証跡を提供します。運用中断なしにセキュリティ分析とコンプライアンスレビューのためのセッションを再生し、すべてのアクティビティを完全に可視化して安全なサーバー環境を構築します。"
                image="public/solutions/acp/sac4.gif"
            >
                <LearnMoreLink
                    href="https://docs.querypie.com/ja/administrator-manual/audit/server-logs/session-logs"
                    external={true}
                    style={{ display: 'inline-flex', alignItems: 'center' }}
                >Learn More</LearnMoreLink>
            </KillerFeature>
        </KillerFeatureCategory>
        <KillerFeatureCategory label="Kubernetesアクセス制御">
            <KillerFeature
                title="簡単なKubernetes登録"
                description="シングルスクリプトがクレデンシャルを自動収集し、どこにあるKubernetesクラスターでも接続します。オンプレミスとクラウド環境全体でのシームレスな統合をサポートします。 クラウドプラットフォームクラスターの自動同期サポートも含みます。"
                image="public/solutions/acp/kac1.gif"
            >
                <LearnMoreLink
                    href="https://docs.querypie.com/ja/administrator-manual/kubernetes/connection-management/clusters/manually-registering-kubernetes-clusters"
                    external={true}
                    style={{ display: 'inline-flex', alignItems: 'center' }}
                >Learn More</LearnMoreLink>
            </KillerFeature>
            <KillerFeature
                title="マルチK8S環境での統合RBAC"
                description="クラスターごとの個別RBAC設定なしに単一コンソールから権限を管理できます。ワイルドカードを使用して複数環境に同ポリシーを適用し、効率的な制御を実現しています。複雑さを排除し、管理オーバーヘッドを大幅に削減できます。"
                image="public/solutions/acp/kac2.gif"
            >
                <LearnMoreLink
                    href="https://docs.querypie.com/ja/administrator-manual/kubernetes/k8s-access-control/policies/setting-kubernetes-policies"
                    external={true}
                    style={{ display: 'inline-flex', alignItems: 'center' }}
                >Learn More</LearnMoreLink>
            </KillerFeature>
            <KillerFeature
                title="Kubernetes API履歴ログ"
                description="クラスター全体のすべてのK8s APIリクエストを記録し、重要なアクションのみに焦点を当てます。明確で焦点を絞った監査証跡が混乱を招くKubernetesログを置き換え、可視性を向上させます。 複雑さを削減して重要な操作を効率的に追跡できます。"
                image="public/solutions/acp/kac3.gif"
            >
                <LearnMoreLink
                    href="https://docs.querypie.com/ja/administrator-manual/audit/kubernetes-logs/request-audit"
                    external={true}
                    style={{ display: 'inline-flex', alignItems: 'center' }}
                >Learn More</LearnMoreLink>
            </KillerFeature>
            <KillerFeature
                title="ライブコンテナセッション記録"
                description="コンテナ内のすべてのユーザーアクティビティを完全な再生機能付きでキャプチャします。 Pod接続後のアクションを監視・レビューし、包括的な監督を実現します。 コンテナ操作を完全に可視化して制御します。"
                image="public/solutions/acp/kac4.gif"
            >
                <LearnMoreLink
                    href="https://docs.querypie.com/ja/administrator-manual/audit/kubernetes-logs/pod-session-recordings"
                    external={true}
                    style={{ display: 'inline-flex', alignItems: 'center' }}
                >Learn More</LearnMoreLink>
            </KillerFeature>
        </KillerFeatureCategory>
        <KillerFeatureCategory label="Webアクセス制御">
            <KillerFeature
                title="一元化されたWebアプリケーション管理"
                description="統合WebプロキシとChrome拡張機能を通じて、AIツール、SaaSプラットフォーム、 社内アプリなどすべてのWebアプリケーションを管理します。 GUIコンソールとプラットフォームの統一されたガバナンスにより、セキュリティの死角を排除します。"
                image="public/solutions/acp/wac1.gif"
            >
                <LearnMoreLink
                    href="https://docs.querypie.com/ja/user-manual/web-access-control/accessing-web-applications-websites"
                    external={true}
                    style={{ display: 'inline-flex', alignItems: 'center' }}
                >Learn More</LearnMoreLink>
            </KillerFeature>
            <KillerFeature
                title="ジャストインタイム（JIT）権限制御"
                description="内蔵ワークフローを通じて一時的なWebアプリケーションアクセスを要求・許可します。SaaSと社内アプリケーションへの時間制限付きアクセスを簡単に管理。包括的な制御により、機能制限アプリのセキュリティを強化します。"
                image="public/solutions/acp/wac2.gif"
            >
                <LearnMoreLink
                    href="https://docs.querypie.com/ja/administrator-manual/web-apps/connection-management/web-app-configurations"
                    external={true}
                    style={{ display: 'inline-flex', alignItems: 'center' }}
                >Learn More</LearnMoreLink>
            </KillerFeature>
            <KillerFeature
                title="動的Webアプリケーション透かし"
                description="制御されたWebアプリケーション画面に動的透かしを適用しています。可視的な可視化された説明責任を維持することで、エンドユーザーのセキュリティ体制を強化します。持続的なユーザーIDオーバーレイにより、不正な画面共有とデータ漏洩を防止します。"
                image="public/solutions/acp/wac3.gif"
            >
                <LearnMoreLink
                    href="https://docs.querypie.com/ja/administrator-manual/web-apps/connection-management/web-app-configurations"
                    external={true}
                    style={{ display: 'inline-flex', alignItems: 'center' }}
                >Learn More</LearnMoreLink>
            </KillerFeature>
            <KillerFeature
                title="タイムラインベースブラウザ監視"
                description="タイムラインビューと自動スクリーンショットにより、アプリ全体のアクションをキャプチャできます。リアルタイムインタラクションを監視し、セキュリティ異常を瞬時に特定し、完全に可視化することで完全な可視性により、すべてのアプリケーション全体で包括的な保護を保証します。"
                image="public/solutions/acp/wac4.gif"
            >
                <LearnMoreLink
                    href="https://docs.querypie.com/ja/administrator-manual/audit/web-app-logs/user-activity-recordings"
                    external={true}
                    style={{ display: 'inline-flex', alignItems: 'center' }}
                >Learn More</LearnMoreLink>
            </KillerFeature>
        </KillerFeatureCategory>
        <KillerFeatureCategory label="ワークフロー & 統合">
            <KillerFeature
                title="アイデンティティプロバイダ （IdP）統合"
                description="SAML SSOとSCIMプロトコルを通じてOktaやAD/LDAPなどのIdPを接続できます。一元制御によりユーザー管理とライフサイクルプロセスを効率化し、統一認証とアクセス制御により組織セキュリティを強化しています。"
                image="public/solutions/acp/workflow1.gif"
            >
                <LearnMoreLink
                    href="https://docs.querypie.com/ja/administrator-manual/general/user-management/authentication"
                    external={true}
                    style={{ display: 'inline-flex', alignItems: 'center' }}
                >Learn More</LearnMoreLink>
            </KillerFeature>
            <KillerFeature
                title="内蔵アクセス要求ワークフロー"
                description="内蔵された要求・承認ワークフロー によりジャストインタイムアクセス管理を効率化します。承認者がSlackを通じて直接決定を行うことで応答時間を短縮できます。行い、応答時間を短縮。効果的なアクセス制御と承認遅延の削減により、効率的な運用を保証します。"
                image="public/solutions/acp/workflow2.gif"
            >
                <LearnMoreLink
                    href="https://docs.querypie.com/ja/user-manual/workflow"
                    external={true}
                    style={{ display: 'inline-flex', alignItems: 'center' }}
                >Learn More</LearnMoreLink>
            </KillerFeature>
            <KillerFeature
                title="シークレットストア統合"
                description="HashiCorp Vaultを統合し、既存のシークレットストアから直接クレデンシャルを管理します。許可された操作やワークフローが、安全にストレージやデータベース、セキュリティインフラを完全に制御して効率化されたクレデンシャルを管理します。"
                image="public/solutions/acp/workflow3.gif"
            >
                <LearnMoreLink
                    href="https://docs.querypie.com/ja/administrator-manual/general/system/integrations/integrating-with-secret-store"
                    external={true}
                    style={{ display: 'inline-flex', alignItems: 'center' }}
                >Learn More</LearnMoreLink>
            </KillerFeature>
            <KillerFeature
                title="簡単なログストリーミング"
                description="簡単な設定により一元監視へのセキュリティデータストリーミングします。リアルタイムでログを関連付けしてインフラ全体の脅威を特定。包括的な監視とアラートにより新たな脅威に対応します。"
                image="public/solutions/acp/workflow4.gif"
            >
                <LearnMoreLink
                    href="https://docs.querypie.com/ja/administrator-manual/general/system/integrations/integrating-with-syslog"
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
                                '一つのプラットフォーム、'
                            }
                            <br />
                            {
                                'すべてのインフラ'
                            }
                        </StaticH4>
                        <StaticBody color="var(--text-body)">
                            {
                                'データベース、サーバー、Kubernetes、Webアプリケーション、アイデンティティプロバイダ、セキュリティツールなど50以上のシステムとシームレスに統合し、インフラエコシステム全体で統一された権限制御を実現しています。'
                            }
                        </StaticBody>
                        <Link href="/solutions/acp/integrations">
                            {
                                '利用可能なACP統合機能をすべて見る >'
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
