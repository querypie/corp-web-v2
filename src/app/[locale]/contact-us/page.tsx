import { notFound } from "next/navigation";
import ContactUsPage from "../../../components/pages/contact/ContactUsPage";
import { isLocale } from "../../../constants/i18n";

type ContactUsRouteProps = {
  params: Promise<{ locale: string }>;
};

export default async function ContactUsRoute({ params }: ContactUsRouteProps) {
  const { locale } = await params;

  if (!isLocale(locale)) notFound();

  // contact-us 페이지의 locale별 카피/폼 라벨
  const copy = {
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
      ],
      productFieldLabel: "Product(s) Interested",
      productOptions: [
        "Database Access Controller (DAC)",
        "System Access Controller (SAC)",
        "Kubernetes Access Controller (KAC)",
        "Web Access Controller (WAC)",
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
      privacyTermsHref: "/en/docs",
      privacyPolicyLabel: "Privacy Policy",
      privacyPolicyHref: "/en/docs",
      submitLabel: "Submit",
    },
    ko: {
      titleLines: ["전문가와 연결하세요.", "더 빠르게 성과를 만드세요."],
      formDescription:
        "빠르고 친절한 가이드로 비즈니스에 필요한 답을 드립니다.",
      emailLinks: [
        { label: "고객 지원", value: "support@querypie.com", href: "mailto:support@querypie.com" },
        { label: "채용", value: "careers@querypie.com", href: "mailto:careers@querypie.com" },
        { label: "홍보", value: "pr@querypie.com", href: "mailto:pr@querypie.com" },
      ],
      formFields: [
        { label: "이름", name: "firstName", placeholder: "이름을 입력하세요", required: true },
        { label: "성", name: "lastName", placeholder: "성을 입력하세요", required: true },
        { label: "회사 이메일", name: "email", placeholder: "회사 이메일을 입력하세요", required: true },
        { label: "회사명", name: "company", placeholder: "회사명을 입력하세요", required: true },
      ],
      productFieldLabel: "관심 있는 제품",
      productOptions: [
        "Database Access Controller (DAC)",
        "System Access Controller (SAC)",
        "Kubernetes Access Controller (KAC)",
        "Web Access Controller (WAC)",
      ],
      messageField: {
        label: "문의 사항 또는 추가 정보",
        name: "message",
        placeholder: "궁금한 점이나 공유할 내용을 입력해 주세요",
        required: true,
      },
      consentLabel: "QueryPie의 뉴스, 이벤트, 제품 정보를 받아보겠습니다.",
      privacyText: "QueryPie는 고객의 개인정보를 중요하게 생각합니다. 자세한 내용은",
      privacyTermsLabel: "이용약관",
      privacyTermsHref: "/ko/docs",
      privacyPolicyLabel: "개인정보처리방침",
      privacyPolicyHref: "/ko/docs",
      submitLabel: "제출하기",
    },
    ja: {
      titleLines: ["専門家にご相談ください。", "成功までのスピードを高めます。"],
      formDescription:
        "ビジネスに必要な答えを、すばやく丁寧にご案内します。",
      emailLinks: [
        { label: "Customer Support", value: "support@querypie.com", href: "mailto:support@querypie.com" },
        { label: "Careers", value: "careers@querypie.com", href: "mailto:careers@querypie.com" },
        { label: "PR", value: "pr@querypie.com", href: "mailto:pr@querypie.com" },
      ],
      formFields: [
        { label: "First Name", name: "firstName", placeholder: "名を入力してください", required: true },
        { label: "Last Name", name: "lastName", placeholder: "姓を入力してください", required: true },
        { label: "Business Email", name: "email", placeholder: "業務用メールアドレスを入力してください", required: true },
        { label: "Company Name", name: "company", placeholder: "会社名を入力してください", required: true },
      ],
      productFieldLabel: "ご興味のある製品",
      productOptions: [
        "Database Access Controller (DAC)",
        "System Access Controller (SAC)",
        "Kubernetes Access Controller (KAC)",
        "Web Access Controller (WAC)",
      ],
      messageField: {
        label: "ご質問・補足情報",
        name: "message",
        placeholder: "ご質問や共有したい詳細をご記入ください",
        required: true,
      },
      consentLabel: "QueryPie のニュース、イベント、製品情報を受け取る。",
      privacyText: "QueryPie はお客様のプライバシーを尊重します。詳しくは",
      privacyTermsLabel: "Terms",
      privacyTermsHref: "/ja/docs",
      privacyPolicyLabel: "Privacy Policy",
      privacyPolicyHref: "/ja/docs",
      submitLabel: "送信",
    },
  }[locale];

  return <ContactUsPage {...copy} />;
}
