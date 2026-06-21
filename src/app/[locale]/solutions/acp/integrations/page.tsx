import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Cta from "@/components/sections/Cta";
import { isLocale, type Locale } from "@/constants/i18n";
import { getSolutionHref } from "@/features/solutions/routes";
import IntegrationsFilter from "./IntegrationsFilter";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  return {
    title: "QueryPie ACP Integrations",
    description:
      "Connect straight to your favorite data sources and get full visibility across all your systems, apps, and services.",
    alternates: {
      canonical: getSolutionHref(locale, "acp-integrations"),
    },
  };
}

export default async function AcpIntegrationsPage({ params }: PageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <div className="flex w-full flex-col gap-14 px-5 pb-10 md:gap-20 md:px-10">
      <section className="flex w-full justify-center">
        <header className="grid w-full max-w-[1200px] gap-4 sm:gap-5 md:grid-cols-2 md:gap-[30px]">
          <h1 className="m-0 type-h1 text-fg">
            <span className="block text-mute">More than</span>
            <span className="block">50 Built-In Integrations</span>
          </h1>
          <p className="m-0 max-w-[720px] type-body-lg leading-relaxed text-fg">
            Connect straight to your favorite data sources and get full visibility across all your
            systems, apps, and services.
            <br className="hidden sm:block" />
            Whether it’s databases, servers, Kubernetes, or web applications—you’re totally
            covered with us!
          </p>
        </header>
      </section>

      <IntegrationsFilter />

      <div>
        <Cta locale={locale as Locale} />
      </div>
    </div>
  );
}
