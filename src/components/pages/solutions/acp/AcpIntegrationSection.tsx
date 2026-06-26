import TextButton from "@/components/ui/TextButton";
import type { Locale } from "@/constants/i18n";
import { getSolutionHref } from "@/features/solutions/routes";

type AcpIntegrationSectionProps = {
  locale: Locale;
};

const copy = {
  en: {
    body:
      "Seamlessly integrate with 50+ systems - databases, servers, Kubernetes, web applications, identity providers, and security tools - for unified permission control across your entire infrastructure ecosystem.",
    button: "See All Available ACP Integrations",
    imageAlt: "ACP integration ecosystem",
    title: ["One Platform", "All Infrastructure"],
  },
  ko: {
    body:
      "데이터베이스, 서버, Kubernetes, 웹 애플리케이션, ID 공급자, 보안 도구 등 50개 이상의 시스템과 연동해 전체 인프라 생태계의 권한 제어를 하나로 통합합니다.",
    button: "사용 가능한 ACP 연동 보기",
    imageAlt: "ACP 연동 생태계",
    title: ["하나의 플랫폼", "모든 인프라"],
  },
  ja: {
    body:
      "データベース、サーバー、Kubernetes、Webアプリケーション、IDプロバイダー、セキュリティツールなど50以上のシステムと連携し、インフラ全体の権限制御を統合します。",
    button: "利用可能なACP連携を見る",
    imageAlt: "ACP連携エコシステム",
    title: ["ひとつのプラットフォーム", "すべてのインフラ"],
  },
} satisfies Record<Locale, {
  body: string;
  button: string;
  imageAlt: string;
  title: string[];
}>;

export default function AcpIntegrationSection({ locale }: AcpIntegrationSectionProps) {
  const content = copy[locale];

  return (
    <section className="flex w-full justify-center">
      <div className="flex w-full max-w-[1200px] flex-col items-start gap-10 lg:flex-row lg:gap-[60px]">
        <div className="flex min-w-0 flex-1 flex-col items-start gap-5">
          <h2 className="m-0 min-w-full type-h2 font-normal text-fg">
            {content.title.map((line) => (
              <span className="block" key={line}>
                {line}
              </span>
            ))}
          </h2>
          <p className="m-0 min-w-full type-body-lg leading-[26px] text-mute">
            {content.body}
          </p>
          <TextButton
            href={getSolutionHref(locale, "acp-integrations")}
          >
            {content.button}
          </TextButton>
        </div>

        <div className="relative mx-auto aspect-[43/41] w-full max-w-[430px] shrink-0 overflow-hidden lg:mx-0 lg:h-[410px] lg:w-[430px]">
          <img
            alt={content.imageAlt}
            className="block h-full w-full object-contain"
            height="410"
            src="/solutions/acp/acp-integration.png"
            width="430"
          />
        </div>
      </div>
    </section>
  );
}
