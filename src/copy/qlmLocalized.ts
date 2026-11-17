import type { Locale } from "@/constants/i18n";
import { qlmKoCopy } from "./qlm";

const en: typeof qlmKoCopy = {
  visuals: { selection: "Select · Optimize", infrastructure: "QueryPie GPU infrastructure", boundary: "QueryPie-managed environment", data: "Business data", policy: "Security policies applied", request: "Summarize this work report", response: "Generating", tokens: ["Analyze", "Reason", "Stream"], workloads: [{ title: "Everyday tasks", model: "Lightweight" }, { title: "Complex tasks", model: "QLM" }], tuning: "Enterprise response settings", settings: ["Work context", "Terminology", "Response rules"], customized: "Enterprise-tuned" },
  metadata: { title: "QueryPie LLM (QLM) | QueryPie AI", description: "QueryPie LLM (QLM) is an enterprise LLM service selected and operated by QueryPie. Dedicated GPU infrastructure and workload-based model routing bring performance, data control, and cost efficiency together." },
  hero: { title: "Built for enterprise AI", accent: "QueryPie LLM", description: "QLM is an LLM service selected and operated by QueryPie. We combine proven open-source models with our own GPU infrastructure and enterprise tuning, giving your team the confidence to take on complex work with AI." },
  features: { title: "The QLM difference", description: "From model selection and infrastructure to workload optimization, QueryPie brings the performance and operating environment your enterprise needs.", cards: [
    { title: "Selected and operated by QueryPie", body: "We select and optimize proven open-source models. As foundation models evolve, your team continues to use one consistent service under the QLM brand.", labels: ["Select", "Optimize", "QLM"] },
    { title: "Our own GPU infrastructure", body: "Models run on GPU infrastructure operated by QueryPie. We directly manage the inference environment and resources to support enterprise AI workloads.", labels: ["GPU", "GPU", "GPU"] },
    { title: "Control over your data path", body: "Reduce reliance on external model providers’ APIs. Connect enterprise security policies to a QueryPie-managed inference environment to reduce data exposure concerns.", labels: ["Business data", "Managed", "Response"] },
    { title: "Optimized for fast responses", body: "We tune models and their inference environment together, balancing response quality and speed across routine tasks and complex requests.", labels: ["Request", "Reason", "Response"] },
    { title: "Cost efficiency for each task", body: "Every request does not need a high-performance model. With AI Gateway, route work to a suitable model based on complexity and manage quality alongside cost.", labels: ["Everyday", "Complex", "Resources"] },
    { title: "Enterprise-specific tuning", body: "Adapt AI to your terminology, work context, and response standards. We support optimization around the requirements that make your organization different.", labels: ["Context", "Standards", "Optimize"] },
  ] },
  performance: { title: "Efficient costs. Strong performance.", description: "QLM optimizes enterprise AI operating costs while delivering the capabilities complex work requires. Explore the foundation model’s published benchmarks for reasoning, coding, and automation.", tableLabel: "Model benchmarks", headers: ["Benchmark", "Evaluation area", "Metric", "Result"], metrics: qlmKoCopy.performance.metrics.map((item, index) => ({ ...item, title: ["Knowledge and reasoning", "Mathematical reasoning", "Terminal tasks", "Terminal tasks", "Terminal tasks", "Software problem solving", "Repository development", "Workflow automation"][index], detail: undefined })), note: "Source: the foundation model’s public model card (accessed Nov 17, 2026). These are not QLM service measurements; results may vary by operating environment." },
  routing: { title: "Lightweight for routine work, QLM for complex tasks", description: "AI Gateway connects requests, while QEV evaluates their purpose and characteristics to support task-based model routing.", input: "Users · AI agents", application: "Application", user: "User", gateway: "AI Gateway", decision: "QEV · Request analysis", light: "Lightweight", lightTasks: "Summaries · Classification · Simple queries", qlm: "QLM", qlmTasks: "Reasoning · Analysis · Coding", note: "Illustrative routing configuration. Model selection follows your organization’s operating policies." },
  cta: { title: "Bring QLM to your enterprise", description: "From model capabilities to data handling and cost, let’s design a QLM deployment around your business.", action: "Talk to us" },
};

