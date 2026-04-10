import { getLocalePath, type Locale } from "@/constants/i18n";

export type ContactLink = {
  href: string;
  label: string;
  value: string;
};

export type ContactField = {
  label: string;
  name: string;
  options?: string[];
  placeholder?: string;
  required?: boolean;
  type?: "select" | "text";
};

export type ContactPageCopy = {
  consentLabel: string;
  emailLinks: ContactLink[];
  formDescription: string;
  formFields: ContactField[];
  messageField: ContactField;
  privacyText: string;
  privacyTermsHref: string;
  privacyTermsLabel: string;
  privacyPolicyHref: string;
  privacyPolicyLabel: string;
  productFieldLabel: string;
  productOptions: string[];
  submitLabel: string;
  titleLines: string[];
};

export function getContactPageCopy(locale: Locale): ContactPageCopy {
  return {
    en: {
      titleLines: ["Connect with our experts.", "Accelerate your success."],
      formDescription:
        "Quick, friendly guidance for your business—answers you'll appreciate, support you'll trust.",
      emailLinks: [
        { label: "Customer Support", value: "support@querypie.com", href: "mailto:support@querypie.com" },
        { label: "Careers", value: "careers@querypie.com", href: "mailto:careers@querypie.com" },
        { label: "PR", value: "pr@querypie.com", href: "mailto:pr@querypie.com" },
      ],
      formFields: [
        { label: "First Name", name: "firstName", placeholder: "Enter your given name", required: true },
        { label: "Last Name", name: "lastName", placeholder: "Enter your family name", required: true },
        { label: "Business Email", name: "email", placeholder: "Enter your business email", required: true },
        { label: "Company Name", name: "company", placeholder: "Enter your company’s name", required: true },
        { label: "Department / Title", name: "departmentTitle", placeholder: "Enter your department and title (e.g., Marketing / Head)", required: true },
        { label: "Phone Number", name: "phoneNumber", placeholder: "Enter your phone number" },
        {
          label: "Inquiry Type",
          name: "inquiryType",
          options: ["Request for Product Demo", "Pricing Plan Discussion", "Technical Question", "Partnership", "Other"],
          placeholder: "Please select the type of inquiry.",
          required: true,
          type: "select" as const,
        },
        {
          label: "Planned Implementation Date",
          name: "plannedImplementationDate",
          options: ["Within 3 months", "Within 6 months", "6 months or more", "Consideration stage"],
          placeholder: "Please select the planned implementation date.",
          required: true,
          type: "select" as const,
        },
      ],
      productFieldLabel: "Products/Services of Interest",
      productOptions: [
        "AI Platform QueryPie AIP",
        "Access Control Platform QueryPie ACP",
        "AI Expert Support (FDE) Service",
        "Partnership",
      ],
      messageField: {
        label: "Questions or Additional Information",
        name: "message",
        placeholder: "Any questions or details you'd like to share?",
        required: true,
      },
      consentLabel: "Keep me updated on QueryPie news, events, & product info.",
      privacyText: "QueryPie values your privacy. Please check out our",
      privacyTermsLabel: "Terms",
      privacyTermsHref: getLocalePath("en", "/features/documentation"),
      privacyPolicyLabel: "Privacy Policy",
      privacyPolicyHref: getLocalePath("en", "/features/documentation"),
      submitLabel: "Submit",
    },
    ko: {
      titleLines: ["전문가와 연결하세요.", "더 빠르게 성과를 만드세요."],
      formDescription: "빠르고 친절한 가이드로 비즈니스에 필요한 답을 드립니다.",
      emailLinks: [
        { label: "고객 지원", value: "support@querypie.com", href: "mailto:support@querypie.com" },
        { label: "채용", value: "careers@querypie.com", href: "mailto:careers@querypie.com" },
        { label: "홍보", value: "pr@querypie.com", href: "mailto:pr@querypie.com" },
      ],
      formFields: [
        { label: "이름", name: "firstName", placeholder: "이름을 입력해 주세요", required: true },
        { label: "성", name: "lastName", placeholder: "성을 입력해 주세요", required: true },
        { label: "회사 이메일", name: "email", placeholder: "회사 이메일을 입력해 주세요", required: true },
        { label: "회사명", name: "company", placeholder: "회사명을 입력해 주세요", required: true },
        { label: "부서 / 직책", name: "departmentTitle", placeholder: "부서와 직책을 입력해 주세요 (예: 마케팅 / 팀장)", required: true },
        { label: "전화번호", name: "phoneNumber", placeholder: "전화번호를 입력해 주세요" },
        {
          label: "문의 유형",
          name: "inquiryType",
          options: ["제품 데모 요청", "요금제 상담", "기술 문의", "파트너십", "기타"],
          placeholder: "문의 유형을 선택해 주세요.",
          required: true,
          type: "select" as const,
        },
        {
          label: "도입 예정 시점",
          name: "plannedImplementationDate",
          options: ["3개월 이내", "6개월 이내", "6개월 이후", "검토 단계"],
          placeholder: "도입 예정 시점을 선택해 주세요.",
          required: true,
          type: "select" as const,
        },
      ],
      productFieldLabel: "관심 있는 제품/서비스",
      productOptions: [
        "AI Platform QueryPie AIP",
        "Access Control Platform QueryPie ACP",
        "AI Expert Support (FDE) Service",
        "Partnership",
      ],
      messageField: {
        label: "문의 사항 또는 추가 정보",
        name: "message",
        placeholder: "공유하고 싶은 문의 내용이나 추가 정보를 입력해 주세요.",
        required: true,
      },
      consentLabel: "QueryPie의 뉴스, 이벤트, 제품 정보를 받아보겠습니다.",
      privacyText: "QueryPie는 고객의 개인정보를 중요하게 생각합니다. 자세한 내용은",
      privacyTermsLabel: "이용약관",
      privacyTermsHref: getLocalePath("ko", "/features/documentation"),
      privacyPolicyLabel: "개인정보처리방침",
      privacyPolicyHref: getLocalePath("ko", "/features/documentation"),
      submitLabel: "제출하기",
    },
    ja: {
      titleLines: ["専門家にご相談ください。", "成功までのスピードを高めます。"],
      formDescription: "ビジネスに必要な答えを、すばやく丁寧にご案内します。",
      emailLinks: [
        { label: "カスタマーサポート", value: "support@querypie.com", href: "mailto:support@querypie.com" },
        { label: "採用", value: "careers@querypie.com", href: "mailto:careers@querypie.com" },
        { label: "広報", value: "pr@querypie.com", href: "mailto:pr@querypie.com" },
      ],
      formFields: [
        { label: "名", name: "firstName", placeholder: "名を入力してください", required: true },
        { label: "姓", name: "lastName", placeholder: "姓を入力してください", required: true },
        { label: "会社メールアドレス", name: "email", placeholder: "会社のメールアドレスを入力してください", required: true },
        { label: "会社名", name: "company", placeholder: "会社名を入力してください", required: true },
        { label: "部署 / 役職", name: "departmentTitle", placeholder: "部署名と役職を入力してください（例: Marketing / Head）", required: true },
        { label: "電話番号", name: "phoneNumber", placeholder: "電話番号を入力してください" },
        {
          label: "お問い合わせの種類",
          name: "inquiryType",
          options: ["製品デモのご依頼", "料金プランのご相談", "技術的なお問い合わせ", "パートナーシップ", "その他"],
          placeholder: "お問い合わせの種類を選択してください。",
          required: true,
          type: "select" as const,
        },
        {
          label: "導入予定時期",
          name: "plannedImplementationDate",
          options: ["3か月以内", "6か月以内", "6か月以上先", "検討段階"],
          placeholder: "導入予定時期を選択してください。",
          required: true,
          type: "select" as const,
        },
      ],
      productFieldLabel: "関心のある製品 / サービス",
      productOptions: [
        "AI Platform QueryPie AIP",
        "Access Control Platform QueryPie ACP",
        "AI Expert Support (FDE) Service",
        "Partnership",
      ],
      messageField: {
        label: "ご質問・補足情報",
        name: "message",
        placeholder: "ご質問や共有したい詳細をご記入ください",
        required: true,
      },
      consentLabel: "QueryPie のニュース、イベント、製品情報を受け取る。",
      privacyText: "QueryPie はお客様のプライバシーを尊重します。詳しくは",
      privacyTermsLabel: "利用規約",
      privacyTermsHref: getLocalePath("ja", "/features/documentation"),
      privacyPolicyLabel: "プライバシーポリシー",
      privacyPolicyHref: getLocalePath("ja", "/features/documentation"),
      submitLabel: "送信",
    },
  }[locale];
}
