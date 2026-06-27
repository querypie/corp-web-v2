"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { aipMockupChats, aipMockupMenuItems } from "./mockData";

type IconName =
  | "agent"
  | "automation"
  | "bell"
  | "building2"
  | "chevron"
  | "grid"
  | "message"
  | "mic"
  | "plus"
  | "send"
  | "settings"
  | "sparkle";

const iconPaths: Record<IconName, string> = {
  agent: "M12 4a4 4 0 014 4v1a4 4 0 01-8 0V8a4 4 0 014-4z M5 20a7 7 0 0114 0",
  automation: "M12 3v4m0 10v4M4.9 5.6l2.8 2.8m8.6 8.6l2.8 2.8M3 12h4m10 0h4M4.9 18.4l2.8-2.8m8.6-8.6l2.8-2.8",
  bell: "M18 8a6 6 0 00-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4",
  building2: "M10 12h4 M10 8h4 M14 21v-3a2 2 0 0 0-4 0v3 M6 10H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2 M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16",
  chevron: "M9 6l6 6-6 6",
  grid: "M4 4h6v6H4z M14 4h6v6h-6z M4 14h6v6H4z M14 14h6v6h-6z",
  message: "M5 5h14v10H8l-4 4V5z",
  mic: "M12 4a3 3 0 00-3 3v5a3 3 0 006 0V7a3 3 0 00-3-3z M5 11a7 7 0 0014 0 M12 18v3",
  plus: "M12 5v14M5 12h14",
  send: "M5 12h13M12 5l7 7-7 7",
  settings: "M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915",
  sparkle: "M12 3l2 5 5 2-5 2-2 5-2-5-5-2 5-2 2-5z",
};

type MenuIconName = "botMessageSquare" | "clock" | "component" | "hardDrive" | "mcp" | "messageSquare" | "puzzle";

const menuIconById: Record<string, MenuIconName> = {
  agents: "botMessageSquare",
  apps: "component",
  automation: "clock",
  chat: "messageSquare",
  mcp: "mcp",
  "my-drive": "hardDrive",
  skills: "puzzle",
};

function Icon({ name, className = "h-4 w-4" }: { className?: string; name: IconName }) {
  if (name === "settings") {
    return (
      <svg
        aria-hidden="true"
        className={className}
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path d={iconPaths.settings} />
        <circle cx="12" cy="12" r="3" />
      </svg>
    );
  }

  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      <path d={iconPaths[name]} />
    </svg>
  );
}

