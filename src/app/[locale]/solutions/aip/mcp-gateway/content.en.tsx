import { pageSectionGapClassName, pageXPaddingClassName } from "@/constants/layout";
import Cta from "@/components/sections/Cta";
import FeatureSection from "@/components/sections/FeatureSection";
import type { Locale } from "@/constants/i18n";

type Props = {
  locale: Locale;
  searchParams?: { category?: string };
};

export const metadata = {
  title: "MCP Gateway",
  description:
    "Connect AI agents to enterprise tools and data through a governed MCP gateway with visibility, policy enforcement, and audit logs.",
  keywords: ["MCP Gateway", "Model Context Protocol", "AI governance"],
} as const;

const featureItems = [
  {
    title: ["Smart Edge", "Tunneling"],
    body: [
      "Access internal systems through secure tunneling.",
      "Connect to firewall-protected resources",
      "without changing security infrastructure.",
    ],
    imageAlt: "Smart edge tunneling preview",
    imageSrc: "/images/home/features/feature-panel-a.png",
  },
  {
    title: ["Easy MCP", "Proxy Access"],
    body: [
      "Use MCP presets in external tools through",
      "a secure local MCP proxy for Cursor IDE,",
      "Claude Desktop, and Windsurf.",
    ],
    imageAlt: "MCP proxy access preview",
    imageSrc: "/images/home/features/feature-panel-b.png",
    reverse: true,
  },
  {
    title: ["Org-Level MCP", "Management"],
    body: [
      "Control who can access each MCP tool",
      "with granular permissions and centralized",
      "activation, deactivation, and governance.",
    ],
    imageAlt: "Organization-level MCP management preview",
    imageSrc: "/images/home/features/feature-panel-a.png",
  },
  {
    title: ["Audit", "Logging"],
    body: [
      "Track every event across your organization.",
      "Monitor user activity and system changes",
      "for security and compliance.",
    ],
    imageAlt: "Audit logging preview",
    imageSrc: "/images/home/features/feature-panel-b.png",
    reverse: true,
  },
  {
    title: ["Data Loss", "Prevention"],
    body: [
      "Automatically block sensitive data",
      "from entering AI conversations, including",
      "API keys and confidential information.",
    ],
    imageAlt: "Data loss prevention preview",
    imageSrc: "/images/home/features/feature-panel-a.png",
  },
];

export default function McpGatewayENSolutionContent({ locale }: Props) {
  return (
    <div className={`flex w-full flex-col ${pageSectionGapClassName} ${pageXPaddingClassName} pb-10`}>
      <section className="flex w-full justify-center">
        <header className="grid w-full max-w-[1200px] gap-4 sm:gap-5 md:grid-cols-2 md:gap-[30px]">
          <div>
            <h1 className="m-0 type-h1 text-fg">
              <span className="block">MCP Hub</span>
              <span className="block">That Connects Everything</span>
            </h1>
          </div>
          <p className="m-0 max-w-[720px] type-body-lg leading-relaxed text-fg">
            Single platform centrally managing all MCP servers and tools—no fragmentation, no
            complexity, no limits. Streamline AI workflows across your entire tech stack while we
            handle the complexity behind the scenes.
          </p>
        </header>
      </section>

      <FeatureSection items={featureItems} />

      <div>
        <Cta locale={locale} />
      </div>
    </div>
  );
}
