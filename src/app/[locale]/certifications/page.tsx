import { notFound } from "next/navigation";
import CertificationsPage from "../../../components/pages/company/CertificationsPage";
import { isLocale } from "../../../constants/i18n";

type CertificationsRouteProps = {
  params: Promise<{ locale: string }>;
};

const certificationsCopy = {
  en: {
    intro:
      "QueryPie AI has earned a range of top-tier international and local security certifications, ensuring you stay compliant and ahead of the curve. With these certifications, you can rest easy knowing your data is protected and you're meeting the strictest regulatory standards no worries, just confidence!",
    items: [
      {
        description: ["System and Organization", "Controls 2", "Type II"],
        imageAlt: "SOC 2 Type II",
        imageContainerClassName: "size-[90px]",
        imageSrc: "/images/certifications/soc2-type2.png",
        title: "SOC 2 Type II",
      },
      {
        description: ["Security, Trust, Assurance and", "Risk", "(Level 1 - Bronze)"],
        imageAlt: "CSA-STAR Level 1",
        imageContainerClassName: "size-[90px]",
        imageSrc: "/images/certifications/csa-star-level1.png",
        title: "CSA-STAR",
      },
      {
        description: ["Security, Trust, Assurance and", "Risk", "(Level 2 - Gold)"],
        imageAlt: "CSA-STAR Level 2",
        imageContainerClassName: "size-[90px]",
        imageSrc: "/images/certifications/csa-star-level2.png",
        title: "CSA-STAR",
      },
      {
        description: ["Payment Card Industry Data", "Security Standard"],
        imageAlt: "PCI DSS",
        imageContainerClassName: "h-12 w-40",
        imageSrc: "/images/certifications/pci-dss.png",
        title: "PCI DSS",
      },
      {
        description: ["Information Security", "Management Systems"],
        imageAlt: "ISO/IEC 27001",
        imageContainerClassName: "h-[76px] w-[120px]",
        imageSrc: "/images/certifications/iso27001.png",
        title: "ISO/IEC 27001",
      },
      {
        description: ["Privacy Information", "Management Systems"],
        imageAlt: "ISO 27701",
        imageContainerClassName: "h-[76px] w-[120px]",
        imageSrc: "/images/certifications/iso27701.png",
        title: "ISO 27701",
      },
      {
        description: ["Information Security controls", "within a Cloud environment"],
        imageAlt: "ISO 27017",
        imageContainerClassName: "h-[86px] w-20",
        imageSrc: "/images/certifications/iso27017.png",
        title: "ISO 27017",
      },
      {
        description: ["Privacy controls", "within a Cloud environment"],
        imageAlt: "ISO 27018",
        imageContainerClassName: "h-[86px] w-20",
        imageSrc: "/images/certifications/iso27018.png",
        title: "ISO 27018",
      },
      {
        description: ["Business Continuity", "Management"],
        imageAlt: "ISO 22301",
        imageContainerClassName: "h-[77px] w-[120px]",
        imageSrc: "/images/certifications/iso22301.png",
        title: "ISO 22301",
      },
      {
        description: ["Business Continuity", "Management"],
        imageAlt: "ISMS-P",
        imageContainerClassName: "h-[83px] w-[120px]",
        imageSrc: "/images/certifications/isms-p.png",
        title: "ISMS-P",
      },
      {
        description: ["Good Software", "Level 1"],
        imageAlt: "GOOD Software",
        imageContainerClassName: "h-[60px] w-[120px]",
        imageSrc: "/images/certifications/good-software.png",
        title: "GOOD Software",
      },
      {
        description: ["Korea Security Evaluation Lab.", "Security Functionality", "Certificate"],
        imageAlt: "KSEL",
        imageContainerClassName: "size-[90px] rounded-full",
        imageSrc: "/images/certifications/ksel.png",
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
        imageSrc: "/images/certifications/soc2-type2.png",
        title: "SOC 2 Type II",
      },
      {
        description: ["보안, 신뢰, 보증 및", "위험", "(레벨 1 - 브론즈)"],
        imageAlt: "CSA-STAR Level 1",
        imageContainerClassName: "size-[90px]",
        imageSrc: "/images/certifications/csa-star-level1.png",
        title: "CSA-STAR",
      },
      {
        description: ["보안, 신뢰, 보증 및", "위험", "(레벨 2 - 골드)"],
        imageAlt: "CSA-STAR Level 2",
        imageContainerClassName: "size-[90px]",
        imageSrc: "/images/certifications/csa-star-level2.png",
        title: "CSA-STAR",
      },
      {
        description: ["지급 카드 산업", "데이터 보안 표준"],
        imageAlt: "PCI DSS",
        imageContainerClassName: "h-12 w-40",
        imageSrc: "/images/certifications/pci-dss.png",
        title: "PCI DSS",
      },
      {
        description: ["정보 보안", "관리 체계"],
        imageAlt: "ISO/IEC 27001",
        imageContainerClassName: "h-[76px] w-[120px]",
        imageSrc: "/images/certifications/iso27001.png",
        title: "ISO/IEC 27001",
      },
      {
        description: ["개인정보", "관리 체계"],
        imageAlt: "ISO 27701",
        imageContainerClassName: "h-[76px] w-[120px]",
        imageSrc: "/images/certifications/iso27701.png",
        title: "ISO 27701",
      },
      {
        description: ["클라우드 환경 내", "정보 보안 통제"],
        imageAlt: "ISO 27017",
        imageContainerClassName: "h-[86px] w-20",
        imageSrc: "/images/certifications/iso27017.png",
        title: "ISO 27017",
      },
      {
        description: ["클라우드 환경 내", "개인정보 보호 통제"],
        imageAlt: "ISO 27018",
        imageContainerClassName: "h-[86px] w-20",
        imageSrc: "/images/certifications/iso27018.png",
        title: "ISO 27018",
      },
      {
        description: ["비즈니스 연속성", "관리"],
        imageAlt: "ISO 22301",
        imageContainerClassName: "h-[77px] w-[120px]",
        imageSrc: "/images/certifications/iso22301.png",
        title: "ISO 22301",
      },
      {
        description: ["비즈니스 연속성", "관리"],
        imageAlt: "ISMS-P",
        imageContainerClassName: "h-[83px] w-[120px]",
        imageSrc: "/images/certifications/isms-p.png",
        title: "ISMS-P",
      },
      {
        description: ["굿소프트웨어", "레벨 1"],
        imageAlt: "GOOD Software",
        imageContainerClassName: "h-[60px] w-[120px]",
        imageSrc: "/images/certifications/good-software.png",
        title: "GOOD Software",
      },
      {
        description: ["한국시큐리티평가연구소", "보안 기능", "인증"],
        imageAlt: "KSEL",
        imageContainerClassName: "size-[90px] rounded-full",
        imageSrc: "/images/certifications/ksel.png",
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
        imageSrc: "/images/certifications/soc2-type2.png",
        title: "SOC 2 Type II",
      },
      {
        description: ["セキュリティ、信頼、保証と", "リスク", "(レベル 1 - ブロンズ)"],
        imageAlt: "CSA-STAR Level 1",
        imageContainerClassName: "size-[90px]",
        imageSrc: "/images/certifications/csa-star-level1.png",
        title: "CSA-STAR",
      },
      {
        description: ["セキュリティ、信頼、保証と", "リスク", "(レベル 2 - ゴールド)"],
        imageAlt: "CSA-STAR Level 2",
        imageContainerClassName: "size-[90px]",
        imageSrc: "/images/certifications/csa-star-level2.png",
        title: "CSA-STAR",
      },
      {
        description: ["ペイメントカード業界", "データセキュリティ基準"],
        imageAlt: "PCI DSS",
        imageContainerClassName: "h-12 w-40",
        imageSrc: "/images/certifications/pci-dss.png",
        title: "PCI DSS",
      },
      {
        description: ["情報セキュリティ", "マネジメントシステム"],
        imageAlt: "ISO/IEC 27001",
        imageContainerClassName: "h-[76px] w-[120px]",
        imageSrc: "/images/certifications/iso27001.png",
        title: "ISO/IEC 27001",
      },
      {
        description: ["プライバシー情報", "マネジメントシステム"],
        imageAlt: "ISO 27701",
        imageContainerClassName: "h-[76px] w-[120px]",
        imageSrc: "/images/certifications/iso27701.png",
        title: "ISO 27701",
      },
      {
        description: ["クラウド環境における", "情報セキュリティ統制"],
        imageAlt: "ISO 27017",
        imageContainerClassName: "h-[86px] w-20",
        imageSrc: "/images/certifications/iso27017.png",
        title: "ISO 27017",
      },
      {
        description: ["クラウド環境における", "プライバシー保護統制"],
        imageAlt: "ISO 27018",
        imageContainerClassName: "h-[86px] w-20",
        imageSrc: "/images/certifications/iso27018.png",
        title: "ISO 27018",
      },
      {
        description: ["事業継続", "マネジメント"],
        imageAlt: "ISO 22301",
        imageContainerClassName: "h-[77px] w-[120px]",
        imageSrc: "/images/certifications/iso22301.png",
        title: "ISO 22301",
      },
      {
        description: ["事業継続", "マネジメント"],
        imageAlt: "ISMS-P",
        imageContainerClassName: "h-[83px] w-[120px]",
        imageSrc: "/images/certifications/isms-p.png",
        title: "ISMS-P",
      },
      {
        description: ["GOOD Software", "レベル 1"],
        imageAlt: "GOOD Software",
        imageContainerClassName: "h-[60px] w-[120px]",
        imageSrc: "/images/certifications/good-software.png",
        title: "GOOD Software",
      },
      {
        description: ["韓国セキュリティ評価研究所", "セキュリティ機能", "認証"],
        imageAlt: "KSEL",
        imageContainerClassName: "size-[90px] rounded-full",
        imageSrc: "/images/certifications/ksel.png",
        title: "KSEL",
      },
    ],
    title: "認証",
  },
} as const;

export default async function CertificationsRoute({
  params,
}: CertificationsRouteProps) {
  const { locale } = await params;

  if (!isLocale(locale)) notFound();

  return <CertificationsPage {...certificationsCopy[locale]} />;
}
