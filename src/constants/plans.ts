export type PlanCard = {
  ctaLabel: string;
  description: string;
  features: string[];
  href: string;
  name: string;
  priceLabel: string;
  tone?: "primary" | "secondary";
};

export type ComparisonValue = {
  tone?: "danger" | "muted" | "success";
  value: string;
};

export type ComparisonRow = {
  label: string;
  values: ComparisonValue[];
};

export type ComparisonGroup = {
  rows: ComparisonRow[];
  title: string;
};

export type PricingProduct = {
  cards: PlanCard[];
  comparisonGroups: ComparisonGroup[];
  plans: string[];
  tabLabel: string;
};

export type PricingProducts = Record<"aip" | "acp", PricingProduct>;

export const pricingProducts: PricingProducts = {
  aip: {
    tabLabel: "QueryPie AIP",
    plans: ["Starter", "Team", "Enterprise"],
    cards: [
      {
        name: "Starter",
        description: "Build your first AI workflow",
        priceLabel: "$20/mo",
        href: "/en/docs",
        ctaLabel: "Subscribe",
        features: [
          "800 monthly credits",
          "Custom AI agents (Unlimited for now)",
          "3 RAG knowledge bundles",
          "Audit logs (max 30 days)",
          "Login IP ACL",
        ],
      },
      {
        name: "Team",
        description: "Collaborate and innovate together",
        priceLabel: "$500/mo",
        href: "/en/docs",
        ctaLabel: "Subscribe",
        features: [
          "20,000 monthly credits",
          "Custom AI agents (Unlimited for now)",
          "10 RAG knowledge bundles",
          "Audit logs (max 90 days)",
          "DLP",
          "Login IP ACL",
        ],
      },
      {
        name: "Enterprise",
        description: "Enterprise power unleashed",
        priceLabel: "Let's Talk",
        href: "/en/docs",
        ctaLabel: "Try Now",
        tone: "primary",
        features: [
          "Custom Prepaid Credits",
          "Unlimited custom AI agents",
          "Unlimited RAG knowledge bundles",
          "Audit logs (max 180 days)",
          "SSO",
          "DLP",
          "Login IP ACL",
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
              { value: "$20/month" },
              { value: "$500/month" },
              { value: "Custom Pricing" },
            ],
          },
          {
            label: "Monthly Credits",
            values: [
              { value: "800 credits", tone: "muted" },
              { value: "20,000 credits", tone: "muted" },
              { value: "Custom Prepaid Credits", tone: "muted" },
            ],
          },
          {
            label: "Available LLM Providers",
            values: [
              { value: "Anthropic", tone: "muted" },
              { value: "Anthropic / OpenAI / Gemini", tone: "muted" },
              { value: "Any LLM Provider", tone: "muted" },
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
              { value: "○", tone: "success" },
            ],
          },
          {
            label: "Insight Widgets",
            values: [
              { value: "○", tone: "success" },
              { value: "○", tone: "success" },
              { value: "○", tone: "success" },
            ],
          },
          {
            label: "Code Artifacts",
            values: [
              { value: "○", tone: "success" },
              { value: "○", tone: "success" },
              { value: "○", tone: "success" },
            ],
          },
          {
            label: "MCP Integrations",
            values: [
              { value: "○", tone: "success" },
              { value: "○", tone: "success" },
              { value: "○", tone: "success" },
            ],
          },
          {
            label: "MCP Preset Creation",
            values: [
              { value: "○", tone: "success" },
              { value: "○", tone: "success" },
              { value: "○", tone: "success" },
            ],
          },
          {
            label: "MCP Prompt Auto-Generation",
            values: [
              { value: "○", tone: "success" },
              { value: "○", tone: "success" },
              { value: "○", tone: "success" },
            ],
          },
          {
            label: "MCP Preset on 3rd Party Apps",
            values: [
              { value: "○", tone: "success" },
              { value: "○", tone: "success" },
              { value: "○", tone: "success" },
            ],
          },
          {
            label: "AI Agent Creation Limit",
            values: [
              { value: "○", tone: "success" },
              { value: "○", tone: "success" },
              { value: "○", tone: "success" },
            ],
          },
          {
            label: "Available Built-in Agents",
            values: [
              { value: "○", tone: "success" },
              { value: "○", tone: "success" },
              { value: "○", tone: "success" },
            ],
          },
          {
            label: "Agent Scheduling",
            values: [
              { value: "○", tone: "success" },
              { value: "○", tone: "success" },
              { value: "○", tone: "success" },
            ],
          },
          {
            label: "Custom LLM Model",
            values: [
              { value: "○", tone: "success" },
              { value: "✕", tone: "danger" },
              { value: "✕", tone: "danger" },
            ],
          },
          {
            label: "Support",
            values: [
              { value: "Email support within 48 hrs", tone: "muted" },
              { value: "Email support within 24 hrs", tone: "muted" },
              { value: "Dedicated", tone: "muted" },
            ],
          },
        ],
      },
    ],
  },
  acp: {
    tabLabel: "QueryPie ACP",
    plans: ["Starter", "Team", "Enterprise"],
    cards: [
      {
        name: "Starter",
        description: "Secure core access control quickly",
        priceLabel: "$29/mo",
        href: "/en/docs",
        ctaLabel: "Subscribe",
        features: [
          "Basic policy management",
          "10 connected resources",
          "30-day audit logs",
          "Login IP ACL",
          "Email support",
        ],
      },
      {
        name: "Team",
        description: "Operate identity and permissions at scale",
        priceLabel: "$590/mo",
        href: "/en/docs",
        ctaLabel: "Subscribe",
        features: [
          "Advanced policy management",
          "Unlimited connected resources",
          "90-day audit logs",
          "DLP",
          "Approval workflows",
          "Priority support",
        ],
      },
      {
        name: "Enterprise",
        description: "Govern large-scale access and compliance",
        priceLabel: "Let's Talk",
        href: "/en/docs",
        ctaLabel: "Try Now",
        tone: "primary",
        features: [
          "Unlimited policy templates",
          "SSO / SCIM",
          "180-day audit logs",
          "Dedicated support",
          "Custom compliance controls",
          "Advanced AI security features",
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
              { value: "$29/month" },
              { value: "$590/month" },
              { value: "Custom Pricing" },
            ],
          },
          {
            label: "Connected Resources",
            values: [
              { value: "10 resources", tone: "muted" },
              { value: "Unlimited", tone: "muted" },
              { value: "Unlimited", tone: "muted" },
            ],
          },
          {
            label: "Deployment",
            values: [
              { value: "Shared Cloud", tone: "muted" },
              { value: "Shared Cloud", tone: "muted" },
              { value: "Private / Hybrid", tone: "muted" },
            ],
          },
        ],
      },
      {
        title: "Platform Features",
        rows: [
          {
            label: "Policy Management",
            values: [
              { value: "○", tone: "success" },
              { value: "○", tone: "success" },
              { value: "○", tone: "success" },
            ],
          },
          {
            label: "Role-based Access Control",
            values: [
              { value: "○", tone: "success" },
              { value: "○", tone: "success" },
              { value: "○", tone: "success" },
            ],
          },
          {
            label: "Approval Workflows",
            values: [
              { value: "✕", tone: "danger" },
              { value: "○", tone: "success" },
              { value: "○", tone: "success" },
            ],
          },
          {
            label: "DLP",
            values: [
              { value: "✕", tone: "danger" },
              { value: "○", tone: "success" },
              { value: "○", tone: "success" },
            ],
          },
          {
            label: "SSO / SCIM",
            values: [
              { value: "✕", tone: "danger" },
              { value: "✕", tone: "danger" },
              { value: "○", tone: "success" },
            ],
          },
          {
            label: "Audit Log Retention",
            values: [
              { value: "30 days", tone: "muted" },
              { value: "90 days", tone: "muted" },
              { value: "180 days", tone: "muted" },
            ],
          },
        ],
      },
    ],
  },
};
