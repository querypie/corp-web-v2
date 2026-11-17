import type { Locale } from "@/constants/i18n";
import { qevKoCopy } from "./qev";

type UseCase = Pick<typeof qevKoCopy.useCases.dlp, "title" | "description" | "label" | "decision" | "outputs">;
type QevPageCopy = Pick<typeof qevKoCopy, "metadata" | "hero" | "flow" | "performance" | "technology" | "explore" | "cta"> & {
  uses: { title: string };
  useCases: {
    routingVisual: typeof qevKoCopy.useCases.routingVisual;
    example: Pick<typeof qevKoCopy.useCases.example, "before" | "personal" | "middle" | "confidential" | "after">;
    dlp: UseCase;
    router: UseCase;
  };
};

const en: QevPageCopy = {
  metadata: { title: "Decision AI Model (QEV) | QueryPie AI", description: "Decision AI Model (QEV), developed by QueryPie, identifies sensitive information in context and selects suitable AI models to support secure enterprise AI operations." },
  hero: { title: "Before AI responds,", accent: "QEV decides.", description: "QEV is a decision AI model developed by QueryPie. It understands request context to identify sensitive information and select suitable AI models. Together with AI Gateway, it brings enterprise security policies into everyday AI workflows." },
  flow: { label: "QEV decision flow", input: "Users · AI agents", application: "Application", user: "User", inputDescription: "Questions, documents, and work requests", core: "QueryPie Decision Model", decisions: ["Does it contain sensitive data?", "Which AI model fits this task?"], gateway: "Policy enforcement · Routing", caption: "QEV makes decisions. AI Gateway applies policies and executes requests." },
  uses: { title: "Two decisions enterprise AI needs" },
  useCases: {
    routingVisual: { request: "Analyze the risks in this business plan", judgment: "QEV", chosen: "Selected", candidate: "Candidates", criteria: "Complex reasoning", task: "Analysis", models: ["Fast response", "General tasks", "Deep reasoning"] },
    example: { before: "Summarize the conversation with ", personal: "Alex · +1 202-555-0147", middle: " and the ", confidential: "undisclosed contract terms", after: "." },
    dlp: { title: "DLP", description: "Understand request context to identify personal information and internal confidential data. AI Gateway uses these decisions to control transmission according to security policies.", label: "Sensitive data detection example", decision: "Sensitive data detection", outputs: ["Personal data", "Confidential"] },
    router: { title: "Auto Router", description: "Evaluate a request’s purpose and characteristics to select a suitable AI model. AI Gateway uses that decision to route the request to the right model.", label: "AI model selection example", decision: "Request analysis", outputs: ["Efficiency-focused", "Reasoning-focused"] },
  },
  performance: { title: "Sensitive data detection performance", description: "Security depends on catching sensitive information. In a controlled evaluation using multilingual internal documents, QEV demonstrated strong detection performance.", metrics: [
    { value: "99.69", unit: "%", label: "Sensitive data detection rate", detail: "1,277 of 1,281 documents detected" },
    { value: "91.3", unit: "%", label: "Fewer misses vs. comparison model", detail: "Misses reduced from 46 to 4" },
    { value: "98.98", unit: "%", label: "F2 score", detail: "Combines precision and recall" },
  ], headers: ["Metric", "Commercial AI model (JEV)", "QEV"], rows: [["Detection rate", "96.41%", "99.69%"], ["Detected", "1,235", "1,277"], ["Missed", "46", "4"]], note: "Comparison under the same evaluation conditions, using 1,281 documents containing sensitive information." },
  technology: { title: "Optimized for security decisions", description: "We combine open-weight models with QueryPie technology and security-domain data to improve detection quality, operating efficiency, and support for enterprise-specific criteria.", items: [
    { title: "A model that understands security context", body: "Additional training and optimization on security-domain data improve the ability to distinguish personal information from internal confidential data.", tags: ["Security-domain data", "Contextual classification"] },
    { title: "Efficient model operations", body: "INT8 quantization reduced GPU memory use by 27.5–45.2% across the QEV model family. The model with a 99.69% detection rate retained its four-miss result after quantization.", tags: ["INT8 optimization", "Lower memory use"] },
    { title: "Adaptable enterprise decision criteria", body: "Designed for additional training and optimization around enterprise data and workflows, extending classification and conditional decisions to domain-specific needs.", tags: ["Domain adaptation", "Additional training"] },
  ], note: "Memory reductions are from internal comparisons before and after quantization across the QEV family and vary by model configuration." },
  explore: { title: "Try QEV for yourself", description: "Explore QEV’s decision capabilities in the demo. Use the provided examples or your own text to inspect classifications and probabilities for each option.", demoLabel: "Try the QEV demo", demoHref: qevKoCopy.explore.demoHref, modelTitle: "Explore QEV models on Hugging Face", modelDescription: "Evaluate the performance and possibilities of QEV models published by QueryPie.", modelLabel: "Visit Hugging Face", modelHref: qevKoCopy.explore.modelHref },
  cta: { title: "Give enterprise AI a basis for decisions", description: "Sensitive data protection and model routing. Explore how QEV can fit your organization’s security policies and workflows.", action: "Talk to us" },
};