function MenuIcon({ name, className = "h-4 w-4" }: { className?: string; name: MenuIconName }) {
  if (name === "mcp") {
    return (
      <svg
        aria-hidden="true"
        className={className}
        fill="none"
        viewBox="0 0 16 16"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M8.97949 0.5C9.63901 0.5001 10.2689 0.746504 10.7354 1.18066C11.0022 1.42895 11.2019 1.73261 11.3203 2.06543C11.4387 2.39825 11.4724 2.75265 11.4199 3.09961L11.3203 3.75977L11.9824 3.66992C12.3641 3.61805 12.7534 3.65124 13.1191 3.76562C13.439 3.86571 13.7325 4.02564 13.9834 4.23438L14.0889 4.32715L14.1191 4.35645L14.124 4.36035C14.35 4.57058 14.5291 4.82102 14.6504 5.0957C14.7716 5.37019 14.833 5.66446 14.833 5.96094C14.833 6.25757 14.7717 6.55253 14.6504 6.82715C14.5291 7.10177 14.35 7.35134 14.124 7.56152L14.123 7.56348L8.05664 13.2529C8.02303 13.2842 7.99264 13.3189 7.96582 13.3564L7.89648 13.4775C7.85882 13.563 7.8389 13.6558 7.83887 13.75C7.83887 13.8445 7.85867 13.9378 7.89648 14.0234C7.9339 14.1081 7.98853 14.1831 8.05469 14.2451V14.2461L9.30078 15.415L9.30273 15.417C9.30876 15.4226 9.3125 15.4282 9.31445 15.4326C9.31632 15.4369 9.31738 15.4411 9.31738 15.4443C9.31733 15.4474 9.31621 15.451 9.31445 15.4551C9.31251 15.4595 9.30873 15.4651 9.30273 15.4707C9.28514 15.4871 9.25687 15.5 9.22363 15.5C9.19059 15.4999 9.16205 15.487 9.14453 15.4707L7.90039 14.3037L7.89941 14.3027L7.84277 14.2441C7.78999 14.1841 7.74711 14.1177 7.71582 14.0469C7.67413 13.9525 7.65338 13.8519 7.65332 13.751C7.65332 13.6499 7.67407 13.5486 7.71582 13.4541C7.75759 13.3596 7.81999 13.273 7.89941 13.1992L7.90039 13.1973L13.9688 7.50488L13.9678 7.50391C14.1806 7.30535 14.3518 7.06778 14.4688 6.80273C14.586 6.53702 14.6474 6.25083 14.6475 5.96094C14.6475 5.67093 14.5861 5.38398 14.4688 5.11816C14.3517 4.85295 14.1808 4.61462 13.9678 4.41602H13.9688L13.9336 4.38281L13.9326 4.38184L13.7646 4.24023C13.3581 3.92892 12.8537 3.7592 12.335 3.75879C11.7424 3.75843 11.1688 3.97947 10.7373 4.37988L10.7354 4.38086L5.7373 9.07031L5.73438 9.07324L5.66895 9.13574C5.65137 9.15211 5.62309 9.16404 5.58984 9.16406C5.55662 9.16406 5.52834 9.15209 5.51074 9.13574V9.13477C5.50475 9.12914 5.50097 9.12354 5.49902 9.11914C5.49727 9.11507 5.49615 9.11151 5.49609 9.1084C5.49609 9.10517 5.49716 9.10098 5.49902 9.09668C5.50097 9.09227 5.50472 9.0867 5.51074 9.08105L5.5127 9.0791L10.5811 4.32422L10.5801 4.32324C10.7929 4.12433 10.9643 3.8865 11.0811 3.62109C11.1979 3.35543 11.2581 3.06898 11.2578 2.7793C11.2575 2.48971 11.1963 2.20386 11.0791 1.93848C10.9619 1.67312 10.7914 1.43398 10.5781 1.23535C10.1468 0.833794 9.57269 0.612404 8.97949 0.612305C8.38628 0.612305 7.81228 0.833863 7.38086 1.23535L7.37891 1.23633L0.671875 7.52832C0.654279 7.54468 0.62601 7.55762 0.592773 7.55762C0.559729 7.55758 0.532231 7.54456 0.514648 7.52832C0.508531 7.52263 0.504898 7.51714 0.50293 7.5127C0.500992 7.50831 0.5 7.50426 0.5 7.50098C0.500042 7.49783 0.501137 7.49438 0.50293 7.49023C0.504896 7.48578 0.508518 7.47934 0.514648 7.47363L0.515625 7.47266L7.22363 1.18066C7.69012 0.746521 8.31992 0.5 8.97949 0.5ZM8.97949 2.72461C9.01248 2.72471 9.04009 2.73767 9.05762 2.75391H9.05859C9.06444 2.75938 9.06735 2.76519 9.06934 2.76953C9.07125 2.77388 9.07225 2.77799 9.07227 2.78125C9.07227 2.78453 9.07127 2.78858 9.06934 2.79297C9.06738 2.79732 9.06445 2.80308 9.05859 2.80859L9.35449 3.12793L9.33984 3.1123L9.05762 2.80859L9.05664 2.80957L4.0957 7.46289C3.88212 7.66174 3.71103 7.90126 3.59375 8.16699C3.47644 8.4328 3.41504 8.71976 3.41504 9.00977C3.41511 9.29961 3.4765 9.58589 3.59375 9.85156C3.71104 10.1173 3.88211 10.3568 4.0957 10.5557C4.52713 10.9572 5.10112 11.1777 5.69434 11.1777C6.28756 11.1777 6.86155 10.9572 7.29297 10.5557L7.29395 10.5537L12.2549 5.90039C12.2725 5.88408 12.3008 5.87109 12.334 5.87109C12.3669 5.8712 12.3946 5.88419 12.4121 5.90039C12.418 5.90587 12.4218 5.91166 12.4238 5.91602C12.4257 5.92029 12.4267 5.92451 12.4268 5.92773C12.4268 5.93101 12.4258 5.93507 12.4238 5.93945C12.4219 5.94389 12.4182 5.94943 12.4121 5.95508L12.4111 5.95703L7.44824 10.6113C6.98183 11.0444 6.35314 11.29 5.69434 11.29C5.03481 11.29 4.40505 11.0444 3.93848 10.6104V10.6094C3.71267 10.3993 3.53435 10.1495 3.41309 9.875C3.29188 9.60052 3.22956 9.30624 3.22949 9.00977C3.22949 8.71314 3.29181 8.41818 3.41309 8.14355C3.53435 7.86908 3.71267 7.61928 3.93848 7.40918L3.94043 7.40723L8.90039 2.75391C8.91799 2.73756 8.94627 2.72461 8.97949 2.72461Z"
          fill="currentColor"
          stroke="currentColor"
        />
      </svg>
    );
  }

  if (name === "botMessageSquare") {
    return (
      <MenuSvg className={className}>
        <path d="M12 6V2H8" />
        <path d="M15 11v2" />
        <path d="M2 12h2" />
        <path d="M20 12h2" />
        <path d="M20 16a2 2 0 0 1-2 2H8.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 4 20.286V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2z" />
        <path d="M9 11v2" />
      </MenuSvg>
    );
  }

  if (name === "clock") {
    return (
      <MenuSvg className={className}>
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </MenuSvg>
    );
  }

  if (name === "component") {
    return (
      <MenuSvg className={className}>
        <path d="M15.536 11.293a1 1 0 0 0 0 1.414l2.376 2.377a1 1 0 0 0 1.414 0l2.377-2.377a1 1 0 0 0 0-1.414l-2.377-2.377a1 1 0 0 0-1.414 0z" />
        <path d="M2.297 11.293a1 1 0 0 0 0 1.414l2.377 2.377a1 1 0 0 0 1.414 0l2.377-2.377a1 1 0 0 0 0-1.414L6.088 8.916a1 1 0 0 0-1.414 0z" />
        <path d="M8.916 17.912a1 1 0 0 0 0 1.415l2.377 2.376a1 1 0 0 0 1.414 0l2.377-2.376a1 1 0 0 0 0-1.415l-2.377-2.376a1 1 0 0 0-1.414 0z" />
        <path d="M8.916 4.674a1 1 0 0 0 0 1.414l2.377 2.376a1 1 0 0 0 1.414 0l2.377-2.376a1 1 0 0 0 0-1.414l-2.377-2.377a1 1 0 0 0-1.414 0z" />
      </MenuSvg>
    );
  }

  if (name === "hardDrive") {
    return (
      <MenuSvg className={className}>
        <path d="M2.212 11.577a2 2 0 0 0-.212.896V18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-5.527a2 2 0 0 0-.212-.896L18.55 5.11A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
        <path d="M21.946 12.013H2.054" />
        <path d="M6 16h.01" />
      </MenuSvg>
    );
  }

  if (name === "puzzle") {
    return (
      <MenuSvg className={className}>
        <path d="M15.39 4.39a1 1 0 0 0 1.68-.474 2.5 2.5 0 1 1 3.014 3.015 1 1 0 0 0-.474 1.68l1.683 1.682a2.414 2.414 0 0 1 0 3.414L19.61 15.39a1 1 0 0 1-1.68-.474 2.5 2.5 0 1 0-3.014 3.015 1 1 0 0 1 .474 1.68l-1.683 1.682a2.414 2.414 0 0 1-3.414 0L8.61 19.61a1 1 0 0 0-1.68.474 2.5 2.5 0 1 1-3.014-3.015 1 1 0 0 0 .474-1.68l-1.683-1.682a2.414 2.414 0 0 1 0-3.414L4.39 8.61a1 1 0 0 1 1.68.474 2.5 2.5 0 1 0 3.014-3.015 1 1 0 0 1-.474-1.68l1.683-1.682a2.414 2.414 0 0 1 3.414 0z" />
      </MenuSvg>
    );
  }

  return (
    <MenuSvg className={className}>
      <path d="M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z" />
    </MenuSvg>
  );
}

