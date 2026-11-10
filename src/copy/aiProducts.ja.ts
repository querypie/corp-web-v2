export type AiProductId = "ai-gateway" | "qlm" | "qev";

export const aiGatewayVisualCopy = {
  architecture: {
    diagramLabel: "AIエージェント・組織管理からAI Gatewayを経由し、LLM・MCPへ接続する構成図",
    control: "アクセス制御",
    observe: "可視化・監査",
    modelTypes: "クラウド / ローカル",
    tools: "SaaS / 社内ツール",
    clientTypes: "CLI / Desktop Companion",
    sso: "SSO",
    sync: "Okta 同期",
    rbac: "RBAC",
    saas: "SaaS",
    internalTools: "社内ツール",
    toolset: "ツールセットで接続",
    problem: "分散するAPIキー。見えないコスト。個別に設定されるツール権限。",
    solution: "すべてのAIリクエストを、一つの経路で管理",
    key: "Gateway Key",
    agents: "AIエージェント連携",
    agentDescription: "使い慣れた開発ツールやデスクトップから接続",
    agentNames: ["Claude Code", "Codex", "Cursor", "Pi", "Hermes"],
    companion: "macOS Desktop Companion",
    organization: "組織・メンバー管理",
    organizationDescription: "認証連携とユーザー・グループ同期。役割に応じた権限を適用。",
    organizationTags: ["SSO", "Okta", "RBAC"],
    providerLabel: "LLMプロバイダー",
    externalLlm: "外部LLM",
    localLlm: "ローカルLLM",
    remote: "MCPサーバー",
    remoteDescription: "SaaS・社内のツールへ、ポリシーに沿って接続",
    modules: [
      { title: "LLM Gateway", points: ["モデルルーティング"] },
      { title: "MCP Gateway", points: ["ツールセット接続"] },
      { title: "アクセス制御", points: ["権限・利用上限"] },
      { title: "可視化・監査", points: ["ログ・コスト"] },
    ],
    roles: [
      { title: "利用者", body: "エージェントを接続" },
      { title: "プロジェクト管理者", body: "モデル・利用上限を設定" },
      { title: "組織管理者", body: "プロバイダー・権限を管理" },
    ],
  },
  clients: "使い慣れたツールから",
  clientItems: ["AI Agent / Desktop・CLI", "業務アプリケーション"],
  gateway: "接続・制御・観測を一つに",
  layers: ["認証・アクセス制御", "ルールベースのルーティング", "利用量・予算の管理"],
  internal: "SaaS / 社内システム",
  observation: "リクエストから実行結果まで記録",
  metrics: ["トークン", "見積コスト", "応答時間", "監査ログ"],
  example: "構成・表示例",
  encrypted: "APIキーを暗号化して保管",
  virtualKey: "利用者にはGateway Keyを発行",
  project: "プロジェクト別ポリシー",
  policyColumns: ["対象", "開発", "運用"],
  policyRows: ["LLMモデル", "MCPツール", "接続元IP"],
  allowed: "許可",
  denied: "拒否",
  ipRanges: ["社内", "VPN"],
  routingAlias: "アプリが指定するモデル名",
  routingRule: "条件と優先順位で振り分け",
  routingNote: "別名はそのまま、接続先を更新",
  budget: "月間予算",
  budgetValue: "$320",
  budgetLimit: "/ $500",
  budgetRatio: "64% 使用",
  budgetMetrics: ["リクエスト数", "トークン数", "レート制限"],
  auditColumns: ["対象", "結果", "応答時間"],
  auditRows: [
    { target: "LLM / fast", result: "許可", latency: "240 ms", allowed: true },
    { target: "MCP / search", result: "許可", latency: "86 ms", allowed: true },
    { target: "MCP / delete", result: "拒否", latency: "—", allowed: false },
  ],
  auditNote: "利用者・キー・プロジェクトを追跡",
  sync: "ユーザー・グループを同期",
  deployment: "Dockerで導入 / 外部APIで連携",
};

export type AiProductCopy = {
  menuLabel: string;
  metadata: { title: string; description: string };
  hero: {
    eyebrow: string;
    title: string;
    accent: string;
    accentAfter?: string;
    description: string[];
    imageLabel: string;
  };
  sections: Array<{
    title: string;
    description: string[];
    cards: Array<{ title: string; body: string }>;
  }>;
  cta: { title: string; description: string };
};

