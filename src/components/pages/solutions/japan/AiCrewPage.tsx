import Image from "next/image";
import Cta from "@/components/sections/Cta";
import Badge from "@/components/ui/Badge";
import ButtonGroup from "@/components/ui/ButtonGroup";
import { getLocalePath } from "@/constants/i18n";
import { pageSectionGapClassName, pageXPaddingClassName } from "@/constants/layout";
import { getPublicDetailHref } from "@/features/content/data";
import AiCrewBeforeAfter from "./AiCrewBeforeAfter";
import AiCrewPlatformDiagram from "./AiCrewPlatformDiagram";
import AiCrewUseCaseCard from "./AiCrewUseCaseCard";
import AiCrewWhitepaperSection from "./AiCrewWhitepaperSection";
import SolutionActionLink from "./SolutionActionLink";
import SolutionIcon from "./SolutionIcon";
import SolutionSectionHeading from "./SolutionSectionHeading";

export const metadata = {
  title: "作業を減らし、成果を増やす。| AI Crew",
  description:
    "調査、データ整理、下書きなどの下準備をAIに任せ、企業の生産性と利益率の向上を支援します。",
  keywords: ["AI Crew", "業務効率化", "AIエージェント", "QueryPie AIP"],
} as const;

const introductionSteps = [
  ["01", "業務課題ヒアリング", "時間がかかる業務、分散するデータ、任せたい作業範囲を整理し、業務が滞る場所を明確にします。"],
  ["02", "対象業務の選定・テスト設計", "対象部門、利用データ、連携先、期待成果と評価指標を定め、効果が出やすい業務から始めます。"],
  ["03", "試作版の構築", "業務フローに合わせてAIの役割、手順、参照データ、出力形式を設計し、触れられる形にします。"],
  ["04", "PoC実施・評価", "実業務に近い条件で、回答品質、工数削減、運用しやすさを検証します。"],
  ["05", "本番導入・改善横展開", "成果が確認できた業務から本番展開し、システム連携と権限を整えながら対象を広げます。"],
] as const;

const introductionStepIcons = ["search", "folder", "spark", "check", "connect"] as const;

const useCases = [
  { id: "seo-analyst", imageSrc: "/demo/use-cases/aip-use-case-2.webp", tags: ["マーケティング", "SEO"], title: "SEO分析", body: "サイト分析、改善ポイントの整理、ダッシュボード化を支援し、次の打ち手を見えやすくします。" },
  { id: "quotation-analyze-ai-agent", imageSrc: "/demo/use-cases/aip-use-case-1.webp", tags: ["見積・営業", "見積分析"], title: "見積業務", body: "見積書の分析・比較・作成を支援し、確認や転記にかかる時間を減らします。" },
  { id: "dev-insight-ai-agent", imageSrc: "/demo/use-cases/aip-use-case-15.webp", tags: ["開発", "DevOps"], title: "開発インサイト", body: "Git、PR、チケット、CI/CD、インシデントを横断し、状況とリスクを会話型で可視化します。" },
  { id: "data-analytics-agent", imageSrc: "/demo/use-cases/aip-use-case-6.webp", tags: ["分析・経営", "データ可視化"], title: "データ分析", body: "自然言語の質問からデータ抽出、可視化、インサイト整理までを支援します。" },
  { id: "work-collaboration-agent", imageSrc: "/demo/use-cases/aip-use-case-11.webp", tags: ["コラボレーション", "業務自動化"], title: "業務コラボレーション", body: "Slack、Jira、Confluenceを連携し、反復的な調整業務とチーム間の情報共有を自動化します。" },
  { id: "security-audit-agent", imageSrc: "/demo/use-cases/aip-use-case-10.webp", tags: ["セキュリティ", "監査"], title: "セキュリティ監査", body: "自然言語でアクセスパターンを調査し、異常を検知してコンプライアンスレポートを生成します。" },
] as const;

const voices = [
  ["MK", "マーケティング担当者", "B2B事業会社", "AIツールを1つ増やした感覚ではなく、実務を支えてくれる新しい同僚という感覚に近いです。"],
  ["CS", "カスタマーサポート責任者", "SaaS運営チーム", "問い合わせ対応の初動が圧倒的に速くなり、担当者が本当に時間を使うべき難易度の高い案件や攻めのサクセス業務に集中できるようになりました。"],
  ["BD", "事業企画マネージャー", "成長フェーズ企業", "会議前に必要な市場データや議事録が先に整理されているので、分析担当の準備負荷が劇的に軽くなりました。"],
  ["OP", "オペレーション統括", "業務支援組織", "最初から大きく変えず、まずはこの1つの業務だけと小さく始められたので、現場への導入もスムーズでした。"],
] as const;

