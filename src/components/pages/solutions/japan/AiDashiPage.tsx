import Image from "next/image";
import Cta from "@/components/sections/Cta";
import Badge from "@/components/ui/Badge";
import { getLocalePath } from "@/constants/i18n";
import { pageSectionGapClassName, pageXPaddingClassName } from "@/constants/layout";
import { getPublicDetailHref } from "@/features/content/data";
import AiCrewWhitepaperSection from "./AiCrewWhitepaperSection";
import AiDashiRolloutSection from "./AiDashiRolloutSection";
import AiDashiValueHeadline from "./AiDashiValueHeadline";
import ComparisonAvailabilityIcon from "./ComparisonAvailabilityIcon";
import SolutionActionLink from "./SolutionActionLink";
import SolutionIcon from "./SolutionIcon";
import SolutionSectionHeading from "./SolutionSectionHeading";

export const metadata = {
  title: "自社サービスをAI搭載SaaSへ最短で進化させる | AI Dashi",
  description:
    "自社SaaSやWebサービスにエンタープライズ品質のAI基盤を組み込み、ブランド体験を保ったままAI搭載サービスへ進化させます。",
  keywords: ["AI Dashi", "組み込みAI", "AI SaaS", "QueryPie AIP"],
} as const;

const values = [
  { icon: "spark", number: "01", title: "競合優位性の確立", headline: "自社のオリジナル機能としてシームレスに展開", headlineAccent: "オリジナル機能", body: "他社の汎用AIツールを外付けするのではなく、貴社プロダクトの裏側に深く組み込みます。ブランド体験を損なわず、直接的な競争力と顧客ロイヤルティを高めます。" },
  { icon: "layers", number: "02", title: "開発リソースの最適化", headline: "AI開発の技術的負債を回避し、コアビジネスに集中", headlineAccent: "技術的負債を回避", body: "変化の速いLLMの追従や複雑なインフラ保守はすべてQueryPie AIPが担います。ゼロから内製するコストとリスクを抑え、エンジニアの貴重な時間を本来のプロダクト開発に集中させられます。" },
  { icon: "analysis", number: "03", title: "事業成長の加速", headline: "タイム・トゥ・マーケットを最速化し、新たな収益源へ", headlineAccent: "タイム・トゥ・マーケット", body: "フルスクラッチなら1年以上かかるエンタープライズ水準のセキュアなAI基盤を、最短1ヶ月で市場投入。単価向上（アップセル）や新プランの立ち上げを加速します。" },
] as const;

const risks = [
  { icon: "people", title: "人材と技術の枯渇", body: "AI専門エンジニアの採用難に加え、日進月歩で変わる最新アーキテクチャへの追従に開発リソースが食いつぶされ、本来のコア事業の進化が止まります。" },
  { icon: "document", title: "データ整備の泥沼", body: "自社データベースを正確にAIに読み込ませる（RAG構築）には膨大な工数がかかり、実用レベルの精度が出ないままリリースが無限に延期されます。" },
  { icon: "layers", title: "肥大化するインフラ保守", body: "リリース後も、モデルの更新やプロンプトの調整、インフラ監視など、想定外の保守運用コストが継続的に発生し利益を圧迫します。" },
] as const;

const securityItems = [
  { icon: "people", title: "B2B基準の権限管理（RBAC）", body: "組織階層やユーザーごとの緻密なアクセス制御をAPIで実装。情報漏洩の致命的リスクを防ぎます。" },
  { icon: "shield", title: "ハルシネーションを防ぐガードレール", body: "自社データのみに基づく事実回答を徹底し、B2Bの業務利用で絶対に許されない「AIの嘘」を防止します。" },
  { icon: "document", title: "監査ログとコンプライアンス対応", body: "ISO/IEC 42001 / SOC2 / ISO27001水準のセキュリティ基盤により、エンタープライズ顧客の厳しいセキュリティシート（導入審査）をパスできます。" },
] as const;

