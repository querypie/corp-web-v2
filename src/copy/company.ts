import type { Locale } from "@/constants/i18n";

export type AboutUsPageCopy = {
  companyDescription: string[];
  companyImageAlt: string;
  investors: Array<{ alt: string; imageSrc: string }>;
  investorsTitle: string;
  journeyDescription: string;
  journeyItems: Array<{ details: string[]; year: string }>;
  journeyTitle: string;
  locations: Array<{ addressLines: string[]; city: string; country: string; iconSrc: string }>;
  locationsTitle: string;
  mapImageSrc: string;
  teamDescription: string[];
  teamMembers: Array<{ imageSrc: string; linkedinHref: string; name: string; role: string }>;
  teamTitle: string;
  title: string[];
};

export type CertificationCopyItem = {
  description: readonly string[];
  imageAlt: string;
  imageClassName?: string;
  imageContainerClassName?: string;
  imageSrc: string;
  title: string;
};

export type CertificationsPageCopy = {
  intro: string;
  items: readonly CertificationCopyItem[];
  title: string;
};

export type CompanyNewsPageCopy = {
  metadataDescription: string;
  metadataTitle: string;
  title: string;
};

export function getAboutUsMetadataTitle(locale: Locale) {
  return {
    en: "About Us",
    ko: "회사 소개",
    ja: "会社概要",
  }[locale];
}

export function getAboutUsMetadataDescription(locale: Locale) {
  return {
    en: "Learn about QueryPie AI, the company building a smarter standard for secure enterprise AI transformation.",
    ko: "안전한 엔터프라이즈 AI 전환의 새로운 기준을 만들어가는 QueryPie AI를 소개합니다.",
    ja: "安全なエンタープライズ AI 変革の新しい基準をつくる QueryPie AI についてご紹介します。",
  }[locale];
}

export function getCertificationsMetadataTitle(locale: Locale) {
  return {
    en: "QueryPie AI Certifications",
    ko: "QueryPie AI 인증",
    ja: "QueryPie AI: 認証",
  }[locale];
}

export function getCertificationsMetadataDescription(locale: Locale) {
  return {
    en: "Review QueryPie AI security, privacy, cloud, and AI management certifications including SOC 2, ISO, ISMS-P, and CSA STAR.",
    ko: "SOC 2, ISO, ISMS-P, CSA STAR 등 QueryPie AI의 보안, 개인정보, 클라우드, AI 관리 인증을 확인하세요.",
    ja: "SOC 2、ISO、ISMS-P、CSA STAR など QueryPie AI のセキュリティ、プライバシー、クラウド、AI 管理認証をご確認ください。",
  }[locale];
}

