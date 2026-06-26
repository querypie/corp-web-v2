import { pageSectionGapClassName, pageXPaddingClassName } from "@/constants/layout";
import AipHero from "@/components/sections/AipHero";
import Cta from "@/components/sections/common/Cta";
import FeatureMediaList from "@/components/sections/common/FeatureMediaList";
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
    title: ["Smart Edge Tunneling"],
    body: [
      "Access internal systems through secure tunneling technology. Connect to firewall-protected resources while keeping your security infrastructure unchanged.",
    ],
    imageAlt: "Smart edge tunneling preview",
    imageClassName: "h-auto w-full md:h-[400px] md:w-auto",
    imageSrc: "/solutions/aip/mcp-gateway/aip_function_tunneling.gif",
    mediaClassName: "aspect-auto h-auto w-full md:h-[400px] md:w-fit md:max-w-full lg:w-fit lg:max-w-none",
  },
  {
    title: ["Easy MCP Proxy Access"],
    body: [
      "Use MCP presets in external tools through secure local MCP proxy. Access custom presets directly in Cursor IDE, Claude Desktop, and Windsurf seamlessly.",
    ],
    imageAlt: "MCP proxy access preview",
    imageClassName: "h-auto w-full md:h-[400px] md:w-auto",
    imageSrc: "/solutions/aip/mcp-gateway/aip_function_mcpproxy.gif",
    mediaClassName: "aspect-auto h-auto w-full md:h-[400px] md:w-fit md:max-w-full lg:w-fit lg:max-w-none",
    reverse: true,
  },
  {
    title: ["Org-Level MCP Management"],
    body: [
      "Control who can access which MCP tools with granular permissions. Activate, deactivate, and govern all AI tool usage across your organization centrally.",
    ],
    imageAlt: "Organization-level MCP management preview",
    imageClassName: "h-auto w-full md:h-[400px] md:w-auto",
    imageSrc: "/solutions/aip/mcp-gateway/aip_function_mcpmanagement.gif",
    mediaClassName: "aspect-auto h-auto w-full md:h-[400px] md:w-fit md:max-w-full lg:w-fit lg:max-w-none",
  },
  {
    title: ["Audit Logging"],
    body: [
      "Track every event across your organization with complete visibility. Monitor user activities and system changes for enhanced security and compliance.",
    ],
    imageAlt: "Audit logging preview",
    imageClassName: "h-auto w-full md:h-[400px] md:w-auto",
    imageSrc: "/solutions/aip/mcp-gateway/aip_function_audit.gif",
    mediaClassName: "aspect-auto h-auto w-full md:h-[400px] md:w-fit md:max-w-full lg:w-fit lg:max-w-none",
    reverse: true,
  },
  {
    title: ["Data Loss Prevention (DLP)"],
    body: [
      "Automatically block sensitive data from entering AI conversations. Prevent credit cards, SSNs, API keys, and confidential information exposure instantly.",
    ],
    imageAlt: "Data loss prevention preview",
    imageClassName: "h-auto w-full md:h-[400px] md:w-auto",
    imageSrc: "/solutions/aip/mcp-gateway/aip_function_dlp.gif",
    mediaClassName: "aspect-auto h-auto w-full md:h-[400px] md:w-fit md:max-w-full lg:w-fit lg:max-w-none",
  },
];

export default function McpGatewayENSolutionContent({ locale }: Props) {
  return (
    <div className={`flex w-full flex-col ${pageSectionGapClassName} ${pageXPaddingClassName} pb-10`}>
      <div className="flex w-full flex-col gap-10 md:gap-[80px]">
        <section className="flex w-full justify-center">
          <header className="grid w-full max-w-[1200px] gap-4 sm:gap-5 md:grid-cols-2 md:gap-[30px]">
            <div>
              <h1 className="m-0 text-pretty type-h1 text-fg">
                MCP Hub That Connects
                <br className="hidden md:block" /> Everything
              </h1>
            </div>
            <p className="m-0 max-w-[720px] text-pretty type-body-lg leading-relaxed text-fg">
              Single platform centrally managing all MCP servers and tools—no fragmentation, no
              complexity, no limits. Streamline AI workflows across your entire tech stack while we
              handle the complexity behind the scenes.
            </p>
          </header>
        </section>
        <AipHero
          imageAlt="MCP Gateway product preview"
          imageSrc="/solutions/aip/mcp-gateway/mcp-gateway.png"
        />
      </div>

      <FeatureMediaList items={featureItems} />

      <div>
        <Cta locale={locale} />
      </div>
    </div>
  );
}