const ja: QevPageCopy = {
  metadata: { title: "意思決定AIモデル (QEV) | QueryPie AI", description: "意思決定AIモデル (QEV) は、QueryPieが独自開発したAIモデルです。文脈に基づく機密情報の判定と業務に適したAIモデルの選択により、企業の安全なAI活用を支援します。" },
  hero: { title: "AIが答える前に、", accent: "QEVが判断します。", description: "QEVは、QueryPieが独自開発した意思決定AIモデルです。リクエストの文脈を理解し、機密情報の判定や目的に適したAIモデルの選択を行います。AI Gatewayと連携し、企業のセキュリティポリシーを実際のAI利用につなげます。" },
  flow: { label: "QEVの意思決定フロー", input: "ユーザー・AIエージェント", application: "アプリケーション", user: "ユーザー", inputDescription: "質問・文書・業務リクエスト", core: "QueryPie Decision Model", decisions: ["機密情報が含まれていますか？", "どのAIモデルが適していますか？"], gateway: "ポリシー適用・ルーティング", caption: "QEVが判断し、AI Gatewayがポリシーの適用とリクエストの実行を担います。" },
  uses: { title: "企業のAIに必要な、二つの判断" },
  useCases: {
    routingVisual: { request: "事業計画のリスクを分析して", judgment: "QEV", chosen: "選択済み", candidate: "モデル候補", criteria: "複合推論", task: "要求分析", models: ["高速応答", "汎用タスク", "高度な推論"] },
    example: { before: "顧客 ", personal: "山田太郎・090-1234-5678", middle: " の相談内容と ", confidential: "未公開の契約条件", after: " を要約してください。" },
    dlp: { title: "DLP", description: "リクエストの文脈を理解し、個人情報や社内の機密情報を判定します。AI Gatewayはその判断をもとに、セキュリティポリシーに従って送信を制御します。", label: "機密情報の検出例", decision: "機密情報の判定", outputs: ["個人情報", "社内機密"] },
    router: { title: "Auto Router", description: "リクエストの目的や特性から、適切なAIモデルを選択します。AI Gatewayはその結果を活用し、リクエストを適したモデルへ送信します。", label: "AIモデルの選択例", decision: "要求特性の判断", outputs: ["効率重視モデル", "推論重視モデル"] },
  },
  performance: { title: "機密情報の検出性能", description: "セキュリティで重要なのは、機密情報を見逃さないことです。多言語の社内文書を使った同一条件の評価で、QEVは高い検出性能を確認しました。", metrics: [
    { value: "99.69", unit: "%", label: "機密情報の検出率", detail: "1,281件中1,277件を検出" },
    { value: "91.3", unit: "%", label: "比較モデルに対する見逃し削減", detail: "見逃しを46件から4件に削減" },
    { value: "98.98", unit: "%", label: "F2スコア", detail: "適合率と再現率を総合評価" },
  ], headers: ["評価項目", "商用AIモデル (JEV)", "QEV"], rows: [["機密情報の検出率", "96.41%", "99.69%"], ["検出成功", "1,235件", "1,277件"], ["見逃し", "46件", "4件"]], note: "機密情報を含む文書1,281件を対象に、同一条件で比較評価した結果です。" },
  technology: { title: "セキュリティに特化した最適化", description: "公開ウェイトモデルにQueryPieの技術とセキュリティ業務データを組み合わせました。検出品質と運用効率を高め、企業ごとに異なる判断基準に対応します。", items: [
    { title: "セキュリティの文脈を理解", body: "セキュリティに特化したデータによる追加学習と最適化で、個人情報と社内機密を区別する判断能力を高めます。", tags: ["セキュリティ業務データ", "文脈に基づく分類"] },
    { title: "効率的なモデル運用", body: "INT8量子化の評価で、QEV系列モデルのGPUメモリ使用量を27.5～45.2%削減しました。検出率99.69%のモデルは、量子化後も見逃し4件を維持しました。", tags: ["INT8最適化", "メモリ使用量削減"] },
    { title: "企業の判断基準に合わせて拡張", body: "企業のデータや業務特性に合わせて、追加学習と最適化を適用できる設計です。分野ごとに必要な情報分類や条件判断へ活用を広げます。", tags: ["ドメイン特化", "追加学習"] },
  ], note: "メモリ削減率はQEV系列モデルの量子化前後の社内比較結果であり、モデル構成により異なります。" },
  explore: { title: "QEVを体験してみませんか", description: "デモでQEVの意思決定機能を体験できます。用意された例や入力した文章を使い、分類結果と選択肢ごとの確率をご確認ください。", demoLabel: "QEVデモを体験する", demoHref: qevKoCopy.explore.demoHref, modelTitle: "Hugging FaceでQEVモデルを公開", modelDescription: "QueryPieが公開したQEVモデルで、性能と活用の可能性をお確かめください。", modelLabel: "Hugging Faceを見る", modelHref: qevKoCopy.explore.modelHref },
  cta: { title: "企業のAIに、判断の基準を", description: "機密情報の保護とAIモデルのルーティング。組織のポリシーと業務に合ったQEVの活用方法をご相談ください。", action: "導入のご相談" },
};

export const qevCopy: Record<Locale, QevPageCopy> = { en, ko: qevKoCopy, ja };