function MenuSvg({ children, className }: { children: ReactNode; className: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      {children}
    </svg>
  );
}

function Sidebar({
  activeMenu,
  onMenuClick,
}: {
  activeMenu: string;
  onMenuClick: (menu: string) => void;
}) {
  return (
    <aside className="hidden w-[260px] shrink-0 border-r border-[#27272a] bg-[#1f1f1f] text-[#f4f4f5] md:flex md:flex-col">
      <div className="flex h-14 items-center justify-between gap-0 px-2 py-0">
        <button className="flex min-w-0 items-center justify-start rounded-md bg-transparent p-2 text-left transition-colors hover:bg-white/10" type="button">
          <img
            alt="QueryPie AI"
            className="h-5 w-auto max-w-[140px]"
            src="/assets/brand/logos/querypie-ai-logo.svg"
          />
        </button>
      </div>

      <nav className="flex min-h-0 flex-1 flex-col gap-4 overflow-auto p-2">
        <div className="flex flex-col gap-0.5">
          {aipMockupMenuItems.map((item) => {
            const isActive = activeMenu === item.id;
            return (
              <button
                className={`group flex h-9 w-full min-w-0 items-center gap-2.5 overflow-hidden rounded-md pl-3 pr-2 text-left text-sm outline-none transition-colors ${
                  isActive
                    ? "bg-white/10 text-[#f4f4f5]"
                    : "text-[#f4f4f5] hover:bg-white/10 hover:text-[#f4f4f5]"
                }`}
                key={item.id}
                onClick={() => onMenuClick(item.id)}
                type="button"
              >
                <MenuIcon className="h-4 w-4 shrink-0" name={menuIconById[item.id]} />
                <span className="min-w-0 truncate">{item.label}</span>
              </button>
            );
          })}
        </div>

        <div className="relative flex min-w-0 flex-1 flex-col">
          <div className="flex shrink-0 items-center rounded-md px-1 py-2 text-xs text-[#a1a1aa]">Chat</div>
          <div className="flex flex-col text-sm">
            {aipMockupChats.map((chat) => (
              <button
                className="group relative flex h-9 w-full items-center rounded-lg text-left text-sm text-[#f4f4f5] transition-colors duration-200 hover:bg-white/10"
                key={chat}
                onClick={() => onMenuClick("chat")}
                type="button"
              >
                <span className="min-w-0 truncate pl-3 pr-2">{chat}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      <div className="relative flex items-center justify-between gap-2 px-2 pb-2 pl-1 pr-2 pt-2">
        <button aria-label="Profile" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-white/10" type="button">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#d9e2ff] to-[#8795ff]" />
        </button>
        <div className="flex items-center gap-1.5">
          <button className="flex h-8 items-center gap-[5px] whitespace-nowrap rounded-md px-2 text-sm font-normal text-[#f4f4f5] hover:bg-white/10" type="button">
            <span className="h-2 w-2 rounded-full bg-[#039855]" />
            Edge Tunnel
          </button>
          <button aria-label="Notifications" className="relative flex h-8 w-8 items-center justify-center rounded-md text-[#f4f4f5] hover:bg-white/10" type="button">
            <Icon name="bell" />
          </button>
          <button aria-label="Workspace admin" className="relative flex h-8 w-8 items-center justify-center rounded-md text-[#f4f4f5] hover:bg-white/10" type="button">
            <Icon name="building2" />
            <span className="absolute bottom-1.5 left-[calc(50%+2px)] rounded-full bg-[#1f1f1f] p-px">
              <Icon className="h-3 w-3 stroke-2" name="settings" />
            </span>
          </button>
        </div>
      </div>
    </aside>
  );
}

type LlmModel = {
  id: string;
  label: string;
  options?: boolean;
};

type LlmGroup = {
  icon: "aip" | "claude" | "gemini" | "gpt" | "solar";
  id: string;
  label: string;
  models: LlmModel[];
};

const llmModelGroups: LlmGroup[] = [
  {
    id: "aip",
    icon: "aip",
    label: "AIP",
    models: [
      { id: "auto", label: "Auto Router" },
      { id: "QLM-1", label: "Auto" },
    ],
  },
  {
    id: "anthropic.claude",
    icon: "claude",
    label: "Claude",
    models: [
      { id: "claude-4.6-sonnet", label: "Claude Sonnet 4.6", options: true },
      { id: "claude-4.6-opus", label: "Claude Opus 4.6", options: true },
    ],
  },
  {
    id: "openai.gpt",
    icon: "gpt",
    label: "GPT",
    models: [
      { id: "gpt-4.1", label: "GPT-4.1", options: true },
      { id: "gpt-4o", label: "GPT-4o", options: true },
    ],
  },
  {
    id: "google.gemini",
    icon: "gemini",
    label: "Gemini",
    models: [
      { id: "gemini-2.5-pro", label: "Gemini 2.5 Pro", options: true },
      { id: "gemini-2.5-flash", label: "Gemini 2.5 Flash" },
    ],
  },
  {
    id: "upstage.solar",
    icon: "solar",
    label: "Solar",
    models: [{ id: "solar-pro2", label: "Solar Pro 2" }],
  },
];

function LlmIcon({ group, className = "h-4 w-4" }: { className?: string; group: LlmGroup["icon"] }) {
  return <img alt={group} className={className} src={`/assets/icons/llm-${group}-color.svg`} />;
}

function PinIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path d="M12 17v5" />
      <path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16h14v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V4h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1z" />
    </svg>
  );
}

function Settings2Icon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path d="M20 7h-9" />
      <path d="M14 17H5" />
      <circle cx="17" cy="17" r="3" />
      <circle cx="7" cy="7" r="3" />
    </svg>
  );
}

