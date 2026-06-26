import type { Locale } from "@/constants/i18n";

type LegalSeoDescriptionKey =
  | "cookiePreference"
  | "eula"
  | "privacyPolicy"
  | "termsOfService";

const descriptions: Record<LegalSeoDescriptionKey, Record<Locale, string>> = {
  cookiePreference: {
    en: "Manage cookie preferences for QueryPie AI and choose how optional cookies are used.",
    ko: "QueryPie AI의 쿠키 설정을 관리하고 선택 쿠키 사용 여부를 조정하세요.",
    ja: "QueryPie AI の Cookie 設定を管理し、任意 Cookie の利用を選択できます。",
  },
  eula: {
    en: "Review the QueryPie AI End User License Agreement for product usage terms and conditions.",
    ko: "QueryPie AI 제품 사용 조건을 안내하는 최종 사용자 라이선스 계약을 확인하세요.",
    ja: "QueryPie AI 製品の利用条件を定めるエンドユーザーライセンス契約をご確認ください。",
  },
  privacyPolicy: {
    en: "Read the QueryPie AI Privacy Policy to understand how personal information is collected, used, and protected.",
    ko: "QueryPie AI가 개인정보를 수집, 이용, 보호하는 방식을 개인정보처리방침에서 확인하세요.",
    ja: "QueryPie AI が個人情報を収集、利用、保護する方法をプライバシーポリシーでご確認ください。",
  },
  termsOfService: {
    en: "Review the QueryPie AI Terms of Service for using QueryPie products, services, and websites.",
    ko: "QueryPie 제품, 서비스, 웹사이트 이용에 적용되는 QueryPie AI 이용약관을 확인하세요.",
    ja: "QueryPie 製品、サービス、ウェブサイトの利用に適用される QueryPie AI 利用規約をご確認ください。",
  },
};

export function getLegalSeoDescription(key: LegalSeoDescriptionKey, locale: Locale) {
  return descriptions[key][locale];
}