export function getCertificationsPageCopy(locale: Locale): CertificationsPageCopy {
  return {
  en: {
    intro:
      "QueryPie AI has earned a range of top-tier international and local security certifications, ensuring you stay compliant and ahead of the curve. With these certifications, you can rest easy knowing your data is protected and you're meeting the strictest regulatory standards no worries, just confidence!",
    items: [
      {
        description: ["System and Organization", "Controls 2", "Type II"],
        imageAlt: "SOC 2 Type II",
        imageContainerClassName: "size-[90px]",
        imageSrc: "/assets/pages/company/certifications/soc2-type2.png",
        title: "SOC 2 Type II",
      },
      {
        description: ["Security, Trust, Assurance and", "Risk", "(Level 1 - Bronze)"],
        imageAlt: "CSA-STAR Level 1",
        imageContainerClassName: "size-[90px]",
        imageSrc: "/assets/pages/company/certifications/csa-star-level1.png",
        title: "CSA-STAR",
      },
      {
        description: ["Security, Trust, Assurance and", "Risk", "(Level 2 - Gold)"],
        imageAlt: "CSA-STAR Level 2",
        imageContainerClassName: "size-[90px]",
        imageSrc: "/assets/pages/company/certifications/csa-star-level2.png",
        title: "CSA-STAR",
      },
      {
        description: ["Payment Card Industry Data", "Security Standard"],
        imageAlt: "PCI DSS",
        imageContainerClassName: "h-12 w-40",
        imageSrc: "/assets/pages/company/certifications/pci-dss.png",
        title: "PCI DSS",
      },
      {
        description: ["Artificial Intelligence", "Management System"],
        imageAlt: "ISO/IEC 42001",
        imageContainerClassName: "h-[76px] w-[120px]",
        imageSrc: "/assets/pages/company/certifications/iso42001.png",
        title: "ISO/IEC 42001",
      },
      {
        description: ["Information Security", "Management Systems"],
        imageAlt: "ISO/IEC 27001",
        imageContainerClassName: "h-[76px] w-[120px]",
        imageSrc: "/assets/pages/company/certifications/iso27001.png",
        title: "ISO/IEC 27001",
      },
      {
        description: ["Privacy Information", "Management Systems"],
        imageAlt: "ISO 27701",
        imageContainerClassName: "h-[76px] w-[120px]",
        imageSrc: "/assets/pages/company/certifications/iso27701.png",
        title: "ISO 27701",
      },
      {
        description: ["Information Security controls", "within a Cloud environment"],
        imageAlt: "ISO 27017",
        imageContainerClassName: "h-[86px] w-20",
        imageSrc: "/assets/pages/company/certifications/iso27017.png",
        title: "ISO 27017",
      },
      {
        description: ["Privacy controls", "within a Cloud environment"],
        imageAlt: "ISO 27018",
        imageContainerClassName: "h-[86px] w-20",
        imageSrc: "/assets/pages/company/certifications/iso27018.png",
        title: "ISO 27018",
      },
      {
        description: ["Personal Information & Information", "Security Management System"],
        imageAlt: "ISMS-P",
        imageContainerClassName: "h-[83px] w-[120px]",
        imageSrc: "/assets/pages/company/certifications/isms-p.png",
        title: "ISMS-P",
      },
      {
        description: ["Good Software", "Level 1"],
        imageAlt: "GOOD Software",
        imageContainerClassName: "h-[60px] w-[120px]",
        imageSrc: "/assets/pages/company/certifications/good-software.png",
        title: "GOOD Software",
      },
      {
        description: ["Korea Security Evaluation Lab.", "Security Functionality", "Certificate"],
        imageAlt: "KSEL",
        imageContainerClassName: "size-[90px] rounded-full",
        imageSrc: "/assets/pages/company/certifications/ksel.png",
        title: "KSEL",
      },
    ],
    title: "Certifications",
  },
  ko: {
    intro:
      "QueryPie AI는 국내외 최고 수준의 보안 인증을 폭넓게 확보해, 고객이 더욱 안정적으로 컴플라이언스를 충족하고 앞서 나갈 수 있도록 지원합니다. 엄격한 기준을 충족하는 인증 체계를 바탕으로 데이터 보호와 운영 신뢰성을 함께 제공합니다.",
    items: [
      {
        description: ["시스템 및 조직", "통제 2", "유형 II"],
        imageAlt: "SOC 2 Type II",
        imageContainerClassName: "size-[90px]",
        imageSrc: "/assets/pages/company/certifications/soc2-type2.png",
        title: "SOC 2 Type II",
      },
      {
        description: ["보안, 신뢰, 보증 및", "위험", "(레벨 1 - 브론즈)"],
        imageAlt: "CSA-STAR Level 1",
        imageContainerClassName: "size-[90px]",
        imageSrc: "/assets/pages/company/certifications/csa-star-level1.png",
        title: "CSA-STAR",
      },
      {
        description: ["보안, 신뢰, 보증 및", "위험", "(레벨 2 - 골드)"],
        imageAlt: "CSA-STAR Level 2",
        imageContainerClassName: "size-[90px]",
        imageSrc: "/assets/pages/company/certifications/csa-star-level2.png",
        title: "CSA-STAR",
      },
      {
        description: ["지급 카드 산업", "데이터 보안 표준"],
        imageAlt: "PCI DSS",
        imageContainerClassName: "h-12 w-40",
        imageSrc: "/assets/pages/company/certifications/pci-dss.png",
        title: "PCI DSS",
      },
      {
        description: ["인공지능", "경영 시스템"],
        imageAlt: "ISO/IEC 42001",
        imageContainerClassName: "h-[76px] w-[120px]",
        imageSrc: "/assets/pages/company/certifications/iso42001.png",
        title: "ISO/IEC 42001",
      },
      {
        description: ["정보 보안", "관리 체계"],
        imageAlt: "ISO/IEC 27001",
        imageContainerClassName: "h-[76px] w-[120px]",
        imageSrc: "/assets/pages/company/certifications/iso27001.png",
        title: "ISO/IEC 27001",
      },
      {
        description: ["개인정보", "관리 체계"],
        imageAlt: "ISO 27701",
        imageContainerClassName: "h-[76px] w-[120px]",
        imageSrc: "/assets/pages/company/certifications/iso27701.png",
        title: "ISO 27701",
      },
      {
        description: ["클라우드 환경 내", "정보 보안 통제"],
        imageAlt: "ISO 27017",
        imageContainerClassName: "h-[86px] w-20",
        imageSrc: "/assets/pages/company/certifications/iso27017.png",
        title: "ISO 27017",
      },
      {
        description: ["클라우드 환경 내", "개인정보 보호 통제"],
        imageAlt: "ISO 27018",
        imageContainerClassName: "h-[86px] w-20",
        imageSrc: "/assets/pages/company/certifications/iso27018.png",
        title: "ISO 27018",
      },
      {
        description: ["개인정보 및 정보보호", "관리 체계"],
        imageAlt: "ISMS-P",
        imageContainerClassName: "h-[83px] w-[120px]",
        imageSrc: "/assets/pages/company/certifications/isms-p.png",
        title: "ISMS-P",
      },
      {
        description: ["굿소프트웨어", "레벨 1"],
        imageAlt: "GOOD Software",
        imageContainerClassName: "h-[60px] w-[120px]",
        imageSrc: "/assets/pages/company/certifications/good-software.png",
        title: "GOOD Software",
      },
      {
        description: ["한국시큐리티평가연구소", "보안 기능", "인증"],
        imageAlt: "KSEL",
        imageContainerClassName: "size-[90px] rounded-full",
        imageSrc: "/assets/pages/company/certifications/ksel.png",
        title: "KSEL",
      },
    ],
    title: "인증서",
  },
  ja: {
    intro:
      "QueryPie AI は、国際基準および国内基準の主要なセキュリティ認証を幅広く取得しており、より安心してコンプライアンス対応を進められる環境を提供します。厳格な認証基準に基づき、データ保護と運用信頼性の両立を支えます。",
    items: [
      {
        description: ["システムおよび組織", "統制 2", "タイプ II"],
        imageAlt: "SOC 2 Type II",
        imageContainerClassName: "size-[90px]",
        imageSrc: "/assets/pages/company/certifications/soc2-type2.png",
        title: "SOC 2 Type II",
      },
      {
        description: ["セキュリティ、信頼、保証と", "リスク", "(レベル 1 - ブロンズ)"],
        imageAlt: "CSA-STAR Level 1",
        imageContainerClassName: "size-[90px]",
        imageSrc: "/assets/pages/company/certifications/csa-star-level1.png",
        title: "CSA-STAR",
      },
      {
        description: ["セキュリティ、信頼、保証と", "リスク", "(レベル 2 - ゴールド)"],
        imageAlt: "CSA-STAR Level 2",
        imageContainerClassName: "size-[90px]",
        imageSrc: "/assets/pages/company/certifications/csa-star-level2.png",
        title: "CSA-STAR",
      },
      {
        description: ["ペイメントカード業界", "データセキュリティ基準"],
        imageAlt: "PCI DSS",
        imageContainerClassName: "h-12 w-40",
        imageSrc: "/assets/pages/company/certifications/pci-dss.png",
        title: "PCI DSS",
      },
      {
        description: ["人工知能", "マネジメントシステム"],
        imageAlt: "ISO/IEC 42001",
        imageContainerClassName: "h-[76px] w-[120px]",
        imageSrc: "/assets/pages/company/certifications/iso42001.png",
        title: "ISO/IEC 42001",
      },
      {
        description: ["情報セキュリティ", "マネジメントシステム"],
        imageAlt: "ISO/IEC 27001",
        imageContainerClassName: "h-[76px] w-[120px]",
        imageSrc: "/assets/pages/company/certifications/iso27001.png",
        title: "ISO/IEC 27001",
      },
      {
        description: ["プライバシー情報", "マネジメントシステム"],
        imageAlt: "ISO 27701",
        imageContainerClassName: "h-[76px] w-[120px]",
        imageSrc: "/assets/pages/company/certifications/iso27701.png",
        title: "ISO 27701",
      },
      {
        description: ["クラウド環境における", "情報セキュリティ統制"],
        imageAlt: "ISO 27017",
        imageContainerClassName: "h-[86px] w-20",
        imageSrc: "/assets/pages/company/certifications/iso27017.png",
        title: "ISO 27017",
      },
      {
        description: ["クラウド環境における", "プライバシー保護統制"],
        imageAlt: "ISO 27018",
        imageContainerClassName: "h-[86px] w-20",
        imageSrc: "/assets/pages/company/certifications/iso27018.png",
        title: "ISO 27018",
      },
      {
        description: ["個人情報および情報", "セキュリティマネジメントシステム"],
        imageAlt: "ISMS-P",
        imageContainerClassName: "h-[83px] w-[120px]",
        imageSrc: "/assets/pages/company/certifications/isms-p.png",
        title: "ISMS-P",
      },
      {
        description: ["GOOD Software", "レベル 1"],
        imageAlt: "GOOD Software",
        imageContainerClassName: "h-[60px] w-[120px]",
        imageSrc: "/assets/pages/company/certifications/good-software.png",
        title: "GOOD Software",
      },
      {
        description: ["韓国セキュリティ評価研究所", "セキュリティ機能", "認証"],
        imageAlt: "KSEL",
        imageContainerClassName: "size-[90px] rounded-full",
        imageSrc: "/assets/pages/company/certifications/ksel.png",
        title: "KSEL",
      },
    ],
    title: "認証",
  },
  }[locale];
}