function AppHeader() {
  const [isModelSelectorOpen, setIsModelSelectorOpen] = useState(false);
  const [selectedModelId, setSelectedModelId] = useState("gpt-4.1");
  const [pinnedModelId, setPinnedModelId] = useState<string | null>(null);
  const [expandedModelId, setExpandedModelId] = useState<string | null>(null);
  const selectedGroup =
    llmModelGroups.find((group) => group.models.some((model) => model.id === selectedModelId)) ?? llmModelGroups[0];
  const selectedModel = selectedGroup.models.find((model) => model.id === selectedModelId) ?? selectedGroup.models[0];
  const pinnedModel =
    pinnedModelId == null
      ? null
      : llmModelGroups
          .flatMap((group) => group.models.map((model) => ({ group, model })))
          .find(({ model }) => model.id === pinnedModelId) ?? null;

  const selectModel = (modelId: string) => {
    setSelectedModelId(modelId);
    setIsModelSelectorOpen(false);
    setExpandedModelId(null);
  };

  return (
    <header className="sticky top-0 z-40 shrink-0 overflow-visible bg-white">
      <div className="mx-auto flex h-14 max-w-[1088px] items-center justify-between px-3 md:px-5">
        <div className="relative flex min-w-0 shrink-0 items-center gap-2">
          <button
            aria-expanded={isModelSelectorOpen}
            className="inline-flex h-9 min-w-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg border-none px-3 py-2 text-sm font-medium text-[#171717] transition-all hover:bg-[#f5f5f5]"
            onClick={() => setIsModelSelectorOpen((value) => !value)}
            type="button"
          >
            <span className="hidden md:block">
              <LlmIcon group={selectedGroup.icon} />
            </span>
            <span className="truncate">{selectedModel.label}</span>
            <Icon className="h-4 w-4 shrink-0 rotate-90 text-[#737373]" name="chevron" />
          </button>

          {isModelSelectorOpen ? (
            <div className="absolute left-0 top-11 z-50 w-[240px] min-w-max rounded-md border border-[#e5e5e5] bg-white p-2 text-[#171717] shadow-md">
              <div className="flex max-h-[400px] flex-col overflow-y-auto overflow-x-hidden">
                {pinnedModel ? (
                  <>
                    <div className="overflow-hidden p-1 text-[#171717]">
                      <div className="flex items-center gap-1.5 px-2 py-1.5 text-xs font-medium text-[#737373]">
                        <PinIcon className="h-3.5 w-3.5" />
                        <span className="text-sm font-normal">Pinned</span>
                      </div>
                      <div
                        aria-label={pinnedModel.model.label}
                        className="group/item flex w-full cursor-default select-none items-center justify-between rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-[#f5f5f5]"
                        onClick={() => selectModel(pinnedModel.model.id)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter" || event.key === " ") selectModel(pinnedModel.model.id);
                        }}
                        role="button"
                        tabIndex={0}
                      >
                        <div className="flex items-center gap-2">
                          <LlmIcon group={pinnedModel.group.icon} />
                          <span className={pinnedModel.model.id === selectedModelId ? "text-[#006adc]" : undefined}>
                            {pinnedModel.model.label}
                          </span>
                        </div>
                        <button
                          aria-label="Unpin model"
                          className="rounded p-1 hover:bg-[#f5f5f5]"
                          onClick={(event) => {
                            event.stopPropagation();
                            setPinnedModelId(null);
                          }}
                          type="button"
                        >
                          <PinIcon className="h-4 w-4 text-[#171717]" />
                        </button>
                      </div>
                    </div>
                    <div className="-mx-1 h-px bg-[#e5e5e5]" />
                  </>
                ) : null}

                {llmModelGroups.map((group, index) => {
                  const visibleModels = group.models.filter((model) => model.id !== pinnedModelId);
                  if (visibleModels.length === 0) return null;

                  return (
                    <div key={group.id}>
                      {index > 0 || pinnedModel ? <div className="-mx-1 h-px bg-[#e5e5e5]" /> : null}
                      <div className="overflow-hidden p-1 text-[#171717]">
                        <div className="flex items-center gap-2 px-2 py-1.5 text-xs font-medium text-[#737373]">
                          <LlmIcon group={group.icon} />
                          <span className="text-sm font-normal">{group.label}</span>
                        </div>
                        {visibleModels.map((model) => {
                          const isSelected = model.id === selectedModelId;
                          const isExpanded = expandedModelId === model.id;
                          return (
                            <div
                              aria-label={model.label}
                              className="group/item flex w-full cursor-default select-none items-center justify-between rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-[#f5f5f5]"
                              key={model.id}
                              onClick={() => selectModel(model.id)}
                              onKeyDown={(event) => {
                                if (event.key === "Enter" || event.key === " ") selectModel(model.id);
                              }}
                              role="button"
                              tabIndex={0}
                            >
                              <span className={isSelected ? "text-[#006adc]" : undefined}>{model.label}</span>
                              <div className="flex items-center gap-1">
                                <button
                                  aria-label="Pin model"
                                  className="rounded p-1 opacity-0 hover:bg-[#f5f5f5] group-hover/item:opacity-100"
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    setPinnedModelId(model.id);
                                  }}
                                  type="button"
                                >
                                  <PinIcon className="h-4 w-4 text-[#737373]" />
                                </button>
                                {model.options ? (
                                  <button
                                    aria-label="Options"
                                    className={[
                                      "rounded p-1 hover:bg-[#f5f5f5]",
                                      isExpanded ? "bg-[#f5f5f5]" : "",
                                    ].join(" ")}
                                    onClick={(event) => {
                                      event.stopPropagation();
                                      setExpandedModelId(isExpanded ? null : model.id);
                                    }}
                                    type="button"
                                  >
                                    <Settings2Icon className="h-4 w-4" />
                                  </button>
                                ) : null}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : null}
        </div>
        <div className="flex shrink-0 items-center" />
      </div>
    </header>
  );
}

function ChatWelcomeLanding() {
  return (
    <div className="flex h-full max-h-full transform-gpu flex-col items-center justify-center pb-1 transition-all duration-200 sm:max-h-0 sm:pb-16">
      <div className="flex flex-col items-center gap-0 p-2">
        <div className="flex items-center justify-center gap-4">
          <h1 className="m-0 text-center text-2xl font-normal text-[#171717] sm:text-4xl">
            Good afternoon, Jane Lee
          </h1>
        </div>
      </div>
    </div>
  );
}

function ChatFormAction({
  children,
  className = "",
  label,
}: {
  children: ReactNode;
  className?: string;
  label: string;
}) {
  return (
    <button
      aria-label={label}
      className={[
        "inline-flex h-9 w-9 items-center justify-center rounded-full p-1 text-[#171717] transition-colors hover:bg-[#f5f5f5]",
        className,
      ].join(" ")}
      type="button"
    >
      {children}
    </button>
  );
}

function PresetMentionTrigger() {
  return (
    <button
      aria-label="Select preset"
      className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-transparent text-[#171717] transition-colors hover:bg-[#f5f5f5]"
      type="button"
    >
      <svg
        aria-hidden="true"
        className="h-6 w-6"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8" />
      </svg>
    </button>
  );
}

function McpToggleTrigger() {
  return (
    <ChatFormAction label="Use MCP">
      <MenuIcon className="h-6 w-6" name="mcp" />
    </ChatFormAction>
  );
}

function ContextWindowUsage() {
  return null;
}

function ChatAudioRecorder() {
  return (
    <button
      aria-label="Voice input"
      className="inline-flex h-9 w-9 items-center justify-center rounded-full p-1 text-[#374151] transition-colors hover:bg-[#f5f5f5]"
      type="button"
    >
      <Icon className="h-6 w-6" name="mic" />
    </button>
  );
}

function PresetChatForm() {
  return (
    <div className="relative mx-auto w-full max-w-[800px]">
      <div className="relative isolate">
        <div className="relative z-20 transition-transform duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)]">
          <form className="mx-auto flex w-full max-w-[800px] flex-row gap-3 transition-all duration-[600ms]">
            <div className="relative flex h-full min-w-0 flex-1 flex-col items-stretch">
              <div className="relative" />
              <div className="flex w-full items-center">
                <div className="relative flex w-full grow flex-col overflow-hidden rounded-[30px] border border-[#d4d4d4] bg-white text-[#171717] shadow-sm transition-all duration-[600ms]">
                  <div />
                  <div className="px-5 pb-3.5 pt-[18px]">
                    <textarea
                      className="m-0 box-border max-h-[min(30svh,13rem)] min-h-[24px] w-full resize-none whitespace-pre-wrap break-words bg-transparent text-[15px] leading-6 text-[#171717] outline-none placeholder:text-black/50"
                      placeholder="Ask me anything"
                      readOnly
                      rows={1}
                    />
                  </div>
                  <div className="flex items-center gap-1.5 px-3 pb-3">
                    <div className="flex items-center gap-0.5">
                      <ChatFormAction label="Open attachment menu">
                        <Icon className="h-6 w-6" name="plus" />
                      </ChatFormAction>
                      <PresetMentionTrigger />
                      <McpToggleTrigger />
                    </div>
                    <div className="mx-auto flex" />
                    <div className="flex items-center gap-2">
                      <ContextWindowUsage />
                      <ChatAudioRecorder />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function NewChatScreen() {
  return (
    <section className="flex h-full min-h-0 flex-col bg-white">
      <div className="min-h-0 flex-1">
        <div className="relative h-full w-full flex-1 grow overflow-hidden">
          <div className="flex h-full w-full flex-col">
            <div className="flex flex-1 flex-col items-center justify-center">
              <ChatWelcomeLanding />
              <PresetChatForm />
              <div aria-hidden="true" className="hidden h-[100px] sm:block" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function AipMockupShell({ className }: { className?: string }) {
  const [activeMenu, setActiveMenu] = useState("chat");

  return (
    <div className={["w-full", className].filter(Boolean).join(" ")} data-aip-mockup>
      <div className="mx-auto flex h-[700px] w-full max-w-[1180px] overflow-hidden rounded-[22px] border border-[#d0d5dd] bg-white text-[#101828] shadow-[0_32px_100px_rgba(16,24,40,0.18)] md:h-[760px]">
        <Sidebar activeMenu={activeMenu} onMenuClick={setActiveMenu} />
        <div className="flex min-w-0 flex-1 flex-col">
          <AppHeader />
          <NewChatScreen />
        </div>
      </div>
    </div>
  );
}
