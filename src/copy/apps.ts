import type { Locale } from "@/constants/i18n";

export type SlackAppPageCopy = {
  benefits: Array<{ description: string; title: string }>;
  connectionSteps: string[];
  contactCta: string;
  description: string;
  metadataDescription: string;
  metadataTitle: string;
  notice: string;
  noticeLabel: string;
  overview: string;
  overviewTitle: string;
  supportDescription: string;
  supportTitle: string;
  title: string;
  whyDescription: string;
  whyTitle: string;
  connectionTitle: string;
};

export function getSlackAppPageCopy(locale: Locale): SlackAppPageCopy {
  return {
    en: {
      metadataTitle: "Slack + QueryPie AIP | QueryPie",
      metadataDescription: "Use QueryPie AIP with Slack to bring approved Slack messages, notifications, and workflow updates into controlled AI workflows.",
      title: "Slack + QueryPie AIP",
      description: "Connect Slack to QueryPie AIP so approved users can use Slack conversations, notifications, and workflow updates in controlled AI workflows.",
      contactCta: "Contact sales",
      overviewTitle: "What is Slack?",
      overview: "Slack is a business messaging app where teams exchange messages, decisions, and operational updates.",
      whyTitle: "Why use Slack + QueryPie AIP?",
      whyDescription: "Use Slack context inside QueryPie AIP without bypassing workspace permissions or QueryPie audit controls.",
      benefits: [
        { title: "Use Slack context", description: "Approved AIP agents can summarize or reason over Slack conversations that your workspace permits." },
        { title: "Prepare Slack-ready updates", description: "Turn QueryPie AIP results into drafts, notifications, and workflow updates that are ready for Slack." },
        { title: "Keep admin control", description: "Run the integration within Slack OAuth, workspace permissions, and QueryPie access controls." },
      ],
      connectionTitle: "How to connect Slack + QueryPie AIP",
      connectionSteps: ["Select Add to Slack and sign in to the workspace you want to connect.", "Review the requested Slack permissions and approve the connection.", "Use approved QueryPie AIP agents with Slack context, messages, and notifications."],
      supportTitle: "Learn more and get support",
      supportDescription: "For questions about installation or permissions, contact QueryPie.",
      noticeLabel: "AI accuracy notice:",
      notice: "QueryPie AIP uses large language models. AI-generated outputs may be inaccurate. Review important results before relying on them or sending them to Slack.",
    },
    ko: {
      metadataTitle: "Slack + QueryPie AIP | QueryPie",
      metadataDescription: "QueryPie AIP와 Slack을 연결해 승인된 Slack 메시지, 알림, workflow update를 통제된 AI workflow에서 사용합니다.",
      title: "Slack + QueryPie AIP",
      description: "Slack을 QueryPie AIP와 연결해 승인된 사용자가 Slack 대화, 알림, workflow update를 통제된 AI workflow에서 사용할 수 있게 합니다.",
      contactCta: "영업팀에 문의",
      overviewTitle: "Slack이란?",
      overview: "Slack은 팀이 메시지, 결정 사항, 운영 업데이트를 주고받는 비즈니스 메시징 앱입니다.",
      whyTitle: "Slack + QueryPie AIP를 사용하는 이유",
      whyDescription: "Slack context를 QueryPie AIP 안에서 활용하면서 workspace permissions와 QueryPie audit controls를 유지합니다.",
      benefits: [
        { title: "Slack 컨텍스트 활용", description: "승인된 AIP agents가 접근이 허용된 Slack 대화를 요약하거나 추론에 사용할 수 있습니다." },
        { title: "Slack용 업데이트 작성", description: "QueryPie AIP 결과를 Slack에 보낼 초안, 알림, workflow update로 정리할 수 있습니다." },
        { title: "관리 통제 유지", description: "Slack OAuth, workspace permissions, QueryPie access controls 범위 안에서 연동을 운영합니다." },
      ],
      connectionTitle: "Slack + QueryPie AIP 연결 방법",
      connectionSteps: ["Slack에 추가하기를 선택하고 연결할 workspace에 로그인합니다.", "요청된 Slack permissions를 검토한 뒤 연결을 승인합니다.", "승인된 QueryPie AIP agents로 Slack context, 메시지, 알림을 사용합니다."],
      supportTitle: "자세히 보기 및 지원",
      supportDescription: "설치 또는 권한 관련 질문은 QueryPie에 문의하세요.",
      noticeLabel: "AI 정확성 고지 :",
      notice: "QueryPie AIP는 large language models를 사용합니다. AI 생성 결과는 부정확할 수 있습니다. 중요한 결과는 의존하거나 Slack으로 보내기 전에 검토하세요.",
    },
    ja: {
      metadataTitle: "Slack + QueryPie AIP | QueryPie",
      metadataDescription: "QueryPie AIP と Slack を接続し、承認済みの Slack メッセージ、通知、workflow updates を管理された AI workflows で利用します。",
      title: "Slack + QueryPie AIP",
      description: "Slack を QueryPie AIP と接続し、承認済みユーザーが Slack の会話、通知、workflow updates を管理された AI workflows で利用できるようにします。",
      contactCta: "営業チームに問い合わせる",
      overviewTitle: "Slack とは？",
      overview: "Slack は、チームがメッセージ、意思決定、業務更新をやり取りするビジネスメッセージングアプリです。",
      whyTitle: "Slack + QueryPie AIP を使う理由",
      whyDescription: "Slack context を QueryPie AIP 内で活用しながら、workspace permissions と QueryPie audit controls を維持します。",
      benefits: [
        { title: "Slack コンテキストを活用", description: "承認済みの AIP agents は、アクセスが許可された Slack の会話を要約や推論に利用できます。" },
        { title: "Slack 向け更新を作成", description: "QueryPie AIP の結果を、Slack に送る下書き、通知、workflow updates として整理できます。" },
        { title: "管理者の統制を維持", description: "Slack OAuth、workspace permissions、QueryPie access controls の範囲内で連携を運用します。" },
      ],
      connectionTitle: "Slack + QueryPie AIP の連携方法",
      connectionSteps: ["Slack に追加を選択し、接続する workspace にログインします。", "要求された Slack permissions を確認し、連携を承認します。", "承認済みの QueryPie AIP agents で Slack context、メッセージ、通知を利用します。"],
      supportTitle: "詳細とサポート",
      supportDescription: "インストールまたは権限に関する質問は QueryPie にお問い合わせください。",
      noticeLabel: "AI 精度に関する注意:",
      notice: "QueryPie AIP は large language models を使用します。AI が生成した出力は不正確な場合があります。重要な結果は、依存したり Slack に送信したりする前に確認してください。",
    },
  }[locale];
}
