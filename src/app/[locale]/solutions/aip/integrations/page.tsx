import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Cta from "@/components/sections/Cta";
import { isLocale, type Locale } from "@/constants/i18n";
import { pageXPaddingClassName } from "@/constants/layout";
import { getSolutionHref } from "@/features/solutions/routes";
import IntegrationsFilter from "./IntegrationsFilter";

type PageProps = {
  params: Promise<{ locale: string }>;
};

const copyByLocale = {
  en: {
    title: "QueryPie AIP Integrations",
    description:
      "Connect to your favorite business tools through MCP servers and automate workflows across systems, apps, and services.",
    headline: "AIP Integrations",
    body:
      "Connect to your favorite business tools through MCP servers and automate workflows across systems, apps, and services.",
    bodySecond:
      "Whether it's Slack, GitHub, AWS, databases, or workflow platforms-you're totally covered with AI integration!",
  },
  ko: {
    title: "QueryPie AIP 연동",
    description:
      "MCP 서버를 통해 선호하는 비즈니스 도구와 연결하고 시스템, 앱, 서비스 전반의 워크플로를 자동화하세요.",
    headline: "AIP 연동",
    body:
      "MCP 서버를 통해 선호하는 비즈니스 도구와 연결하고 시스템, 앱, 서비스 전반의 워크플로를 자동화하세요.",
    bodySecond:
      "Slack, GitHub, AWS, 데이터베이스, 워크플로 플랫폼까지 AI 연동으로 폭넓게 활용할 수 있습니다.",
  },
  ja: {
    title: "QueryPie AIP連携",
    description:
      "MCPサーバーを通じてよく使うビジネスツールに接続し、システム、アプリ、サービス全体のワークフローを自動化できます。",
    headline: "AIP連携",
    body:
      "MCPサーバーを通じてよく使うビジネスツールに接続し、システム、アプリ、サービス全体のワークフローを自動化できます。",
    bodySecond:
      "Slack、GitHub、AWS、データベース、ワークフロープラットフォームまで、AI連携で幅広くカバーできます。",
  },
} satisfies Record<
  Locale,
  {
    title: string;
    description: string;
    headline: string;
    body: string;
    bodySecond: string;
  }
>;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const copy = copyByLocale[locale];

  return {
    title: copy.title,
    description: copy.description,
    alternates: {
      canonical: getSolutionHref(locale, "aip-integrations"),
    },
  };
}

export default async function AipIntegrationsPage({ params }: PageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const copy = copyByLocale[locale];

  return (
    <div className={`flex w-full flex-col gap-14 ${pageXPaddingClassName} pb-10 md:gap-20`}>
      <section className="flex w-full justify-center">
        <header className="grid w-full max-w-[1200px] gap-4 sm:gap-5 md:grid-cols-2 md:gap-[30px]">
          <h1 className="m-0 type-h1 text-fg">{copy.headline}</h1>
          <p className="m-0 max-w-[720px] type-body-lg leading-relaxed text-fg">
            {copy.body}
            <br className="hidden sm:block" />
            {copy.bodySecond}
          </p>
        </header>
      </section>

      <IntegrationsFilter locale={locale} />

      <div>
        <Cta locale={locale} />
      </div>
    </div>
  );
}