export const aiProductsJapaneseCopy: Record<AiProductId, AiProductCopy> = {
  "ai-gateway": {
    menuLabel: "AI Gateway (AIG)",
    metadata: {
      title: "AI Gateway｜企業のAIサービスを安全につなぐ統合基盤 | QueryPie AI",
      description: "LLMとMCPを安全につなぐ企業向けAI Gateway。アクセス権限、ルーティング、利用コスト、監査ログを一元管理します。",
    },
    hero: {
      eyebrow: "AI Gateway",
      title: "すべてのAIリクエストに、",
      accent: "一つのゲートウェイを。",
      description: [
        "分散するAPIキー、把握しづらいモデル利用とコスト、個別に設定されるツール権限。AI Gatewayは、AIエージェントとLLM・MCPの間に共通の管理ポイントを設け、接続・制御・可視化を一つにまとめます。",
      ],
      imageLabel: "AI Gatewayのアーキテクチャビジュアル（準備中）",
    },
    sections: [],
    cta: { title: "AI Gatewayをはじめましょう", description: "LLM・MCPの利用状況や、アクセス制御・コスト管理の課題に合わせて、導入構成と運用方法をご提案します。" },
  },
  qlm: {
    menuLabel: "QueryPie LLM｜QLM",
    metadata: {
      title: "QLM（QueryPie LLM）｜企業向けLLMサービス | QueryPie AI",
      description: "QueryPieが選定・運用するオープンソース基盤のLLMサービス。モデルに依存しないQLMブランドで、企業のAI活用を支えます。",
    },
    hero: {
      eyebrow: "QueryPie LLM",
      title: "企業のLLM活用を、",
      accent: "QLM",
      accentAfter: "で最適化する",
      description: [
        "QLMは、QueryPieがオープンソースモデルを選定し、企業利用に必要な品質と運用性を高めて提供するLLMサービスです。",
        "初期はDeepSeek系モデルを活用し、将来は最適な基盤モデルへ柔軟に切り替えながら、QLMとして一貫した体験を提供します。",
      ],
      imageLabel: "QLMのモデル性能ビジュアル（準備中）",
    },
    sections: [
      {
        title: "基盤モデルではなく、QLMの価値を届ける",
        description: ["オープンソースモデルの選択や更新をお客様が個別に担う必要はありません。", "QueryPieが評価・運用・改善を継続し、企業が安心して利用できるLLMサービスとして提供します。"],
        cards: [
          { title: "QueryPieがモデルを選定", body: "性能、ライセンス、運用性を評価し、用途に適したオープンソースモデルを採用します。" },
          { title: "モデルに依存しないブランド", body: "基盤モデルが変わっても、QLMとしてAPI・運用・サポートの一貫性を保ちます。" },
          { title: "継続的な品質改善", body: "業務シナリオに基づく評価とチューニングを重ね、実用性能を高めていきます。" },
        ],
      },
      {
        title: "ベンチマークで確かめる、業務に必要な性能",
        description: ["QLMの性能は、一般的なスコアだけでなく企業の業務シナリオに沿って評価します。", "今後、モデル性能・日本語理解・業務タスクのベンチマーク結果を段階的に公開します。"],
        cards: [
          { title: "日本語・業務文書の理解", body: "日本語の指示や長文の業務文書を正確に理解し、実務で使える回答を目指します。" },
          { title: "タスク別ベンチマーク", body: "要約・分類・抽出・推論など、利用目的に近いタスクで性能を比較します。" },
          { title: "運用を含めた評価", body: "応答品質だけでなく、安定性・レイテンシ・コストを含めて継続的に検証します。" },
        ],
      },
    ],
    cta: { title: "QLMを業務に活用しませんか", description: "現在のLLM利用状況と業務要件に合わせて、QLMの活用方法をご案内します。" },
  },
  qev: {
    menuLabel: "QueryPie Decision Model｜QEV",
    metadata: {
      title: "QEV（QueryPie Decision Model）｜意思決定AIモデル | QueryPie AI",
      description: "QueryPieが独自開発した意思決定AIモデル。DLPによる機密情報判定とAuto Routerによるモデル選択を実現します。",
    },
    hero: {
      eyebrow: "QueryPie Decision Model",
      title: "生成するAIから、",
      accent: "QEV",
      accentAfter: "で判断するAIへ",
      description: [
        "QEVは、リクエストの内容を理解し、セキュリティポリシーと目的に沿った判断を行うQueryPie独自のAIモデルです。",
        "DLPとAuto Routerを通じて、AIGの安全なデータ保護とモデルルーティングを支えます。",
      ],
      imageLabel: "QEVの意思決定モデルビジュアル（準備中）",
    },
    sections: [
      {
        title: "企業のAI運用を支える、二つの意思決定",
        description: ["一般的な生成AIが回答を作るのに対し、QEVはリクエストを分析して次のアクションを判断します。", "AIを使う前の判断レイヤーを持つことで、企業のポリシーを実際の運用に反映できます。"],
        cards: [
          { title: "DLP｜機密情報の判定", body: "個人情報や機密情報が含まれているかを判断し、外部LLMへの送信可否を制御します。" },
          { title: "Auto Router｜モデルの選択", body: "依頼内容、品質要件、コスト、セキュリティ条件から適切なAIモデルを選択します。" },
          { title: "AIGと連携する判断基盤", body: "QEVの判断結果をAI Gatewayに連携し、企業ごとのポリシーに沿った処理を実行します。" },
        ],
      },
      {
        title: "技術的な差別化を、継続的な評価で磨く",
        description: ["QEVは企業の実データに近い評価シナリオを用いて、検知精度とルーティング品質を改善します。", "運用で蓄積したフィードバックをモデル更新に反映し、判断の信頼性を高めます。"],
        cards: [
          { title: "高精度な機密情報検知", body: "検知対象と業務文脈を考慮し、必要な保護を過不足なく適用します。" },
          { title: "用途に応じたモデル振り分け", body: "質問の難易度や目的を見極め、品質とコストのバランスを取ります。" },
          { title: "監査可能な判断", body: "判断結果と適用ポリシーを記録し、後から確認できる運用を支援します。" },
        ],
      },
    ],
    cta: { title: "QEVでAIの判断を安全に自動化しましょう", description: "DLPとモデルルーティングの要件を整理し、AIGへの組み込み方をご提案します。" },
  },
};
