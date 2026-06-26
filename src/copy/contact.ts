import { getLocalePath, type Locale } from "@/constants/i18n";

export type ContactLink = {
  href: string;
  label: string;
  value: string;
};

export type ContactCommunityLink = {
  href: string;
  label: string;
  title: string;
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
  metadataTitle: string;
  consentLabel: string;
  contactHighlights: string[];
  emailLinks: ContactLink[];
  errorGeneral: string;
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
  successButton: string;
  successDescription: string;
  successTitle: string;
  supportLink: ContactCommunityLink;
  titleLines: string[];
};

export function getContactPageCopy(locale: Locale): ContactPageCopy {
  return {
    en: {
      metadataTitle: "QueryPie Contacts",
      titleLines: ["Connect with our experts.", "Accelerate your success."],
      formDescription:
        "We're here to help with product consultations, resource requests, and technical inquiries. Fill out the form on the right, and our team will review your inquiry and contact you within one business week.",
      contactHighlights: [
        "Talk with the right team for your product and rollout stage.",
        "Receive introduction materials and implementation consultation tailored to your inquiry.",
        "Receive follow-up by email after our team reviews your inquiry.",
      ],
      emailLinks: [
        { label: "Sales", value: "sales@querypie.com", href: "mailto:sales@querypie.com" },
        { label: "Careers", value: "careers@querypie.com", href: "mailto:careers@querypie.com" },
        { label: "PR/Marketing", value: "pr@querypie.com", href: "mailto:pr@querypie.com" },
      ],
      supportLink: {
        title: "QueryPie ACP Community Online Technical Support",
        label: "GitHub Discussions",
        href: "https://github.com/querypie/querypie-community/discussions",
      },
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
        "Meeting Notes & Live Translation AI - Lingo",
        "Knowledge-based Content Creation AI - NotePie",
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
      errorGeneral: "Failed to submit the form. Please try again later.",
      privacyText: "QueryPie values your privacy. Please check out our",
      privacyTermsLabel: "Terms",
      privacyTermsHref: getLocalePath("en", "/features/documentation"),
      privacyPolicyLabel: "Privacy Policy",
      privacyPolicyHref: getLocalePath("en", "/features/documentation"),
      submitLabel: "Proceed",
      successTitle: "Submission Complete",
      successDescription: "Thank you for your application!\nOur team will review it and get back to you shortly.",
      successButton: "Go to Home",
    },
    ko: {
      metadataTitle: "QueryPie Contacts",
      titleLines: ["전문가와 연결하세요.", "더 빠르게 성과를 만드세요."],
      formDescription:
        "제품 상담, 자료 요청, 기술 문의가 필요하시면 도와드리겠습니다. 오른쪽 양식을 작성해 주시면 담당자가 문의 내용을 검토한 뒤 영업일 기준 1주일 이내에 연락드립니다.",
      contactHighlights: [
        "제품과 도입 단계에 맞는 담당 팀과 상담할 수 있습니다.",
        "문의 내용에 맞춘 소개 자료와 도입 컨설팅을 받을 수 있습니다.",
        "담당자 검토 후 이메일로 후속 안내를 받을 수 있습니다.",
      ],
      emailLinks: [
        { label: "세일즈", value: "sales@querypie.com", href: "mailto:sales@querypie.com" },
        { label: "채용", value: "careers@querypie.com", href: "mailto:careers@querypie.com" },
        { label: "PR/마케팅", value: "pr@querypie.com", href: "mailto:pr@querypie.com" },
      ],
      supportLink: {
        title: "QueryPie ACP 커뮤니티 온라인 기술 지원",
        label: "GitHub Discussions",
        href: "https://github.com/querypie/querypie-community/discussions",
      },
      formFields: [
        { label: "이름", name: "firstName", placeholder: "이름을 입력해주세요.", required: true },
        { label: "성", name: "lastName", placeholder: "성을 입력해주세요.", required: true },
        { label: "회사 이메일", name: "email", placeholder: "회사 이메일을 입력해주세요.", required: true },
        { label: "회사명", name: "company", placeholder: "회사명을 입력해주세요.", required: true },
        { label: "부서 / 직책", name: "departmentTitle", placeholder: "부서 및 직책을 입력하세요.", required: true },
        { label: "전화번호", name: "phoneNumber", placeholder: "전화번호를 입력하세요." },
        {
          label: "문의 종류",
          name: "inquiryType",
          options: ["제품 데모 요청", "요금제 상담", "기술적 문의", "파트너십", "기타"],
          placeholder: "문의 유형을 선택해주세요.",
          required: true,
          type: "select" as const,
        },
        {
          label: "도입 예정 시기",
          name: "plannedImplementationDate",
          options: ["3개월 이내", "6개월 이내", "6개월 이후", "검토 단계"],
          placeholder: "도입 예정 시기를 선택해주세요.",
          required: true,
          type: "select" as const,
        },
      ],
      productFieldLabel: "관심 있는 제품・서비스",
      productOptions: [
        "회의기록 및 실시간번역 AI - Lingo",
        "지식 기반 콘텐츠 생성 AI - NotePie",
        "AI 플랫폼 QueryPie AIP",
        "액세스 제어 플랫폼 QueryPie ACP",
        "AI 전문가 지원 (FDE) 서비스",
        "파트너십",
      ],
      messageField: {
        label: "Questions or Additional Information",
        name: "message",
        placeholder: "Any questions or details you’d like to share?",
        required: true,
      },
      consentLabel: "QueryPie의 뉴스, 이벤트, 제품 정보를 받아보겠습니다.",
      errorGeneral: "폼 제출에 실패했습니다. 다시 시도해 주세요.",
      privacyText: "QueryPie는 고객의 개인정보를 중요하게 생각합니다. 자세한 내용은",
      privacyTermsLabel: "이용약관",
      privacyTermsHref: getLocalePath("ko", "/features/documentation"),
      privacyPolicyLabel: "개인정보처리방침",
      privacyPolicyHref: getLocalePath("ko", "/features/documentation"),
      submitLabel: "Proceed",
      successTitle: "제출이 완료되었습니다.",
      successDescription: "문의해 주셔서 감사합니다!\n담당자가 검토 후 빠르게 연락드리겠습니다.",
      successButton: "홈으로 이동",
    },
    ja: {
      metadataTitle: "QueryPie: お問い合わせ",
      titleLines: ["専門家にご相談ください。", "成功までのスピードを高めます。"],
      formDescription:
        "製品相談、資料請求、技術的なお問い合わせについてサポートします。右側のフォームにご記入いただくと、担当チームが内容を確認し、1営業週以内にご連絡します。",
      contactHighlights: [
        "製品や導入フェーズに合った担当チームにご相談いただけます。",
        "お問い合わせ内容に合わせた紹介資料と導入コンサルティングをご案内します。",
        "担当チームの確認後、メールでフォローアップをお送りします。",
      ],
      emailLinks: [
        { label: "セールス", value: "sales@querypie.com", href: "mailto:sales@querypie.com" },
        { label: "採用", value: "careers@querypie.com", href: "mailto:careers@querypie.com" },
        { label: "PR/マーケティング", value: "pr@querypie.com", href: "mailto:pr@querypie.com" },
      ],
      supportLink: {
        title: "QueryPie ACP コミュニティ オンライン技術サポート",
        label: "GitHub Discussions",
        href: "https://github.com/querypie/querypie-community/discussions",
      },
      formFields: [
        { label: "姓", name: "lastName", placeholder: "例: 山田", required: true },
        { label: "名", name: "firstName", placeholder: "例: 太郎", required: true },
        { label: "ビジネス用メールアドレス", name: "email", placeholder: "例: name@company.com", required: true },
        { label: "会社名", name: "company", placeholder: "例: クエリパイ株式会社", required: true },
        { label: "部署／役職", name: "departmentTitle", placeholder: "例: エンタープライズAI事業部 部長", required: true },
        { label: "電話番号", name: "phoneNumber", placeholder: "例: 090-1234-5678" },
        {
          label: "お問い合わせの種類",
          name: "inquiryType",
          options: ["AI導入・活用について相談", "資料ダウンロード", "デモを依頼", "お見積もり依頼", "技術的な質問", "パートナーシップ", "その他"],
          placeholder: "お問い合わせ内容を選択してください",
          required: true,
          type: "select" as const,
        },
        {
          label: "導入予定時期",
          name: "plannedImplementationDate",
          options: ["3ヶ月以内", "6ヶ月以内", "6ヶ月以降", "検討段階"],
          placeholder: "導入予定時期を選択してください",
          required: true,
          type: "select" as const,
        },
      ],
      productFieldLabel: "興味のある製品・サービス",
      productOptions: [
        "会議記録・リアルタイム翻訳AI - Lingo",
        "ナレッジベース コンテンツ生成AI - NotePie",
        "社内業務効率化｜AI Crew",
        "自社サービスAI化｜AI Dashi",
        "AIプラットフォーム QueryPie AIP",
        "アクセス制御プラットフォーム QueryPie ACP",
        "AI専門家伴走 (FDE) サービス",
        "パートナーシップ",
      ],
      messageField: {
        label: "ご質問・ご要望",
        name: "message",
        placeholder: "具体的なご質問やご要望をお聞かせください。",
        required: true,
      },
      consentLabel: "QueryPie のニュース、イベント、製品情報を受け取る。",
      errorGeneral: "フォームの送信に失敗しました。もう一度お試しください。",
      privacyText: "QueryPie はお客様のプライバシーを尊重します。詳しくは",
      privacyTermsLabel: "利用規約",
      privacyTermsHref: getLocalePath("ja", "/features/documentation"),
      privacyPolicyLabel: "プライバシーポリシー",
      privacyPolicyHref: getLocalePath("ja", "/features/documentation"),
      submitLabel: "送信する",
      successTitle: "送信が完了しました。",
      successDescription: "お問い合わせいただきありがとうございます。\n担当者が確認後、速やかにご連絡いたします。",
      successButton: "ホームに戻る",
    },
  }[locale];
}
