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
    title: "QueryPie ACP Integrations",
    description:
      "Connect straight to your favorite data sources and get full visibility across all your systems, apps, and services.",
    eyebrow: "More than",
    headline: "50 Built-In Integrations",
    body:
      "Connect straight to your favorite data sources and get full visibility across all your systems, apps, and services.",
    bodySecond:
      "Whether it’s databases, servers, Kubernetes, or web applications—you’re totally covered with us!",
  },
  ko: {
    title: "QueryPie ACP 연동",
    description:
      "선호하는 데이터 소스와 바로 연결하고 시스템, 앱, 서비스 전반의 가시성을 확보하세요.",
    eyebrow: "50개 이상의",
    headline: "기본 제공 연동",
    body:
      "선호하는 데이터 소스와 바로 연결하고 시스템, 앱, 서비스 전반의 가시성을 확보하세요.",
    bodySecond:
      "데이터베이스, 서버, Kubernetes, 웹 애플리케이션까지 QueryPie ACP 하나로 폭넓게 연결할 수 있습니다.",
  },
  ja: {
    title: "QueryPie ACP連携",
    description:
      "よく使うデータソースへ直接接続し、システム、アプリ、サービス全体の可視性を確保できます。",
    eyebrow: "50以上の",
    headline: "標準連携",
    body:
      "よく使うデータソースへ直接接続し、システム、アプリ、サービス全体の可視性を確保できます。",
    bodySecond:
      "データベース、サーバー、Kubernetes、Webアプリケーションまで、QueryPie ACPひとつで幅広くカバーできます。",
  },
} satisfies Record<
  Locale,
  {
    title: string;
    description: string;
    eyebrow: string;
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
      canonical: getSolutionHref(locale, "acp-integrations"),
    },
  };
}

export default async function AcpIntegrationsPage({ params }: PageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const copy = copyByLocale[locale];

  return (
    <div className={`flex w-full flex-col gap-14 ${pageXPaddingClassName} pb-10 md:gap-20`}>
      <section className="flex w-full justify-center">
        <header className="grid w-full max-w-[1200px] gap-4 sm:gap-5 md:grid-cols-2 md:gap-[30px]">
          <h1 className="m-0 type-h1 text-fg">
            <span className="block text-mute">{copy.eyebrow}</span>
            <span className="block">{copy.headline}</span>
          </h1>
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
