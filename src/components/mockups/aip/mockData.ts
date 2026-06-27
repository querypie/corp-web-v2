export type AipMockupAgent = {
  id: string;
  name: string;
  owner: "Personal Agent" | "Organization Agent";
  shortName: string;
};

export type AipMockupMenuItem = {
  id: string;
  label: string;
};

export type AipMockupMessage =
  | {
      id: string;
      body: string;
      role: "user";
    }
  | {
      id: string;
      body: string[];
      card?: {
        description: string;
        rows: Array<[string, string, string]>;
        title: string;
      };
      role: "assistant";
      title: string;
    };

export const aipMockupMenuItems: AipMockupMenuItem[] = [
  { id: "chat", label: "New chat" },
  { id: "agents", label: "Agents" },
  { id: "presets", label: "Presets" },
  { id: "mcp", label: "MCP" },
  { id: "widgets", label: "Widgets" },
  { id: "automation", label: "Automation" },
  { id: "my-drive", label: "My Drive" },
  { id: "skills", label: "Skills" },
];

export const aipMockupAgents: AipMockupAgent[] = [
  { id: "finance-analyst", name: "Finance Analyst", owner: "Organization Agent", shortName: "F" },
  { id: "sales-ops", name: "Sales Ops Agent", owner: "Organization Agent", shortName: "S" },
  { id: "data-analysis", name: "Data Analysis Agent", owner: "Personal Agent", shortName: "D" },
  { id: "report-writer", name: "Report Writer", owner: "Personal Agent", shortName: "R" },
];

export const aipMockupMessages: AipMockupMessage[] = [
  {
    id: "user-1",
    role: "user",
    body: "Show me the names and masked emails of the top 10 VIP customers this month.",
  },
  {
    id: "assistant-1",
    role: "assistant",
    title: "Data Analysis Agent",
    body: [
      "I found the top VIP customers and masked their email addresses according to the data policy.",
      "The results are sorted by total spend, with the customer segment and last activity included for review.",
    ],
    card: {
      title: "Top 10 VIP Customers - This Month",
      description: "Masked customer table",
      rows: [
        ["Olivia Park", "VIP", "$48,200"],
        ["Daniel Kim", "VIP", "$42,810"],
        ["Mina Choi", "VIP", "$39,450"],
      ],
    },
  },
];

export const aipMockupMcpTools = ["Salesforce", "Snowflake", "Google Drive", "Slack"] as const;
