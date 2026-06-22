import type { Locale } from "./i18n";

export type CookieCategory = {
  description: string;
  detail: string;
  id: "necessary" | "performance" | "functional" | "analysis" | "marketing";
  status: "consent" | "optional" | "required";
  title: string;
};

export type CookiePreferenceCopy = {
  acceptAllLabel: string;
  ctaActionLabel: string;
  ctaDescription: string;
  ctaEyebrow: string;
  ctaTitle: string;
  declineAllLabel: string;
  intro: string[];
  preferences: CookieCategory[];
  title: string;
};

export const cookiePreferenceCopy: Record<Locale, CookiePreferenceCopy> = {
  en: {
    acceptAllLabel: "Accept all cookies",
    ctaActionLabel: "Get Start!",
    ctaDescription: "Sign up in seconds and secure your 14-day free trial now.",
    ctaEyebrow: "Stop Thinking.",
    ctaTitle: "Start Transforming.",
    declineAllLabel: "Decline non-essential",
    intro: [
      "We use technologies like cookies to collect data and tailor your online experience. Manage your cookie preferences to enable or disable specific types of cookies, categorized for your convenience.",
    ],
    preferences: [
      {
        description: "Required to keep core website features, security protections, and compliance-related operations running.",
        detail: "These cookies support essential functions such as secure access, session integrity, and other baseline behaviors the site depends on.",
        id: "necessary",
        status: "required",
        title: "Strictly Necessary Cookies",
      },
      {
        description: "Help us understand how the site performs so we can improve speed, responsiveness, and overall usability.",
        detail: "Disabling performance cookies may reduce how well the experience is tuned and can make the site feel slower or less optimized.",
        id: "performance",
        status: "optional",
        title: "Performance Cookies",
      },
      {
        description: "Remember choices you make and provide more personalized features without tracking your activity across other websites.",
        detail: "These cookies are used to maintain preferences that make the experience more convenient and consistent from visit to visit.",
        id: "functional",
        status: "optional",
        title: "Functional Cookies",
      },
      {
        description: "Measure visits and traffic sources so we can learn which pages are useful and where the product experience can improve.",
        detail: "The information collected is aggregated and anonymous, helping us monitor usage patterns without identifying individual visitors.",
        id: "analysis",
        status: "consent",
        title: "Analysis Cookies",
      },
      {
        description: "Support advertising measurement by identifying campaign-driven visits and evaluating the performance of channels such as Google Ads.",
        detail: "These are non-essential cookies that require consent and are not used to identify specific individuals.",
        id: "marketing",
        status: "consent",
        title: "Marketing Cookies",
      },
    ],
    title: "Cookie Preference",
  },
  ko: {
    acceptAllLabel: "모든 쿠키 허용",
    ctaActionLabel: "시작하기",
    ctaDescription: "몇 초 만에 가입하고 14일 무료 체험을 바로 시작하세요.",
    ctaEyebrow: "Stop Thinking.",
    ctaTitle: "Start Transforming.",
    declineAllLabel: "비필수 쿠키 거부",
    intro: [
      "당사는 쿠키와 같은 기술을 사용해 데이터를 수집하고 온라인 경험을 맞춤화합니다. 편의에 맞게 분류된 항목별로 쿠키 사용 여부를 관리할 수 있습니다.",
    ],
    preferences: [
      {
        description: "사이트의 핵심 기능, 보안 보호, 규정 준수를 위한 기본 동작에 필요한 쿠키입니다.",
        detail: "보안 접속, 세션 유지, 기본 동작 처리 등 사이트 운영에 필수적인 기능을 지원합니다.",
        id: "necessary",
        status: "required",
        title: "필수 쿠키",
      },
      {
        description: "사이트 사용성을 개선하기 위해 속도, 반응성, 전반적인 성능을 파악하는 데 사용됩니다.",
        detail: "비활성화할 경우 맞춤 최적화 수준이 낮아지고 일부 경험이 덜 매끄럽게 느껴질 수 있습니다.",
        id: "performance",
        status: "optional",
        title: "성능 쿠키",
      },
      {
        description: "사용자가 선택한 설정을 기억해 보다 개인화된 기능을 제공하며, 다른 사이트 활동은 추적하지 않습니다.",
        detail: "반복 방문 시 일관되고 편리한 경험을 제공하기 위한 선호 설정 유지에 활용됩니다.",
        id: "functional",
        status: "optional",
        title: "기능 쿠키",
      },
      {
        description: "방문 수와 유입 경로를 측정해 어떤 페이지가 효과적인지, 어디를 개선해야 하는지 파악합니다.",
        detail: "수집 정보는 집계 및 익명 처리되어 개별 방문자를 식별하지 않고 사용 패턴을 분석하는 데 쓰입니다.",
        id: "analysis",
        status: "consent",
        title: "분석 쿠키",
      },
      {
        description: "광고 유입 여부와 캠페인 성과를 측정해 Google Ads 같은 채널 운영을 지원합니다.",
        detail: "비필수 쿠키이며 사용자 동의가 필요하고, 특정 개인을 식별하기 위한 용도로 사용되지 않습니다.",
        id: "marketing",
        status: "consent",
        title: "마케팅 쿠키",
      },
    ],
    title: "쿠키 설정",
  },
  ja: {
    acceptAllLabel: "すべての Cookie を許可",
    ctaActionLabel: "始める",
    ctaDescription: "数秒で登録し、14日間の無料トライアルを今すぐ始めましょう。",
    ctaEyebrow: "Stop Thinking.",
    ctaTitle: "Start Transforming.",
    declineAllLabel: "必須以外を拒否",
    intro: [
      "当社は Cookie などの技術を使用してデータを収集し、オンライン体験を最適化します。分類ごとに Cookie の利用可否を管理できます。",
    ],
    preferences: [
      {
        description: "サイトの基本機能、セキュリティ保護、コンプライアンス対応を維持するために必要な Cookie です。",
        detail: "安全なアクセス、セッション維持、そのほかサイト運用に必要な基本動作を支えます。",
        id: "necessary",
        status: "required",
        title: "必須 Cookie",
      },
      {
        description: "サイトの速度や応答性、使いやすさを把握し、体験改善に役立てるための Cookie です。",
        detail: "無効化すると最適化の精度が下がり、表示や動作がやや不安定に感じられる場合があります。",
        id: "performance",
        status: "optional",
        title: "パフォーマンス Cookie",
      },
      {
        description: "ユーザーの選択内容を記憶し、より個別化された機能を提供します。他サイト上の行動は追跡しません。",
        detail: "再訪時にも一貫した便利な体験を提供するため、設定内容の保持に利用されます。",
        id: "functional",
        status: "optional",
        title: "機能 Cookie",
      },
      {
        description: "訪問数や流入経路を測定し、どのページが有効か、どこを改善すべきかを把握します。",
        detail: "収集情報は集計・匿名化されており、個人を特定せずに利用傾向の把握に活用されます。",
        id: "analysis",
        status: "consent",
        title: "分析 Cookie",
      },
      {
        description: "広告経由の訪問有無やキャンペーン成果を測定し、Google Ads などの運用に役立てます。",
        detail: "非必須 Cookie であり、利用には同意が必要です。特定の個人を識別する目的では使用されません。",
        id: "marketing",
        status: "consent",
        title: "マーケティング Cookie",
      },
    ],
    title: "クッキー設定",
  },
};
