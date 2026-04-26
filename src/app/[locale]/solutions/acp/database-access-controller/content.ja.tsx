import type { Locale } from "@/constants/i18n";
import { buildSolutionContentComponents } from "@/features/solutions/contentComponents";

type Props = {
  locale: Locale;
  searchParams?: { category?: string };
};

export const metadata = {
    "title": "QueryPie DAC: Database Access Controller",
    "description": "QueryPie DACnはデータ保護のために作られ、様々なクラウドエコシステムにシームレスに接続します。 ",
    "abstract": "QueryPie DACnはデータ保護のために作られ、様々なクラウドエコシステムにシームレスに接続します。 ",
    "keywords": [
      "QueryPie DAC",
      "データベースアクセスコントローラ",
      "DBアクセス制御",
      "データ保護",
      "SQLエディタ",
      "RBAC",
      "ABAC",
      "データ監査"
    ]
} as const;


export default function AcpDatabaseAccessControllerJASolutionContent({ locale, searchParams }: Props) {
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
                        'QueryPie DAC は、クラウド環境とオンプレミス環境の両方をサポートするデータ保護およびアクセス制御ソリューションです。'
                    }
                    <br />
                    {
                        'どこにいても、データセキュリティとアクセス制御を完全に管理できるQueryPie DAC から始めてみませんか？'
                    }
                </StaticHeader>
            </Box>
            <Youtube src="https://www.youtube.com/embed/SoACnHF6s3Y?si=1DSZJfMYeXjeT0kU" />
        </CenterSection>
    </Box>

    <Box paddingTopSize="ultra" paddingBottomSize="xl" center as="section">
        <CenterSection gapSize="lg">
            <Box direction="column" gapSize="sm">
                <StaticH2>{'DAC の注目機能'}</StaticH2>
                <StaticBody color="var(--text-body)">
                    {
                        'QueryPie DAC は、RBAC（ロールベースアクセス制御）とABAC（属性ベースアクセス制御）を活用した動的なアクセス制御を提供し、高度な権限管理をサポートします。ユーザーはWeb SQL エディタを使ってスムーズにデータベース作業を行うことができ、管理者は多様なデータソースにおけるユーザーの活動をリアルタイムで監査することが可能です。'
                    }
                </StaticBody>
            </Box>
            <ThreeColumnList gapSize="md">
                <KeyFeature
                    iconFilepath="public/solutions/acp/database-access-controller/iam.svg"
                    label="RBAC / ABAC ベースのアクセス制御"
                    description="ユーザーロール(RBAC: Role-Based Access Control)によって基本権限を設定できるだけでなく、時間、曜日、 アドレス、SQL タイプなど様々な属性(ABAC: Attribute-Based Access Control)に基づいた詳細なアクセス制御が可能です。"
                />
                <KeyFeature
                    iconFilepath="public/solutions/acp/database-access-controller/web-editor.svg"
                    label="Web SQL エディタ対応"
                    description="ユーザーのオペレーティングシステムが何であっても、IDE ツールがなくても、ユーザフレンドリーな Web SQL エディタでブラウザから直接データベースに接続することができます。 クエリの実行からデータのインポートとエクスポートまで、すべてのタスクを簡単に処理できます。"
                />
                <KeyFeature
                    iconFilepath="public/solutions/acp/database-access-controller/alert.svg"
                    label="データ監査と異常兆候の通知"
                    description="ログイン、データベースアクセス、権限変更、SQL コマンド、クエリ結果など、すべてのユーザー活動を追跡し、異常な行動を素早く感知し、データセキュリティを徹底的に維持することができます。また、Slack のようなチャンネルでリアルタイム通知を受けて重要なイベントを確認することができます。"
                />
                <KeyFeature
                    iconFilepath="public/solutions/acp/database-access-controller/table-access-control.svg"
                    label="テーブル / カラム単位のアクセス制御"
                    description="機密情報を保護するためにデータマスキングポリシーを適用し、特定のクエリルールによって重要なテーブルとカラムへのアクセス制限を設定してデータセキュリティを強化することができます。"
                />
                <KeyFeature
                    iconFilepath="public/solutions/acp/database-access-controller/workflow.svg"
                    label="ジャストインアクセス要求処理"
                    description="ユーザーが必要な時点でアクセス権を要請し、管理者が直ちに承認及び権限を付与することができます。 Slack のようなシームレスな統合により、簡単で効率的なアクセス管理が可能です。"
                />
            </ThreeColumnList>
        </CenterSection>
    </Box>

    <Box paddingTopSize="xl" paddingBottomSize="xl" center as="section">
        <CenterSection gapSize="xxl">
            <Box direction="column" gapSize="sm">
                <StaticH2>{'QueryPie DACの仕組み'}</StaticH2>
                <StaticBody color="var(--text-body)">
                    {
                        "QueryPieは、お客様の固有の環境に合わせて柔軟なワークスペースを提供し、セキュリティを一層強化します。"
                    }
                    <br />
                    {'ブラウザベースのWeb SQLエディタにより、データ漏洩制御を簡単に管理できるだけでなく、'}
                    <br />
                    {
                        'サードパーティーツールの使用を可能にするエージェントまたはエージェントレス(URLプロキシ)方式をサポートします。'
                    }
                </StaticBody>
            </Box>
            <Box as="section" center>
                <div style={{ maxWidth: '1000px' }}>
                    <FileImage
                        alt="QueryPie DAC の仕組み"
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
                    {'QueryPie ユニバーサルアナライザー:'}
                    <br />
                    {'あらゆるクエリ言語に対応'}
                </StaticH2>
                <StaticBody color="var(--text-body)">
                    {
                        "QueryPie ならではの武器、クエリーアナライザーによって様々なデータソース間の差違を解消します。"
                    }
                    <br />
                    {
                        "いかなる複雑なクエリもQueryPie アナライザーが分析して解析し、シンプルな形式に変換します。"
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
                <StaticH2>{'簡単インストール、簡単操作'}</StaticH2>
                <StaticBody color="var(--text-body)">
                    {
                        'QueryPie はクラウドネイティブ技術とWebベースのインターフェースを組み合わせ、さまざまなオペレーティングシステムで簡単にインストールおよび運用できるよう設計されています。Docker パッケージングにより容易に配布可能で、オンプレミスのセキュリティとSaaS のような利便性の高いアップデート方式を組み合わせたハイブリッドアプローチをサポートしています。この設計により、金融、医療、公共部門などでのコンプライアンスを支援するとともに、問題が発生した際には即座にロールバックする機能も提供します。QueryPie は、SaaS の利便性とオンプレミスソリューションの強固なセキュリティを融合させることで、顧客に大きな価値を提供することを目指しています。'
                    }
                </StaticBody>
            </Box>
            <Box as="section" center>
                <div style={{ maxWidth: '1000px' }}>
                    <FileImage
                        alt="簡単インストール、簡単操作"
                        filepath="public/solutions/acp/database-access-controller/easy-use-jp.png"
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
                            {'ユーザーフレンドリーな'}
                            <br /> 
                            {'Web SQLエディタ'}
                        </StaticH4>
                        <StaticBody color="var(--text-body)">
                            {
                                'もう、IDE を個別に用意する必要ありません！ QueryPie のWeb SQL エディタを使用すれば、使用するOS に関係なく、ブラウザ上で簡単にクエリの実行、インポート、エクスポート、およびさまざまなタスクを実行できます。'
                            }
                        </StaticBody>
                    </Box>
                </SplitView.View>
                <SplitView.View fixWidth="51.7%">
                    <FileImage
                        alt="ユーザーフレンドリーなWeb SQL エディタ"
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
                        alt="サードパーティー ツールのための安全なプロキシ接続をサポート"
                        filepath="public/solutions/acp/database-access-controller/third-party-tools.png"
                        width={600}
                        height={380}
                        responsive
                    />
                </SplitView.View>
                <SplitView.View verticalCenter>
                    <Box direction="column" gapSize="sm">
                        <StaticH4>
                            {'サードパーティー ツールのための'}
                            <br />
                            {'安全なプロキシ接続をサポート'}
                        </StaticH4>
                        <StaticBody color="var(--text-body)">
                            {
                                'これまで利用していたツールをそのままデータベースに接続する必要がある場合のために、QueryPie は安全なプロキシサーバでのアプローチをサポートします。 エージェント及びエージェントレス方式をすべてサポートし、QueryPie と同様の強力なアクセス制御とポリシーをご利用いただけます。'
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
                            {'データベースを'}
                            <br />
                            {'統合した構文制御支援'}
                            </StaticH4>
                        <StaticBody color="var(--text-body)">
                            {
                                '標準SQLに基づいてデータベースを統合した構文制御が可能です。RDBMS、データウェアハウス、NoSQL などを一貫した権限ポリシーで管理し、Redis は200以上のコマンドを、MongoDB Shell は標準SQL に対応して構文統制をサポートします。'
                            }
                        </StaticBody>
                    </Box>
                </SplitView.View>
                <SplitView.View fixWidth="53.3%">
                    <FileImage
                        alt="データベースを統合した構文制御支援"
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
                        alt="重要データのマスキング処理と保護"
                        filepath="public/solutions/acp/database-access-controller/data-masking.png"
                        width={640}
                        height={660}
                        responsive
                    />
                </SplitView.View>
                <SplitView.View verticalCenter>
                    <Box direction="column" gapSize="sm">
                        <StaticH4>{'重要データのマスキング処理と保護'}</StaticH4>
                        <StaticBody color="var(--text-body)">
                            {
                                '事前定義されたパターンと正規形式で機密情報データのマスキング処理をサポートします。 カスタムパターン設定を通じて柔軟なマスキングポリシーを構成し、ビュー作成および関数使用時にデータを遮断し、ポリシーに従って個人情報を安全に保護します。 単一カラムだけでなく、JSON 形式のデータも処理します。'
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
                        <StaticH4>{'元帳テーブルのアクセス制御'}</StaticH4>
                        <StaticBody color="var(--text-body)">
                            {
                                '重要なテーブルへの変更を承認するワークフローを備えており、データを簡単に管理できます。 元帳テーブルポリシー(Ledger Table Policy) に検出された場合、事前定義された承認プロセスが自動的に行われます。 変更前後の結果を追跡し、スムーズな構成管理を実現します！'
                            }
                        </StaticBody>
                    </Box>
                </SplitView.View>
                <SplitView.View fixWidth="53.3%">
                    <FileImage
                        alt="元帳テーブルのアクセス制御"
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
                        alt="権限付与とSQL承認のプロセスの自動化"
                        filepath="public/solutions/acp/database-access-controller/workflow.png"
                        width={620}
                        height={670}
                        responsive
                    />
                </SplitView.View>
                <SplitView.View verticalCenter>
                    <Box direction="column" gapSize="sm">
                        <StaticH4>
                            {'権限付与とSQL承認の'}
                            <br />
                            {'プロセスの自動化'}
                            </StaticH4>
                        <StaticBody color="var(--text-body)">
                            {
                                '管理者が承認プロセスを設定できるカスタマイズ可能なテンプレートを使用して、ワークフローをシンプルにします！権限のないユーザーがデータベースへのアクセスや変更を要求した場合、自動化されたワークフローがすべてをスムーズに実行されるようにします。'
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
