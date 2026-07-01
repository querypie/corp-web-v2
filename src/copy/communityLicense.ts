import { getLocalePath, type Locale } from "@/constants/i18n";

export type CommunityLicenseApplyLink = {
  href: string;
  label: string;
  value: string;
};

export type CommunityLicenseApplySupportLink = {
  href: string;
  label: string;
  title: string;
};

export type CommunityLicenseField = {
  label: string;
  name: string;
  placeholder?: string;
  required?: boolean;
  type: "text" | "email" | "url";
};

export type CommunityLicensePageCopy = {
  metadataTitle: string;
  titleLines: string[];
  description: string;
  fields: CommunityLicenseField[];
  marketingLabel: string;
  submitLabel: string;
  successTitle: string;
  successDescription: string;
  successButton: string;
  homeHref: string;
  errorGeneral: string;
};

export type CommunityLicenseApplyPageCopy = {
  metadataTitle: string;
  titleLines: string[];
  formDescription: string;
  contactHighlights: string[];
  emailLinks: CommunityLicenseApplyLink[];
  supportLink: CommunityLicenseApplySupportLink;
  fields: CommunityLicenseField[];
  marketingLabel: string;
  privacyText: string;
  privacyTermsHref: string;
  privacyTermsLabel: string;
  privacyPolicyHref: string;
  privacyPolicyLabel: string;
  submitLabel: string;
  successTitle: string;
  successDescription: string;
  successButton: string;
  homeHref: string;
  errorGeneral: string;
};

