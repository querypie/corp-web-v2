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
    "QueryPie ACP is the platform that delivers comprehensive access management across data and infrastructure.",
  keywords: ["QueryPie ACP", "Access Control Platform", "ACP", "access control"],
} as const;

const featureItems = [
  {
    body: [
      "Control access to databases with unified policies,",
      "query-level governance, masking, and full audit logs",
      "without disrupting developer workflows.",
    ],
    imageAlt: "Database access control preview",
    imageSrc: "/images/home/features/feature-panel-a.png",
    title: ["Govern every", "database session"],
  },
  {
    body: [
      "Manage server access through web terminals,",
      "approval workflows, session recording, and",
      "policy-as-code controls for privileged users.",
    ],
    imageAlt: "System access control preview",
    imageSrc: "/images/home/features/feature-panel-b.png",
    reverse: true,
    title: ["Secure privileged", "system access"],
  },
  {
    body: [
      "Apply consistent RBAC across Kubernetes clusters",
      "and capture API activity and container sessions",
      "from one centralized access control layer.",
    ],
    imageAlt: "Kubernetes access control preview",
    imageSrc: "/images/home/features/feature-panel-a.png",
    title: ["Unify Kubernetes", "access governance"],
  },
  {
    body: [
      "Bring SaaS and internal web applications under",
      "centralized access policies with monitoring,",
      "watermarking, and just-in-time permissions.",
    ],
    imageAlt: "Web access control preview",
    imageSrc: "/images/home/features/feature-panel-b.png",
    reverse: true,
    title: ["Control business", "web applications"],
  },
];

export default function AcpENSolutionContent({ locale }: Props) {
  return (
    <div className="flex w-full flex-col gap-14 px-5 pb-10 md:gap-[160px] md:px-10">
      <div className="flex flex-col gap-14 md:gap-20">
        <div>
          <section className="flex w-full justify-center">
            <header className="grid w-full max-w-[1200px] gap-4 sm:gap-5 md:grid-cols-2 md:gap-[30px]">
              <h1 className="m-0 type-h1 text-fg">Access Control Platform</h1>
              <p className="m-0 max-w-[720px] type-body-lg leading-relaxed text-fg">
                QueryPie ACP centralizes access control for databases, systems, Kubernetes, and web
                applications, helping teams grant least-privilege access, monitor privileged activity,
                and maintain audit-ready governance across complex enterprise environments.
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