const ja: typeof qlmKoCopy = {
  visuals: { selection: "選定・最適化", infrastructure: "QueryPie GPUインフラ", boundary: "QueryPie管理環境", data: "企業データ", policy: "セキュリティポリシー適用", request: "業務レポートを要約して", response: "応答を生成中", tokens: ["分析", "推論", "出力"], workloads: [{ title: "日常業務", model: "軽量モデル" }, { title: "複雑な業務", model: "QLM" }], tuning: "企業別の応答設定", settings: ["業務の文脈", "専門用語", "応答基準"], customized: "企業別に最適化" },
  metadata: { title: "QueryPie LLM (QLM) | QueryPie AI", description: "QueryPie LLM (QLM) は、QueryPieがモデルを選定・運用する企業向けLLMサービスです。自社GPUインフラと業務に応じたモデルルーティングで、性能・データ管理・コスト効率を支えます。" },
  hero: { title: "企業のAI活用を支える", accent: "QueryPie LLM", description: "QLMは、QueryPieがモデルを選定し、運用するLLMサービスです。実績のあるオープンソースモデルに自社GPUインフラと企業別の最適化を組み合わせ、複雑な業務も安心して任せられるAIを提供します。" },
  features: { title: "QLMがもたらす違い", description: "モデル選定からインフラ運用、業務別の最適化まで。企業のAI活用に必要な性能と運用環境を、QueryPieが一体で提供します。", cards: [
    { title: "QueryPieが選定・運用するモデル", body: "実績のあるオープンソースモデルを自ら選定し、最適化します。基盤モデルが進化しても、QLMという一つのブランドで継続してご利用いただけます。", labels: ["選定", "最適化", "QLM"] },
    { title: "自社GPUインフラ", body: "QueryPieが運用するGPUインフラでモデルを実行します。推論環境とリソースを直接管理し、企業のAIワークロードに対応します。", labels: ["GPU", "GPU", "GPU"] },
    { title: "データ経路のコントロール", body: "外部モデル提供者のAPIへの依存を減らします。QueryPieが管理する推論環境と企業のセキュリティポリシーをつなぎ、データ流出への懸念を軽減します。", labels: ["企業データ", "管理環境", "応答"] },
    { title: "応答速度を高める最適化", body: "モデルの特性と推論環境を合わせて調整します。定型業務から複雑なリクエストまで、応答品質と速度のバランスを整えます。", labels: ["要求", "推論", "応答"] },
    { title: "業務に応じたコスト効率", body: "すべてのリクエストに高性能モデルを使う必要はありません。AI Gatewayと連携し、業務の難易度に応じたモデルを選択して品質とコストを管理します。", labels: ["日常業務", "複雑な業務", "リソース"] },
    { title: "エンタープライズ向けチューニング", body: "企業の用語、業務の文脈、応答基準に合わせた最適化を支援します。組織ごとの要件を反映し、実務で活用できるAIを設計します。", labels: ["文脈", "応答基準", "最適化"] },
  ] },
  performance: { title: "優れた性能を、適切なコストで", description: "QLMはAIの運用コストを最適化しながら、複雑な業務に必要な性能を提供します。推論からコーディング、業務自動化まで、基盤モデルの公開ベンチマークをご確認ください。", tableLabel: "モデルベンチマーク", headers: ["ベンチマーク", "評価領域", "評価指標", "結果"], metrics: qlmKoCopy.performance.metrics.map((item, index) => ({ ...item, title: ["専門知識・推論", "数学的推論", "ターミナル操作", "ターミナル操作", "ターミナル操作", "ソフトウェアの問題解決", "リポジトリ単位の開発", "業務自動化"][index], detail: undefined })), note: "出典：基盤モデルの公開モデルカード（2026年11月17日確認）。QLMサービスの実測値ではなく、運用環境により結果は異なります。" },
  routing: { title: "日常業務は軽量モデル、複雑な業務はQLMへ", description: "AI Gatewayがリクエストを接続し、QEVが目的や特性を判断して、業務に応じたモデルルーティングを支援します。", input: "ユーザー・AIエージェント", application: "アプリケーション", user: "ユーザー", gateway: "AI Gateway", decision: "QEV・リクエスト分析", light: "軽量モデル", lightTasks: "要約・分類・簡単な質問", qlm: "QLM", qlmTasks: "複合推論・分析・コード作成", note: "業務別ルーティングの構成例です。モデルの選択基準と対象は、企業の運用ポリシーに応じて設定します。" },
  cta: { title: "企業のAI活用を、QLMで", description: "必要な性能からデータ処理環境、コストまで。企業に合ったQLMの導入方法を一緒に設計します。", action: "導入のご相談" },
};

export const qlmCopy: Record<Locale, typeof qlmKoCopy> = { en, ko: qlmKoCopy, ja };
