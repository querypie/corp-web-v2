import type { Locale } from "@/constants/i18n";

const ko = {
  dlp: {
    title: "DLP로 기밀정보 보호",
    description: "보호할 정보와 대응 정책을 설정하고, AI 입력에 포함된 기밀정보를 감지해 제어합니다. 탐지 내역은 감사 로그로 확인하며 조직의 데이터 보안 정책을 한곳에서 관리합니다.",
    points: [
      { title: "보호할 정보와 정책 설정", body: "개인정보와 기밀정보 등 탐지할 대상과 감지 시 대응 방침을 정하고, 조직의 데이터 보안 정책을 한곳에서 관리합니다." },
      { title: "기밀정보 감지·제어", body: "AI 입력에 포함된 민감정보를 감지하고, 설정한 정책에 따라 대응해 기밀정보 유출 위험을 줄입니다." },
      { title: "감사 로그로 결과 확인", body: "탐지 내역을 감사 로그에서 확인합니다. 민감한 값은 가린 채 결과를 검토하고, 후속 점검과 정책 개선에 활용합니다." },
    ],
    label: "프롬프트 DLP 점검 결과 예시: 개인정보와 API 키를 탐지하고 민감한 값을 가린 미리보기",
    example: "표시 예시", scan: "스캔 결과", columns: ["사용자", "탐지 결과", "패턴"], scoreNote: "점수는 해당 카테고리에 포함될 가능성을 나타냅니다.",
    rows: [
      { user: "kim.j", project: "commerce-ops", category: "고객 개인정보", score: "0.96", preview: "…고객 연락처 010-****-5821…", pattern: "전화번호 3 · 이메일 2" },
      { user: "park.h", project: "hr-assist", category: "인사·급여", score: "0.93", preview: "본문 미표시 · 패턴 일치 없음", pattern: "" },
      { user: "lee.s", project: "platform-dev", category: "대외비 문서", score: "0.31", preview: "…OPENAI_API_KEY=sk-****…", pattern: "API 키·토큰 1" },
    ],
  },
  acp: {
    user: "사용자",
    title: "ACP 보안 연동",
    description: "QueryPie ACP와 연동해 AI의 사내 데이터·시스템 접근까지 보호합니다. ACP가 제공하는 MCP 도구를 통해 허용된 리소스에 안전하게 접근할 수 있습니다.",
    label: "AI Gateway가 모델에 연결되고 ACP의 MCP 도구를 통해 데이터베이스, 서버, Kubernetes, 웹 애플리케이션에 접근하는 구성도",
    models: "AI 모델", modelList: "OpenAI · Anthropic · Gemini · Local LLM", gateway: "AI 연결 관리", tools: "MCP 도구", control: "리소스 접근 제어", resources: ["데이터베이스", "서버", "Kubernetes", "웹 애플리케이션"], caption: "AI 연결부터 데이터 소스 접근까지, 조직의 권한 체계 안에서.",
  },
};

type SecurityCopy = typeof ko;
export const aiGatewaySecurityCopy: Record<Locale, SecurityCopy> = {
  ko,
  en: {
    dlp: {
      title: "Data protection with DLP",
      description: "Define what to protect and how to respond, then detect and control confidential information in AI inputs. Review findings in audit logs and manage your organization’s data security policies in one place.",
      points: [
        { title: "Define protection policies", body: "Choose the personal and confidential information to detect and how to respond. Manage your organization’s data security policies in one place." },
        { title: "Detect and control sensitive data", body: "Detect sensitive information in AI inputs and respond according to your policies to reduce the risk of confidential data exposure." },
        { title: "Review results in audit logs", body: "Review findings in audit logs with sensitive values masked. Use the results for follow-up reviews and policy improvements." },
      ],
      label: "Example Prompt DLP results showing personal information and API key detection with a masked preview",
      example: "Example", scan: "Scan results", columns: ["User", "Findings", "Patterns"], scoreNote: "Scores indicate how likely the content is to match a category.",
      rows: [
        { user: "kim.j", project: "commerce-ops", category: "Customer personal data", score: "0.96", preview: "…Customer contact: j***@example.com…", pattern: "Phone 3 · Email 2" },
        { user: "park.h", project: "hr-assist", category: "HR & payroll", score: "0.93", preview: "Content hidden · No pattern match", pattern: "" },
        { user: "lee.s", project: "platform-dev", category: "Confidential documents", score: "0.31", preview: "…OPENAI_API_KEY=sk-****…", pattern: "API key & token 1" },
      ],
    },
    acp: {
      user: "User",
      title: "Security with ACP",
      description: "Connect QueryPie ACP to protect AI access to internal data and systems. MCP tools provided by ACP give AI secure access to permitted resources.",
      label: "AI Gateway connects to AI models and accesses databases, servers, Kubernetes, and web applications through ACP MCP tools",
      models: "AI models", modelList: "OpenAI · Anthropic · Gemini · Local LLM", gateway: "AI connectivity", tools: "MCP tools", control: "Resource access control", resources: ["Databases", "Servers", "Kubernetes", "Web applications"], caption: "From AI connections to data access, governed by your organization’s permissions.",
    },
  },
  ja: {
    dlp: {
      title: "DLPで機密情報を保護",
      description: "保護する情報と対応方針を設定し、AIへの入力に含まれる機密情報を検知・制御。検知結果を監査ログで確認し、組織のデータセキュリティポリシーを一元管理します。",
      points: [
        { title: "保護する情報とポリシーを設定", body: "個人情報や機密情報など、検知対象と検知時の対応方針を設定。組織のデータセキュリティポリシーを一か所で管理します。" },
        { title: "機密情報を検知・制御", body: "AIへの入力に含まれる機密情報を検知。設定したポリシーに沿って対応し、機密情報の漏えいリスクを抑えます。" },
        { title: "監査ログで結果を確認", body: "検知結果を監査ログから確認。機密情報をマスキングした状態で結果を確認し、継続的な点検やポリシーの改善に活用します。" },
      ],
      label: "プロンプトDLPの検出結果例：個人情報とAPIキーの検出、マスキングされたプレビュー",
      example: "表示例", scan: "スキャン結果", columns: ["ユーザー", "検出結果", "パターン"], scoreNote: "スコアはカテゴリに該当する可能性を示します。",
      rows: [
        { user: "kim.j", project: "commerce-ops", category: "顧客の個人情報", score: "0.96", preview: "…連絡先は j***@example.com…", pattern: "電話番号 3・メール 2" },
        { user: "park.h", project: "hr-assist", category: "人事・給与", score: "0.93", preview: "本文非表示・パターン一致なし", pattern: "" },
        { user: "lee.s", project: "platform-dev", category: "機密文書", score: "0.31", preview: "…OPENAI_API_KEY=sk-****…", pattern: "APIキー・トークン 1" },
      ],
    },
    acp: {
      user: "ユーザー",
      title: "ACPとのセキュリティ連携",
      description: "QueryPie ACPと連携し、AIによる社内データやシステムへのアクセスも保護。ACPが提供するMCPツールを通じて、許可されたリソースに安全にアクセスできます。",
      label: "AI GatewayがAIモデルに接続し、ACPのMCPツールを通じてデータベース、サーバー、Kubernetes、Webアプリにアクセスする構成図",
      models: "AIモデル", modelList: "OpenAI · Anthropic · Gemini · Local LLM", gateway: "AI接続の管理", tools: "MCPツール", control: "リソースのアクセス制御", resources: ["データベース", "サーバー", "Kubernetes", "Webアプリ"], caption: "AI接続からデータへのアクセスまで、組織の権限に沿って管理。",
    },
  },
};
