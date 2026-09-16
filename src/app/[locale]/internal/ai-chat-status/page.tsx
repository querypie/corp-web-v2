import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AiChatStatusPage, { type AiChatStatusPageCopy } from "@/components/internal/AiChatStatusPage";
import { isLocale, type Locale } from "@/constants/i18n";
import { getAiChatStatusConfig } from "@/features/ai-chat/status.server";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export const dynamic = "force-dynamic";

const copyByLocale = {
  en: {
    metadataTitle: "AI Chat Status",
    title: "AI Chat Status",
    description:
      "Checks whether the Vercel Server can connect directly to AI Gateway Stage. The browser is not used as a proxy.",
    configTitle: "Runtime configuration",
    probeTitle: "Basic request",
    resultTitle: "Response",
    eyebrow: "Vercel Server Probe",
    fixedRequestLabel: "Fixed test request",
    action: "Run basic request",
    loading: "Sending request",
    retryAfter: "Retry in {seconds}s",
    status: {
      enabled: "Enabled",
      disabled: "Disabled",
      configured: "Configured",
      missing: "Missing",
      success: "Success",
      failure: "Failure",
      idle: "No request has been sent yet.",
    },
    labels: {
      environment: "Environment",
      enabled: "AI Chat Enabled",
      keyConfigured: "API Key",
      baseUrl: "Base URL",
      model: "Model",
      upstreamStatus: "Upstream HTTP status",
      elapsed: "Elapsed",
      finishReason: "Finish reason",
      responseType: "Response type",
      responseServer: "Response server",
      checkedAt: "Checked at",
      result: "Result",
      finalAnswer: "Final answer",
    },
    values: { other: "Other" },
    notices: {
      disabled: "AI Chat is disabled, so the diagnostic request cannot run.",
      missingKey: "AI_CHAT_API_KEY is not configured.",
      productionDisabled: "Production keeps AI Chat Enabled=false, so the probe is not sent.",
      rateLimit:
        "The limit is 30 requests per minute and 1 concurrent request per server instance. Try again after Retry-After.",
    },
    errors: {
      rateLimited: "The request rate limit has been reached.",
      albForbidden:
        "Access was denied at the Gateway front door (ALB/WAF). This page cannot identify the specific blocking rule.",
      disabled: "The server reported that AI Chat is disabled.",
      notConfigured: "The server reported that AI_CHAT_API_KEY is missing.",
      invalidResponse: "The Gateway response format was not expected.",
      timeout: "The Gateway request timed out.",
      network: "The Vercel Server could not connect to the Gateway.",
      generic: "The diagnostic request could not be completed.",
    },
  },
  ko: {
    metadataTitle: "AI Chat 상태 진단",
    title: "AI Chat 상태 진단",
    description:
      "Vercel Server에서 AI Gateway Stage로 직접 연결되는지 확인합니다. 브라우저는 프록시로 사용하지 않습니다.",
    configTitle: "실행 설정",
    probeTitle: "기본 요청",
    resultTitle: "응답 결과",
    eyebrow: "Vercel Server Probe",
    fixedRequestLabel: "고정 테스트 요청",
    action: "기본 요청 테스트",
    loading: "요청 중",
    retryAfter: "{seconds}초 후 재시도",
    status: {
      enabled: "활성화됨",
      disabled: "비활성화됨",
      configured: "설정됨",
      missing: "미설정",
      success: "성공",
      failure: "실패",
      idle: "아직 요청하지 않았습니다.",
    },
    labels: {
      environment: "환경",
      enabled: "AI Chat Enabled",
      keyConfigured: "API Key",
      baseUrl: "Base URL",
      model: "Model",
      upstreamStatus: "Upstream HTTP status",
      elapsed: "Elapsed",
      finishReason: "Finish reason",
      responseType: "Response type",
      responseServer: "Response server",
      checkedAt: "Checked at",
      result: "Result",
      finalAnswer: "Final answer",
    },
    values: { other: "Other" },
    notices: {
      disabled: "AI Chat이 비활성화되어 있어 진단 요청을 실행하지 않습니다.",
      missingKey: "AI_CHAT_API_KEY가 설정되지 않았습니다.",
      productionDisabled: "Production 환경은 AI Chat Enabled=false 설정을 유지하므로 probe를 실행하지 않습니다.",
      rateLimit:
        "서버 인스턴스별 호출 제한은 분당 30회, 동시 실행 1회입니다. Retry-After 이후 다시 시도해 주세요.",
    },
    errors: {
      rateLimited: "호출 횟수 제한에 걸렸습니다.",
      albForbidden:
        "Gateway 앞단(ALB/WAF)에서 접근이 거부되었습니다. 구체적인 차단 규칙은 이 화면만으로 확인할 수 없습니다.",
      disabled: "서버에서 AI Chat이 비활성화되어 있다고 응답했습니다.",
      notConfigured: "서버에서 AI_CHAT_API_KEY가 없다고 응답했습니다.",
      invalidResponse: "Gateway 응답 형식이 예상과 다릅니다.",
      timeout: "Gateway 요청 시간이 초과되었습니다.",
      network: "Gateway 또는 Vercel Server 네트워크 연결에 실패했습니다.",
      generic: "진단 요청을 완료하지 못했습니다.",
    },
  },
  ja: {
    metadataTitle: "AI Chat ステータス診断",
    title: "AI Chat ステータス診断",
    description:
      "Vercel Server から AI Gateway Stage に直接接続できるかを確認します。ブラウザをプロキシとして使用しません。",
    configTitle: "実行設定",
    probeTitle: "基本リクエスト",
    resultTitle: "応答結果",
    eyebrow: "Vercel Server Probe",
    fixedRequestLabel: "固定テストリクエスト",
    action: "基本リクエストをテスト",
    loading: "リクエスト中",
    retryAfter: "{seconds}秒後に再試行",
    status: {
      enabled: "有効",
      disabled: "無効",
      configured: "設定済み",
      missing: "未設定",
      success: "成功",
      failure: "失敗",
      idle: "まだリクエストを実行していません。",
    },
    labels: {
      environment: "環境",
      enabled: "AI Chat Enabled",
      keyConfigured: "API Key",
      baseUrl: "Base URL",
      model: "Model",
      upstreamStatus: "Upstream HTTP status",
      elapsed: "所要時間",
      finishReason: "終了理由",
      responseType: "応答形式",
      responseServer: "応答サーバー",
      checkedAt: "確認日時",
      result: "結果",
      finalAnswer: "最終応答",
    },
    values: { other: "その他" },
    notices: {
      disabled: "AI Chat が無効のため、診断リクエストを実行できません。",
      missingKey: "AI_CHAT_API_KEY が設定されていません。",
      productionDisabled: "Production 環境では AI Chat Enabled=false を維持するため、プローブを実行しません。",
      rateLimit:
        "サーバーインスタンスごとの上限は1分あたり30回、同時実行1回です。Retry-After の後に再試行してください。",
    },
    errors: {
      rateLimited: "リクエスト回数の上限に達しました。",
      albForbidden:
        "Gateway の前段（ALB/WAF）でアクセスが拒否されました。この画面だけでは具体的なブロックルールを特定できません。",
      disabled: "サーバーから AI Chat が無効だと応答されました。",
      notConfigured: "サーバーから AI_CHAT_API_KEY が未設定だと応答されました。",
      invalidResponse: "Gateway の応答形式が想定と異なります。",
      timeout: "Gateway へのリクエストがタイムアウトしました。",
      network: "Gateway または Vercel Server とのネットワーク接続に失敗しました。",
      generic: "診断リクエストを完了できませんでした。",
    },
  },
} satisfies Record<Locale, AiChatStatusPageCopy>;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const copy = copyByLocale[locale];

  return {
    title: copy.metadataTitle,
    description: copy.description,
    robots: {
      follow: false,
      index: false,
    },
  };
}

export default async function InternalAiChatStatusRoute({ params }: PageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const config = getAiChatStatusConfig();

  return <AiChatStatusPage config={config} copy={copyByLocale[locale]} locale={locale} />;
}