const comparisonRows = [
  { label: "開発期間", aip: ["最短1ヶ月（API組み込みのみ）", "すぐに市場投入が可能"], inHouse: ["半年〜1年以上（試行錯誤の連続）", "競合に先を越され市場機会を逃す"] },
  { label: "初期インフラ投資", aip: ["初期投資ゼロ（インフラ不要）", "使った分だけの従量課金でスモールスタートが可能"], inHouse: ["数千万円規模の先行投資", "サーバー代や検証費用など、回収不能なサンクコストが発生"] },
  { label: "専門エンジニア確保", aip: ["QueryPie AIのFDE（専門エンジニア）が伴走", "AIに関する専門知識不要"], inHouse: ["AI人材の採用が必須（極めて困難）", "人件費の高騰で採用が進まないリスク"] },
  { label: "セキュリティ", aip: ["エンタープライズ品質の基盤（ISO/IEC 42001/SOC2/ISO27001）", "厳格な権限管理（RBAC）が標準装備"], inHouse: ["ゼロトラストアーキテクチャを一から構築", "情報漏洩の致命的リスクと認証取得の果てしない工数"] },
  { label: "ハルシネーション対策", aip: ["エンタープライズRAGによる事実のみの回答", "内蔵されたガードレール機能でB2Bでの業務利用も安心"], inHouse: ["精度が上がらず本番リリース不可", "自社データとLLMの連携（チャンキング等）で泥沼化"] },
  { label: "運用保守", aip: ["24時間365日のインフラ監視と継続アップデート", "LLMの進化や運用はすべてオフロード、本業に集中"], inHouse: ["自社エンジニアが運用保守に追われる", "プロンプト調整やインフラ管理でコア事業の進化が停止"] },
] as const;

const supportItems = [
  { icon: "layers", title: "カスタマイズ自在なAI基盤", subtitle: "最速での市場投入を実現するコアシステム", points: ["ブランドに合わせたUI/UXカスタマイズ", "高性能AIエージェント基盤", "既存サービス・DBとのAPI連携", "最短1〜3ヶ月で立ち上げ可能な開発環境"] },
  { icon: "people", title: "専門エンジニアによる開発支援", subtitle: "貴社チームに伴走し、最適なAIを共創", points: ["FDEが要件定義から参画", "ドメイン知識とAI知見を組み合わせた設計", "初期セットアップと技術トレーニング", "リリースに向けた継続サポート"] },
  { icon: "shield", title: "継続的なインフラ・運用保守", subtitle: "リリース後の基盤管理をオフロード", points: ["セキュアで高可用なAIインフラ", "継続的な監視と障害対応", "最新AIモデルへのアップデート", "運用負担を減らし、事業成長に集中"] },
] as const;

const steps = [
  ["01", "1〜2週間", "ヒアリング・要件定義", "ビジネスモデル、既存システム、実現したいAI機能を整理し、最適なアーキテクチャと実装方針を策定します。"],
  ["02", "2〜3週間", "プロトタイプ作成", "ブランドに合わせたUI/UXと初期AIモデルを構築し、実際の動作と顧客体験を確認します。"],
  ["03", "4〜6週間", "統合開発・テスト", "既存サービスやDBとのAPI連携、回答品質の調整、権限管理とセキュリティ要件を検証します。"],
  ["04", "最短1〜3ヶ月", "本番リリース・運用開始", "顧客向けに公開し、リリース後も基盤監視とFDEによる継続的な改善を支援します。"],
] as const;

