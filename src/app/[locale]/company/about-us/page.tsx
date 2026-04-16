import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getLocalePath, isLocale } from "../../../../constants/i18n";
import AboutUsPage from "../../../../components/pages/company/AboutUsPage";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function AboutUsRoute({ params }: Props) {
  const { locale } = await params;

  if (!isLocale(locale)) notFound();

  const copy = {
    en: {
      companyDescription: [
        "Excessive costs, security threats, and complex infrastructure have caused companies to hesitate in AI innovation.",
        "QueryPie AI provides a powerful, security-free AI environment through centralized management and custom agent deployment, while reducing costs by up to 90% with usage-based pricing.",
        "You can now execute cutting-edge AI strategies without a Fortune 500-level budget and realize all innovations at previously impossible costs.",
        "Starting in Silicon Valley in 2017 as a data protection specialist, QueryPie AI sets a new standard for enterprise AI.",
      ],
      investors: [
        { alt: "Salesforce Ventures", imageSrc: "/images/about-us/logo-salesforce.svg" },
        { alt: "Y Combinator", imageSrc: "/images/about-us/logo-ycombinator.svg" },
        { alt: "Z Venture Capital", imageSrc: "/images/about-us/logo-zventurecapital.svg" },
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
          addressLines: ["3003 North 1st Street, Suite 221, San Jose, CA 95134"],
          city: "San Francisco, CA",
          country: "San Francisco, USA",
          iconSrc: "/images/about-us/icon-us.svg",
        },
        {
          addressLines: ["7F, 26, Magokjungang 1-ro, Gangseo-gu, Seoul, Republic of Korea"],
          city: "Seoul, South Korea",
          country: "Seoul Magok Office",
          iconSrc: "/images/about-us/icon-kr.svg",
        },
        {
          addressLines: ["15F, Toranomon Hills Business Tower", "1 Chome-17-1 Toranomon, Minato City, Tokyo 105-6490"],
          city: "Tokyo, Japan",
          country: "Tokyo, Japan",
          iconSrc: "/images/about-us/icon-ja.svg",
        },
        {
          addressLines: ["Office Park Harapan Indah OP 2 No 20,", "Medan Satria, Bekasi, West Java 17132"],
          city: "Indonesia",
          country: "Office Park Harapan Indah",
          iconSrc: "/images/about-us/icon-id.svg",
        },
      ],
      locationsTitle: "Our Locations",
      mapImageSrc: "/images/about-us/world-location.svg",
      teamDescription: [
        "Our leaders master AI transformation with a rebel twist refusing to accept that enterprise AI must be complex or costly.",
        "They make AI work in the real world, not just Silicon Valley labs.",
      ],
      teamMembers: [
        { imageSrc: "/images/about-us/brant.webp", linkedinHref: "https://www.linkedin.com/in/ishwang/", name: "Brant Hwang", role: "Founder & CEO" },
        { imageSrc: "/images/about-us/paul.webp", linkedinHref: "https://www.linkedin.com/in/paul-hong-bb0983216/", name: "Paul Hong", role: "Co-Founder & CFO" },
        { imageSrc: "/images/about-us/sam.webp", linkedinHref: "https://www.linkedin.com/in/sam0-kim/", name: "Sam Kim", role: "CTO" },
        { imageSrc: "/images/about-us/jake.webp", linkedinHref: "https://www.linkedin.com/in/binlim/", name: "Jake Im", role: "CISO & CPO" },
        { imageSrc: "/images/about-us/kris.webp", linkedinHref: "https://www.linkedin.com/in/kris-park-89a83b19/", name: "Kris Park", role: "CSO" },
        { imageSrc: "/images/about-us/keizo.webp", linkedinHref: "https://www.linkedin.com/in/keizo-arinobu-b40769/", name: "Keizo Arinobu", role: "CGO & Japan Country Manager" },
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
      investors: [
        { alt: "Salesforce Ventures", imageSrc: "/images/about-us/logo-salesforce.svg" },
        { alt: "Y Combinator", imageSrc: "/images/about-us/logo-ycombinator.svg" },
        { alt: "Z Venture Capital", imageSrc: "/images/about-us/logo-zventurecapital.svg" },
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
          addressLines: ["3003 North 1st Street, Suite 221, San Jose, CA 95134"],
          city: "San Francisco, CA",
          country: "San Francisco, USA",
          iconSrc: "/images/about-us/icon-us.svg",
        },
        {
          addressLines: ["7F, 26, Magokjungang 1-ro, Gangseo-gu, Seoul, Republic of Korea"],
          city: "Seoul, South Korea",
          country: "Seoul Magok Office",
          iconSrc: "/images/about-us/icon-kr.svg",
        },
        {
          addressLines: ["15F, Toranomon Hills Business Tower", "1 Chome-17-1 Toranomon, Minato City, Tokyo 105-6490"],
          city: "Tokyo, Japan",
          country: "Tokyo, Japan",
          iconSrc: "/images/about-us/icon-ja.svg",
        },
        {
          addressLines: ["Office Park Harapan Indah OP 2 No 20,", "Medan Satria, Bekasi, West Java 17132"],
          city: "Indonesia",
          country: "Office Park Harapan Indah",
          iconSrc: "/images/about-us/icon-id.svg",
        },
      ],
      locationsTitle: "거점",
      mapImageSrc: "/images/about-us/world-location.svg",
      teamDescription: [
        "우리의 리더들은 엔터프라이즈 AI가 복잡하고 비싸야 한다는 통념을 거부합니다.",
        "실제 운영 환경에서 AI를 작동하게 만드는 팀입니다.",
      ],
      teamMembers: [
        { imageSrc: "/images/about-us/brant.webp", linkedinHref: "https://www.linkedin.com/in/ishwang/", name: "Brant Hwang", role: "Founder & CEO" },
        { imageSrc: "/images/about-us/paul.webp", linkedinHref: "https://www.linkedin.com/in/paul-hong-bb0983216/", name: "Paul Hong", role: "Co-Founder & CFO" },
        { imageSrc: "/images/about-us/sam.webp", linkedinHref: "https://www.linkedin.com/in/sam0-kim/", name: "Sam Kim", role: "CTO" },
        { imageSrc: "/images/about-us/jake.webp", linkedinHref: "https://www.linkedin.com/in/binlim/", name: "Jake Im", role: "CISO & CPO" },
        { imageSrc: "/images/about-us/kris.webp", linkedinHref: "https://www.linkedin.com/in/kris-park-89a83b19/", name: "Kris Park", role: "CSO" },
        { imageSrc: "/images/about-us/keizo.webp", linkedinHref: "https://www.linkedin.com/in/keizo-arinobu-b40769/", name: "Keizo Arinobu", role: "CGO & Japan Country Manager" },
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
      investors: [
        { alt: "Salesforce Ventures", imageSrc: "/images/about-us/logo-salesforce.svg" },
        { alt: "Y Combinator", imageSrc: "/images/about-us/logo-ycombinator.svg" },
        { alt: "Z Venture Capital", imageSrc: "/images/about-us/logo-zventurecapital.svg" },
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
          addressLines: ["3003 North 1st Street, Suite 221, San Jose, CA 95134"],
          city: "San Francisco, CA",
          country: "San Francisco, USA",
          iconSrc: "/images/about-us/icon-us.svg",
        },
        {
          addressLines: ["7F, 26, Magokjungang 1-ro, Gangseo-gu, Seoul, Republic of Korea"],
          city: "Seoul, South Korea",
          country: "Seoul Magok Office",
          iconSrc: "/images/about-us/icon-kr.svg",
        },
        {
          addressLines: ["15F, Toranomon Hills Business Tower", "1 Chome-17-1 Toranomon, Minato City, Tokyo 105-6490"],
          city: "Tokyo, Japan",
          country: "Tokyo, Japan",
          iconSrc: "/images/about-us/icon-ja.svg",
        },
        {
          addressLines: ["Office Park Harapan Indah OP 2 No 20,", "Medan Satria, Bekasi, West Java 17132"],
          city: "Indonesia",
          country: "Office Park Harapan Indah",
          iconSrc: "/images/about-us/icon-id.svg",
        },
      ],
      locationsTitle: "拠点",
      mapImageSrc: "/images/about-us/world-location.svg",
      teamDescription: [
        "私たちのリーダーは、エンタープライズ AI は複雑で高価であるべきだという前提を受け入れません。",
        "実際の現場で AI を動かすことに集中しています。",
      ],
      teamMembers: [
        { imageSrc: "/images/about-us/brant.webp", linkedinHref: "https://www.linkedin.com/in/ishwang/", name: "Brant Hwang", role: "Founder & CEO" },
        { imageSrc: "/images/about-us/paul.webp", linkedinHref: "https://www.linkedin.com/in/paul-hong-bb0983216/", name: "Paul Hong", role: "Co-Founder & CFO" },
        { imageSrc: "/images/about-us/sam.webp", linkedinHref: "https://www.linkedin.com/in/sam0-kim/", name: "Sam Kim", role: "CTO" },
        { imageSrc: "/images/about-us/jake.webp", linkedinHref: "https://www.linkedin.com/in/binlim/", name: "Jake Im", role: "CISO & CPO" },
        { imageSrc: "/images/about-us/kris.webp", linkedinHref: "https://www.linkedin.com/in/kris-park-89a83b19/", name: "Kris Park", role: "CSO" },
        { imageSrc: "/images/about-us/keizo.webp", linkedinHref: "https://www.linkedin.com/in/keizo-arinobu-b40769/", name: "Keizo Arinobu", role: "CGO & Japan Country Manager" },
      ],
      teamTitle: "チーム",
      title: ["The Smart Standard", "for Enterprise AI"],
    },
  }[locale];

  return <AboutUsPage {...copy} />;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  if (!isLocale(locale)) return {};

  return {
    alternates: {
      canonical: getLocalePath(locale, "/company/about-us"),
    },
  };
}