export function getCommunityLicensePageCopy(locale: Locale): CommunityLicensePageCopy {
  const copies = {
    en: {
      metadataTitle: "License Request Form",
      titleLines: ["License Request Form"],
      description:
        "Request your license. Unlock your potential.\nFast, easy licensing tailored for your business\u2014get started in just a few clicks.\nRequest now!",
      fields: [
        {
          label: "First Name",
          name: "FirstName",
          placeholder: "Enter your given name",
          required: true,
          type: "text",
        },
        {
          label: "Last Name",
          name: "LastName",
          placeholder: "Enter your family name",
          required: true,
          type: "text",
        },
        {
          label: "Email",
          name: "Email",
          placeholder: "Enter your email",
          required: true,
          type: "email",
        },
        {
          label: "Organization Name",
          name: "Company",
          placeholder: "Enter your organization\u2019s name",
          required: true,
          type: "text",
        },
        {
          label: "Job Title",
          name: "Title",
          placeholder: "Enter your job title",
          type: "text",
        },
        {
          label: "Organization Website",
          name: "Website",
          placeholder: "Enter your organization\u2019s website",
          type: "url",
        },
      ],
      marketingLabel: "Keep me updated on QueryPie news, events, & product info.",
      submitLabel: "Proceed",
      successTitle: "Submission Complete",
      successDescription:
        "Thank you for your interest in QueryPie!\nYour application has been successfully submitted.\nThe instructions and software license will be delivered directly to your email shortly.",
      successButton: "Go to Home",
      homeHref: getLocalePath("en", "/"),
      errorGeneral: "An error occurred. Please try again.",
    },
    ko: {
      metadataTitle: "라이선스 발급 신청",
      titleLines: ["라이선스 발급 신청"],
      description:
        "라이선스를 신청하고 비즈니스 잠재력을 키워보세요!\n신청 후 입력하신 이메일로 1년 라이선스가 발급됩니다.",
      fields: [
        {
          label: "성",
          name: "LastName",
          placeholder: "성을 입력해주세요.",
          required: true,
          type: "text",
        },
        {
          label: "이름",
          name: "FirstName",
          placeholder: "이름을 입력해주세요.",
          required: true,
          type: "text",
        },
        {
          label: "이메일",
          name: "Email",
          placeholder: "이메일을 입력해주세요.",
          required: true,
          type: "email",
        },
        {
          label: "소속 기관명",
          name: "Company",
          placeholder: "소속 기관명을 입력해주세요.",
          required: true,
          type: "text",
        },
        {
          label: "직책",
          name: "Title",
          placeholder: "직책을 입력하세요",
          type: "text",
        },
        {
          label: "소속 기관 웹사이트",
          name: "Website",
          placeholder: "소속 기관 웹사이트 주소를 입력하세요",
          type: "url",
        },
      ],
      marketingLabel: "QueryPie의 최신 소식을 이메일로 받아보시겠어요?",
      submitLabel: "Proceed",
      successTitle: "신청이 완료되었습니다.",
      successDescription:
        "QueryPie에 관심을 가져주셔서 감사합니다!\n설치 안내 및 소프트웨어 라이선스는 곧 등록하신 이메일로 발송될 예정입니다.",
      successButton: "Go to Home",
      homeHref: getLocalePath("ko", "/"),
      errorGeneral: "오류가 발생했습니다. 다시 시도해주세요.",
    },
    ja: {
      metadataTitle: "ライセンス発行の申請",
      titleLines: ["ライセンス発行の申請"],
      description:
        "ライセンスを申請して、ビジネスの可能性を広げましょう！\n申請後、ご入力いただいたメールアドレス宛に1年間有効なライセンスをお送りします。",
      fields: [
        {
          label: "姓",
          name: "LastName",
          placeholder: "例: 山田",
          required: true,
          type: "text",
        },
        {
          label: "名",
          name: "FirstName",
          placeholder: "例: 太郎",
          required: true,
          type: "text",
        },
        {
          label: "メールアドレス",
          name: "Email",
          placeholder: "メールアドレスを入力してください。",
          required: true,
          type: "email",
        },
        {
          label: "所属機関名",
          name: "Company",
          placeholder: "所属機関名を入力してください。",
          required: true,
          type: "text",
        },
        {
          label: "役職名",
          name: "Title",
          placeholder: "役職名を入力してください",
          type: "text",
        },
        {
          label: "所属機関ウェブサイトのURL",
          name: "Website",
          placeholder: "所属機関ウェブサイトのURLを入力してください",
          type: "url",
        },
      ],
      marketingLabel:
        "QueryPie AIのニュース、イベント、および製品情報に関する最新情報を受け取る。",
      submitLabel: "申請する",
      successTitle: "お申し込みが完了しました。",
      successDescription:
        "QueryPie にご関心をお寄せいただき、誠にありがとうございます。\nお申し込みは正常に完了しました。\nインストール手順およびソフトウェアライセンスは、まもなくご登録のメールアドレス宛にお送りいたします。",
      successButton: "ホームに戻る",
      homeHref: getLocalePath("ja", "/"),
      errorGeneral: "エラーが発生しました。もう一度お試しください。",
    },
  } satisfies Record<Locale, CommunityLicensePageCopy>;
  return copies[locale];
}

