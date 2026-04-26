import type { Locale } from "@/constants/i18n";
import { buildSolutionMdxComponents } from "@/features/solutions/mdxComponents";

type Props = {
  locale: Locale;
  searchParams?: { category?: string };
};

export default function AcpKubernetesAccessControllerJASolutionContent({ locale, searchParams }: Props) {
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
  <Box paddingTopSize="lg" center as="section" background="kac">
    <CenterSection gapSize="xxl" center>
      <Box direction="column" gapSize="sm" center>
        <StaticH1>{'Kubernetes Access Controller'}</StaticH1>
        <StaticHeader color="var(--text-body)">
          {
            'QueryPie KAC はクバネティスAPI保護ソリューションで、AWS EKS のようなクラウドインフラおよびオンプレミスクラスターの'
          }
          <br />
          {
            '集中管理を可能にします。管理者はアクセス管理、API リクエストの監視、実行したコンテナコマンドの再生を行うことができます。'
          }
        </StaticHeader>
      </Box>
      <Youtube src="https://www.youtube.com/embed/OzxB0qqmCTQ?si=qbFYGIDUg2GPuzfU" />
    </CenterSection>
  </Box>

  <Box paddingTopSize="ultra" paddingBottomSize="xl" center as="section">
    <CenterSection gapSize="lg">
      <Box direction="column" gapSize="sm">
        <StaticH2>{'KACの注目機能'}</StaticH2>
        <StaticBody color="var(--text-body)">
          {
            'QueryPie KAC は、クバネティスの正確なアクセス管理のために、RBAC およびABAC のコントロールを提供し、IAM パーミッションを自動的に取得します。'
          }
          <br />
          {
            'また、監査ログやセッション記録、効率的なマルチクラスターアクセスを通じてリアルタイムで状況を把握することが可能です。'
          }
        </StaticBody>
      </Box>
      <ThreeColumnList gapSize="md">
        <KeyFeature
          iconFilepath="public/solutions/acp/kubernetes-access-controller/iam.svg"
          label="RBAC / ABACベースのアクセス制御"
          description="クバネティス クラスタに対して、役割ベースアクセス制御（RBAC）を実装し、API アクセスをカスタマイズしたポリシーで管理します。また、属性ベースアクセス制御（ABAC）を使用して、ユーザー属性に基づいた権限に適合させます。"
        />
        <KeyFeature
          iconFilepath="public/solutions/acp/kubernetes-access-controller/gateway.svg"
          label="自動化されたアクセス許可"
          description="AWS EKS のようなクラウドベースのクバネティス クラスタに対して、IAM 権限を割り当てるだけで、管理者のアクセス権限を自動的に登録します。"
        />
        <KeyFeature
          iconFilepath="public/solutions/acp/kubernetes-access-controller/audit.svg"
          label="監査ログとセッションの記録"
          description="監査ログとポッドセッションの記録を通じて、複数のクラスタにわたるユーザーの行動をほぼリアルタイムで可視化します。"
        />
        <KeyFeature
          iconFilepath="public/solutions/acp/kubernetes-access-controller/cluster.svg"
          label="マルチクラスターアクセスの集中化"
          description="ユーザーがコンテナに接続した際のセッションを自動的に記録し、ユーザーのアクションを監視。標準の K8S RBAC ではサポートされていない、K8S(クバネティス)リソース名（RegEx）に基づくアクセス制御ルールを適用します。"
        />
        <KeyFeature
          iconFilepath="public/solutions/acp/kubernetes-access-controller/config.svg"
          label="自動 KUBECONFIG の設定"
          description="分散リソースを同期し、複数のクバネティス統合を管理することで、クラウド環境を最適化します。スケジューリング機能により、リソースの同期を自動化し、変更履歴を追跡します。"
        />
      </ThreeColumnList>
    </CenterSection>
  </Box>

  <Box paddingTopSize="xl" paddingBottomSize="xl" center as="section">
    <CenterSection gapSize="xxl">
      <Box direction="column" gapSize="sm">
        <StaticH2>{'QueryPie KAC の仕組み'}</StaticH2>
        <StaticBody color="var(--text-body)">
          {'QueryPie KAC は、強力なアクセス制御と監査機能を備えたKubernetes クラスタにユーザーをシームレスに接続します。'}
          <br />
          {
            'QueryPie Agent はセキュアなkubeconfig ファイルを生成し、ユーザはkubectl、Lens などのツールを使用して簡単にKubernetes クラスタに接続できます。'
          }
          <br />
          {
            'QueryPie KAC は、コントロール ハブとして機能し、すべてのKubernetes アクティビティに対する正確なロールベース アクセス管理と包括的な監査を保証します。'
          }
        </StaticBody>
      </Box>
      <Box as="section" center>
        <div style={{ maxWidth: '1000px' }}>
          <FileImage
            alt="QueryPie KAC の仕組み"
            filepath="public/solutions/acp/kubernetes-access-controller/works.png"
            width={1000}
            height={400}
            responsive
          />
        </div>
      </Box>
    </CenterSection>
  </Box>

  <Box paddingTopSize="xl" paddingBottomSize="ultra" center as="section">
    <CenterSection gapSize="xl">
      <Box direction="column" gapSize="sm">
        <StaticH2>{'クバネティスを完全に保護する'}</StaticH2>
        <StaticBody color="var(--text-body)">
          {
            'QueryPie は、クバネティス環境のセキュリティを強化し、ネームスペース内外を問わず、すべての環境を安全に保護します。'
          }
          <br />
          {'SAC（System Access Controller） は、厳密なアクセス制御とノードのSSH 接続に関する監査機能を担当し、KAC（Kubernetes Access Controller） はクバネティス リソースにおけるすべてのAPIインタラクションを管理・監視する役割を果たします。'}
          <br />
          {
            'これにより、すべてのタスクがシームレスかつ安全に実行されるよう、包括的なセキュリティを提供いたします。'
          }
        </StaticBody>
      </Box>
      <Box as="section" center>
        <div style={{ maxWidth: '1000px' }}>
          <FileImage
            alt="クバネティスを完全に保護する"
            filepath="public/solutions/acp/kubernetes-access-controller/protect-k8s.png"
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
            <StaticH4>{'簡単で高速なクラウド同期'}</StaticH4>
            <StaticBody color="var(--text-body)">
              {
                'QueryPie でクラウドリソースを簡単に同期！クラウド環境に最適化され、クバネティス統合をシンプル化し、スマートなスケジューリング機能でリソース同期を自動化し、変更を簡単に追跡できます。'
              }
            </StaticBody>
          </Box>
        </SplitView.View>
        <SplitView.View fixWidth="51.7%">
          <FileImage
            alt="簡単で高速なクラウド同期"
            filepath="public/solutions/acp/kubernetes-access-controller/cloud-sync.png"
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
        <SplitView.View fixWidth="53.3%">
          <FileImage
            alt="Multi-K8S 環境統合管理"
            filepath="public/solutions/acp/kubernetes-access-controller/management-env.png"
            width={640}
            height={610}
            responsive
          />
        </SplitView.View>
        <SplitView.View verticalCenter>
          <Box direction="column" gapSize="sm">
            <StaticH4>{'Multi-K8S 環境統合管理'}</StaticH4>
            <StaticBody color="var(--text-body)">
              {
                '単一のコンソールで権限を管理することで、クバネティス クラスタごとにロールベースアクセス制御（RBAC） 設定を個別に構成する必要がなくなります。ワイルドカードを使用して、複数のクラスタに同じ権限ポリシーを適用してアクセス制御をシンプル化します。'
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
            <StaticH4>{'きめ細かいK8Sリソースユニットのポリシー管理'}</StaticH4>
            <StaticBody color="var(--text-body)">
              {
                'ワイルドカードと正規表現のサポートにより、リソースへのアクセス制御をシンプル化し、ユーザー権限に応じて応答をフィルタリングし、変数名に適応できます。 API グループ、アクション、リソースタイプ、名前空間、およびリソース名の詳細なポリシー管理により、正確な制御が可能です。'
              }
            </StaticBody>
          </Box>
        </SplitView.View>
        <SplitView.View fixWidth="48.3%">
          <FileImage
            alt="きめ細かいK8S リソースユニットのポリシー管理"
            filepath="public/solutions/acp/kubernetes-access-controller/management-policy.png"
            width={580}
            height={460}
            responsive
          />
        </SplitView.View>
      </SplitView>
    </CenterSection>
  </Box>

  <Box paddingTopSize="md" paddingBottomSize="md" center as="section">
    <CenterSection>
      <SplitView gapSize="xxl" breakpoint="md" reverse useNoGapWhenMobile>
        <SplitView.View fixWidth="50.8%">
          <FileImage
            alt="クバネティスAPI 実行履歴のログ記録"
            filepath="public/solutions/acp/kubernetes-access-controller/logging-api.png"
            width={610}
            height={760}
            responsive
          />
        </SplitView.View>
        <SplitView.View verticalCenter>
          <Box direction="column" gapSize="sm">
            <StaticH4>{'クバネティスAPI 実行履歴のログ記録'}</StaticH4>
            <StaticBody color="var(--text-body)">
              {
                'クバネティスAPI 監査ログの混乱にさよならを言いましょう！ QueryPie のプロキシは、複数のクラスタにわたるすべてのAPI リクエストを記録し、効率的な追跡に必要なアクションに焦点を当てながら、マスターサーバーへの不要な負荷を軽減します。'
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
            <StaticH4>{'コンテナシェルコマンドの実行履歴'}</StaticH4>
            <StaticBody color="var(--text-body)">
              {
                'ユーザーがポッドに接続した後に実行したすべてのタスクを再生できるセッション記録を使用して、コンテナ内で発生したユーザーアクティビティを徹底的に追跡します。この機能は、ユーザーが実行したコマンド、API リクエスト、およびタスクを細かく記録し、全体の監査と制御を強化し、問題が発生したときに迅速に対応できるようにします。'
              }
            </StaticBody>
          </Box>
        </SplitView.View>
        <SplitView.View fixWidth="50%">
          <FileImage
            alt="コンテナシェルコマンドの実行履歴"
            filepath="public/solutions/acp/kubernetes-access-controller/session-replay.png"
            width={600}
            height={590}
            responsive
          />
        </SplitView.View>
      </SplitView>
    </CenterSection>
  </Box>

  <Box paddingTopSize="md" paddingBottomSize="lg" center as="section">
    <CenterSection>
      <SplitView gapSize="xxl" breakpoint="md" reverse useNoGapWhenMobile>
        <SplitView.View fixWidth="48.3%">
          <FileImage
            alt="クバネティスアクセス権の自動設定"
            filepath="public/solutions/acp/kubernetes-access-controller/auto-setup.png"
            width={580}
            height={510}
            responsive
          />
        </SplitView.View>
        <SplitView.View verticalCenter>
          <Box direction="column" gapSize="sm">
            <StaticH4>{'クバネティスアクセス権の自動設定'}</StaticH4>
            <StaticBody color="var(--text-body)">
              {
                '各ユーザーに割り当てられたロールに基づいて、kubeconfig ファイルを自動的に生成します。ユーザーはQueryPie エージェントを通じてこれらのファイルに簡単にアクセスでき、kubectx などの既存のクバネティス ツールを使用してアクセス可能なクラスターを選択できます。'
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
