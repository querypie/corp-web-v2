import type { Locale } from "@/constants/i18n";

type AiChatCopy = {
  open: string;
  close: string;
  reset: string;
  title: string;
  heading: string;
  description: string;
  placeholder: string;
  send: string;
  conversation: string;
  unavailable: string;
  loading: string;
  error: string;
  sources: string;
  disclaimer: string;
};

export const aiChatCopy: Record<Locale, AiChatCopy> = {
  ko: {
    open: "AI 제품 상담 열기",
    close: "상담창 닫기",
    reset: "대화 초기화",
    title: "QueryPie Bot",
    heading: "무엇이 궁금하신가요?",
    description: "우리 제품에 대해 궁금한 내용을\n편하게 물어보세요.",
    placeholder: "메시지를 입력하세요…",
    send: "메시지 보내기",
    conversation: "상담 대화",
    unavailable: "이 환경에서는 AI 상담 연결이 아직 설정되지 않았습니다.",
    loading: "공식 자료를 바탕으로 답변을 준비하고 있어요…",
    error: "답변을 가져오지 못했어요. 잠시 후 다시 보내주세요.",
    sources: "참고 자료",
    disclaimer: "AI는 간혹 실수할 수 있습니다.",
  },
  en: {
    open: "Open AI product chat",
    close: "Close chat",
    reset: "Reset conversation",
    title: "QueryPie Bot",
    heading: "What would you like to know?",
    description: "Ask us anything\nabout our products.",
    placeholder: "Type a message…",
    send: "Send message",
    conversation: "Conversation",
    unavailable: "The AI advisor is not connected in this environment yet.",
    loading: "Preparing an answer from our official sources…",
    error: "We couldn't get an answer. Please try sending your message again shortly.",
    sources: "Sources",
    disclaimer: "AI can sometimes make mistakes.",
  },
  ja: {
    open: "AI製品相談を開く",
    close: "チャットを閉じる",
    reset: "会話をリセット",
    title: "QueryPie Bot",
    heading: "何をお知りになりたいですか？",
    description: "製品について気になることを\nお気軽にご質問ください。",
    placeholder: "メッセージを入力…",
    send: "メッセージを送信",
    conversation: "会話履歴",
    unavailable: "この環境ではAI相談への接続がまだ設定されていません。",
    loading: "公式資料をもとに回答を準備しています…",
    error: "回答を取得できませんでした。しばらくしてから、もう一度送信してください。",
    sources: "参考資料",
    disclaimer: "AIの回答には誤りが含まれる場合があります。",
  },
};
