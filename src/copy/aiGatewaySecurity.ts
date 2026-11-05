import type { Locale } from "@/constants/i18n";

const ko = {
  dlp: {
    title: "DLP 민감정보 탐지",
    description: "AI 사용 기록에 포함된 개인정보와 기밀정보를 찾아보세요. 필요한 범위를 선택하거나 정기 점검을 예약해 정보 유출 위험을 살필 수 있습니다.",
    points: [
      { title: "민감정보 탐지", body: "개인정보·인사·기밀 문서부터 API 키까지, 점검이 필요한 내용을 찾습니다." },
      { title: "가려서 확인하는 결과", body: "탐지된 패턴의 민감한 값은 가리고, 주변 내용만 미리보기로 보여줍니다." },
      { title: "반복 점검도 간편하게", body: "기간과 프로젝트를 지정해 점검하고, 예약 실행으로 꾸준히 확인합니다." },
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
      title: "Data detection with DLP",
      description: "Find personal and confidential information in AI usage logs. Review a selected scope or schedule regular scans to spot potential data exposure.",
      points: [
        { title: "Detect sensitive information", body: "Find content that needs review, from personal and HR data to confidential documents and API keys." },
        { title: "Review masked previews", body: "Sensitive pattern matches are masked, with only the surrounding context shown in previews." },
        { title: "Make reviews routine", body: "Choose a date range and project, or schedule recurring scans to keep track." },
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
      title: "DLPで機密情報を検出",
      description: "AIの利用ログに含まれる個人情報や機密情報を検出。対象を絞ったスキャンや定期チェックで、情報流出のリスクを把握できます。",
      points: [
        { title: "機密情報を検出", body: "個人情報・人事情報・機密文書からAPIキーまで、確認が必要な内容を見つけます。" },
        { title: "マスキングして確認", body: "パターンに一致した機密情報を隠し、前後の内容だけをプレビューに表示します。" },
        { title: "定期チェックも手軽に", body: "期間やプロジェクトを指定してスキャン。予約実行で継続的に確認できます。" },
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
