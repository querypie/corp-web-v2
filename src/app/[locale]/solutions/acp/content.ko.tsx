import Cta from "@/components/sections/Cta";
import FeatureSection from "@/components/sections/FeatureSection";
import type { Locale } from "@/constants/i18n";
import AcpDiagram from "./AcpDiagram";
import AcpIntegrationSection from "./AcpIntegrationSection";

type Props = {
  locale: Locale;
  searchParams?: { category?: string };
};

export const metadata = {
  title: "QueryPie Access Control Platform (ACP)",
  description:
    "QueryPie ACP는 데이터와 인프라 전반의 접근 관리를 제공하는 접근 제어 플랫폼입니다.",
  keywords: ["QueryPie ACP", "Access Control Platform", "ACP", "access control"],
} as const;

const featureItems = [
  {
    body: [
      "통합 정책, 쿼리 단위 거버넌스, 마스킹,",
      "전체 감사 로그로 데이터베이스 접근을 제어하고",
      "개발자 업무 흐름은 그대로 유지합니다.",
    ],
    imageAlt: "데이터베이스 접근 제어 미리보기",
    imageSrc: "/images/home/features/feature-panel-a.png",
    title: ["모든 데이터베이스", "세션을 거버넌스하세요"],
  },
  {
    body: [
      "웹 터미널, 승인 워크플로우, 세션 녹화,",
      "Policy as Code 기반 제어로 권한 사용자의",
      "시스템 접근을 안전하게 관리합니다.",
    ],
    imageAlt: "시스템 접근 제어 미리보기",
    imageSrc: "/images/home/features/feature-panel-b.png",
    reverse: true,
    title: ["권한 시스템", "접근을 보호하세요"],
  },
  {
    body: [
      "여러 Kubernetes 클러스터에 일관된 RBAC를 적용하고,",
      "API 활동과 컨테이너 세션을 하나의 중앙 접근 제어",
      "레이어에서 기록하고 관리합니다.",
    ],
    imageAlt: "Kubernetes 접근 제어 미리보기",
    imageSrc: "/images/home/features/feature-panel-a.png",
    title: ["Kubernetes 접근", "거버넌스를 통합하세요"],
  },
  {
    body: [
      "SaaS와 내부 웹 애플리케이션을 중앙 정책 아래 두고,",
      "모니터링, 워터마킹, Just-in-time 권한으로",
      "비즈니스 앱 접근을 제어합니다.",
    ],
    imageAlt: "웹 접근 제어 미리보기",
    imageSrc: "/images/home/features/feature-panel-b.png",
    reverse: true,
    title: ["비즈니스 웹 앱", "접근을 제어하세요"],
  },
];

export default function AcpKOSolutionContent({ locale }: Props) {
  return (
    <div className="flex w-full flex-col gap-14 px-5 pb-10 md:gap-[160px] md:px-10">
      <div className="flex flex-col gap-14 md:gap-20">
        <div>
          <section className="flex w-full justify-center">
            <header className="grid w-full max-w-[1200px] gap-4 sm:gap-5 md:grid-cols-2 md:gap-[30px]">
              <h1 className="m-0 type-h1 text-fg">Access Control Platform</h1>
              <p className="m-0 max-w-[720px] type-body-lg leading-relaxed text-fg">
                QueryPie ACP는 데이터베이스, 시스템, Kubernetes, 웹 애플리케이션 전반의 접근
                제어를 중앙화해 최소 권한 접근을 부여하고, 권한 사용을 모니터링하며, 복잡한
                엔터프라이즈 환경에서도 감사 대응 가능한 거버넌스를 유지하도록 돕습니다.
              </p>
            </header>
          </section>
        </div>

        <div>
          <AcpDiagram locale={locale} />
        </div>
      </div>

      <div>
        <FeatureSection items={featureItems} />
      </div>

      <div className="-mx-5 md:-mx-10">
        <AcpIntegrationSection locale={locale} />
      </div>

      <div>
        <Cta locale={locale} />
      </div>
    </div>
  );
}