export default function AiDashiPage() {
  const contactHref = getLocalePath("ja", "/company/contact-us");
  const whitepaperHref = getPublicDetailHref("documentation", "ja", "saas-end-or-evolution", "white-papers");

  return (
    <div className={`flex w-full flex-col ${pageSectionGapClassName} ${pageXPaddingClassName}`}>
      <section className="relative -mx-5 -mt-[36px] min-h-[600px] overflow-hidden bg-bg-deep md:-mx-10 md:-mt-[76px] md:min-h-[560px]">
        <Image alt="AI Dashiの組み込みAI基盤" className="object-cover" fill priority sizes="100vw" src="/assets/pages/solutions/ai-dashi/hero-ai.webp" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.8)_0%,rgba(0,0,0,0.5)_54%,rgba(0,0,0,0.08)_100%)]" />
        <div className="relative mx-auto flex min-h-[600px] w-full max-w-[1280px] items-center px-5 py-12 md:min-h-[560px] md:px-10 md:py-12">
          <div className="theme-dark flex max-w-[720px] flex-col items-start gap-6 text-white">
            <h1 className="m-0 text-pretty type-h1">自社サービスを<br className="md:hidden" />AI搭載SaaSへ<br />最短で進化させる</h1>
            <div className="max-w-[620px] space-y-2 type-body-lg text-white/80">
              <p className="m-0">明日、AIを搭載した競合が現れたとき、貴社のサービスは選ばれ続けるでしょうか。</p>
              <p className="m-0">LLMの進化により、ソフトウェアの価値基準は、画面を手動で操作するSaaSから、AIが自律的に業務を完結させるSaaSへ移行しています。</p>
              <p className="m-0">AIエージェントを組み込んだ後発サービスが自動化体験で市場を奪う今、AI実装の遅れは単なる機能差ではなく、サービスの陳腐化や解約に直結する経営課題です。</p>
            </div>
            <SolutionActionLink href={contactHref} variant="primary">無料で導入相談・お見積り</SolutionActionLink>
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-[1200px] gap-10 md:grid-cols-2 md:items-center md:gap-[60px]">
        <div className="space-y-5"><h2 className="m-0 text-pretty type-h1 text-fg">なぜ<span className="text-brand">AI Dashi</span>なのか？</h2><p className="m-0 type-body-lg text-mute">良い「出汁」は、主役の食材を邪魔せず、料理全体の旨味を底上げします。</p><p className="m-0 type-body-lg text-mute">SaaSやWebサービスにおけるAIも同じです。AIそのものが主役になるのではなく、貴社がこれまで築き上げてきた「プロダクトのコア価値」を裏側から圧倒的に引き上げる存在でなければなりません。</p><p className="m-0 type-body-lg text-mute">QueryPie AIが提供するAIプラットフォーム（AIP）は、貴社のUIやブランドの世界観に完全に溶け込み、ユーザーに「このサービス、すごく便利になった！」という最高の体験（旨味）を提供するための、最高品質のAI基盤（AI Dashi）です。</p></div>
        <div className="w-full max-w-[480px] justify-self-center overflow-hidden rounded-box md:justify-self-end"><Image alt="AI Dashiのコンセプト" className="block h-auto w-full" height={1088} sizes="(min-width: 768px) 480px, 100vw" src="/assets/pages/solutions/ai-dashi/about-visual.webp" width={1200} /></div>
      </section>

      <section className="-mx-5 bg-bg-deep px-5 py-[70px] md:-mx-10 md:px-10 md:py-[90px]">
        <div className="mx-auto w-full max-w-[1200px] space-y-10"><SolutionSectionHeading title="QueryPie AIPが提供する3つの価値" /><div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,680px)] lg:items-start lg:gap-10"><div className="flex flex-col gap-4">{values.map((item) => <article className="flex flex-col rounded-box bg-bg p-6" key={item.number}><div><Badge variant="secondary">{item.title}</Badge></div><h3 className="mb-4 mt-5 type-h3 text-fg"><AiDashiValueHeadline accent={item.headlineAccent} headline={item.headline} /></h3><p className="m-0 type-body-md text-mute">{item.body}</p></article>)}</div><div className="relative mx-auto aspect-[1.14/1] w-full max-w-[680px] overflow-hidden rounded-box"><Image alt="AI Dashiが提供する3つの価値" className="object-cover" fill sizes="(min-width: 1024px) 680px, (min-width: 640px) 600px, 100vw" src="/assets/pages/solutions/ai-dashi/value-diagram.webp" /></div></div></div>
      </section>

      <section className="mx-auto w-full max-w-[1200px] space-y-10">
        <SolutionSectionHeading title="ゼロからの自社AI化を阻む、3つの致命的リスク" description="LLMのAPIを叩くだけなら簡単ですが、それを「商用レベルのSaaS」として実装しようとすると、多くのプロジェクトが以下の壁に直面し頓挫します。" /><div className="grid gap-4 md:grid-cols-3">{risks.map((item) => <article className="rounded-box bg-[var(--color-inverse-bg)] p-6" key={item.title}><div className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[var(--color-inverse-fg)] text-[var(--color-inverse-bg)]"><SolutionIcon name={item.icon} /></div><h3 className="mb-4 mt-8 type-h3 text-[var(--color-inverse-fg)]">{item.title}</h3><p className="m-0 type-body-md text-[var(--color-inverse-muted)]">{item.body}</p></article>)}</div>
      </section>

      <section className="mx-auto w-full max-w-[1200px] space-y-10">
        <SolutionSectionHeading title="LLMを繋ぐだけでは、エンタープライズ顧客には売れない" description="AI機能を実装できても、大企業が求める厳しいセキュリティ要件を満たさなければ、導入審査で弾かれます。QueryPie AIPは、これらの要件をあらかじめクリアしたAI基盤です。" />
        <div className="grid gap-4 md:grid-cols-3">{securityItems.map((item) => <article className="rounded-box bg-bg-content p-6" key={item.title}><div className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-bg text-fg"><SolutionIcon name={item.icon} /></div><h3 className="mb-4 mt-8 type-h3 text-fg">{item.title}</h3><p className="m-0 type-body-md text-mute">{item.body}</p></article>)}</div>
      </section>

      <section className="-mx-5 bg-bg-deep px-5 py-[70px] md:-mx-10 md:px-10 md:py-[90px]">
        <div className="mx-auto w-full max-w-[1100px] space-y-10"><SolutionSectionHeading title="QueryPie AIPと自社開発の比較" description={["競合他社がAI化を進める中、開発に半年以上かけていては市場機会を逃します。", "QueryPie AIPを活用すれば、最短1ヶ月で独自のAIサービスをリリースできます。"]} /><div className="overflow-x-auto overflow-y-hidden rounded-box border border-border bg-bg"><div className="min-w-[800px]"><div className="grid grid-cols-[0.8fr_1.4fr_1.4fr] border-b border-border bg-bg text-fg"><span className="px-5 py-4" /><span className="relative z-10 -mb-px flex flex-col items-center gap-1 border-x-[3px] border-t-[3px] border-brand px-5 py-4 text-center"><h3 className="m-0 flex items-center gap-2 type-h3"><Badge variant="brand">おすすめ</Badge>QueryPie AIP導入</h3><span className="type-body-sm text-mute">組み込みAI基盤</span></span><span className="flex flex-col items-center gap-1 px-5 py-4 text-center"><h3 className="m-0 type-h3">自社開発</h3><span className="type-body-sm text-mute">フルスクラッチ</span></span></div>{comparisonRows.map((row, index) => <div className="grid grid-cols-[0.8fr_1.4fr_1.4fr] border-b border-border last:border-b-0" key={row.label}><strong className="self-center px-5 py-4 type-body-lg text-fg">{row.label}</strong><div className={`relative z-10 -mb-px flex flex-col items-center border-x-[3px] border-brand px-5 py-4 text-center ${index === comparisonRows.length - 1 ? "border-b-[3px]" : ""}`}><ComparisonAvailabilityIcon available /><p className="mb-0 mt-3 type-body-lg text-fg">{row.aip[0]}</p><p className="mb-0 mt-1 type-body-sm text-mute">{row.aip[1]}</p></div><div className="flex flex-col items-center px-5 py-4 text-center"><ComparisonAvailabilityIcon available={false} /><p className="mb-0 mt-3 type-body-lg text-fg">{row.inHouse[0]}</p><p className="mb-0 mt-1 type-body-sm text-mute">{row.inHouse[1]}</p></div></div>)}</div></div><p className="m-0 text-center type-body-sm text-mute">※期間・費用は標準的な導入ケースの目安です。要件により変動します。</p></div>
      </section>

      <section className="mx-auto w-full max-w-[1200px] space-y-8 md:space-y-10">
        <SolutionSectionHeading title="QueryPie AIの包括的サポート体制" description="単なるツール提供ではなく、自社ブランドのAIサービスをリリースし、安定運用するための要素をワンストップで提供します。" />
        <div className="grid gap-4 md:gap-5 lg:grid-cols-3">{supportItems.map((item) => <article className="flex flex-col rounded-box bg-bg-content p-6 md:h-full md:min-h-[360px]" key={item.title}><div className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-primary text-bg"><SolutionIcon name={item.icon} /></div><h3 className="mb-2 mt-5 type-h2 text-fg md:mt-7">{item.title}</h3><p className="m-0 type-body-md text-mute">{item.subtitle}</p><ul className="m-0 mt-5 flex list-none flex-col gap-2.5 p-0 md:mt-6 md:gap-3">{item.points.map((point) => <li className="flex items-start gap-1.5 type-body-md text-fg" key={point}><span className="inline-flex w-4 shrink-0 justify-center text-brand">✓</span><span>{point}</span></li>)}</ul></article>)}</div>
      </section>

      <AiDashiRolloutSection
        description={[
          "ゼロからAIを自社開発し、試行錯誤で時間を浪費する必要はありません。",
          "当社の専門エンジニア（FDE）が要件定義から本番公開まで一気通貫で伴走し、競合に先んじたスピーディな立ち上げを実現します。",
        ]}
        steps={steps}
        title="市場機会を逃さない、"
        titleAccent="圧倒的な導入スピード"
        titleEyebrow="最速で市場へ"
      />

      <AiCrewWhitepaperSection
        action="無料でダウンロード"
        badges={["プロダクト責任者向け", "SaaS戦略", "組み込みAI"]}
        description="AIエージェントがSaaSビジネスに与える影響と、SaaS企業が取るべき戦略、AI Native企業への変革の視点をまとめました。"
        href={whitepaperHref}
        imageAlt="SaaSの終焉か、進化か ホワイトペーパー"
        imageSrc="/documentation/white-papers/thumbnail-26.webp"
        title="SaaSの終焉か、進化か"
      />

      <Cta actionHref={contactHref} actionLabel="無料で導入相談・お見積り" compactHeading description="具体的な連携アイデアから実装範囲、お見積もりまでお気軽にご相談ください。" hideEyebrow locale="ja" secondaryActionHref="" secondaryActionLabel="" title="自社サービスのAI化を、一緒にデザインしませんか？" />
    </div>
  );
}