export function getCommunityLicenseApplyPageCopy(locale: Locale = "ko"): CommunityLicenseApplyPageCopy {
  const baseCopy = getCommunityLicensePageCopy(locale);
  const commonEmailLinks = [
    { label: "Sales", value: "sales@querypie.com", href: "mailto:sales@querypie.com" },
    { label: "Support", value: "support@querypie.com", href: "mailto:support@querypie.com" },
  ];

  const copies = {
    en: {
      metadataTitle: "QueryPie Community License Request",
      titleLines: ["Request your Community License."],
      formDescription:
        "Request a license for QueryPie ACP Community Edition. After we receive your application, installation guidance and the software license will be sent to your email.",
      contactHighlights: [
        "Receive Community License issuance guidance at the email address you provide.",
        "Application details are used only for license issuance and follow-up communication.",
        "Technical questions can continue in QueryPie Community GitHub Discussions.",
      ],
      emailLinks: commonEmailLinks,
      supportLink: {
        title: "QueryPie ACP Community Online Technical Support",
        label: "GitHub Discussions",
        href: "https://github.com/querypie/querypie-community/discussions",
      },
      fields: baseCopy.fields,
      marketingLabel: baseCopy.marketingLabel,
      privacyText: "QueryPie values your privacy. Please check our",
      privacyTermsLabel: "Terms of Service",
      privacyTermsHref: getLocalePath("en", "/terms-of-service"),
      privacyPolicyLabel: "Privacy Policy",
      privacyPolicyHref: getLocalePath("en", "/privacy-policy"),
      submitLabel: "Submit request",
      successTitle: baseCopy.successTitle,
      successDescription: baseCopy.successDescription,
      successButton: baseCopy.successButton,
      homeHref: baseCopy.homeHref,
      errorGeneral: baseCopy.errorGeneral,
    },
    ko: {
      metadataTitle: "QueryPie Community License 신청",
      titleLines: ["Community License를 신청하세요."],
      formDescription:
        "QueryPie ACP Community Edition을 사용하기 위한 라이선스를 신청해 주세요. 신청 내용을 확인한 뒤 설치 안내와 소프트웨어 라이선스를 이메일로 전달합니다.",
      contactHighlights: [
        "입력한 이메일 주소로 Community License 발급 안내를 받을 수 있습니다.",
        "신청 정보는 라이선스 발급 및 후속 안내 용도로만 사용됩니다.",
        "기술 문의는 QueryPie Community GitHub Discussions에서 이어갈 수 있습니다.",
      ],
      emailLinks: commonEmailLinks,
      supportLink: {
        title: "QueryPie ACP Community 온라인 기술 지원",
        label: "GitHub Discussions",
        href: "https://github.com/querypie/querypie-community/discussions",
      },
      fields: baseCopy.fields,
      marketingLabel: "QueryPie의 최신 소식, 이벤트, 제품 정보를 이메일로 받아보겠습니다.",
      privacyText: "QueryPie는 개인정보를 소중히 다룹니다.",
      privacyTermsLabel: "이용약관",
      privacyTermsHref: getLocalePath("ko", "/terms-of-service"),
      privacyPolicyLabel: "개인정보 처리방침",
      privacyPolicyHref: getLocalePath("ko", "/privacy-policy"),
      submitLabel: "신청하기",
      successTitle: baseCopy.successTitle,
      successDescription: baseCopy.successDescription,
      successButton: "홈으로 이동",
      homeHref: baseCopy.homeHref,
      errorGeneral: baseCopy.errorGeneral,
    },
    ja: {
      metadataTitle: "QueryPie Community License 申請",
      titleLines: ["Community Licenseを申請する。"],
      formDescription:
        "QueryPie ACP Community Edition を利用するためのライセンスを申請してください。申請内容を確認後、インストール手順とソフトウェアライセンスをメールでお送りします。",
      contactHighlights: [
        "入力したメールアドレス宛に Community License の発行案内を受け取れます。",
        "申請情報はライセンス発行およびフォローアップの目的でのみ使用されます。",
        "技術的な質問は QueryPie Community GitHub Discussions で続けられます。",
      ],
      emailLinks: commonEmailLinks,
      supportLink: {
        title: "QueryPie ACP Community オンライン技術サポート",
        label: "GitHub Discussions",
        href: "https://github.com/querypie/querypie-community/discussions",
      },
      fields: baseCopy.fields,
      marketingLabel: baseCopy.marketingLabel,
      privacyText: "QueryPie はプライバシーを大切にしています。",
      privacyTermsLabel: "利用規約",
      privacyTermsHref: getLocalePath("ja", "/terms-of-service"),
      privacyPolicyLabel: "プライバシーポリシー",
      privacyPolicyHref: getLocalePath("ja", "/privacy-policy"),
      submitLabel: baseCopy.submitLabel,
      successTitle: baseCopy.successTitle,
      successDescription: baseCopy.successDescription,
      successButton: baseCopy.successButton,
      homeHref: baseCopy.homeHref,
      errorGeneral: baseCopy.errorGeneral,
    },
  } satisfies Record<Locale, CommunityLicenseApplyPageCopy>;

  return copies[locale];
}
