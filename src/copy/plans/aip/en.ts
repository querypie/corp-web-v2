import type { PricingProduct } from "../types";

export const aipPricingEn: PricingProduct<"aip"> = {
  productKey: "aip",
  locale: "en",
  tabLabel: "QueryPie AIP",
  plans: ["Business", "Enterprise"],
  cards: [
    {
      name: "Business",
      description: "Collaborate and innovate together",
      priceLabel: "$650/mo",
      href: "https://app.querypie.com/",
      ctaLabel: "Subscribe",
      features: [
        "20,000 monthly credits",
        { type: "divider" },
        "Up to 30 custom AI agents",
        "10 RAG knowledge bundles",
        { type: "divider" },
        "Audit logs (max 90 days)",
        "Login IP ACL",
        "MCP Access Control",
        "Agent Access Control",
        { value: "SSO", tone: "danger" },
        { value: "DLP", tone: "danger" },
        { type: "divider" },
        { value: "Real-time Customer Support", tone: "danger" },
        { value: "Advanced AI Security Features", tone: "danger" },
      ],
    },
    {
      name: "Enterprise",
      description: "Enterprise power unleashed",
      priceLabel: "Let's Talk",
      href: "/contact-us",
      ctaLabel: "Try Now",
      tone: "primary",
      features: [
        "Custom Prepaid Credits",
        { type: "divider" },
        "Unlimited custom AI agents",
        "Unlimited RAG knowledge bundles",
        { type: "divider" },
        "Audit logs (max 180 days)",
        "Login IP ACL",
        "MCP Access Control",
        "Agent Access Control",
        "SSO",
        "DLP",
        { type: "divider" },
        "Custom Branding",
        "Advanced AI Security Features",
      ],
    },
  ],
  comparisonGroups: [
    {
      title: "General",
      rows: [
        {
          label: "Monthly Billing",
          values: [
            { value: "$650/month" },
            { value: "Custom Pricing" },
          ],
        },
        {
          label: "Monthly Credits",
          values: [
            { value: "20,000 credits", tone: "muted" },
            { value: "Custom Prepaid Credits", tone: "muted" },
          ],
        },
        {
          label: "LLM Chat",
          values: [
            { value: "Anthropic / OpenAI / Gemini", tone: "muted" },
            { value: "Any LLM Provider", tone: "muted" },
          ],
        },
        {
          label: "Custom LLM Model",
          values: [
            { value: "✕", tone: "danger" },
            { value: "○ (Add-on)", tone: "success" },
          ],
        },
      ],
    },
    {
      title: "Platform Features",
      rows: [
        {
          label: "Web Search",
          values: [
            { value: "○", tone: "success" },
            { value: "○", tone: "success" },
          ],
        },
        {
          label: "Insight Widgets",
          values: [
            { value: "○", tone: "success" },
            { value: "○", tone: "success" },
          ],
        },
        {
          label: "Code Artifacts",
          values: [
            { value: "○", tone: "success" },
            { value: "○", tone: "success" },
          ],
        },
        {
          label: "MCP Integrations",
          values: [
            { value: "○", tone: "success" },
            { value: "○", tone: "success" },
          ],
        },
        {
          label: "MCP Preset Creation",
          values: [
            { value: "○", tone: "success" },
            { value: "○", tone: "success" },
          ],
        },
        {
          label: "MCP Prompt Auto-Generation",
          values: [
            { value: "○", tone: "success" },
            { value: "○", tone: "success" },
          ],
        },
        {
          label: "MCP Preset on 3rd Party Apps",
          values: [
            { value: "○", tone: "success" },
            { value: "○", tone: "success" },
          ],
        },
        {
          label: "Available Built-in Agents",
          values: [
            { value: "○", tone: "success" },
            { value: "○", tone: "success" },
          ],
        },
        {
          label: "Skills",
          values: [
            { value: "○", tone: "success" },
            { value: "○", tone: "success" },
          ],
        },
        {
          label: "Image Generation",
          values: [
            { value: "○", tone: "success" },
            { value: "○", tone: "success" },
          ],
        },
        {
          label: "RAG Knowledge Bundle Limit",
          values: [
            { value: "○ 10", tone: "success" },
            { value: "○ Unlimited", tone: "success" },
          ],
        },
        {
          label: "Personal Edge Tunnels",
          values: [
            { value: "○ 20", tone: "success" },
            { value: "○ Unlimited", tone: "success" },
          ],
        },
        {
          label: "Agent Scheduling",
          values: [
            { value: "○ 10", tone: "success" },
            { value: "○ Unlimited", tone: "success" },
          ],
        },
        {
          label: "AI Agent Creation Limit",
          values: [
            { value: "○ 30", tone: "success" },
            { value: "○ Unlimited", tone: "success" },
          ],
        },
        {
          label: "My Drive",
          values: [
            { value: "○ 1GB / user", tone: "success" },
            { value: "○ 10GB / user", tone: "success" },
          ],
        },
      ],
    },
    {
      title: "Security Features",
      rows: [
        {
          label: "SSO",
          values: [
            { value: "✕", tone: "danger" },
            { value: "○", tone: "success" },
          ],
        },
        {
          label: "Chat Retention",
          values: [
            { value: "✕", tone: "danger" },
            { value: "○", tone: "success" },
          ],
        },
        {
          label: "DLP",
          values: [
            { value: "✕", tone: "danger" },
            { value: "○", tone: "success" },
          ],
        },
        {
          label: "Login IP ACL",
          values: [
            { value: "○", tone: "success" },
            { value: "○", tone: "success" },
          ],
        },
        {
          label: "Audit Logs",
          values: [
            { value: "○ Max 90 days", tone: "success" },
            { value: "○ Max 180 days", tone: "success" },
          ],
        },
      ],
    },
    {
      title: "Organizational Features",
      rows: [
        {
          label: "Pre-configured MCP Integration",
          values: [
            { value: "✕", tone: "danger" },
            { value: "○", tone: "success" },
          ],
        },
        {
          label: "Organizational Edge Tunnels",
          values: [
            { value: "✕", tone: "danger" },
            { value: "○", tone: "success" },
          ],
        },
        {
          label: "MCP Access Control",
          values: [
            { value: "○", tone: "success" },
            { value: "○", tone: "success" },
          ],
        },
        {
          label: "Agent Access Control",
          values: [
            { value: "○", tone: "success" },
            { value: "○", tone: "success" },
          ],
        },
        {
          label: "LLM Model Control",
          values: [
            { value: "○", tone: "success" },
            { value: "○", tone: "success" },
          ],
        },
      ],
    },
    {
      title: "Branding & Support",
      rows: [
        {
          label: "Custom Branding",
          values: [
            { value: "✕", tone: "danger" },
            { value: "○", tone: "success" },
          ],
        },
        {
          label: "FDE (Forward Deployed Engineer)",
          values: [
            { value: "✕", tone: "danger" },
            { value: "○ (Add-on)", tone: "success" },
          ],
        },
        {
          label: "Customer Support",
          values: [
            { value: "Email support within 24 hrs", tone: "muted" },
            { value: "Dedicated", tone: "muted" },
          ],
        },
      ],
    },
  ],
};