export default function AiCrewPage() {
  const contactHref = getLocalePath("ja", "/company/contact-us");
  const demoHref = getLocalePath("ja", "/demo/use-cases");
  const whitepaperHref = getPublicDetailHref("documentation", "ja", "ai-transformation-japan", "white-papers");

  return (
    <div className={`flex w-full flex-col ${pageSectionGapClassName} ${pageXPaddingClassName}`}>
      <section className="mx-auto grid w-full max-w-[1200px] items-start gap-10 md:grid-cols-2 md:items-center md:gap-[30px]">
        <div className="flex flex-col items-start gap-6">
          <h1 className="m-0 text-pretty type-h1 text-fg">
            AIを単なるツールではなく、<br />共に働く<span className="text-brand">AI Crew</span>へ。
          </h1>
          <div className="max-w-[560px] space-y-3 type-body-lg text-mute">
            <p className="m-0">AIを単なる便利なツールではなく、貴社のチームに加わる「新しい同僚」として迎える。それがQueryPie AIの考え方です。</p>
            <p className="m-0">QueryPie AIPは、貴社の業務フローやルールを理解する業務別AIエージェントを構築します。現場のAI Crewとして情報収集・データ整理・下書きなどの準備業務を自律的に分担し、人は判断と創造に集中することで、チーム全体の生産性と成果を高めます。</p>
          </div>
          <ButtonGroup className="flex-wrap">
            <SolutionActionLink href={contactHref}>業務に合うAI活用を相談する</SolutionActionLink>
            <SolutionActionLink href={demoHref} variant="outline">活用事例を見る</SolutionActionLink>
          </ButtonGroup>
        </div>
        <div className="relative aspect-[16/9] overflow-hidden rounded-box bg-bg-content">
          <Image alt="AI Crewがチームの一員として業務を分担するイメージ" className="object-cover" fill priority sizes="(min-width: 768px) 50vw, 100vw" src="/assets/pages/solutions/ai-crew/hero-visual.webp" />
        </div>
      </section>

      <section className="-mx-5 bg-bg-deep px-5 py-[70px] md:-mx-10 md:px-10 md:py-[90px]">
        <div className="mx-auto w-full max-w-[1200px] space-y-10">
          <SolutionSectionHeading title={["AIに下準備を任せ、", "人は判断と創造に集中する"]} description="判断前の業務はAIに任せ、人は本質的な仕事に集中します。" />
          <AiCrewBeforeAfter
            afterTitle="役割分担が整理され、本来の業務に集中"
            beforePoints={["情報が散らばり、調査と確認に時間がかかる", "下準備が多く、本来の判断に時間を使えない"]}
            beforeTitle="一次対応に時間がかかる"
            crewLabel="AI"
            crewTasks={["調査", "整理", "一次ドラフト", "分析準備", "リスク検知"]}
            decisionLabel="人による最終判断"
            humanLabel="人"
            humanTasks={["最終判断", "顧客対応", "提案", "企画", "改善"]}
          />
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1200px] space-y-10">
        <SolutionSectionHeading title="導入は5ステップ。任せやすい業務から小さく始める" description="課題整理、テスト導入、試作、本番展開、改善まで一気通貫で支援します。" />
        <ol className="grid gap-4 md:grid-cols-5">
          {introductionSteps.map(([number, title, body], index) => (
            <li className="relative rounded-box border border-border bg-bg p-6" key={number}><div className="flex items-center justify-between gap-3"><Badge variant="primary">Step {number}</Badge><span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] bg-bg-content text-fg"><SolutionIcon name={introductionStepIcons[index] ?? "check"} /></span></div><h3 className="mb-3 mt-6 type-h3 text-fg">{title}</h3><p className="m-0 type-body-md text-mute">{body}</p></li>
          ))}
        </ol>
        <ButtonGroup className="flex-wrap justify-center">
          <SolutionActionLink href={contactHref} variant="secondary">進め方を相談する</SolutionActionLink>
          <SolutionActionLink href={demoHref} variant="outline">活用事例を見る</SolutionActionLink>
        </ButtonGroup>
      </section>

      <section className="-mx-5 bg-bg-deep px-5 py-[70px] md:-mx-10 md:px-10 md:py-[90px]">
        <div className="mx-auto w-full max-w-[1200px] space-y-6">
          <SolutionSectionHeading title="実務での安全なAI活用を支える、QueryPie AIP" description="自律したAIエージェントの実務性能とガバナンスを支える、エンタープライズAI基盤です。" />
          <AiCrewPlatformDiagram />
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1200px] space-y-10">
        <SolutionSectionHeading title="まずは、最も負荷の高い業務から" description="改善インパクトの大きい業務を起点に、業務フローや運用ルールに合わせて設計します。まずは効果が見えやすい領域から小さく始められます。以下は、実際にご相談の多いユースケースです。" />
        <div className="grid grid-cols-1 gap-[30px] md:grid-cols-2 lg:grid-cols-3">
          {useCases.map((item) => (
            <AiCrewUseCaseCard
              body={item.body}
              href={getPublicDetailHref("demo", "ja", item.id, "use-cases")}
              key={item.id}
              imageSrc={item.imageSrc}
              tags={item.tags}
              title={item.title}
            />
          ))}
        </div>
        <div className="flex justify-center"><SolutionActionLink href={demoHref} variant="outline">すべての活用事例を見る</SolutionActionLink></div>
      </section>

      <section className="mx-auto w-full max-w-[1200px] space-y-10">
        <SolutionSectionHeading title="現場は仕事が進むスピードを、経営は投資対効果を実感" />
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {voices.map(([initials, role, organization, quote]) => (
              <figure className="m-0 rounded-box bg-bg-content p-6 text-left" key={initials}><blockquote className="m-0 whitespace-pre-line type-body-lg text-fg">「{quote}」</blockquote><figcaption className="mt-6 flex items-center gap-4"><span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-fg type-body-md text-bg">{initials}</span><div className="min-w-0"><p className="m-0 type-body-sm text-fg">{role}</p><p className="m-0 type-body-sm text-mute">{organization}</p></div></figcaption></figure>
            ))}
          </div>
          <div className="grid gap-4 rounded-box bg-bg-content p-6 md:grid-cols-2">
            <div className="flex flex-col justify-start"><h2 className="m-0 text-pretty type-h2 text-fg">固定費ではなく、業務量に応じたクレジット制</h2><p className="mb-0 mt-5 type-body-lg text-mute">人数ではなく、どれだけの業務を支援したかに応じた料金設計。大きな初期費用をかけず、最もボトルネックの大きい業務から始められます。</p></div>
            <div className="grid gap-4 sm:grid-cols-2">
              <article className="rounded-box bg-bg p-6"><SolutionIcon name="analysis" /><h3 className="mb-3 mt-8 type-h3 text-fg">必要な分だけ使える</h3><p className="m-0 type-body-md text-mute">繁忙期と閑散期に合わせて利用量を調整し、無駄の少ない運用が可能です。</p></article>
              <article className="rounded-box bg-bg p-6"><SolutionIcon name="people" /><h3 className="mb-3 mt-8 type-h3 text-fg">部署をまたいで管理</h3><p className="m-0 type-body-md text-mute">複数部署でも共通クレジットで管理でき、展開時のコストを把握しやすくします。</p></article>
            </div>
          </div>
        </div>
      </section>

      <AiCrewWhitepaperSection
        action="無料ダウンロード"
        badges={["経営層向け", "AIトランスフォーメーション", "日本市場"]}
        description="世界と日本のAI活用の差を踏まえ、AIを全社の生産性と成長へつなげる実践的なプロセスと変革指針を解説します。"
        href={whitepaperHref}
        imageAlt="AI Transformation ホワイトペーパー"
        title="なぜ今、日本企業がAIトランスフォーメーションに取り組むべきなのか"
      />

      <Cta actionHref={contactHref} actionLabel="導入の進め方を相談する" compactHeading description="対象業務が明確でなくても問題ありません。ボトルネック整理からPoC、本番展開までご一緒します。" hideEyebrow locale="ja" secondaryActionHref={demoHref} secondaryActionLabel="活用事例を見る" secondaryActionVariant="outline" title="どの業務から始めるべきか、一緒に整理しませんか？" />
    </div>
  );
}