export function getNewsPageCopy(locale: Locale): CompanyNewsPageCopy {
  return {
    en: {
      metadataDescription:
        "Read the latest QueryPie AI news, product announcements, company updates, and enterprise AI insights.",
      metadataTitle: "QueryPie News",
      title: "News",
    },
    ko: {
      metadataDescription:
        "QueryPie AI의 최신 뉴스, 제품 발표, 회사 소식과 엔터프라이즈 AI 인사이트를 확인하세요.",
      metadataTitle: "QueryPie 뉴스",
      title: "뉴스",
    },
    ja: {
      metadataDescription:
        "QueryPie AI の最新ニュース、製品発表、会社情報、エンタープライズ AI のインサイトをご覧ください。",
      metadataTitle: "QueryPie: ニュース",
      title: "News",
    },
  }[locale];
}

export function getAboutUsPageCopy(locale: Locale): AboutUsPageCopy {
  return {
    en: {
      companyDescription: [
        "Excessive costs, security threats, and complex infrastructure have caused companies to hesitate in AI innovation.",
        "QueryPie AI provides a powerful, security-free AI environment through centralized management and custom agent deployment, while reducing costs by up to 90% with usage-based pricing.",
        "You can now execute cutting-edge AI strategies without a Fortune 500-level budget and realize all innovations at previously impossible costs.",
        "Starting in Silicon Valley in 2017 as a data protection specialist, QueryPie AI sets a new standard for enterprise AI.",
      ],
      companyImageAlt: "Company introduction",
      investors: [
        { alt: "Salesforce Ventures", imageSrc: "/assets/pages/company/about-us/logo-salesforce.svg" },
        { alt: "Y Combinator", imageSrc: "/assets/pages/company/about-us/logo-ycombinator.svg" },
        { alt: "Z Venture Capital", imageSrc: "/assets/pages/company/about-us/logo-zventurecapital.svg" },
      ],
      investorsTitle: "Our Investors",
      journeyDescription:
        "As AI emerged as a core next-generation technology and companies faced the dual barriers of massive costs and complex implementation, we evolved to build AI transformation expertise while remaining easily accessible to everyone.",
      journeyItems: [
        { details: ["Founded"], year: "2016" },
        { details: ["Funding from Kakao Investment", "Development started QueryPie SQL Client"], year: "2018" },
        { details: ["Launched QueryPie SQL Client", "Participated in TechCrunch SF 2019", "Won LG Startup Competition 2019"], year: "2019" },
        { details: ["Funding from Y-Combinator", "Pivoted to Data Protection Platform", "Delivered QueryPie to Yanolja, KakaoPay, Dunamu"], year: "2020" },
        { details: ["Fundraised $17.75M in Preferred Seed Round"], year: "2021" },
        { details: ["Secured $5.81M funding by Korea Credit Guarantee Fund"], year: "2023" },
        {
          details: [
            "Launched QueryPie Japan (Tokyo, Japan)",
            "Strategic Investment from Salesforce Ventures, Z Venture Capital, Murex Partners and Shinhan Venture Investment",
          ],
          year: "2024",
        },
      ],
      journeyTitle: "Our Journey",
      locations: [
        {
          addressLines: ["2525 West 8th Street, Suite 300, Los Angeles, CA 90057"],
          city: "Los Angeles, CA",
          country: "Los Angeles, USA",
          iconSrc: "/assets/pages/company/about-us/icon-us.svg",
        },
        {
          addressLines: ["7F, 26, Magokjungang 1-ro, Gangseo-gu, Seoul, Republic of Korea"],
          city: "Seoul, South Korea",
          country: "Seoul Magok Office",
          iconSrc: "/assets/pages/company/about-us/icon-kr.svg",
        },
        {
          addressLines: ["15F, Toranomon Hills Business Tower", "1 Chome-17-1 Toranomon, Minato City, Tokyo 105-6490"],
          city: "Tokyo, Japan",
          country: "Tokyo, Japan",
          iconSrc: "/assets/pages/company/about-us/icon-ja.svg",
        },
        {
          addressLines: ["Office Park Harapan Indah OP 2 No 20,", "Medan Satria, Bekasi, West Java 17132"],
          city: "Indonesia",
          country: "Office Park Harapan Indah",
          iconSrc: "/assets/pages/company/about-us/icon-id.svg",
        },
      ],
      locationsTitle: "Our Locations",
      mapImageSrc: "/assets/pages/company/about-us/world-location.svg",
      teamDescription: [
        "Our leaders master AI transformation with a rebel twist refusing to accept that enterprise AI must be complex or costly.",
        "They make AI work in the real world, not just Silicon Valley labs.",
      ],
      teamMembers: [
        { imageSrc: "/assets/pages/company/about-us/brant.webp", linkedinHref: "https://www.linkedin.com/in/ishwang/", name: "Brant Hwang", role: "Founder & CEO" },
        { imageSrc: "/assets/pages/company/about-us/paul.webp", linkedinHref: "https://www.linkedin.com/in/paul-hong-bb0983216/", name: "Paul Hong", role: "Co-Founder & CFO" },
        { imageSrc: "/assets/pages/company/about-us/sam.webp", linkedinHref: "https://www.linkedin.com/in/sam0-kim/", name: "Sam Kim", role: "CTO" },
        { imageSrc: "/assets/pages/company/about-us/jake.webp", linkedinHref: "https://www.linkedin.com/in/binlim/", name: "Jake Im", role: "CISO & CPO" },
        { imageSrc: "/assets/pages/company/about-us/kris.webp", linkedinHref: "https://www.linkedin.com/in/kris-park-89a83b19/", name: "Kris Park", role: "CSO" },
        { imageSrc: "/assets/pages/company/about-us/keizo.webp", linkedinHref: "https://www.linkedin.com/in/keizo-arinobu-b40769/", name: "Keizo Arinobu", role: "CGO & Japan Country Manager" },
      ],
      teamTitle: "Our Team",
      title: ["The Smart Standard", "for Enterprise AI"],
    },
    ko: {
      companyDescription: [
        "과도한 비용, 보안 위협, 복잡한 인프라는 기업이 AI 혁신 앞에서 주저하게 만든 핵심 이유였습니다.",
        "QueryPie AI는 중앙화된 관리와 커스텀 에이전트 배포를 통해 보안 걱정 없는 강력한 AI 환경을 제공하는 동시에, 사용량 기반 과금으로 비용을 최대 90%까지 절감합니다.",
        "이제 포춘 500 수준의 예산 없이도 최첨단 AI 전략을 실행하고, 이전에는 불가능했던 비용 구조로 모든 혁신을 현실화할 수 있습니다.",
        "2017년 실리콘밸리에서 데이터 보호 전문 기업으로 출발한 QueryPie AI는 엔터프라이즈 AI의 새로운 기준을 만들어가고 있습니다.",
      ],
      companyImageAlt: "회사 소개",
      investors: [
        { alt: "Salesforce Ventures", imageSrc: "/assets/pages/company/about-us/logo-salesforce.svg" },
        { alt: "Y Combinator", imageSrc: "/assets/pages/company/about-us/logo-ycombinator.svg" },
        { alt: "Z Venture Capital", imageSrc: "/assets/pages/company/about-us/logo-zventurecapital.svg" },
      ],
      investorsTitle: "주요 투자사",
      journeyDescription:
        "AI가 차세대 핵심 기술로 떠오르고, 기업이 막대한 비용과 복잡한 도입 장벽에 직면하던 시점부터 QueryPie는 누구나 접근 가능한 AI 전환 역량을 만드는 방향으로 진화해왔습니다.",
      journeyItems: [
        { details: ["법인 설립"], year: "2016" },
        { details: ["카카오인베스트먼트 투자 유치", "QueryPie SQL Client 개발 시작"], year: "2018" },
        { details: ["QueryPie SQL Client 출시", "TechCrunch SF 2019 참가", "LG Startup Competition 2019 수상"], year: "2019" },
        { details: ["Y-Combinator 투자 유치", "Data Protection Platform으로 피벗", "야놀자, 카카오페이, 두나무 등에 QueryPie 공급"], year: "2020" },
        { details: ["Preferred Seed Round로 1,775만 달러 투자 유치"], year: "2021" },
        { details: ["신용보증기금으로부터 581만 달러 확보"], year: "2023" },
        { details: ["QueryPie Japan 출범", "Salesforce Ventures, Z Venture Capital 등 전략적 투자 유치"], year: "2024" },
      ],
      journeyTitle: "연혁",
      locations: [
        {
          addressLines: ["2525 West 8th Street, Suite 300, Los Angeles, CA 90057"],
          city: "Los Angeles, CA",
          country: "Los Angeles, USA",
          iconSrc: "/assets/pages/company/about-us/icon-us.svg",
        },
        {
          addressLines: ["7F, 26, Magokjungang 1-ro, Gangseo-gu, Seoul, Republic of Korea"],
          city: "Seoul, South Korea",
          country: "Seoul Magok Office",
          iconSrc: "/assets/pages/company/about-us/icon-kr.svg",
        },
        {
          addressLines: ["15F, Toranomon Hills Business Tower", "1 Chome-17-1 Toranomon, Minato City, Tokyo 105-6490"],
          city: "Tokyo, Japan",
          country: "Tokyo, Japan",
          iconSrc: "/assets/pages/company/about-us/icon-ja.svg",
        },
        {
          addressLines: ["Office Park Harapan Indah OP 2 No 20,", "Medan Satria, Bekasi, West Java 17132"],
          city: "Indonesia",
          country: "Office Park Harapan Indah",
          iconSrc: "/assets/pages/company/about-us/icon-id.svg",
        },
      ],
      locationsTitle: "거점",
      mapImageSrc: "/assets/pages/company/about-us/world-location.svg",
      teamDescription: [
        "우리의 리더들은 엔터프라이즈 AI가 복잡하고 비싸야 한다는 통념을 거부합니다.",
        "실제 운영 환경에서 AI를 작동하게 만드는 팀입니다.",
      ],
      teamMembers: [
        { imageSrc: "/assets/pages/company/about-us/brant.webp", linkedinHref: "https://www.linkedin.com/in/ishwang/", name: "Brant Hwang", role: "Founder & CEO" },
        { imageSrc: "/assets/pages/company/about-us/paul.webp", linkedinHref: "https://www.linkedin.com/in/paul-hong-bb0983216/", name: "Paul Hong", role: "Co-Founder & CFO" },
        { imageSrc: "/assets/pages/company/about-us/sam.webp", linkedinHref: "https://www.linkedin.com/in/sam0-kim/", name: "Sam Kim", role: "CTO" },
        { imageSrc: "/assets/pages/company/about-us/jake.webp", linkedinHref: "https://www.linkedin.com/in/binlim/", name: "Jake Im", role: "CISO & CPO" },
        { imageSrc: "/assets/pages/company/about-us/kris.webp", linkedinHref: "https://www.linkedin.com/in/kris-park-89a83b19/", name: "Kris Park", role: "CSO" },
        { imageSrc: "/assets/pages/company/about-us/keizo.webp", linkedinHref: "https://www.linkedin.com/in/keizo-arinobu-b40769/", name: "Keizo Arinobu", role: "CGO & Japan Country Manager" },
      ],
      teamTitle: "팀",
      title: ["엔터프라이즈 AI를 위한", "새로운 기준"],
    },
    ja: {
      companyDescription: [
        "過度なコスト、セキュリティ脅威、複雑なインフラは、企業がAIイノベーションに踏み出せない大きな要因でした。",
        "QueryPie AI は、集中管理とカスタムエージェントの展開を通じて、セキュリティ不安のない強力なAI環境を提供しながら、従量課金モデルでコストを最大90%削減します。",
        "Fortune 500 レベルの予算がなくても最先端のAI戦略を実行でき、これまで不可能だったコスト構造であらゆるイノベーションを実現できます。",
        "2017年にシリコンバレーでデータ保護の専門企業としてスタートした QueryPie AI は、エンタープライズAIの新しい基準を築いています。",
      ],
      companyImageAlt: "会社紹介",
      investors: [
        { alt: "Salesforce Ventures", imageSrc: "/assets/pages/company/about-us/logo-salesforce.svg" },
        { alt: "Y Combinator", imageSrc: "/assets/pages/company/about-us/logo-ycombinator.svg" },
        { alt: "Z Venture Capital", imageSrc: "/assets/pages/company/about-us/logo-zventurecapital.svg" },
      ],
      investorsTitle: "主要投資家",
      journeyDescription:
        "AI が次世代の中核技術として浮上し、企業が高コストと複雑な導入に直面する中、QueryPie は誰もが扱える AI 変革基盤へと進化してきました。",
      journeyItems: [
        { details: ["会社設立"], year: "2016" },
        { details: ["Kakao Investment より資金調達", "QueryPie SQL Client の開発開始"], year: "2018" },
        { details: ["QueryPie SQL Client をリリース", "TechCrunch SF 2019 に参加", "LG Startup Competition 2019 を受賞"], year: "2019" },
        { details: ["Y-Combinator より資金調達", "Data Protection Platform へピボット", "Yanolja、KakaoPay、Dunamu に QueryPie を提供"], year: "2020" },
        { details: ["Preferred Seed Round で 1,775 万ドルを調達"], year: "2021" },
        { details: ["韓国信用保証基金から 581 万ドルを確保"], year: "2023" },
        {
          details: ["QueryPie Japan を設立（東京）", "Salesforce Ventures、Z Venture Capital、Murex Partners、Shinhan Venture Investment から戦略的投資を獲得"],
          year: "2024",
        },
      ],
      journeyTitle: "歩み",
      locations: [
        {
          addressLines: ["2525 West 8th Street, Suite 300, Los Angeles, CA 90057"],
          city: "Los Angeles, CA",
          country: "Los Angeles, USA",
          iconSrc: "/assets/pages/company/about-us/icon-us.svg",
        },
        {
          addressLines: ["7F, 26, Magokjungang 1-ro, Gangseo-gu, Seoul, Republic of Korea"],
          city: "Seoul, South Korea",
          country: "Seoul Magok Office",
          iconSrc: "/assets/pages/company/about-us/icon-kr.svg",
        },
        {
          addressLines: ["15F, Toranomon Hills Business Tower", "1 Chome-17-1 Toranomon, Minato City, Tokyo 105-6490"],
          city: "Tokyo, Japan",
          country: "Tokyo, Japan",
          iconSrc: "/assets/pages/company/about-us/icon-ja.svg",
        },
        {
          addressLines: ["Office Park Harapan Indah OP 2 No 20,", "Medan Satria, Bekasi, West Java 17132"],
          city: "Indonesia",
          country: "Office Park Harapan Indah",
          iconSrc: "/assets/pages/company/about-us/icon-id.svg",
        },
      ],
      locationsTitle: "拠点",
      mapImageSrc: "/assets/pages/company/about-us/world-location.svg",
      teamDescription: [
        "私たちのリーダーは、エンタープライズ AI は複雑で高価であるべきだという前提を受け入れません。",
        "実際の現場で AI を動かすことに集中しています。",
      ],
      teamMembers: [
        { imageSrc: "/assets/pages/company/about-us/brant.webp", linkedinHref: "https://www.linkedin.com/in/ishwang/", name: "Brant Hwang", role: "Founder & CEO" },
        { imageSrc: "/assets/pages/company/about-us/paul.webp", linkedinHref: "https://www.linkedin.com/in/paul-hong-bb0983216/", name: "Paul Hong", role: "Co-Founder & CFO" },
        { imageSrc: "/assets/pages/company/about-us/sam.webp", linkedinHref: "https://www.linkedin.com/in/sam0-kim/", name: "Sam Kim", role: "CTO" },
        { imageSrc: "/assets/pages/company/about-us/jake.webp", linkedinHref: "https://www.linkedin.com/in/binlim/", name: "Jake Im", role: "CISO & CPO" },
        { imageSrc: "/assets/pages/company/about-us/kris.webp", linkedinHref: "https://www.linkedin.com/in/kris-park-89a83b19/", name: "Kris Park", role: "CSO" },
        { imageSrc: "/assets/pages/company/about-us/keizo.webp", linkedinHref: "https://www.linkedin.com/in/keizo-arinobu-b40769/", name: "Keizo Arinobu", role: "CGO & Japan Country Manager" },
      ],
      teamTitle: "チーム",
      title: ["エンタープライズAIのための", "新しい基準"],
    },
  }[locale];
}
