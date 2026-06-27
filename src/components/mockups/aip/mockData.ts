export type AipMockupAgent = {
  id: string;
  name: string;
  shortName: string;
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
        title: string;
        type: "table" | "workflow";
      };
      role: "assistant";
      title: string;
    };

export const aipMockupAgents: AipMockupAgent[] = [
  { id: "lingo", name: "Lingo", shortName: "L" },
  { id: "ledger", name: "Household ledger", shortName: "H" },
  { id: "analytics", name: "Data Analysis Agent", shortName: "D" },
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
    title: "Data Analytics Agent",
    body: [
      "I found the top VIP customers and masked their email addresses according to the data policy.",
      "The results are sorted by total spend, with the customer segment and last activity included for review.",
    ],
    card: {
      type: "table",
      title: "Top 10 VIP Customers - This Month",
      description: "Masked customer table",
    },
  },
];

export const aipMockupIntegrations = [
  "Salesforce",
  "Snowflake",
  "Google Drive",
  "Slack",
  "PostgreSQL",
  "Notion",
] as const;
