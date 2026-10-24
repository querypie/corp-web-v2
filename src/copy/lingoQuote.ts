import { getLocalePath, type Locale } from "@/constants/i18n";

export type LingoQuotePageCopy = {
  metadataTitle: string;
  title: string;
  description: string;
  planLabel: string;
  companyLabel: string;
  companyPlaceholder: string;
  contactLabel: string;
  contactPlaceholder: string;
  departmentLabel: string;
  departmentPlaceholder: string;
  consentLabel: string;
  privacyText: string;
  privacyTermsHref: string;
  privacyTermsLabel: string;
  privacyPolicyHref: string;
  privacyPolicyLabel: string;
  submitLabel: string;
  submittingLabel: string;
  successTitle: string;
  successDescription: string;
  downloadLabel: string;
  errorGeneral: string;
  errorRequired: string;
  errorRateLimited: string;
};

export function getLingoQuotePageCopy(locale: Locale): LingoQuotePageCopy {
  const copies: Record<Locale, Omit<LingoQuotePageCopy, "privacyTermsHref" | "privacyPolicyHref">> = {
    en: {
      metadataTitle: "Lingo quotation",
      title: "Request a Lingo quotation",
      description: "Choose a credit plan and enter the ordering company information. We will create the quotation as an Excel file.",
      planLabel: "Credit plan",
      companyLabel: "Ordering company",
      companyPlaceholder: "Enter the company name",
      contactLabel: "Contact person",
      contactPlaceholder: "Enter the contact person",
      departmentLabel: "Department",
      departmentPlaceholder: "Enter the department",
      consentLabel: "I agree to the collection and use of the information needed to issue this quotation.",
      privacyText: "Please review the",
      privacyTermsLabel: "Terms of Service",
      privacyPolicyLabel: "Privacy Policy",
      submitLabel: "Download quotation",
      submittingLabel: "Creating...",
      successTitle: "Quotation created",
      successDescription: "Your quotation download has started. Use the button below if you need to download it again.",
      downloadLabel: "Download quotation again",
      errorGeneral: "We could not create the quotation. Please try again.",
      errorRequired: "Enter the ordering company, select a credit plan and agree to the privacy notice.",
      errorRateLimited: "Too many requests. Please wait a moment and try again.",
    },
    ko: {
      metadataTitle: "링고 견적서 발급",
      title: "링고 견적서 발급",
      description: "크레딧 상품을 선택하고 발주 회사 정보를 입력하면 Excel 견적서를 바로 다운로드할 수 있습니다.",
      planLabel: "크레딧 상품",
      companyLabel: "발주 회사명",
      companyPlaceholder: "회사명을 입력해주세요.",
      contactLabel: "담당자명",
      contactPlaceholder: "담당자명을 입력해주세요.",
      departmentLabel: "부서",
      departmentPlaceholder: "부서를 입력해주세요.",
      consentLabel: "견적서 발급에 필요한 개인정보 수집 및 이용에 동의합니다.",
      privacyText: "자세한 내용은",
      privacyTermsLabel: "이용약관",
      privacyPolicyLabel: "개인정보처리방침",
      submitLabel: "견적서 다운로드",
      submittingLabel: "생성 중...",
      successTitle: "견적서가 생성되었습니다.",
      successDescription: "견적서 다운로드가 시작되었습니다. 다시 받으려면 아래 버튼을 눌러주세요.",
      downloadLabel: "견적서 다시 다운로드",
      errorGeneral: "견적서를 생성하지 못했습니다. 잠시 후 다시 시도해주세요.",
      errorRequired: "발주 회사명과 크레딧 상품을 입력하고 개인정보 수집 및 이용에 동의해주세요.",
      errorRateLimited: "요청이 너무 많습니다. 잠시 후 다시 시도해주세요.",
    },
    ja: {
      metadataTitle: "Lingo 見積書の発行",
      title: "Lingo 見積書の発行",
      description: "クレジット商品と発注会社の情報を入力すると、Excel形式の見積書をダウンロードできます。",
      planLabel: "クレジット商品",
      companyLabel: "発注会社名",
      companyPlaceholder: "会社名を入力してください。",
      contactLabel: "担当者名",
      contactPlaceholder: "担当者名を入力してください。",
      departmentLabel: "部署",
      departmentPlaceholder: "部署を入力してください。",
      consentLabel: "見積書の発行に必要な個人情報の収集・利用に同意します。",
      privacyText: "詳細は",
      privacyTermsLabel: "利用規約",
      privacyPolicyLabel: "プライバシーポリシー",
      submitLabel: "見積書をダウンロード",
      submittingLabel: "作成中...",
      successTitle: "見積書を作成しました。",
      successDescription: "見積書のダウンロードが始まりました。もう一度ダウンロードする場合は下のボタンをご利用ください。",
      downloadLabel: "見積書を再ダウンロード",
      errorGeneral: "見積書を作成できませんでした。しばらくしてからもう一度お試しください。",
      errorRequired: "発注会社名とクレジット商品を入力し、個人情報の収集・利用に同意してください。",
      errorRateLimited: "リクエストが多すぎます。しばらくしてからもう一度お試しください。",
    },
  };

  return {
    ...copies[locale],
    privacyTermsHref: getLocalePath(locale, "/terms-of-service"),
    privacyPolicyHref: getLocalePath(locale, "/privacy-policy"),
  };
}
