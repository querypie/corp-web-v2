"use client";

import type { ReactNode, WheelEvent } from "react";
import { useEffect, useRef, useState } from "react";
import { aipMockupAgents, aipMockupChats, aipMockupMenuItems } from "./mockData";

type IconName =
  | "agent"
  | "automation"
  | "bell"
  | "building2"
  | "chevron"
  | "grid"
  | "layers"
  | "list"
  | "message"
  | "messageShare"
  | "mic"
  | "moreHorizontal"
  | "plus"
  | "search"
  | "send"
  | "settings"
  | "sparkle"
  | "trash";

type HintIconName = "artifact" | "cloudUpload" | "file" | "folderUp" | "globe" | "image" | "speech" | "webApp" | "widget";

function handleMockupWheel(event: WheelEvent<HTMLDivElement>) {
  const target = event.target;

  if (!(target instanceof Element)) {
    return;
  }

  let element: Element | null = target;

  while (element && element !== event.currentTarget) {
    if (element instanceof HTMLElement) {
      const style = window.getComputedStyle(element);
      const canScrollY =
        event.deltaY !== 0 &&
        element.scrollHeight > element.clientHeight &&
        ["auto", "scroll"].includes(style.overflowY);
      const canScrollX =
        event.deltaX !== 0 &&
        element.scrollWidth > element.clientWidth &&
        ["auto", "scroll"].includes(style.overflowX);

      if (canScrollY || canScrollX) {
        const maxScrollTop = element.scrollHeight - element.clientHeight;
        const maxScrollLeft = element.scrollWidth - element.clientWidth;
        const nextScrollTop = canScrollY
          ? Math.max(0, Math.min(maxScrollTop, element.scrollTop + event.deltaY))
          : element.scrollTop;
        const nextScrollLeft = canScrollX
          ? Math.max(0, Math.min(maxScrollLeft, element.scrollLeft + event.deltaX))
          : element.scrollLeft;
        const moved = nextScrollTop !== element.scrollTop || nextScrollLeft !== element.scrollLeft;

        if (moved) {
          if (event.cancelable) {
            event.preventDefault();
          }
          event.stopPropagation();
          element.scrollTop = nextScrollTop;
          element.scrollLeft = nextScrollLeft;
          return;
        }
      }
    }

    element = element.parentElement;
  }
}

const iconPaths: Record<IconName, string> = {
  agent: "M12 4a4 4 0 014 4v1a4 4 0 01-8 0V8a4 4 0 014-4z M5 20a7 7 0 0114 0",
  automation: "M12 3v4m0 10v4M4.9 5.6l2.8 2.8m8.6 8.6l2.8 2.8M3 12h4m10 0h4M4.9 18.4l2.8-2.8m8.6-8.6l2.8-2.8",
  bell: "M18 8a6 6 0 00-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4",
  building2: "M10 12h4 M10 8h4 M14 21v-3a2 2 0 0 0-4 0v3 M6 10H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2 M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16",
  chevron: "M9 6l6 6-6 6",
  grid: "M4 4h6v6H4z M14 4h6v6h-6z M4 14h6v6H4z M14 14h6v6h-6z",
  layers: "M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.18a1 1 0 0 0 0 1.82l8.57 4a2 2 0 0 0 1.66 0L21.4 8a1 1 0 0 0 0-1.82z M22 12l-9.17 4.28a2 2 0 0 1-1.66 0L2 12 M22 16l-9.17 4.28a2 2 0 0 1-1.66 0L2 16",
  list: "M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01",
  message: "M5 5h14v10H8l-4 4V5z",
  messageShare: "M12 3H4a2 2 0 0 0-2 2v16.286a.71.71 0 0 0 1.212.502l2.202-2.202A2 2 0 0 1 6.828 19H20a2 2 0 0 0 2-2v-4 M16 3h6v6 m-6 0 6-6",
  mic: "M12 4a3 3 0 00-3 3v5a3 3 0 006 0V7a3 3 0 00-3-3z M5 11a7 7 0 0014 0 M12 18v3",
  moreHorizontal: "M12 12h.01M19 12h.01M5 12h.01",
  plus: "M12 5v14M5 12h14",
  search: "M10.5 18a7.5 7.5 0 1 1 5.3-12.8 7.5 7.5 0 0 1-5.3 12.8z M16 16l5 5",
  send: "M5 12h13M12 5l7 7-7 7",
  settings: "M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915",
  sparkle: "M12 3l2 5 5 2-5 2-2 5-2-5-5-2 5-2 2-5z",
  trash: "M3 6h18M8 6V4h8v2M10 11v6M14 11v6M5 6l1 15h12l1-15",
};

type MenuIconName = "botMessageSquare" | "clock" | "component" | "hardDrive" | "mcp" | "messageSquare" | "puzzle";

type AdminMenuIconName =
  | "bookOpen"
  | "botMessageSquare"
  | "box"
  | "brainCircuit"
  | "chartColumn"
  | "circleDollarSign"
  | "coins"
  | "layoutDashboard"
  | "lock"
  | "mcp"
  | "network"
  | "puzzle"
  | "scrollText"
  | "shieldCheck"
  | "shredder"
  | "slidersHorizontal"
  | "users";

type AdminMenuGroup = {
  id: string;
  items: Array<{
    icon: AdminMenuIconName;
    id: string;
    label: string;
  }>;
  label?: string;
};

const menuIconById: Record<string, MenuIconName> = {
  agents: "botMessageSquare",
  apps: "component",
  automation: "clock",
  chat: "messageSquare",
  mcp: "mcp",
  "my-drive": "hardDrive",
  skills: "puzzle",
};

const adminMenuGroups: AdminMenuGroup[] = [
  {
    id: "main",
    items: [{ id: "dashboard", icon: "layoutDashboard", label: "Dashboard" }],
  },
  {
    id: "organization",
    label: "Organization Settings",
    items: [
      { id: "general", icon: "slidersHorizontal", label: "General" },
      { id: "users", icon: "users", label: "Users" },
      { id: "sso", icon: "lock", label: "SSO" },
      { id: "billing", icon: "circleDollarSign", label: "Billing" },
      { id: "credits-history", icon: "coins", label: "Credits History" },
      { id: "credit-quota", icon: "coins", label: "Credit Limits" },
      { id: "usage-analytics", icon: "chartColumn", label: "Usage Analytics" },
    ],
  },
  {
    id: "ai-mcp",
    label: "AI & MCP Settings",
    items: [
      { id: "agent", icon: "botMessageSquare", label: "Agent" },
      { id: "knowledge", icon: "bookOpen", label: "Knowledge" },
      { id: "llm-models", icon: "brainCircuit", label: "LLM Models" },
      { id: "mcp", icon: "mcp", label: "MCP" },
      { id: "skills", icon: "puzzle", label: "Skills" },
    ],
  },
  {
    id: "security",
    label: "Security Settings",
    items: [
      { id: "access-control", icon: "shieldCheck", label: "Security" },
      { id: "sandbox", icon: "box", label: "Sandbox" },
      { id: "edge-tunnel", icon: "network", label: "Edge Tunnel" },
      { id: "dlp-logs", icon: "shredder", label: "DLP Logs" },
      { id: "audit-logs", icon: "scrollText", label: "Audit Logs" },
    ],
  },
];

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

function HintIcon({ name, className = "h-5 w-5" }: { className?: string; name: HintIconName }) {
  const paths: Record<HintIconName, ReactNode> = {
    artifact: (
      <>
        <path d="M14 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7z" />
        <path d="M14 2v5h5" />
        <path d="m10 13-2 2 2 2" />
        <path d="m14 17 2-2-2-2" />
      </>
    ),
    cloudUpload: (
      <>
        <path d="M12 13v8" />
        <path d="m8 17 4-4 4 4" />
        <path d="M20.4 16.6A5 5 0 0 0 18 7h-1.3A8 8 0 1 0 4 15.3" />
      </>
    ),
    file: (
      <>
        <path d="M14 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7z" />
        <path d="M14 2v5h5" />
      </>
    ),
    folderUp: (
      <>
        <path d="M12 10v6" />
        <path d="m9 13 3-3 3 3" />
        <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2z" />
      </>
    ),
    globe: (
      <>
        <circle cx="12" cy="12" r="10" />
        <path d="M2 12h20" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </>
    ),
    image: (
      <>
        <rect height="16" rx="2" width="18" x="3" y="5" />
        <circle cx="8.5" cy="10.5" r="1.5" />
        <path d="m21 15-5-5L5 21" />
        <path d="M19 3v4" />
        <path d="M17 5h4" />
      </>
    ),
    speech: (
      <>
        <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22z" />
        <path d="M8 12h.01" />
        <path d="M12 12h.01" />
        <path d="M16 12h.01" />
      </>
    ),
    webApp: (
      <>
        <path d="M12 3v6" />
        <path d="M8 7h8" />
        <path d="M5 10h14v8a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2z" />
        <path d="M8 14h3" />
        <path d="M13 14h3" />
      </>
    ),
    widget: (
      <>
        <path d="M4 19V5" />
        <path d="M4 19h16" />
        <path d="M8 16v-5" />
        <path d="M12 16V8" />
        <path d="M16 16v-3" />
      </>
    ),
  };

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
      {paths[name]}
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

function AdminMenuIcon({ name, className = "h-4 w-4" }: { className?: string; name: AdminMenuIconName }) {
  if (name === "mcp") {
    return <MenuIcon className={className} name="mcp" />;
  }

  const paths: Record<Exclude<AdminMenuIconName, "mcp">, ReactNode> = {
    bookOpen: (
      <>
        <path d="M12 7v14" />
        <path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z" />
      </>
    ),
    botMessageSquare: (
      <>
        <path d="M12 6V2H8" />
        <path d="M15 11v2" />
        <path d="M2 12h2" />
        <path d="M20 12h2" />
        <path d="M20 16a2 2 0 0 1-2 2H8.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 4 20.286V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2z" />
        <path d="M9 11v2" />
      </>
    ),
    box: (
      <>
        <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
        <path d="m3.3 7 8.7 5 8.7-5" />
        <path d="M12 22V12" />
      </>
    ),
    brainCircuit: (
      <>
        <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z" />
        <path d="M9 13a4.5 4.5 0 0 0 3-4" />
        <path d="M6.003 5.125A3 3 0 0 0 6.401 6.5" />
        <path d="M3.477 10.896a4 4 0 0 1 .585-.396" />
        <path d="M6 18a4 4 0 0 1-1.967-.516" />
        <path d="M12 13h4" />
        <path d="M12 18h6a2 2 0 0 1 2 2v1" />
        <path d="M12 8h8" />
        <path d="M16 8V5a2 2 0 0 1 2-2" />
        <circle cx="16" cy="13" r=".5" />
        <circle cx="18" cy="3" r=".5" />
        <circle cx="20" cy="21" r=".5" />
        <circle cx="20" cy="8" r=".5" />
      </>
    ),
    chartColumn: (
      <>
        <path d="M3 3v16a2 2 0 0 0 2 2h16" />
        <path d="M18 17V9" />
        <path d="M13 17V5" />
        <path d="M8 17v-3" />
      </>
    ),
    circleDollarSign: (
      <>
        <circle cx="12" cy="12" r="10" />
        <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
        <path d="M12 18V6" />
      </>
    ),
    coins: (
      <>
        <path d="M13.744 17.736a6 6 0 1 1-7.48-7.48" />
        <path d="M15 6h1v4" />
        <path d="m6.134 14.768.866-.5 2 3.464" />
        <circle cx="16" cy="8" r="6" />
      </>
    ),
    layoutDashboard: (
      <>
        <rect height="9" rx="1" width="7" x="3" y="3" />
        <rect height="5" rx="1" width="7" x="14" y="3" />
        <rect height="9" rx="1" width="7" x="14" y="12" />
        <rect height="5" rx="1" width="7" x="3" y="16" />
      </>
    ),
    lock: (
      <>
        <rect height="11" rx="2" ry="2" width="18" x="3" y="11" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </>
    ),
    network: (
      <>
        <rect height="6" rx="1" width="6" x="16" y="16" />
        <rect height="6" rx="1" width="6" x="2" y="16" />
        <rect height="6" rx="1" width="6" x="9" y="2" />
        <path d="M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3" />
        <path d="M12 12V8" />
      </>
    ),
    puzzle: (
      <>
        <path d="M15.39 4.39a1 1 0 0 0 1.68-.474 2.5 2.5 0 1 1 3.014 3.015 1 1 0 0 0-.474 1.68l1.683 1.682a2.414 2.414 0 0 1 0 3.414L19.61 15.39a1 1 0 0 1-1.68-.474 2.5 2.5 0 1 0-3.014 3.015 1 1 0 0 1 .474 1.68l-1.683 1.682a2.414 2.414 0 0 1-3.414 0L8.61 19.61a1 1 0 0 0-1.68.474 2.5 2.5 0 1 1-3.014-3.015 1 1 0 0 0 .474-1.68l-1.683-1.682a2.414 2.414 0 0 1 0-3.414L4.39 8.61a1 1 0 0 1 1.68.474 2.5 2.5 0 1 0 3.014-3.015 1 1 0 0 1-.474-1.68l1.683-1.682a2.414 2.414 0 0 1 3.414 0z" />
      </>
    ),
    scrollText: (
      <>
        <path d="M15 12h-5" />
        <path d="M15 8h-5" />
        <path d="M19 17V5a2 2 0 0 0-2-2H4" />
        <path d="M8 21h12a2 2 0 0 0 2-2v-1a1 1 0 0 0-1-1H11a1 1 0 0 0-1 1v1a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v2a1 1 0 0 0 1 1h3" />
      </>
    ),
    shieldCheck: (
      <>
        <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),
    shredder: (
      <>
        <path d="M4 13V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.706.706l3.588 3.588A2.4 2.4 0 0 1 20 8v5" />
        <path d="M14 2v5a1 1 0 0 0 1 1h5" />
        <path d="M10 22v-5" />
        <path d="M14 19v-2" />
        <path d="M18 20v-3" />
        <path d="M2 13h20" />
        <path d="M6 20v-3" />
      </>
    ),
    slidersHorizontal: (
      <>
        <path d="M10 5H3" />
        <path d="M12 19H3" />
        <path d="M14 3v4" />
        <path d="M16 17v4" />
        <path d="M21 12h-9" />
        <path d="M21 19h-5" />
        <path d="M21 5h-7" />
        <path d="M8 10v4" />
        <path d="M8 12H3" />
      </>
    ),
    users: (
      <>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <path d="M16 3.128a4 4 0 0 1 0 7.744" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <circle cx="9" cy="7" r="4" />
      </>
    ),
  };

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
      {paths[name]}
    </svg>
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
  activeAdminPage,
  activeChatTitle,
  onAdminMenuClick,
  onAgentClick,
  onChatClick,
  onMenuClick,
  onNewChatClick,
}: {
  activeMenu: string;
  activeAdminPage: string;
  activeChatTitle: string | null;
  onAdminMenuClick: (page: string) => void;
  onAgentClick: (agentId: string) => void;
  onChatClick: (chatTitle: string) => void;
  onMenuClick: (menu: string) => void;
  onNewChatClick: () => void;
}) {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const notificationButtonRef = useRef<HTMLButtonElement | null>(null);
  const notificationPopoverRef = useRef<HTMLDivElement | null>(null);
  const notifications = [
    {
      id: "daily-sales-summary",
      message: 'Automation "Daily Sales Summary" run completed successfully.',
      relativeTime: "06/28/2026, 02:18:00 PM",
      type: "success",
      typeLabel: "Automation run completed",
    },
    {
      id: "quote-email-review",
      message: 'Automation "Quote Email Review" run completed successfully.',
      relativeTime: "06/28/2026, 02:02:00 PM",
      type: "success",
      typeLabel: "Automation run succeeded",
    },
  ];

  useEffect(() => {
    if (!isNotificationOpen) return;

    const handleOutsideClick = (event: MouseEvent | TouchEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (notificationButtonRef.current?.contains(target)) return;
      if (notificationPopoverRef.current?.contains(target)) return;

      setIsNotificationOpen(false);
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("touchstart", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("touchstart", handleOutsideClick);
    };
  }, [isNotificationOpen]);

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

      <nav className="aip-mockup-sidebar-scroll flex min-h-0 flex-1 flex-col gap-4 overflow-auto p-2">
        {activeMenu === "admin" ? (
          <AdminSidebarMenu activeAdminPage={activeAdminPage} onAdminMenuClick={onAdminMenuClick} />
        ) : (
          <>
            <div className="flex flex-col gap-0.5">
              {aipMockupMenuItems.map((item) => {
                const isActive = activeMenu === item.id && !(item.id === "chat" && activeChatTitle);
                const isAgentsMenu = item.id === "agents";
                return (
                  <div key={item.id}>
                    <button
                      className={`group flex h-9 w-full min-w-0 items-center gap-2.5 overflow-hidden rounded-md pl-3 pr-2 text-left text-sm outline-none transition-colors ${
                        isActive
                          ? "bg-white/10 text-[#f4f4f5]"
                          : "text-[#f4f4f5] hover:bg-white/10 hover:text-[#f4f4f5]"
                      }`}
                      onClick={() => (item.id === "chat" ? onNewChatClick() : onMenuClick(item.id))}
                      type="button"
                    >
                      <MenuIcon className="h-4 w-4 shrink-0" name={menuIconById[item.id]} />
                      <span className="min-w-0 truncate">{item.label}</span>
                      {isAgentsMenu ? (
                        <span className="ml-auto shrink-0 text-xs text-[#f4f4f5] group-hover:underline">View all</span>
                      ) : null}
                    </button>
                    {isAgentsMenu ? <SidebarAgentSubMenu onAgentClick={onAgentClick} /> : null}
                  </div>
                );
              })}
            </div>

            <div className="relative flex min-w-0 flex-1 flex-col">
              <div className="flex shrink-0 items-center rounded-md px-1 py-2 text-xs text-[#a1a1aa]">Chat</div>
              <div className="flex flex-col text-sm">
                {aipMockupChats.map((chat) => (
                  <button
                    className={[
                      "group relative flex h-9 w-full items-center rounded-lg text-left text-sm text-[#f4f4f5] transition-colors duration-200 hover:bg-white/10",
                      activeMenu === "chat" && activeChatTitle === chat ? "bg-white/10" : "",
                    ].join(" ")}
                    key={chat}
                    onClick={() => onChatClick(chat)}
                    type="button"
                  >
                    <span className="min-w-0 truncate pl-3 pr-2">{chat}</span>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </nav>

      <div className="relative flex items-center justify-between gap-2 px-2 pb-2 pl-1 pr-2 pt-2">
        <button aria-label="Profile" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-white/10" type="button">
          <img
            alt=""
            className="h-8 w-8 rounded-full object-cover"
            src="/assets/mockups/aip/user-avatar.png"
          />
        </button>
        <div className="flex items-center gap-1.5">
          <button className="flex h-8 items-center gap-[5px] whitespace-nowrap rounded-md px-2 text-sm font-normal text-[#f4f4f5] hover:bg-white/10" type="button">
            <span className="h-2 w-2 rounded-full bg-[#039855]" />
            Edge Tunnel
          </button>
          <button
            aria-expanded={isNotificationOpen}
            aria-label="Notifications"
            className={[
              "relative flex h-8 w-8 items-center justify-center rounded-md text-[#f4f4f5] hover:bg-white/10",
              isNotificationOpen ? "bg-white/10" : "",
            ].join(" ")}
            onClick={() => setIsNotificationOpen((value) => !value)}
            ref={notificationButtonRef}
            type="button"
          >
            <Icon name="bell" />
            <span className="absolute -top-0 left-1/2 flex size-4 items-center justify-center rounded-full bg-[#ef4444] text-[10px] font-medium leading-none text-white">
              2
            </span>
          </button>
          {isNotificationOpen ? (
            <div
              className="absolute bottom-14 left-12 z-50 w-[360px] overflow-hidden rounded-md border border-[#2f2f2f] bg-[#1b1b1b] p-0 text-[#f4f4f5] shadow-[0_18px_50px_rgba(0,0,0,0.45)]"
              ref={notificationPopoverRef}
            >
              <div className="flex items-center justify-between border-b border-[#2f2f2f] py-2.5 pl-5 pr-2.5">
                <span className="text-base font-semibold text-[#fafafa]">Notifications</span>
                <div className="flex items-center gap-1.5">
                  <button className="inline-flex h-8 items-center justify-center rounded-lg px-3 text-sm font-medium text-[#f4f4f5] hover:bg-white/10" type="button">
                    Mark all as read
                  </button>
                  <button aria-label="Notification settings" className="inline-flex size-8 items-center justify-center rounded-lg text-[#f4f4f5] hover:bg-white/10" type="button">
                    <Icon className="size-4" name="settings" />
                  </button>
                </div>
              </div>
              <div className="flex max-h-[420px] min-h-0 flex-col overflow-y-auto pb-12">
                {notifications.map((notification) => (
                  <div className="group flex items-start gap-3 py-2.5 pl-5 pr-2.5 hover:bg-white/10" key={notification.id}>
                    <button className="flex min-w-0 flex-1 gap-3 text-left" type="button">
                      <div className="relative mt-0.5 shrink-0">
                        <div className="flex size-7 items-center justify-center rounded-full bg-[#2a2a2a]">
                          {notification.type === "success" ? (
                            <svg aria-hidden="true" className="size-4 text-[#a1a1aa]" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
                              <path d="M9 12l2 2 4-4" />
                              <circle cx="12" cy="12" r="10" />
                            </svg>
                          ) : (
                            <svg aria-hidden="true" className="size-4 text-[#a1a1aa]" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
                              <circle cx="12" cy="12" r="10" />
                              <path d="m15 9-6 6" />
                              <path d="m9 9 6 6" />
                            </svg>
                          )}
                        </div>
                        <span className="absolute left-0 top-0 size-1.5 rounded-full bg-[#ef4444]" />
                      </div>
                      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                        <span className="line-clamp-1 text-sm font-semibold text-[#fafafa]">{notification.typeLabel}</span>
                        <span className="line-clamp-2 text-sm leading-5 text-[#a1a1aa]">{notification.message}</span>
                        <span className="text-xs text-[#a1a1aa]">{notification.relativeTime}</span>
                      </div>
                    </button>
                    <div className="shrink-0 md:invisible md:group-hover:visible">
                      <button aria-label="Mute notification" className="inline-flex size-6 items-center justify-center rounded-lg text-[#f4f4f5] hover:bg-white/10" type="button">
                        <Icon className="size-4" name="bell" />
                      </button>
                    </div>
                  </div>
                ))}
                <div className="px-5">
                  <div className="flex items-center justify-center gap-2.5 border-t border-[#2f2f2f] py-5 text-sm text-[#a1a1aa]">
                    <svg aria-hidden="true" className="size-4 shrink-0" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                    <span>You&apos;ve seen all notifications from the last 14 days.</span>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
          <button
            aria-label={activeMenu === "admin" ? "Back to workspace" : "Workspace admin"}
            className={[
              "relative flex h-8 w-8 items-center justify-center rounded-md text-[#f4f4f5] hover:bg-white/10",
              activeMenu === "admin" ? "bg-white/10" : "",
            ].join(" ")}
            onClick={() => (activeMenu === "admin" ? onNewChatClick() : onMenuClick("admin"))}
            type="button"
          >
            {activeMenu === "admin" ? (
              <Icon name="messageShare" />
            ) : (
              <>
                <Icon name="building2" />
                <span className="absolute bottom-1.5 left-[calc(50%+2px)] rounded-full bg-[#1f1f1f] p-px">
                  <Icon className="h-3 w-3 stroke-2" name="settings" />
                </span>
              </>
            )}
          </button>
        </div>
      </div>
    </aside>
  );
}

function AdminSidebarMenu({
  activeAdminPage,
  onAdminMenuClick,
}: {
  activeAdminPage: string;
  onAdminMenuClick: (page: string) => void;
}) {
  return (
    <>
      {adminMenuGroups.map((group) => (
        <div className="relative flex w-full min-w-0 flex-col" key={group.id}>
          {group.label ? (
            <div className="flex shrink-0 items-center rounded-md px-1 py-2 text-xs text-[#a1a1aa]">
              {group.label}
            </div>
          ) : null}
          <div className="w-full text-sm">
            <ul className="flex w-full min-w-0 flex-col">
              {group.items.map((item) => {
                const isActive = item.id === activeAdminPage;
                return (
                  <li className="group/menu-item relative" key={item.id}>
                    <button
                      className={[
                        "group flex h-9 w-full min-w-0 items-center gap-2.5 overflow-hidden rounded-md pl-3 pr-2 text-left text-sm outline-none transition-colors",
                        isActive
                          ? "bg-white/10 text-[#f4f4f5]"
                          : "text-[#f4f4f5] hover:bg-white/10 hover:text-[#f4f4f5]",
                      ].join(" ")}
                      onClick={() => onAdminMenuClick(item.id)}
                      type="button"
                    >
                      <AdminMenuIcon className="h-4 w-4 shrink-0" name={item.icon} />
                      <span className="min-w-0 truncate">{item.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      ))}
    </>
  );
}

function SidebarAgentSubMenu({ onAgentClick }: { onAgentClick: (agentId: string) => void }) {
  const personalAgents = aipMockupAgents.filter((agent) => agent.owner === "Personal Agent");
  const organizationAgents = aipMockupAgents.filter((agent) => agent.owner === "Organization Agent");
  const sections = [
    { id: "personal", label: "Personal", agents: personalAgents },
    { id: "organization", label: "Organization", agents: organizationAgents },
  ].filter((section) => section.agents.length > 0);

  return (
    <ul className="ml-3.5 flex min-w-0 translate-x-px flex-col border-l border-[#27272a] pl-2.5">
      {sections.map((section) => (
        <li key={section.id}>
          <div className="px-2 py-1 text-xs font-medium text-[#a1a1aa]">{section.label}</div>
          <div className="flex flex-col">
            {section.agents.map((agent) => (
              <button
                className="flex h-9 min-w-0 w-full items-center gap-2.5 overflow-hidden rounded-md pl-3 pr-2 text-left text-sm text-[#f4f4f5] outline-none transition-colors hover:bg-white/10 hover:text-[#f4f4f5]"
                key={agent.id}
                onClick={() => onAgentClick(agent.id)}
                type="button"
              >
                <AgentAvatar name={agent.name} shortName={agent.shortName} size="xs" />
                <span className="min-w-0 truncate">{agent.name}</span>
              </button>
            ))}
          </div>
        </li>
      ))}
    </ul>
  );
}

type LlmModel = {
  id: string;
  label: string;
  options?: boolean;
};

type LlmGroup = {
  icon: "claude" | "gemini" | "gpt" | "solar";
  id: string;
  label: string;
  models: LlmModel[];
};

const llmModelGroups: LlmGroup[] = [
  {
    id: "anthropic.claude",
    icon: "claude",
    label: "Claude",
    models: [
      { id: "claude-4.5-opus", label: "Claude Opus 4.5", options: true },
      { id: "claude-4.6-opus", label: "Claude Opus 4.6", options: true },
      { id: "claude-4.7-opus", label: "Claude Opus 4.7", options: true },
      { id: "claude-4.8-opus", label: "Claude Opus 4.8", options: true },
      { id: "claude-4.6-sonnet", label: "Claude Sonnet 4.6", options: true },
      { id: "claude-4.5-sonnet", label: "Claude Sonnet 4.5", options: true },
      { id: "claude-4-sonnet", label: "Claude Sonnet 4", options: true },
      { id: "claude-4.5-haiku", label: "Claude Haiku 4.5", options: true },
    ],
  },
  {
    id: "openai.gpt",
    icon: "gpt",
    label: "GPT",
    models: [
      { id: "gpt-5", label: "GPT-5", options: true },
      { id: "gpt-5.1", label: "GPT-5.1", options: true },
      { id: "gpt-5.2", label: "GPT-5.2", options: true },
      { id: "gpt-5.3-codex", label: "GPT-5.3 Codex", options: true },
      { id: "gpt-5.4", label: "GPT-5.4", options: true },
      { id: "gpt-5.5", label: "GPT-5.5", options: true },
      { id: "gpt-5.4-mini", label: "GPT-5.4 Mini", options: true },
      { id: "gpt-5.4-nano", label: "GPT-5.4 Nano", options: true },
    ],
  },
  {
    id: "google.gemini",
    icon: "gemini",
    label: "Gemini",
    models: [
      { id: "gemini-2.5-flash", label: "Gemini 2.5 Flash" },
      { id: "gemini-3-flash", label: "Gemini 3 Flash" },
      { id: "gemini-3.1-pro", label: "Gemini 3.1 Pro" },
      { id: "gemini-3.1-flash-lite", label: "Gemini 3.1 Flash Lite" },
      { id: "gemini-3.5-flash", label: "Gemini 3.5 Flash", options: true },
    ],
  },
  {
    id: "upstage.solar",
    icon: "solar",
    label: "Solar",
    models: [
      { id: "solar-pro", label: "Solar Pro" },
      { id: "solar-pro2", label: "Solar Pro 2" },
    ],
  },
];

function LlmIcon({ group, className = "h-4 w-4" }: { className?: string; group: LlmGroup["icon"] }) {
  const iconVariant = group === "gpt" || group === "solar" ? "dark" : "color";

  return <img alt={group} className={className} src={`/assets/icons/llm-${group}-${iconVariant}.svg`} />;
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

function getDefaultWideContext(modelId: string) {
  return (
    modelId.includes("opus") ||
    modelId === "claude-4.6-sonnet" ||
    modelId === "gpt-5.2" ||
    modelId === "gpt-5.3-codex" ||
    modelId === "gemini-3.1-pro"
  );
}

function getDefaultReasoningLevel(modelId: string) {
  if (modelId === "gpt-5.1" || modelId === "gpt-5.2" || modelId === "gpt-5.3-codex") return "Auto";
  if (modelId.includes("opus") || modelId === "gemini-3.1-pro") return "High";
  if (modelId.includes("mini") || modelId.includes("nano") || modelId.includes("haiku")) return "Low";
  return "Medium";
}

function ModelOptionsPanel({
  model,
  onClose,
  reasoningLevel,
  setWideContext,
  wideContext,
}: {
  model: LlmModel;
  onClose: () => void;
  reasoningLevel: string;
  setWideContext: (value: boolean) => void;
  wideContext: boolean;
}) {
  return (
    <div
      className="min-w-[220px] border-l border-[#2f2f2f] text-[#f4f4f5]"
      onClick={(event) => event.stopPropagation()}
    >
      <div className="flex items-center justify-between border-b border-[#2f2f2f] px-3 py-2">
        <span className="text-sm font-medium">{model.label} Options</span>
        <button
          aria-label="Close options"
          className="rounded p-1 hover:bg-white/10"
          onClick={onClose}
          type="button"
        >
          <svg aria-hidden="true" className="size-4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>
      </div>
      <div className="pt-2">
        <div className="flex items-center justify-between px-3 py-2">
          <div className="flex items-center gap-1">
            <span className="text-sm">Wide Context</span>
          </div>
          <button
            aria-checked={wideContext}
            aria-label="Wide Context"
            className={[
              "relative inline-flex h-5 w-9 shrink-0 items-center rounded-full border transition-colors",
              wideContext ? "border-[#2c74e1] bg-[#2c74e1]" : "border-[#3f3f46] bg-[#27272a]",
            ].join(" ")}
            onClick={() => setWideContext(!wideContext)}
            role="switch"
            type="button"
          >
            <span
              className={[
                "inline-block size-4 rounded-full bg-white transition-transform",
                wideContext ? "translate-x-4" : "translate-x-0.5",
              ].join(" ")}
            />
          </button>
        </div>

        <div className="flex items-center justify-between px-3 py-2">
          <div className="flex items-center gap-1">
            <span className="text-sm">Reasoning Level</span>
          </div>
          <button
            aria-label="Reasoning Level"
            className="inline-flex h-8 max-w-[120px] items-center justify-center gap-1.5 rounded-md border border-[#3f3f46] bg-transparent px-2 text-sm text-[#f4f4f5] hover:bg-white/10"
            onClick={(event) => event.preventDefault()}
            type="button"
          >
            <span>{reasoningLevel}</span>
            <Icon className="h-3.5 w-3.5 rotate-90 text-[#a1a1aa]" name="chevron" />
          </button>
        </div>
      </div>
    </div>
  );
}

function AppHeader() {
  const [isModelSelectorOpen, setIsModelSelectorOpen] = useState(false);
  const [selectedModelId, setSelectedModelId] = useState("claude-4.6-sonnet");
  const [pinnedModelId, setPinnedModelId] = useState<string | null>(null);
  const [expandedModelId, setExpandedModelId] = useState<string | null>(null);
  const [wideContextByModel, setWideContextByModel] = useState<Record<string, boolean>>({});
  const [reasoningLevelByModel, setReasoningLevelByModel] = useState<Record<string, string>>({});
  const modelSelectorRef = useRef<HTMLDivElement | null>(null);
  const selectedGroup =
    llmModelGroups.find((group) => group.models.some((model) => model.id === selectedModelId)) ?? llmModelGroups[0];
  const selectedModel = selectedGroup.models.find((model) => model.id === selectedModelId) ?? selectedGroup.models[0];
  const expandedModel =
    expandedModelId == null
      ? null
      : llmModelGroups.flatMap((group) => group.models).find((model) => model.id === expandedModelId) ?? null;
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

  useEffect(() => {
    if (!isModelSelectorOpen) return;

    const handleOutsideClick = (event: MouseEvent | TouchEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (modelSelectorRef.current?.contains(target)) return;

      setIsModelSelectorOpen(false);
      setExpandedModelId(null);
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("touchstart", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("touchstart", handleOutsideClick);
    };
  }, [isModelSelectorOpen]);

  return (
    <header className="sticky top-0 z-40 shrink-0 overflow-visible bg-[#121212]">
      <div className="mx-auto flex h-14 max-w-[1088px] items-center justify-between px-3 md:px-5">
        <div className="relative flex min-w-0 shrink-0 items-center gap-2" ref={modelSelectorRef}>
          <button
            aria-expanded={isModelSelectorOpen}
            className="inline-flex h-9 min-w-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg border-none px-3 py-2 text-sm font-medium text-[#f4f4f5] transition-all hover:bg-white/10"
            onClick={() => setIsModelSelectorOpen((value) => !value)}
            type="button"
          >
            <span className="hidden md:block">
              <LlmIcon group={selectedGroup.icon} />
            </span>
            <span className="truncate">{selectedModel.label}</span>
            <Icon className="h-4 w-4 shrink-0 rotate-90 text-[#a1a1aa]" name="chevron" />
          </button>

          {isModelSelectorOpen ? (
            <div
              className={[
                "absolute left-0 top-11 z-50 min-w-max rounded-2xl border border-[#2f2f2f] bg-[#1b1b1b] p-2 text-[#f4f4f5] shadow-[0_18px_50px_rgba(0,0,0,0.45)] outline-none",
                expandedModel ? "w-auto" : "w-[240px]",
              ].join(" ")}
            >
              <div className="flex">
              <div className="flex h-full w-full flex-col overflow-hidden rounded-none rounded-t-[10px] bg-[#1b1b1b] text-[#f4f4f5] md:w-[240px] md:rounded-2xl">
                <div className="max-h-[400px] overflow-y-auto overflow-x-hidden">
                {pinnedModel ? (
                  <>
                    <div className="overflow-hidden p-1 text-[#f4f4f5]">
                      <div className="flex items-center gap-1.5 px-2 py-1.5 text-xs font-medium text-[#a1a1aa]">
                        <PinIcon className="h-3.5 w-3.5" />
                        <span className="text-sm font-normal text-[#a1a1aa]">Pinned</span>
                      </div>
                      <div
                        aria-label={pinnedModel.model.label}
                        className="group/item relative flex w-full cursor-default select-none items-center justify-between gap-2 rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-white/10"
                        onClick={() => selectModel(pinnedModel.model.id)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter" || event.key === " ") selectModel(pinnedModel.model.id);
                        }}
                        role="button"
                        tabIndex={0}
                      >
                        <div className="flex items-center gap-2">
                          <LlmIcon group={pinnedModel.group.icon} />
                          <span className={pinnedModel.model.id === selectedModelId ? "text-[#7aa7ff]" : undefined}>
                            {pinnedModel.model.label}
                          </span>
                        </div>
                        <button
                          aria-label="Unpin model"
                          className="rounded p-1 hover:bg-white/10"
                          onClick={(event) => {
                            event.stopPropagation();
                            setPinnedModelId(null);
                          }}
                          type="button"
                        >
                          <PinIcon className="h-4 w-4 text-[#f4f4f5]" />
                        </button>
                      </div>
                    </div>
                    <div className="-mx-1 h-px bg-[#2f2f2f]" />
                  </>
                ) : null}

                {llmModelGroups.map((group, index) => {
                  const visibleModels = group.models.filter((model) => model.id !== pinnedModelId);
                  if (visibleModels.length === 0) return null;

                  return (
                    <div key={group.id}>
                      {index > 0 || pinnedModel ? <div className="-mx-1 h-px bg-[#2f2f2f]" /> : null}
                      <div className="overflow-hidden p-1 text-[#f4f4f5]">
                        <div className="flex items-center gap-2 px-2 py-1.5 text-xs font-medium text-[#a1a1aa]">
                          <LlmIcon group={group.icon} />
                          <span className="text-sm font-normal text-[#a1a1aa]">{group.label}</span>
                        </div>
                        {visibleModels.map((model) => {
                          const isSelected = model.id === selectedModelId;
                          const isExpanded = expandedModelId === model.id;
                          return (
                            <div
                              aria-label={model.label}
                              className="group/item relative flex w-full cursor-default select-none items-center justify-between gap-2 rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-white/10"
                              key={model.id}
                              onClick={() => selectModel(model.id)}
                              onKeyDown={(event) => {
                                if (event.key === "Enter" || event.key === " ") selectModel(model.id);
                              }}
                              role="button"
                              tabIndex={0}
                            >
                              <span className={isSelected ? "text-[#7aa7ff]" : undefined}>{model.label}</span>
                              <div className="flex items-center gap-1">
                                <button
                                  aria-label="Pin model"
                                  className="rounded p-1 opacity-0 hover:bg-white/10 md:group-hover/item:opacity-100"
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    setPinnedModelId(model.id);
                                  }}
                                  type="button"
                                >
                                  <PinIcon className="h-4 w-4 text-[#a1a1aa]" />
                                </button>
                                {model.options ? (
                                  <button
                                    aria-label="Options"
                                    className={[
                                      "rounded p-1 hover:bg-white/10",
                                      isExpanded ? "bg-white/10" : "",
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
              {expandedModel ? (
                <ModelOptionsPanel
                  model={expandedModel}
                  onClose={() => setExpandedModelId(null)}
                  reasoningLevel={reasoningLevelByModel[expandedModel.id] ?? getDefaultReasoningLevel(expandedModel.id)}
                  setWideContext={(value) =>
                    setWideContextByModel((current) => ({ ...current, [expandedModel.id]: value }))
                  }
                  wideContext={wideContextByModel[expandedModel.id] ?? getDefaultWideContext(expandedModel.id)}
                />
              ) : null}
              </div>
            </div>
          ) : null}
        </div>
        <div className="flex shrink-0 items-center" />
      </div>
    </header>
  );
}

function ExampleChatConversation() {
  return (
    <div className="min-h-0 flex-1 overflow-y-auto">
      <div className="mx-auto flex w-full max-w-[800px] flex-col gap-8 px-8 pb-8 pt-7">
        <div className="flex justify-end">
          <div className="max-w-[620px] rounded-[20px] bg-[#2f2f2f] px-4 py-3 text-[15px] leading-6 text-[#f4f4f5]">
            Check today&apos;s emails for one with a quotation attached, convert it to a PDF, and save it to my Desktop.
          </div>
        </div>

        <div className="flex">
          <div className="min-w-0 flex-1 text-[15px] leading-6 text-[#e4e4e7]">
            <p className="m-0">
              Completed successfully. I reviewed the 14 emails received today and found a quotation attached to an email
              titled &quot;Software Supply Quotation.&quot;
            </p>

          <div className="mt-5">
            <h2 className="m-0 text-[15px] font-semibold text-[#f4f4f5]">Quotation Summary</h2>
            <dl className="mt-2 grid grid-cols-[118px_1fr] gap-x-4 gap-y-1 text-sm">
              <dt className="text-[#a1a1aa]">Supplier:</dt>
              <dd className="m-0 text-[#f4f4f5]">ABC Software Ltd.</dd>
              <dt className="text-[#a1a1aa]">Quotation No.:</dt>
              <dd className="m-0 text-[#f4f4f5]">SQ-2026-0618</dd>
              <dt className="text-[#a1a1aa]">Issue Date:</dt>
              <dd className="m-0 text-[#f4f4f5]">06/28/2026, 12:00:00 AM</dd>
              <dt className="text-[#a1a1aa]">Valid Until:</dt>
              <dd className="m-0 text-[#f4f4f5]">07/12/2026, 12:00:00 AM</dd>
              <dt className="text-[#a1a1aa]">Total Amount:</dt>
              <dd className="m-0 text-[#f4f4f5]">USD 48,750</dd>
            </dl>
          </div>

          <div className="mt-5">
            <h2 className="m-0 text-[15px] font-semibold text-[#f4f4f5]">Line Items</h2>
            <div className="mt-2 overflow-hidden rounded-xl border border-[#333333]">
              <table className="w-full border-collapse text-left text-sm">
                <thead className="bg-[#1b1b1b] text-[#a1a1aa]">
                  <tr>
                    <th className="px-3 py-2 font-medium">Item</th>
                    <th className="px-3 py-2 font-medium">Qty</th>
                    <th className="px-3 py-2 text-right font-medium">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#333333] text-[#f4f4f5]">
                  <tr>
                    <td className="px-3 py-2">Enterprise AI Platform License</td>
                    <td className="px-3 py-2 text-[#d4d4d8]">250 Users</td>
                    <td className="px-3 py-2 text-right">USD 37,500</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2">Premium Support (1 Year)</td>
                    <td className="px-3 py-2 text-[#d4d4d8]">1</td>
                    <td className="px-3 py-2 text-right">USD 7,500</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2">Implementation Service</td>
                    <td className="px-3 py-2 text-[#d4d4d8]">1</td>
                    <td className="px-3 py-2 text-right">USD 3,750</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="my-2 flex flex-col gap-2 rounded-2xl border border-[#333333] p-2">
            <div className="flex justify-end">
              <button className="inline-flex h-8 items-center justify-center gap-1.5 rounded-md px-2 text-xs text-[#f4f4f5] transition-colors hover:bg-white/10" type="button">
                <svg aria-hidden="true" className="size-4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z" />
                  <path d="M17 21v-8H7v8" />
                  <path d="M7 3v5h8" />
                </svg>
                save
              </button>
            </div>
            <div className="relative aspect-video w-full overflow-hidden rounded-md bg-[#101010] p-4">
              <div className="flex h-full flex-col">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div>
                    <p className="m-0 text-sm font-medium text-[#f4f4f5]">Quotation Line Item Amounts</p>
                    <p className="m-0 text-xs text-[#a1a1aa]">USD by line item</p>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-[#a1a1aa]">
                    <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-[#4f8cff]" />Amount</span>
                    <span className="flex items-center gap-1.5"><span className="h-0.5 w-4 rounded bg-[#22c55e]" />Share</span>
                  </div>
                </div>
                <div className="grid min-h-0 flex-1 grid-cols-[42px_1fr] grid-rows-[1fr_24px] gap-x-3">
                  <div className="flex h-full flex-col justify-between pb-2 pr-1 text-right text-[10px] text-[#737373]">
                    <span>USD 40k</span>
                    <span>30k</span>
                    <span>20k</span>
                    <span>10k</span>
                    <span>0</span>
                  </div>
                  <div className="relative grid grid-cols-3 items-end overflow-hidden border-b border-l border-[#333333] px-10 pb-0">
                    <div className="absolute inset-x-0 top-0 border-t border-dashed border-[#2a2a2a]" />
                    <div className="absolute inset-x-0 top-1/4 border-t border-dashed border-[#2a2a2a]" />
                    <div className="absolute inset-x-0 top-1/2 border-t border-dashed border-[#2a2a2a]" />
                    <div className="absolute inset-x-0 top-3/4 border-t border-dashed border-[#2a2a2a]" />
                    <svg aria-hidden="true" className="pointer-events-none absolute inset-x-10 bottom-0 top-0 z-20 h-full w-[calc(100%-5rem)] overflow-visible" preserveAspectRatio="none" viewBox="0 0 300 160">
                      <path d="M50 24 C90 58 110 126 150 130 C190 134 210 141 250 146" fill="none" stroke="#22c55e" strokeLinecap="round" strokeWidth="2.2" />
                      {[
                        [50, 24],
                        [150, 130],
                        [250, 146],
                      ].map(([cx, cy]) => (
                        <circle cx={cx} cy={cy} fill="#101010" key={`${cx}-${cy}`} r="4" stroke="#22c55e" strokeWidth="2" />
                      ))}
                    </svg>
                    {[
                      ["License", 94, "USD 37,500", "77%"],
                      ["Support", 19, "USD 7,500", "15%"],
                      ["Implementation", 9, "USD 3,750", "8%"],
                    ].map(([label, height, amount, share]) => (
                      <div className="relative z-10 flex h-full flex-1 flex-col items-center justify-end" key={label}>
                        <div className="mb-2 rounded-md border border-[#333333] bg-[#171717] px-2 py-1 text-center shadow-[0_8px_24px_rgba(0,0,0,0.25)]">
                          <p className="m-0 whitespace-nowrap text-[10px] font-medium leading-3 text-[#f4f4f5]">{amount}</p>
                          <p className="m-0 text-[9px] leading-3 text-[#22c55e]">{share}</p>
                        </div>
                        <div
                          className="w-full max-w-[54px] rounded-t-md border border-[#76a9ff]/50 bg-gradient-to-t from-[#2c74e1] to-[#8db8ff] shadow-[0_0_18px_rgba(44,116,225,0.28)]"
                          style={{ height: `${height}%` }}
                        />
                      </div>
                    ))}
                  </div>
                  <div />
                  <div className="grid grid-cols-3 px-10 pt-2 text-center text-[10px] text-[#a1a1aa]">
                    <span className="truncate">License</span>
                    <span className="truncate">Support</span>
                    <span className="truncate">Implementation</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <p className="mt-5">
            The quotation was analyzed and converted into a PDF document, preserving the title, supplier information,
            line items, pricing, and commercial terms.
          </p>

          <div className="mt-5">
            <h2 className="m-0 text-[15px] font-semibold text-[#f4f4f5]">Saved Successfully</h2>
            <pre className="mt-2 overflow-hidden rounded-xl border border-[#333333] bg-[#0f0f0f] px-3 py-2 text-sm leading-6 text-[#d4d4d8]">
{`Desktop/
└── Software_Supply_Quotation.pdf`}
            </pre>
          </div>

          <p className="mt-5">
            If you&apos;d like, I can also generate an executive summary or draft an approval request email based on this
            quotation.
          </p>
          </div>
      </div>
    </div>
    </div>
  );
}

const agentChatConfigs: Record<string, { prompts: string[] }> = {
  "data-analysis": {
    prompts: [
      "Analyze this dataset and summarize the key insights.",
      "Find anomalies, trends, and correlations in the uploaded file.",
      "Create charts and a short executive summary from this spreadsheet.",
    ],
  },
  "quotation-assistant": {
    prompts: [
      "Find the latest quotation email and summarize pricing terms.",
      "Compare this quotation against the approved purchase budget.",
      "Draft an approval request based on the attached quotation.",
    ],
  },
  "sales-insight": {
    prompts: [
      "Analyze this pipeline export and identify stalled opportunities.",
      "Summarize this quarter's sales performance by account segment.",
      "Draft follow-up actions for high-priority open deals.",
    ],
  },
  "document-review": {
    prompts: [
      "Review this document and summarize the key issues.",
      "Extract action items and owners from the attached document.",
      "Check this document for missing sections or unclear terms.",
    ],
  },
  "report-writer": {
    prompts: [
      "Turn these notes into a polished executive report.",
      "Create a concise project status update from this document.",
      "Rewrite this draft with clearer structure and business tone.",
    ],
  },
};

function AgentChatStartScreen({ agentId }: { agentId: string }) {
  const agent = aipMockupAgents.find((item) => item.id === agentId) ?? aipMockupAgents[0];
  const prompts = agentChatConfigs[agent.id]?.prompts ?? [];

  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      <div className="absolute right-5 top-4 z-10">
        <button
          className="inline-flex h-9 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg border-none bg-[#2A2A2A] px-3 py-2 text-sm font-medium text-[#fafafa] transition-all hover:bg-[#2A2A2A]/60"
          type="button"
        >
          <svg aria-hidden="true" className="size-4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M8 3H5a2 2 0 0 0-2 2v3" />
            <path d="M21 8V5a2 2 0 0 0-2-2h-3" />
            <path d="M3 16v3a2 2 0 0 0 2 2h3" />
            <path d="M16 21h3a2 2 0 0 0 2-2v-3" />
          </svg>
          Kiosk mode
        </button>
      </div>
      <div className="flex min-h-0 flex-1 translate-y-16 flex-col items-center justify-center">
        <div className="flex flex-col items-center justify-center pb-8 transition-all duration-200">
          <div className="flex flex-col items-center gap-0 p-2">
            <h1 className="text-center text-2xl font-medium leading-tight text-[#f4f4f5] sm:text-4xl">
              Chat with {agent.name}
            </h1>
          </div>
        </div>
        <AgentChatStartForm agent={agent} promptGuides={prompts} />
        <div aria-hidden="true" className="hidden h-[100px] sm:block" />
      </div>
    </div>
  );
}

function AgentChatStartForm({
  agent,
  promptGuides,
}: {
  agent: (typeof aipMockupAgents)[number];
  promptGuides: string[];
}) {
  return (
    <div className="mx-auto w-full max-w-[800px] px-8">
      <form className="main-content-chat flex w-full flex-row gap-3 transition-all duration-200">
        <div className="relative flex h-full min-w-0 flex-1 flex-col items-stretch">
          <div className="flex w-full items-center">
            <div className="relative flex w-full grow flex-col overflow-hidden rounded-[30px] border border-[#333333] bg-[#121212] text-[#f4f4f5] shadow-sm transition-all duration-200">
              <div className="px-5 pb-3.5 pt-[18px]">
                <textarea
                  className="m-0 box-border max-h-[min(30svh,13rem)] min-h-[24px] w-full resize-none whitespace-pre-wrap break-words bg-transparent text-[15px] leading-6 text-[#f4f4f5] outline-none placeholder:text-[#7a7a7a]"
                  placeholder="Start a conversation with the agent now."
                  readOnly
                  rows={1}
                />
              </div>
              <div className="flex items-center gap-1.5 px-3 pb-3">
                <div className="flex items-center gap-0.5">
                  <button
                    aria-label="Add"
                    className="inline-flex size-9 items-center justify-center rounded-full text-[#f4f4f5] transition-colors hover:bg-white/10"
                    type="button"
                  >
                    <Icon className="size-5" name="plus" />
                  </button>
                  <button
                    className="flex min-w-0 select-none items-center gap-2 rounded-2xl px-2.5 py-1.5 text-[#f4f4f5] transition-colors hover:bg-white/10"
                    type="button"
                  >
                    <AgentAvatar name={agent.name} shortName={agent.shortName} size="xs" />
                    <span className="truncate text-sm font-medium">{agent.name}</span>
                  </button>
                </div>
                <div className="mx-auto flex" />
                <div className="flex items-center gap-2">
                  <button
                    aria-label="Start recording"
                    className="inline-flex size-9 items-center justify-center rounded-full text-[#f4f4f5] transition-colors hover:bg-white/10"
                    type="button"
                  >
                    <Icon className="size-5" name="mic" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
      <ul className="mt-6 flex w-full flex-col">
        {promptGuides.map((prompt) => (
          <li key={prompt}>
            <button
              className="w-full break-keep border-b border-[#333333]/50 px-4 py-4 text-left text-sm text-[#d4d4d8] transition-colors hover:border-[#3f3f46] hover:text-[#f4f4f5]"
              type="button"
            >
              {prompt}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

type VisualizationChat = {
  answer: string;
  bars: Array<{ label: string; value: number }>;
  caption: string;
  question: string;
  stat: string;
  title: string;
  trend: Array<number>;
};

const visualizationChats: Record<string, VisualizationChat> = {
  "Revenue dashboard analysis": {
    question: "Build a revenue dashboard for this month and highlight the biggest movement by channel.",
    answer:
      "Completed. Direct sales contributed the largest share, while partner revenue showed the strongest week-over-week growth.",
    title: "Monthly Revenue by Channel",
    caption: "Revenue is concentrated in Direct and Partner channels, with Partner up 18% from last week.",
    stat: "USD 1.28M total revenue",
    bars: [
      { label: "Direct", value: 88 },
      { label: "Partner", value: 72 },
      { label: "Marketplace", value: 48 },
      { label: "Renewal", value: 64 },
    ],
    trend: [32, 46, 41, 58, 63, 69, 82, 78, 91, 88],
  },
};

function VisualizationChartCard({ chat }: { chat: VisualizationChat }) {
  return (
    <div className="mt-5 overflow-hidden rounded-2xl border border-[#333333] bg-[#171717]">
      <div className="flex items-start justify-between gap-4 border-b border-[#333333] px-4 py-3">
        <div className="min-w-0">
          <h2 className="m-0 text-[15px] font-semibold text-[#f4f4f5]">{chat.title}</h2>
          <p className="mt-1 text-xs leading-4 text-[#a1a1aa]">{chat.stat}</p>
        </div>
        <span className="rounded-full border border-[#2c74e1]/40 bg-[#2c74e1]/15 px-2.5 py-1 text-xs text-[#9ec1ff]">
          Updated
        </span>
      </div>

      <div className="space-y-4 p-4">
        <div className="grid gap-3 md:grid-cols-4">
          {[
            ["Revenue", "$1.28M", "+14.2%"],
            ["Pipeline", "$3.64M", "+8.7%"],
            ["Win Rate", "42.8%", "+3.1pt"],
            ["ARR Expansion", "$218K", "+18.0%"],
          ].map(([label, value, delta]) => (
            <div className="rounded-xl border border-[#2a2a2a] bg-[#101010] px-3 py-2" key={label}>
              <p className="m-0 text-xs text-[#a1a1aa]">{label}</p>
              <div className="mt-1 flex items-end justify-between gap-2">
                <span className="text-lg font-semibold leading-6 text-[#f4f4f5]">{value}</span>
                <span className="text-xs font-medium text-[#22c55e]">{delta}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-[1.25fr_0.75fr]">
          <div className="rounded-xl bg-[#101010] p-4">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="m-0 text-sm font-medium text-[#f4f4f5]">Revenue Trend</p>
                <p className="m-0 text-xs text-[#a1a1aa]">Weekly revenue and channel contribution</p>
              </div>
              <div className="flex items-center gap-3 text-xs text-[#a1a1aa]">
                <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-[#2c74e1]" />Direct</span>
                <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-[#14b8a6]" />Partner</span>
                <span className="flex items-center gap-1.5"><span className="h-0.5 w-4 rounded bg-[#f59e0b]" />Growth</span>
              </div>
            </div>
            <div className="relative grid h-[220px] grid-cols-[36px_1fr] grid-rows-[1fr_22px] gap-x-3">
              <div className="flex h-full flex-col justify-between pb-2 text-right text-[10px] text-[#737373]">
                <span>400k</span>
                <span>300k</span>
                <span>200k</span>
                <span>100k</span>
                <span>0</span>
              </div>
              <div className="relative grid grid-cols-4 items-end overflow-hidden border-b border-l border-[#333333] px-4">
                {[0, 25, 50, 75].map((top) => (
                  <div className="absolute inset-x-0 border-t border-dashed border-[#2a2a2a]" key={top} style={{ top: `${top}%` }} />
                ))}
                <svg aria-hidden="true" className="pointer-events-none absolute inset-x-4 bottom-0 top-0 z-20 h-full w-[calc(100%-2rem)] overflow-visible" preserveAspectRatio="none" viewBox="0 0 320 180">
                  <path d="M40 142 C78 128 86 98 120 106 C160 116 160 72 200 78 C240 84 248 52 280 30" fill="none" stroke="#f59e0b" strokeLinecap="round" strokeWidth="2.2" />
                  {[ [40, 142], [120, 106], [200, 78], [280, 30] ].map(([cx, cy]) => (
                    <circle cx={cx} cy={cy} fill="#101010" key={`${cx}-${cy}`} r="3.5" stroke="#f59e0b" strokeWidth="2" />
                  ))}
                </svg>
                {[
                  ["W1", 54, 32],
                  ["W2", 62, 41],
                  ["W3", 73, 52],
                  ["W4", 88, 72],
                ].map(([week, direct, partner]) => (
                  <div className="relative z-10 flex h-full items-end justify-center gap-1.5" key={week}>
                    <div className="w-5 rounded-t-sm bg-gradient-to-t from-[#2c74e1] to-[#8db8ff]" style={{ height: `${direct}%` }} />
                    <div className="w-5 rounded-t-sm bg-gradient-to-t from-[#0f766e] to-[#5eead4]" style={{ height: `${partner}%` }} />
                  </div>
                ))}
              </div>
              <div />
              <div className="grid grid-cols-4 px-4 pt-2 text-center text-[10px] text-[#a1a1aa]">
                <span>W1</span>
                <span>W2</span>
                <span>W3</span>
                <span>W4</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-xl bg-[#101010] p-4">
              <div className="mb-4 flex items-center justify-between">
                <p className="m-0 text-sm font-medium text-[#f4f4f5]">Channel Mix</p>
                <span className="text-xs text-[#22c55e]">Partner +18%</span>
              </div>
              <div className="space-y-3">
                {chat.bars.map((bar, index) => {
                  const colors = ["#2c74e1", "#14b8a6", "#8b5cf6", "#f59e0b"];
                  return (
                    <div className="grid grid-cols-[88px_1fr_34px] items-center gap-3" key={bar.label}>
                      <span className="truncate text-xs text-[#d4d4d8]">{bar.label}</span>
                      <div className="h-2.5 overflow-hidden rounded-full bg-[#2a2a2a]">
                        <div className="h-full rounded-full" style={{ backgroundColor: colors[index], width: `${bar.value}%` }} />
                      </div>
                      <span className="text-right text-xs text-[#a1a1aa]">{bar.value}%</span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="rounded-xl border border-[#2a2a2a] bg-[#101010] p-4">
              <p className="m-0 text-sm font-medium text-[#f4f4f5]">Key Movement</p>
              <p className="mt-2 text-xs leading-5 text-[#a1a1aa]">{chat.caption}</p>
              <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-lg bg-[#171717] p-2">
                  <span className="block text-[#a1a1aa]">Largest share</span>
                  <span className="font-medium text-[#f4f4f5]">Direct sales</span>
                </div>
                <div className="rounded-lg bg-[#171717] p-2">
                  <span className="block text-[#a1a1aa]">Fastest growth</span>
                  <span className="font-medium text-[#f4f4f5]">Partner</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function VisualizationChatConversation({ chatTitle }: { chatTitle: string }) {
  const chat = visualizationChats[chatTitle] ?? visualizationChats["Revenue dashboard analysis"];

  return (
    <div className="mx-auto flex w-full max-w-[800px] flex-1 flex-col gap-8 overflow-y-auto px-4 pb-8 pt-7">
      <div className="flex justify-end">
        <div className="max-w-[620px] rounded-[20px] bg-[#2f2f2f] px-4 py-3 text-[15px] leading-6 text-[#f4f4f5]">
          {chat.question}
        </div>
      </div>

      <div className="flex">
        <div className="min-w-0 flex-1 text-[15px] leading-6 text-[#e4e4e7]">
          <p className="m-0">{chat.answer}</p>
          <VisualizationChartCard chat={chat} />
          <p className="mt-5">
            I also prepared the chart layout so it can be exported into a dashboard or dropped into a weekly business
            review.
          </p>
        </div>
      </div>
    </div>
  );
}

function WidgetToolCallStatus() {
  return (
    <div className="my-3 flex items-center gap-2 text-sm text-[#a1a1aa]">
      <span className="flex h-6 w-6 items-center justify-center rounded-md border border-[#333333] bg-[#262626] text-[#d4d4d8]">
        <svg aria-hidden="true" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M3 3v18h18" />
          <path d="m19 9-5 5-4-4-3 3" />
        </svg>
      </span>
      <span>Created widget chart</span>
    </div>
  );
}

function WidgetSaveButton() {
  return (
    <button
      className="inline-flex h-8 items-center justify-center gap-1.5 rounded-md px-2 text-xs text-[#f4f4f5] transition-colors hover:bg-white/10"
      type="button"
    >
      <svg aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z" />
        <path d="M17 21v-8H7v8" />
        <path d="M7 3v5h8" />
      </svg>
      save
    </button>
  );
}

function WidgetChartShell({ children, title }: { children: ReactNode; title: string }) {
  return (
    <div className="my-2 flex flex-col gap-2 rounded-2xl border border-[#333333] p-2">
      <div className="flex items-center justify-between gap-3">
        <span className="truncate px-2 text-xs font-medium text-[#a1a1aa]">{title}</span>
        <WidgetSaveButton />
      </div>
      <div className="h-[210px] overflow-hidden rounded-xl bg-[#101010] p-4">{children}</div>
    </div>
  );
}

function WidgetLineChart() {
  const points = [42, 58, 49, 64, 78, 73, 91];
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-semibold text-[#f4f4f5]">Ticket Volume Trend</p>
          <p className="text-xs text-[#a1a1aa]">Last 7 days</p>
        </div>
        <span className="text-xs font-medium text-[#22c55e]">-12% backlog</span>
      </div>
      <div className="mt-4 flex flex-1 items-end gap-2">
        {points.map((point, index) => (
          <div className="flex flex-1 flex-col items-center gap-2" key={index}>
            <div className="flex h-20 w-full items-end rounded-md bg-[#262626] px-1">
              <div className="w-full rounded-t-md bg-[#2c74e1]" style={{ height: `${point}%` }} />
            </div>
            <span className="text-[10px] text-[#8f8f8f]">D{index + 1}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function WidgetDonutChart() {
  return (
    <div className="grid h-full grid-cols-[150px_1fr] items-center gap-4">
      <div className="relative h-32 w-32 rounded-full bg-[conic-gradient(#2c74e1_0_42%,#14b8a6_42%_68%,#8b5cf6_68%_86%,#f59e0b_86%_100%)]">
        <div className="absolute inset-7 rounded-full bg-[#101010]" />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-semibold text-[#f4f4f5]">1,248</span>
          <span className="text-[10px] text-[#a1a1aa]">tickets</span>
        </div>
      </div>
      <div className="space-y-3">
        <p className="text-sm font-semibold text-[#f4f4f5]">Tickets by Channel</p>
        {[
          ["Email", "42%", "bg-[#2c74e1]"],
          ["Chat", "26%", "bg-[#14b8a6]"],
          ["Portal", "18%", "bg-[#8b5cf6]"],
          ["Phone", "14%", "bg-[#f59e0b]"],
        ].map(([label, value, color]) => (
          <div className="flex items-center justify-between gap-3 text-xs" key={label}>
            <span className="flex items-center gap-2 text-[#d4d4d8]">
              <span className={`h-2 w-2 rounded-full ${color}`} />
              {label}
            </span>
            <span className="text-[#a1a1aa]">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function WidgetBarChart() {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-semibold text-[#f4f4f5]">SLA Attainment by Priority</p>
          <p className="text-xs text-[#a1a1aa]">Resolved within target time</p>
        </div>
        <span className="rounded-full border border-[#333333] px-2 py-1 text-xs text-[#a1a1aa]">Widget</span>
      </div>
      <div className="mt-5 space-y-4">
        {[
          ["P1 Critical", 91, "#ef4444"],
          ["P2 High", 84, "#f59e0b"],
          ["P3 Normal", 96, "#22c55e"],
          ["P4 Low", 98, "#2c74e1"],
        ].map(([label, value, color]) => (
          <div className="grid grid-cols-[86px_1fr_36px] items-center gap-3" key={label}>
            <span className="truncate text-xs text-[#d4d4d8]">{label}</span>
            <div className="h-2.5 overflow-hidden rounded-full bg-[#262626]">
              <div className="h-full rounded-full" style={{ width: `${value}%`, backgroundColor: String(color) }} />
            </div>
            <span className="text-right text-xs text-[#a1a1aa]">{value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SupportWidgetsChatConversation() {
  return (
    <div className="min-h-0 flex-1 overflow-y-auto">
      <div className="mx-auto flex w-full max-w-[800px] flex-col gap-8 px-8 pb-8 pt-7">
        <div className="flex justify-end">
          <div className="max-w-[620px] rounded-[20px] bg-[#2f2f2f] px-4 py-3 text-[15px] leading-6 text-[#f4f4f5]">
            Review last month&apos;s support tickets and create dashboard widgets for CS operations.
          </div>
        </div>

        <div className="flex">
          <div className="min-w-0 flex-1 text-[15px] leading-6 text-[#e4e4e7]">
            <p className="m-0">
              Completed. I analyzed 1,248 support tickets and generated three widget charts that can be saved to the
              operations dashboard.
            </p>

          <WidgetToolCallStatus />
          <WidgetChartShell title="Ticket volume trend">
            <WidgetLineChart />
          </WidgetChartShell>

          <WidgetToolCallStatus />
          <WidgetChartShell title="Tickets by channel">
            <WidgetDonutChart />
          </WidgetChartShell>

          <WidgetToolCallStatus />
          <WidgetChartShell title="SLA attainment by priority">
            <WidgetBarChart />
          </WidgetChartShell>

          <p className="mt-5">
            Recommendation: keep the volume trend and SLA widgets pinned for daily standups, and use the channel widget
            for weekly staffing review.
          </p>
          </div>
      </div>
    </div>
    </div>
  );
}

function ArtifactFileIcon() {
  return (
    <div className="relative flex h-10 w-8 shrink-0 items-center justify-center rounded-md border border-[#ffffff1a] bg-[#262626]">
      <div className="absolute right-0 top-0 h-2.5 w-2.5 rounded-bl-sm bg-[#3f3f46]" />
      <span className="text-[10px] font-semibold text-[#9ec1ff]">JS</span>
    </div>
  );
}

function RevenueArtifactTrigger() {
  return (
    <div className="group relative my-4 rounded-xl text-sm text-[#f4f4f5]">
      <button
        className="relative overflow-hidden rounded-xl border border-[#333333] transition-all duration-300 hover:border-[#525252] hover:shadow-lg"
        type="button"
      >
        <div className="w-fit bg-[#262626] p-2">
          <div className="flex flex-row items-center gap-2">
            <ArtifactFileIcon />
            <div className="overflow-hidden text-left">
              <div className="truncate font-medium">Revenue Dashboard</div>
              <div className="truncate text-[#a1a1aa]">Click to open artifact</div>
            </div>
          </div>
        </div>
      </button>
      <br />
    </div>
  );
}

function RevenueArtifactPreview() {
  return (
    <div className="h-full overflow-auto overscroll-contain bg-[#f8fafc] p-4 text-slate-950">
      <div className="mx-auto max-w-[560px]">
        <div className="flex items-start justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">Revenue Ops</p>
            <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-950">Monthly Revenue Dashboard</h2>
            <p className="mt-1 text-sm text-slate-500">Channel performance and week-over-week movement.</p>
          </div>
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">Live preview</span>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-3">
          {[
            { label: "Revenue", value: "$1.28M", delta: "+14.2%", spark: [34, 42, 38, 51, 58, 64, 71] },
            { label: "Pipeline", value: "$3.64M", delta: "+8.7%", spark: [48, 46, 52, 58, 55, 63, 69] },
            { label: "Win Rate", value: "42.8%", delta: "+3.1pt", spark: [30, 34, 32, 37, 39, 41, 43] },
            { label: "ARR Expansion", value: "$218K", delta: "+18.0%", spark: [22, 28, 31, 36, 44, 49, 56] },
          ].map((item) => (
            <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm" key={item.label}>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-xs text-slate-500">{item.label}</p>
                  <p className="mt-1 text-xl font-bold text-slate-950">{item.value}</p>
                </div>
                <p className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">{item.delta}</p>
              </div>
              <div className="mt-3 flex h-8 items-end gap-1">
                {item.spark.map((value, index) => (
                  <div className="flex-1 rounded-t bg-blue-100" key={index} style={{ height: `${value}%` }}>
                    <div className="h-full rounded-t bg-blue-500/70" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-semibold text-slate-950">Revenue by Channel</h3>
              <p className="text-xs text-slate-500">Monthly contribution and growth path</p>
            </div>
            <span className="text-xs text-slate-400">06/01/2026, 12:00:00 AM</span>
          </div>
          <div className="relative h-[220px] overflow-hidden rounded-xl border border-slate-100 bg-slate-50 px-4 pb-8 pt-4">
            {[0, 25, 50, 75].map((top) => (
              <div className="absolute inset-x-4 border-t border-dashed border-slate-200" key={top} style={{ top: `${top}%` }} />
            ))}
            <svg aria-hidden="true" className="pointer-events-none absolute inset-x-8 bottom-8 top-4 z-20 h-[calc(100%-3rem)] w-[calc(100%-4rem)] overflow-visible" preserveAspectRatio="none" viewBox="0 0 320 160">
              <path d="M40 126 C76 110 84 86 120 96 C160 108 160 62 200 70 C240 78 250 42 280 30" fill="none" stroke="#f59e0b" strokeLinecap="round" strokeWidth="3" />
              {[[40, 126], [120, 96], [200, 70], [280, 30]].map(([cx, cy]) => (
                <circle cx={cx} cy={cy} fill="#f8fafc" key={`${cx}-${cy}`} r="4" stroke="#f59e0b" strokeWidth="2" />
              ))}
            </svg>
            <div className="relative z-10 grid h-full grid-cols-4 items-end px-4">
              {[
                { label: "Direct", value: 88, color: "from-blue-700 to-blue-400", amount: "$564K" },
                { label: "Partner", value: 72, color: "from-cyan-700 to-cyan-400", amount: "$462K" },
                { label: "Market", value: 48, color: "from-violet-700 to-violet-400", amount: "$146K" },
                { label: "Renewal", value: 64, color: "from-emerald-700 to-emerald-400", amount: "$108K" },
              ].map((bar) => (
                <div className="flex h-full flex-col items-center justify-end" key={bar.label}>
                  <span className="mb-2 rounded-md bg-white px-2 py-1 text-[10px] font-semibold text-slate-700 shadow-sm">{bar.amount}</span>
                  <div className={`w-full max-w-10 rounded-t-lg bg-gradient-to-t ${bar.color} shadow-sm`} style={{ height: `${bar.value}%` }} />
                </div>
              ))}
            </div>
            <div className="absolute bottom-2 left-8 right-8 grid grid-cols-4 text-center text-[10px] font-medium text-slate-500">
              <span>Direct</span>
              <span>Partner</span>
              <span>Market</span>
              <span>Renewal</span>
            </div>
          </div>
        </div>

        <div className="mt-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-950">Channel Health</h3>
            <div className="mt-3 flex flex-col gap-3">
            {[
              ["Direct", "88%", "bg-blue-600"],
              ["Partner", "72%", "bg-cyan-500"],
              ["Marketplace", "48%", "bg-violet-500"],
              ["Renewal", "64%", "bg-emerald-500"],
            ].map(([label, value, color]) => (
              <div className="grid grid-cols-[74px_1fr_34px] items-center gap-2" key={label}>
                <span className="truncate text-xs font-medium text-slate-600">{label}</span>
                <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                  <div className={`h-full rounded-full ${color}`} style={{ width: value }} />
                </div>
                <span className="text-right text-xs text-slate-500">{value}</span>
              </div>
            ))}
            </div>
          </div>
        </div>

        <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-950 p-4 text-white shadow-sm">
          <div className="grid gap-4 md:grid-cols-[1fr_180px]">
            <div>
              <p className="text-sm font-semibold">Insight</p>
              <p className="mt-2 text-sm leading-5 text-slate-300">
                Partner revenue is accelerating fastest. Reallocate next week&apos;s campaign budget toward the two partner
                segments with the highest close velocity.
              </p>
            </div>
            <div className="rounded-xl bg-white/10 p-3">
              <p className="text-xs text-slate-400">Recommended action</p>
              <p className="mt-1 text-sm font-medium text-white">Increase partner campaign budget by 12%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function RevenueArtifactPanel() {
  return (
    <aside className="hidden h-full min-w-0 border-l border-[#333333] bg-[#171717] lg:flex lg:w-[430px] lg:flex-col">
      <div className="flex items-center justify-between border-b border-[#333333] bg-[#1b1b1b] p-2">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <button
            aria-label="Back"
            className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-[#d4d4d8] hover:bg-white/10"
            type="button"
          >
            <Icon className="h-4 w-4 rotate-180" name="chevron" />
          </button>
          <h3 className="truncate text-sm text-[#f4f4f5]">Revenue Dashboard</h3>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button
            aria-label="Refresh preview"
            className="inline-flex h-7 w-7 items-center justify-center rounded-md text-[#d4d4d8] hover:bg-white/10"
            type="button"
          >
            <svg aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M21 12a9 9 0 1 1-2.64-6.36" />
              <path d="M21 3v6h-6" />
            </svg>
          </button>
          <div className="inline-flex h-7 rounded-full border border-[#333333] bg-[#262626] p-0.5">
            <button className="rounded-full bg-[#3a3a3a] px-3 text-xs text-[#f4f4f5]" type="button">
              Preview
            </button>
            <button className="rounded-full px-3 text-xs text-[#a1a1aa]" type="button">
              Code
            </button>
          </div>
        </div>
      </div>
      <div className="min-h-0 flex-1 overflow-hidden">
        <RevenueArtifactPreview />
      </div>
      <div className="flex items-center justify-between border-t border-[#333333] bg-[#1b1b1b] p-2 text-sm text-[#a1a1aa]">
        <span>1 / 1</span>
        <div className="flex items-center gap-2">
          <button className="rounded-md border border-[#333333] px-2 py-1 text-xs hover:bg-white/10" type="button">
            Copy code
          </button>
          <button className="rounded-md border border-[#333333] px-2 py-1 text-xs hover:bg-white/10" type="button">
            Download
          </button>
        </div>
      </div>
    </aside>
  );
}

function RevenueArtifactChatScreen() {
  return (
    <section className="flex h-full min-h-0 bg-[#121212]">
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="mx-auto flex w-full max-w-[680px] flex-1 flex-col gap-8 overflow-y-auto px-8 pb-8 pt-7">
          <div className="flex justify-end">
            <div className="max-w-[560px] rounded-[20px] bg-[#2f2f2f] px-4 py-3 text-[15px] leading-6 text-[#f4f4f5]">
              Create an interactive revenue dashboard artifact from this month&apos;s CRM and billing data.
            </div>
          </div>

          <div className="flex">
            <div className="min-w-0 flex-1 text-[15px] leading-6 text-[#e4e4e7]">
              <p className="m-0">
                Completed. I created a React artifact with KPI cards, revenue-by-channel bars, and a short action
                insight for the revenue team.
              </p>
              <RevenueArtifactTrigger />
              <p className="mt-5">
                The artifact is ready for review in the preview panel. It can be copied or downloaded from the artifact
                toolbar.
              </p>
            </div>
          </div>
        </div>
        <PresetChatForm />
        <div aria-hidden="true" className="h-5" />
      </div>
      <RevenueArtifactPanel />
    </section>
  );
}

function ChatFormAction({
  children,
  className = "",
  label,
  onClick,
}: {
  children: ReactNode;
  className?: string;
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      aria-label={label}
      className={[
        "inline-flex h-9 w-9 items-center justify-center rounded-full p-1 text-[#f4f4f5] transition-colors hover:bg-white/10",
        className,
      ].join(" ")}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}

function McpToggleTrigger({ onClick }: { onClick?: () => void }) {
  return (
    <ChatFormAction label="Use MCP" onClick={onClick}>
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
      className="inline-flex h-9 w-9 items-center justify-center rounded-full p-1 text-[#d4d4d8] transition-colors hover:bg-white/10"
      type="button"
    >
      <Icon className="h-6 w-6" name="mic" />
    </button>
  );
}

const chatHintItems: Array<{
  description: string;
  icon: HintIconName;
  id: string;
  title: string;
}> = [
  {
    description: "Create images with AI",
    id: "image",
    icon: "image",
    title: "Generate an image",
  },
  {
    description: "Visualize data with charts, graphs, and more",
    id: "widget",
    icon: "widget",
    title: "Create a widget",
  },
  {
    description: "Create with code",
    id: "artifact",
    icon: "artifact",
    title: "Generate a code artifact",
  },
  {
    description: "Build and publish a web application",
    id: "web-app",
    icon: "webApp",
    title: "Build a web app",
  },
];

function ActionMenuSeparator() {
  return <li className="my-2 h-px w-full shrink-0 bg-[#333333]" role="separator" />;
}

function ActionMenuRow({
  checked,
  description,
  icon,
  onClick,
  title,
  trailing,
}: {
  checked?: boolean;
  description?: string;
  icon: HintIconName;
  onClick?: () => void;
  title: string;
  trailing?: ReactNode;
}) {
  return (
    <li className="group w-full shrink-0">
      <button
        aria-pressed={checked}
        className={[
          "flex w-full select-none items-center gap-3 rounded-lg px-2 text-left transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7aa7ff]",
          description ? "h-[52px]" : "h-9",
          checked ? "text-[#7aa7ff]" : "text-[#f4f4f5]",
        ].join(" ")}
        onClick={onClick}
        type="button"
      >
        <span className={["flex h-5 w-5 shrink-0 items-center justify-center", checked ? "text-[#7aa7ff]" : "text-[#d4d4d8]"].join(" ")}>
          <HintIcon name={icon} />
        </span>
        <span className="flex min-w-0 flex-1 flex-col items-start justify-center gap-0.5">
          <span className="truncate text-sm font-normal leading-5">{title}</span>
          {description ? <span className="truncate text-xs font-normal leading-4 text-[#a1a1aa]">{description}</span> : null}
        </span>
        {trailing ? <span className="flex shrink-0 items-center">{trailing}</span> : null}
        {checked ? (
          <span className="flex h-4 w-4 shrink-0 items-center justify-center text-[#7aa7ff]">
            <svg aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </span>
        ) : null}
      </button>
    </li>
  );
}

function ActionMenuSwitchRow({
  checked,
  icon,
  onClick,
  title,
}: {
  checked: boolean;
  icon: HintIconName;
  onClick: () => void;
  title: string;
}) {
  return (
    <li className="group w-full shrink-0">
      <button
        className="flex h-9 w-full select-none items-center gap-3 rounded-lg px-2.5 text-left text-[#f4f4f5] transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7aa7ff]"
        onClick={onClick}
        role="switch"
        aria-checked={checked}
        type="button"
      >
        <span className="flex h-5 w-5 shrink-0 items-center justify-center text-[#d4d4d8]">
          <HintIcon name={icon} />
        </span>
        <span className="min-w-0 flex-1 truncate text-sm font-normal leading-5">{title}</span>
        <span className={["relative h-5 w-9 rounded-full transition-colors", checked ? "bg-[#2c74e1]" : "bg-[#3f3f46]"].join(" ")}>
          <span className={["absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform", checked ? "translate-x-[18px]" : "translate-x-0.5"].join(" ")} />
        </span>
      </button>
    </li>
  );
}

function ChatAddonMenu() {
  const [selectedHint, setSelectedHint] = useState<string | null>(null);
  const [isFileSubmenuOpen, setIsFileSubmenuOpen] = useState(false);
  const [webSearchEnabled, setWebSearchEnabled] = useState(false);
  const [voiceReplyEnabled, setVoiceReplyEnabled] = useState(false);

  return (
    <div className="absolute bottom-[58px] left-0 z-30 w-[280px] rounded-2xl border border-[#333333] bg-[#1b1b1b] p-2 shadow-[0_18px_50px_rgba(0,0,0,0.45)]">
      <ul className="flex flex-col">
        <ActionMenuRow
          icon="file"
          onClick={() => setIsFileSubmenuOpen((value) => !value)}
          title="Add photos and files"
          trailing={<Icon className="h-4 w-4 text-[#a1a1aa]" name="chevron" />}
        />
        {isFileSubmenuOpen ? (
          <div className="absolute left-[286px] top-2 z-40 w-[250px] rounded-2xl border border-[#333333] bg-[#1b1b1b] p-2 shadow-[0_18px_50px_rgba(0,0,0,0.45)]">
            <ul className="flex flex-col">
              <ActionMenuRow icon="folderUp" title="Upload from computer" />
              <ActionMenuRow icon="cloudUpload" title="Select from My Drive" />
            </ul>
          </div>
        ) : null}

        <ActionMenuSeparator />
        {chatHintItems.map((item) => (
          <ActionMenuRow
            checked={selectedHint === item.id}
            description={item.description}
            icon={item.icon}
            key={item.title}
            onClick={() => setSelectedHint((value) => (value === item.id ? null : item.id))}
            title={item.title}
          />
        ))}
        <ActionMenuSeparator />
        <ActionMenuSwitchRow
          checked={webSearchEnabled}
          icon="globe"
          onClick={() => setWebSearchEnabled((value) => !value)}
          title="Web Search"
        />
        <ActionMenuSwitchRow
          checked={voiceReplyEnabled}
          icon="speech"
          onClick={() => setVoiceReplyEnabled((value) => !value)}
          title="AI Voice Reply"
        />
      </ul>
    </div>
  );
}

const mcpItems = [
  { id: "gmail", name: "Gmail", iconUrl: "/assets/products/aip/integrations/google-gmail.svg" },
  { id: "google-drive", name: "Google Drive", iconUrl: "/assets/products/aip/integrations/google-drive.svg" },
  { id: "google-calendar", name: "Google Calendar", iconUrl: "/assets/products/aip/integrations/google-calendar.svg" },
  { id: "google-sheets", name: "Google Sheets", iconUrl: "/assets/products/aip/integrations/google-sheets.svg" },
  { id: "slack", name: "Slack", iconUrl: "/assets/products/aip/integrations/slack.svg" },
  { id: "jira", name: "Jira", iconUrl: "/assets/products/aip/integrations/jira.svg" },
  { id: "github", name: "GitHub", iconUrl: "/assets/products/aip/integrations/github.svg" },
  { id: "notion", name: "Notion", iconUrl: "/assets/products/aip/integrations/notion.svg" },
  { id: "salesforce", name: "Salesforce", iconUrl: "/assets/products/aip/integrations/salesforce.svg" },
  { id: "confluence", name: "Confluence", iconUrl: "/assets/products/aip/integrations/confluence.svg" },
];

type ManagedMcpItem = {
  createdBy?: string;
  description: string;
  enabled?: boolean;
  id: string;
  name: string;
};

type ManagedMcpGroup = {
  id: string;
  items: ManagedMcpItem[];
  name: string;
};

const managedMcpGroups: ManagedMcpGroup[] = [
  {
    id: "analytics-business-intelligence",
    name: "Analytics & Business Intelligence",
    items: [
      { id: "airtable", name: "Airtable", description: "Work with Airtable bases, tables, and records." },
      { id: "clickhouse", name: "ClickHouse", description: "Query ClickHouse analytics databases." },
      { id: "snowflake", name: "Snowflake", description: "Analyze data stored in Snowflake warehouses." },
    ],
  },
  {
    id: "workflow-automation",
    name: "Workflow Automation",
    items: [
      { id: "dify", name: "Dify", description: "Connect Dify workflows and applications." },
      { id: "n8n-chat", name: "n8n Chat", description: "Use n8n chat workflows from AIP." },
      { id: "n8n-webhook", name: "n8n Webhook", description: "Trigger n8n workflows through webhook integrations." },
    ],
  },
  {
    id: "communication-collaboration",
    name: "Communication & Collaboration",
    items: [
      { id: "confluence", name: "Confluence", description: "Search and reference Confluence workspace content." },
      { id: "discord", name: "Discord", description: "Connect Discord channels and messages." },
      { id: "notion", name: "Notion", description: "Access Notion pages, databases, and workspace content." },
      { id: "slack", name: "Slack", description: "Search channels, messages, and workspace conversations." },
    ],
  },
  {
    id: "crm",
    name: "Customer Relationship Management(CRM)",
    items: [{ id: "salesforce", name: "Salesforce", description: "Access Salesforce CRM records and customer data." }],
  },
  {
    id: "google-services",
    name: "Google Services",
    items: [
      { id: "google-calendar", name: "Google Calendar", description: "Read and manage Google Calendar events." },
      { id: "google-drive", name: "Google Drive", description: "Find and work with files stored in Google Drive." },
      { id: "google-gmail", name: "Gmail", description: "Search Gmail messages and email attachments." },
      { id: "google-sheets", name: "Google Sheets", description: "Read and update spreadsheet data in Google Sheets." },
      { id: "google-slides", name: "Google Slides", description: "Access and work with Google Slides presentations." },
    ],
  },
  {
    id: "microsoft-services",
    name: "Microsoft Services",
    items: [
      { id: "microsoft-365", name: "Microsoft 365", description: "Connect Microsoft 365 files, mail, and workspace data." },
    ],
  },
  {
    id: "project-management",
    name: "Project Management",
    items: [{ id: "jira", name: "Jira", description: "Search and manage Jira issues and project data." }],
  },
  {
    id: "development-devops",
    name: "Development & DevOps",
    items: [
      { id: "aws", name: "AWS", description: "Access AWS resources and cloud service information." },
      { id: "datadog", name: "Datadog", description: "Query Datadog monitoring data and observability signals." },
      { id: "github", name: "GitHub", description: "Work with GitHub repositories, issues, and pull requests." },
      { id: "grafana", name: "Grafana", description: "Read Grafana dashboards and observability data." },
      { id: "kubernetes", name: "Kubernetes", description: "Inspect Kubernetes resources and cluster state." },
    ],
  },
  {
    id: "database-connections",
    name: "Database Connections",
    items: [
      { id: "maria-db", name: "MariaDB", description: "Query MariaDB databases." },
      { id: "mysql", name: "MySQL", description: "Query MySQL databases." },
      { id: "oracle", name: "Oracle", description: "Query Oracle databases." },
      { id: "postgresql", name: "PostgreSQL", description: "Query PostgreSQL databases." },
      { id: "redis", name: "Redis", description: "Access Redis data and keys." },
      { id: "sql-server", name: "SQL Server", description: "Query Microsoft SQL Server databases." },
      { id: "supabase", name: "Supabase", description: "Access Supabase project data." },
    ],
  },
  {
    id: "search-navigation",
    name: "Search & Navigation",
    items: [
      { id: "brave-search", name: "Brave Search", description: "Search the web with Brave Search." },
      { id: "context7", name: "Context7", description: "Find up-to-date developer documentation." },
      { id: "daum-search", name: "Daum Search", description: "Search web results through Daum." },
      { id: "kakao", name: "Kakao", description: "Search and access Kakao service information." },
      { id: "naver-search", name: "Naver Search", description: "Search web results through Naver." },
      { id: "perplexity-ask", name: "Perplexity Ask", description: "Ask Perplexity for web-grounded answers." },
    ],
  },
  {
    id: "local-integrations",
    name: "Local Integrations",
    items: [
      { id: "querypie", name: "QueryPie", description: "Connect QueryPie resources and internal service context." },
      { id: "ssh", name: "SSH", description: "Connect to local or remote environments over SSH." },
    ],
  },
  {
    id: "others",
    name: "Others",
    items: [{ id: "mcp", name: "MCP", description: "Connect custom MCP-compatible tools and servers." }],
  },
];

const installedMcpItems: ManagedMcpItem[] = [
  { createdBy: "Mina Park", enabled: true, id: "google-gmail", name: "Gmail", description: "Search Gmail messages and email attachments." },
  { createdBy: "Mina Park", enabled: true, id: "google-drive", name: "Google Drive", description: "Find and work with files stored in Google Drive." },
  { createdBy: "Daniel Kim", enabled: true, id: "google-calendar", name: "Google Calendar", description: "Read and manage Google Calendar events." },
  { createdBy: "Daniel Kim", enabled: true, id: "google-sheets", name: "Google Sheets", description: "Read and update spreadsheet data in Google Sheets." },
  { createdBy: "Sarah Lee", enabled: true, id: "slack", name: "Slack", description: "Search channels, messages, and workspace conversations." },
  { createdBy: "Sarah Lee", enabled: false, id: "jira", name: "Jira", description: "Search and manage Jira issues and project data." },
  { createdBy: "Alex Chen", enabled: true, id: "github", name: "GitHub", description: "Work with GitHub repositories, issues, and pull requests." },
  { createdBy: "Alex Chen", enabled: true, id: "notion", name: "Notion", description: "Access Notion pages, databases, and workspace content." },
  { createdBy: "Mina Park", enabled: true, id: "salesforce", name: "Salesforce", description: "Access Salesforce CRM records and customer data." },
  { createdBy: "Daniel Kim", enabled: false, id: "confluence", name: "Confluence", description: "Search and reference Confluence workspace content." },
];

const installedMcpItemIds = new Set(installedMcpItems.map((item) => item.id));

function McpSwitchRow({
  checked,
  iconUrl,
  name,
  onClick,
}: {
  checked: boolean;
  iconUrl: string;
  name: string;
  onClick: () => void;
}) {
  return (
    <li className="group w-full shrink-0">
      <button
        aria-checked={checked}
        className="flex h-9 w-full select-none items-center gap-3 rounded-lg px-2.5 text-left text-[#f4f4f5] transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7aa7ff]"
        onClick={onClick}
        role="switch"
        type="button"
      >
        <span className="flex h-5 w-5 shrink-0 items-center justify-center overflow-hidden rounded-md bg-white">
          <img alt="" className="h-4 w-4 object-contain" src={iconUrl} />
        </span>
        <span className="min-w-0 flex-1 truncate text-sm font-normal leading-5">{name}</span>
        <span
          className={[
            "relative h-[18px] w-8 rounded-full transition-colors",
            checked ? "bg-[#2c74e1]" : "bg-[#3f3f46]",
          ].join(" ")}
        >
          <span
            className={[
              "absolute top-0.5 h-3.5 w-3.5 rounded-full bg-white transition-transform",
              checked ? "translate-x-4" : "translate-x-0.5",
            ].join(" ")}
          />
        </span>
      </button>
    </li>
  );
}

function McpMenu() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggleItem = (id: string) => {
    setSelectedIds((current) => (current.includes(id) ? current.filter((value) => value !== id) : [...current, id]));
  };

  return (
    <div className="absolute bottom-[58px] left-11 z-30 w-[280px] rounded-2xl border border-[#333333] bg-[#1b1b1b] p-2 shadow-[0_18px_50px_rgba(0,0,0,0.45)]">
      <ul className="flex max-h-[360px] flex-col overflow-y-auto">
        {mcpItems.map((item) => (
          <McpSwitchRow
            checked={selectedIds.includes(item.id)}
            iconUrl={item.iconUrl}
            key={item.id}
            name={item.name}
            onClick={() => toggleItem(item.id)}
          />
        ))}
      </ul>
    </div>
  );
}

function PresetChatForm() {
  const [isHintMenuOpen, setIsHintMenuOpen] = useState(false);
  const [isMcpMenuOpen, setIsMcpMenuOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isHintMenuOpen && !isMcpMenuOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (containerRef.current?.contains(event.target as Node)) return;
      setIsHintMenuOpen(false);
      setIsMcpMenuOpen(false);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [isHintMenuOpen, isMcpMenuOpen]);

  return (
    <div className="relative mx-auto w-full max-w-[800px] px-8" ref={containerRef}>
      <div className="relative isolate">
        <div className="relative z-20 transition-transform duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)]">
          <form className="mx-auto flex w-full max-w-[800px] flex-row gap-3 transition-all duration-[600ms]">
            <div className="relative flex h-full min-w-0 flex-1 flex-col items-stretch">
              <div className="relative" />
              {isHintMenuOpen ? <ChatAddonMenu /> : null}
              {isMcpMenuOpen ? <McpMenu /> : null}
              <div className="flex w-full items-center">
                <div className="relative flex w-full grow flex-col overflow-hidden rounded-[30px] border border-[#333333] bg-[#121212] text-[#f4f4f5] shadow-sm transition-all duration-[600ms]">
                  <div />
                  <div className="px-5 pb-3.5 pt-[18px]">
                    <textarea
                      className="m-0 box-border max-h-[min(30svh,13rem)] min-h-[24px] w-full resize-none whitespace-pre-wrap break-words bg-transparent text-[15px] leading-6 text-[#f4f4f5] outline-none placeholder:text-[#7a7a7a]"
                      placeholder="Ask me anything"
                      readOnly
                      rows={1}
                    />
                  </div>
                  <div className="flex items-center gap-1.5 px-3 pb-3">
                    <div className="flex items-center gap-0.5">
                      <ChatFormAction
                        label="Open attachment menu"
                        onClick={() => {
                          setIsHintMenuOpen((value) => !value);
                          setIsMcpMenuOpen(false);
                        }}
                      >
                        <Icon className="h-6 w-6" name="plus" />
                      </ChatFormAction>
                      <McpToggleTrigger
                        onClick={() => {
                          setIsMcpMenuOpen((value) => !value);
                          setIsHintMenuOpen(false);
                        }}
                      />
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

const agentSummaries: Record<string, string> = {
  "data-analysis": "Analyze uploaded data and generate structured insights.",
  "customer-support": "Handle customer inquiries and prepare support response drafts.",
  "email-assistant": "Summarize emails, extract action items, and draft replies.",
  "meeting-notes": "Turn meeting transcripts into notes, decisions, and follow-up tasks.",
  "document-review": "Review documents, extract issues, and summarize action items.",
  "quotation-assistant": "Review quotations, summarize commercial terms, and prepare approval drafts.",
  "report-writer": "Draft polished reports from notes, files, and business context.",
  "research-helper": "Collect source material and organize findings for research tasks.",
  "sales-insight": "Analyze sales data, pipeline movement, and opportunity risks.",
  "security-review": "Review requests for security concerns and summarize risk findings.",
};

function AgentAvatar({
  name,
  shortName,
  size = "md",
}: {
  name: string;
  shortName: string;
  size?: "md" | "xs";
}) {
  const agentIconByName: Record<string, { color: string; iconUrl: string; full?: boolean }> = {
    "Data Analysis Agent": { color: "#e8f0fe", full: true, iconUrl: "/assets/mockups/aip/agents/data-analysis.svg" },
    "Quotation Assistant": { color: "#e8f0fe", full: true, iconUrl: "/assets/mockups/aip/agents/quotation-assistant.svg" },
    "Sales Insight Agent": { color: "#f3f0ff", full: true, iconUrl: "/assets/mockups/aip/agents/sales-insight.svg" },
    "Document Review Agent": { color: "#ecfdf5", full: true, iconUrl: "/assets/mockups/aip/agents/document-review.svg" },
    "Report Writer": { color: "#fff7ed", full: true, iconUrl: "/assets/mockups/aip/agents/report-writer.svg" },
  };
  const agentIcon = agentIconByName[name];

  return (
    <span
      className={[
        "relative flex shrink-0 items-center justify-center overflow-hidden rounded-full font-semibold text-white",
        size === "xs" ? "size-4 text-[8px]" : "size-8 text-base",
      ].join(" ")}
      style={{ backgroundColor: agentIcon?.color ?? "#0090ff" }}
    >
      {agentIcon ? (
        <img
          alt=""
          className={agentIcon.full ? "h-full w-full object-cover" : size === "xs" ? "size-2.5 object-contain" : "size-5 object-contain"}
          src={agentIcon.iconUrl}
        />
      ) : (
        <span>{shortName || name.charAt(0).toUpperCase()}</span>
      )}
    </span>
  );
}

function AgentsScreen({ onAgentClick }: { onAgentClick: (agentId: string) => void }) {
  const [activeTab, setActiveTab] = useState<"personal" | "organization">("personal");
  const agents = aipMockupAgents.filter((agent) =>
    activeTab === "personal" ? agent.owner === "Personal Agent" : agent.owner === "Organization Agent",
  );

  return (
    <section className="flex min-w-0 flex-1 flex-col overflow-auto bg-[#171717] px-6 py-6 text-[#fafafa]">
      <header className="mb-[30px] flex min-w-0 flex-wrap items-start gap-4">
        <div className="w-full">
          <div className="flex w-full items-center gap-1">
            <h1 className="text-3xl font-medium leading-9 text-[#fafafa]">Agents</h1>
          </div>
          <p className="mt-1 text-sm leading-5 text-[#8f8f8f]">
            From scheduling to custom workflows, use AI agents to handle repetitive work more efficiently.
          </p>
        </div>
      </header>

      <div className="mb-4 inline-flex h-auto shrink-0 items-center justify-center gap-5 self-start rounded-none bg-transparent p-0">
        <button
          className={[
            "inline-flex items-center justify-center whitespace-nowrap rounded-none border-b-2 border-transparent pb-1.5 text-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0090ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#171717]",
            activeTab === "personal" ? "text-[#fafafa]" : "text-[#8f8f8f] hover:text-[#fafafa]",
          ].join(" ")}
          onClick={() => setActiveTab("personal")}
          style={{ borderBottomColor: activeTab === "personal" ? "#fafafa" : "transparent" }}
          type="button"
        >
          Personal Agents
        </button>
        <button
          className={[
            "inline-flex items-center justify-center whitespace-nowrap rounded-none border-b-2 border-transparent pb-1.5 text-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0090ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#171717]",
            activeTab === "organization"
              ? "text-[#fafafa]"
              : "text-[#8f8f8f] hover:text-[#fafafa]",
          ].join(" ")}
          onClick={() => setActiveTab("organization")}
          style={{ borderBottomColor: activeTab === "organization" ? "#fafafa" : "transparent" }}
          type="button"
        >
          Organization Agents
        </button>
      </div>

      <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
        <div className="relative w-64 max-w-full">
          <Icon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#8f8f8f]" name="search" />
          <input
            className="flex h-10 w-full rounded-md border border-[#ffffff1a] bg-[#171717] px-3 py-2 pl-9 text-base text-[#fafafa] outline-none placeholder:text-[#737373] focus-visible:ring-2 focus-visible:ring-[#0090FF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#171717] md:text-sm"
            placeholder="Search agents..."
            readOnly
            type="search"
          />
        </div>

        {activeTab === "personal" ? (
          <div className="relative">
            <button
              className="inline-flex h-9 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg border-none bg-[#2A2A2A] px-3 py-2 text-sm font-medium text-[#fafafa] transition-all hover:bg-[#2A2A2A]/60"
              type="button"
            >
              <Icon className="h-4 w-4" name="plus" />
              Add
              <Icon className="h-4 w-4 rotate-90" name="chevron" />
            </button>
          </div>
        ) : null}
      </div>

      <div className="flex min-h-0 flex-1 flex-col">
        <div className="max-w-full overflow-x-auto">
          <table className="w-full table-fixed caption-bottom text-sm">
            <thead className="[&_tr]:border-b">
              <tr className="border-b border-[#ffffff1a] transition-colors hover:bg-white/[0.04]">
                <th className="h-12 w-[250px] whitespace-nowrap px-4 text-left align-middle font-medium text-[#8f8f8f]">Name</th>
                <th className="h-12 min-w-[400px] whitespace-nowrap px-4 text-left align-middle font-medium text-[#8f8f8f]">Summary</th>
                <th className="h-12 w-[160px] whitespace-nowrap px-4 text-center align-middle font-medium text-[#8f8f8f]">Start Chat</th>
                <th className="h-12 w-[60px] whitespace-nowrap px-4 text-left align-middle font-medium text-[#8f8f8f]" />
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {agents.map((agent) => (
                <tr
                  className="cursor-pointer border-b border-[#ffffff1a] transition-colors hover:bg-white/[0.04]"
                  key={agent.id}
                  onClick={() => onAgentClick(agent.id)}
                >
                  <td className="p-4 align-middle">
                    <div className="flex min-w-0 items-center gap-3">
                      <AgentAvatar name={agent.name} shortName={agent.shortName} />
                      <span className="block min-w-0 truncate font-medium text-[#fafafa]" title={agent.name}>
                        {agent.name}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 align-middle">
                    <span className="block truncate text-sm text-[#8f8f8f]" title={agentSummaries[agent.id]}>
                      {agentSummaries[agent.id] ?? "No content to display"}
                    </span>
                  </td>
                  <td className="p-4 text-center align-middle">
                    <button
                      aria-label="Start chat"
                      className="inline-flex h-8 w-8 shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg border border-[#ffffff1a] p-1 text-sm font-medium text-[#fafafa] transition-all hover:bg-white/[0.08] hover:text-[#fafafa]"
                      onClick={(event) => {
                        event.stopPropagation();
                        onAgentClick(agent.id);
                      }}
                      type="button"
                    >
                      <Icon className="h-4 w-4" name="messageShare" />
                    </button>
                  </td>
                  <td className="p-4 align-middle">
                    <div className="relative">
                      <button
                        aria-label="More actions"
                        className="inline-flex h-8 w-8 shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg border-none p-1 text-sm font-medium text-[#fafafa] transition-all hover:bg-white/[0.08] hover:text-[#fafafa]"
                        type="button"
                      >
                        <Icon className="h-4 w-4" name="moreHorizontal" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {agents.length === 0 ? (
          <div className="py-12 text-center text-sm text-[#8f8f8f]">No content to display</div>
        ) : null}
      </div>

      {agents.length > 0 ? (
        <div className="mt-4 flex items-center justify-between p-4">
          <span className="m-0 shrink-0 text-sm text-[#8f8f8f]">
            1 - {agents.length} of {agents.length}
          </span>

          <nav aria-label="pagination" className="mx-0 flex w-full justify-end">
            <ul className="flex flex-row items-center gap-1">
              <li>
                <button
                  aria-label="Go to previous page"
                  className="inline-flex h-9 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg px-2.5 py-2 text-sm font-medium text-[#8f8f8f] opacity-50"
                  type="button"
                >
                  <Icon className="h-4 w-4 rotate-180" name="chevron" />
                </button>
              </li>
              <li>
                <button
                  aria-current="page"
                  className="inline-flex h-8 w-8 shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg border border-[#ffffff1a] p-1 text-sm font-medium text-[#fafafa]"
                  type="button"
                >
                  1
                </button>
              </li>
              <li>
                <button
                  aria-label="Go to next page"
                  className="inline-flex h-9 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg px-2.5 py-2 text-sm font-medium text-[#8f8f8f] opacity-50"
                  type="button"
                >
                  <Icon className="h-4 w-4" name="chevron" />
                </button>
              </li>
            </ul>
          </nav>
        </div>
      ) : null}
    </section>
  );
}

type AutomationTrigger = "Email" | "Folder Watch" | "Schedule" | "Webhook";

type AutomationItem = {
  agentName: string;
  agentType: string;
  id: string;
  name: string;
  nextRun: string;
  notification: "Off" | "On";
  prompt: string;
  repeat: string;
  status: "Active" | "Paused";
  trigger: AutomationTrigger;
};

const automationItems: AutomationItem[] = [
  {
    id: "daily-sales-summary",
    name: "Daily Sales Summary",
    prompt: "Summarize yesterday's sales activity and highlight priority follow-ups.",
    agentName: "Sales Ops Agent",
    agentType: "Organization Agent",
    trigger: "Schedule",
    status: "Active",
    repeat: "Daily",
    nextRun: "Tomorrow",
    notification: "On",
  },
  {
    id: "quote-email-review",
    name: "Quote Email Review",
    prompt: "Review new quotation emails and prepare a purchasing approval note.",
    agentName: "Finance Analyst",
    agentType: "Organization Agent",
    trigger: "Email",
    status: "Active",
    repeat: "-",
    nextRun: "Triggered by email",
    notification: "On",
  },
  {
    id: "contract-folder-watch",
    name: "Contract Folder Watch",
    prompt: "Analyze newly uploaded contract files and extract renewal dates.",
    agentName: "Data Analysis Agent",
    agentType: "Personal Agent",
    trigger: "Folder Watch",
    status: "Paused",
    repeat: "-",
    nextRun: "Triggered by folder change",
    notification: "Off",
  },
  {
    id: "support-webhook-triage",
    name: "Support Webhook Triage",
    prompt: "Classify incoming support payloads and draft the first response.",
    agentName: "Report Writer",
    agentType: "Personal Agent",
    trigger: "Webhook",
    status: "Active",
    repeat: "-",
    nextRun: "Triggered by webhook",
    notification: "On",
  },
];

const automationTriggerIconPath: Record<AutomationTrigger, string> = {
  Email: "M4 6h16v12H4z M4 7l8 6 8-6",
  "Folder Watch": "M3 6h7l2 2h9v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
  Schedule: "M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14H3V6a2 2 0 0 1 2-2z",
  Webhook: "M9 7a4 4 0 0 1 6 0M7 12a5 5 0 0 0 10 0M12 17v4M5 21h14",
};

function AutomationTriggerBadge({ trigger }: { trigger: AutomationTrigger }) {
  const className =
    trigger === "Email"
      ? "border-transparent bg-[#1d4ed8] text-[#eff6ff]"
      : trigger === "Webhook"
        ? "border-transparent bg-[#2a2a2a] text-[#fafafa]"
        : "border-[#ffffff1a] bg-transparent text-[#fafafa]";

  return (
    <span className={`inline-flex h-7 items-center gap-2 whitespace-nowrap rounded-md border px-2.5 text-xs font-semibold ${className}`}>
      <svg
        aria-hidden="true"
        className="size-4"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path d={automationTriggerIconPath[trigger]} />
      </svg>
      <span>{trigger}</span>
    </span>
  );
}

function MockSwitch({ checked }: { checked: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={[
        "relative inline-flex h-5 w-9 shrink-0 rounded-full border border-transparent transition-colors",
        checked ? "bg-[#2563eb]" : "bg-[#3f3f46]",
      ].join(" ")}
    >
      <span
        className={[
          "pointer-events-none block size-4 translate-y-[1px] rounded-full bg-white shadow transition-transform",
          checked ? "translate-x-[18px]" : "translate-x-[1px]",
        ].join(" ")}
      />
    </span>
  );
}

function AutomationScreen() {
  return (
    <section className="flex min-w-0 flex-1 flex-col overflow-auto bg-[#171717] px-6 py-6 text-[#fafafa]">
      <header className="mb-[30px] flex min-w-0 flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex w-full items-center gap-1">
            <h1 className="text-3xl font-medium leading-9 text-[#fafafa]">Automation</h1>
          </div>
          <p className="mt-1 text-sm leading-5 text-[#8f8f8f]">
            Create an automation to run an agent from a schedule, email, webhook, or folder watch trigger.
          </p>
        </div>
        <button
          className="inline-flex h-9 shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg border-none bg-[#2A2A2A] px-3 py-2 text-sm font-medium text-[#fafafa] transition-all hover:bg-[#2A2A2A]/60"
          type="button"
        >
          <Icon className="h-4 w-4" name="plus" />
          New automation
        </button>
      </header>

      <div className="mb-4 flex items-center gap-4">
        <div className="relative w-72 max-w-full">
          <Icon
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#8f8f8f]"
            name="search"
          />
          <input
            className="flex h-10 w-full rounded-md border border-[#ffffff1a] bg-[#171717] px-3 py-2 pl-9 text-base text-[#fafafa] outline-none placeholder:text-[#737373] focus-visible:ring-2 focus-visible:ring-[#0090FF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#171717] md:text-sm"
            placeholder="Search automations..."
            readOnly
            type="search"
          />
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col">
        <div className="max-w-full overflow-x-auto">
          <table className="w-full min-w-[960px] table-fixed caption-bottom text-sm">
            <thead className="[&_tr]:border-b">
              <tr className="border-b border-[#ffffff1a] transition-colors hover:bg-white/[0.04]">
                <th className="h-12 w-[240px] whitespace-nowrap px-4 text-left align-middle font-medium text-[#8f8f8f]">Name</th>
                <th className="h-12 w-[160px] whitespace-nowrap px-4 text-left align-middle font-medium text-[#8f8f8f]">Target</th>
                <th className="h-12 w-[130px] whitespace-nowrap px-4 text-left align-middle font-medium text-[#8f8f8f]">Trigger</th>
                <th className="h-12 w-[120px] whitespace-nowrap px-4 text-left align-middle font-medium text-[#8f8f8f]">Status</th>
                <th className="h-12 w-[100px] whitespace-nowrap px-4 text-left align-middle font-medium text-[#8f8f8f]">Repeat</th>
                <th className="h-12 w-[150px] whitespace-nowrap px-4 text-left align-middle font-medium text-[#8f8f8f]">Next Run</th>
                <th className="h-12 w-[130px] whitespace-nowrap px-4 text-left align-middle font-medium text-[#8f8f8f]">Notification</th>
                <th className="h-12 w-[60px] whitespace-nowrap px-4 text-left align-middle font-medium text-[#8f8f8f]">Actions</th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {automationItems.map((automation) => (
                <tr
                  className="cursor-pointer border-b border-[#ffffff1a] transition-colors hover:bg-white/[0.04]"
                  key={automation.id}
                >
                  <td className="p-4 align-middle">
                    <div className="space-y-1">
                      <div className="truncate font-medium text-[#fafafa]" title={automation.name}>
                        {automation.name}
                      </div>
                      <div className="line-clamp-2 text-sm text-[#8f8f8f]">{automation.prompt}</div>
                    </div>
                  </td>
                  <td className="p-4 align-middle">
                    <div>
                      <div className="flex min-w-0 items-center gap-2 font-medium">
                        <span className="truncate text-[#fafafa]" title={automation.agentName}>
                          {automation.agentName}
                        </span>
                      </div>
                      <div className="text-sm text-[#8f8f8f]">{automation.agentType}</div>
                    </div>
                  </td>
                  <td className="p-4 align-middle">
                    <AutomationTriggerBadge trigger={automation.trigger} />
                  </td>
                  <td className="p-4 align-middle">
                    <div className="flex items-center gap-3">
                      <MockSwitch checked={automation.status === "Active"} />
                      <span className="text-sm text-[#fafafa]">{automation.status}</span>
                    </div>
                  </td>
                  <td className="p-4 align-middle">
                    {automation.repeat === "-" ? (
                      <span className="text-sm text-[#fafafa]">-</span>
                    ) : (
                      <span className="inline-flex h-6 items-center rounded-md bg-[#2a2a2a] px-2 text-xs font-semibold capitalize text-[#fafafa]">
                        {automation.repeat}
                      </span>
                    )}
                  </td>
                  <td className="p-4 align-middle">
                    <span className="text-sm text-[#fafafa]">{automation.nextRun}</span>
                  </td>
                  <td className="p-4 align-middle">
                    <div className="flex items-center gap-3">
                      <MockSwitch checked={automation.notification === "On"} />
                      <span className="text-sm text-[#fafafa]">{automation.notification}</span>
                    </div>
                  </td>
                  <td className="p-4 align-middle">
                    <button
                      aria-label="More actions"
                      className="inline-flex h-8 w-8 shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg border-none p-1 text-sm font-medium text-[#fafafa] transition-all hover:bg-white/[0.08] hover:text-[#fafafa]"
                      type="button"
                    >
                      <Icon className="h-4 w-4" name="moreHorizontal" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex items-center justify-between p-4">
          <span className="m-0 shrink-0 text-sm text-[#8f8f8f]">
            1 - {automationItems.length} of {automationItems.length}
          </span>

          <nav aria-label="pagination" className="mx-0 flex w-full justify-end">
            <ul className="flex flex-row items-center gap-1">
              <li>
                <button
                  aria-label="Go to previous page"
                  className="inline-flex h-9 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg px-2.5 py-2 text-sm font-medium text-[#8f8f8f] opacity-50"
                  type="button"
                >
                  <Icon className="h-4 w-4 rotate-180" name="chevron" />
                </button>
              </li>
              <li>
                <button
                  aria-current="page"
                  className="inline-flex h-8 w-8 shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg border border-[#ffffff1a] p-1 text-sm font-medium text-[#fafafa]"
                  type="button"
                >
                  1
                </button>
              </li>
              <li>
                <button
                  aria-label="Go to next page"
                  className="inline-flex h-9 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg px-2.5 py-2 text-sm font-medium text-[#8f8f8f] opacity-50"
                  type="button"
                >
                  <Icon className="h-4 w-4" name="chevron" />
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </section>
  );
}

type MyDriveItem = {
  id: string;
  modifiedAt: string;
  name: string;
  size: string;
  type: "FILE" | "FOLDER";
};

const myDriveItems: MyDriveItem[] = [
  { id: "folder-finance", name: "Finance", type: "FOLDER", size: "-", modifiedAt: "06/28/2026, 10:14:00 AM" },
  { id: "folder-projects", name: "Project Documents", type: "FOLDER", size: "-", modifiedAt: "06/27/2026, 04:32:00 PM" },
  { id: "quotation-pdf", name: "Software_Supply_Quotation.pdf", type: "FILE", size: "184 KiB", modifiedAt: "06/28/2026, 11:02:00 AM" },
  { id: "sales-xlsx", name: "Q2_Sales_Pipeline.xlsx", type: "FILE", size: "92 KiB", modifiedAt: "06/26/2026, 06:18:00 PM" },
  { id: "notes-md", name: "Implementation_Notes.md", type: "FILE", size: "14 KiB", modifiedAt: "06/25/2026, 09:41:00 AM" },
];

function DriveItemIcon({ item }: { item: MyDriveItem }) {
  if (item.type === "FOLDER") {
    return (
      <svg aria-hidden="true" className="size-6 shrink-0" fill="none" viewBox="0 0 32 32">
        <path d="M2 8.3H26.6667C28.5 8.3 30 10 30 11.5V23.8C30 25.5 28.5 27 26.6667 27H5.33333C3.5 27 2 25.5 2 23.8V8.3Z" fill="#FBBC04" />
        <path d="M2 7C2 6 3.07692 5 4.15385 5H11.1538C11.61 5 12.1844 5.25068 12.3744 5.64168L13.6667 8.3H2V7Z" fill="#E79200" />
      </svg>
    );
  }

  if (item.name.endsWith(".xlsx")) {
    return (
      <svg aria-hidden="true" className="size-6 shrink-0" fill="none" viewBox="0 0 32 32">
        <path d="M5 5C5 2.79086 6.79086 1 9 1H20L27 8V27C27 29.2091 25.2091 31 23 31H9C6.79086 31 5 29.2091 5 27V5Z" fill="#50984B" />
        <path d="M20 1L27 8H22C20.8954 8 20 7.10457 20 6V1Z" fill="#90BB8D" />
        <path d="M10 13H22V25H10V13Z" fill="white" />
        <path d="M11.5 14.5H15.5V17.5H11.5V14.5Z" fill="#50984B" />
        <path d="M16.5 14.5H20.5V17.5H16.5V14.5Z" fill="#50984B" />
        <path d="M11.5 18.5H15.5V21.5H11.5V18.5Z" fill="#50984B" />
        <path d="M16.5 18.5H20.5V21.5H16.5V18.5Z" fill="#50984B" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" className="size-6 shrink-0" fill="none" viewBox="0 0 32 32">
      <path d="M5 5C5 2.79086 6.79086 1 9 1H20L27 8V27C27 29.2091 25.2091 31 23 31H9C6.79086 31 5 29.2091 5 27V5Z" fill="#4285F4" />
      <path d="M20 1L27 8H22C20.8954 8 20 7.10457 20 6V1Z" fill="#A3C2F4" />
      <path d="M10 13H22V15H10V13Z" fill="white" />
      <path d="M10 18H22V20H10V18Z" fill="white" />
      <path d="M10 23H18V25H10V23Z" fill="white" />
    </svg>
  );
}

function MyDriveToolbarButton({
  children,
  disabled,
}: {
  children: ReactNode;
  disabled?: boolean;
}) {
  return (
    <button
      className={[
        "inline-flex h-9 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-all",
        disabled
          ? "border border-[#ffffff1a] text-[#8f8f8f] opacity-50"
          : "border border-[#ffffff1a] text-[#fafafa] hover:bg-white/[0.08]",
      ].join(" ")}
      type="button"
    >
      {children}
    </button>
  );
}

function MyDriveScreen() {
  return (
    <section className="flex min-w-0 flex-1 flex-col overflow-hidden bg-[#171717] px-6 py-6 text-[#fafafa]">
      <div className="flex h-full min-h-0 flex-col gap-4 overflow-hidden">
        <div className="shrink-0">
          <header className="mb-[30px] flex min-w-0 flex-wrap items-start gap-4">
            <div className="w-full">
              <div className="flex w-full items-center gap-1">
                <h1 className="text-3xl font-medium leading-9 text-[#fafafa]">My Drive</h1>
              </div>
              <p className="mt-1 text-sm leading-5 text-[#8f8f8f]">
                Upload files in advance and use them in chats when needed. A viewer is not provided.
              </p>
            </div>
          </header>

          <div className="flex flex-wrap items-center justify-between gap-5">
            <nav aria-label="breadcrumb" className="min-w-0">
              <ol className="flex min-w-0 items-center gap-1 text-sm text-[#8f8f8f]">
                <li>
                  <button
                    aria-label="My Drive"
                    className="flex items-center gap-1.5 rounded-md px-1.5 py-1 text-[#fafafa] hover:bg-white/[0.08]"
                    type="button"
                  >
                    <svg aria-hidden="true" className="size-4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M3 11l9-8 9 8" />
                      <path d="M5 10v10h14V10" />
                    </svg>
                    <span className="sr-only">My Drive</span>
                  </button>
                </li>
              </ol>
            </nav>

            <div className="flex flex-wrap items-center justify-end gap-2">
              <MyDriveToolbarButton disabled>
                <svg aria-hidden="true" className="size-4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M12 3v12" />
                  <path d="m7 10 5 5 5-5" />
                  <path d="M5 21h14" />
                </svg>
                Download
              </MyDriveToolbarButton>
              <MyDriveToolbarButton disabled>
                <svg aria-hidden="true" className="size-4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M3 6h18" />
                  <path d="M8 6V4h8v2" />
                  <path d="M6 6l1 16h10l1-16" />
                </svg>
                Delete
              </MyDriveToolbarButton>
              <button
                className="inline-flex h-9 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg border-none bg-[#2A2A2A] px-3 py-2 text-sm font-medium text-[#fafafa] transition-all hover:bg-[#2A2A2A]/60"
                type="button"
              >
                <Icon className="h-4 w-4" name="plus" />
                Add
                <Icon className="h-4 w-4 rotate-90" name="chevron" />
              </button>
            </div>
          </div>
        </div>

        <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-md border border-[#ffffff1a]">
          <div className="max-w-full overflow-x-auto">
            <table className="w-full min-w-[720px] caption-bottom text-sm">
              <thead className="sticky top-0 bg-[#262626] [&_tr]:border-b">
                <tr className="border-b border-[#ffffff1a] transition-colors hover:bg-[#262626]">
                  <th className="h-[39px] min-w-[200px] max-w-[300px] whitespace-nowrap px-4 text-left align-middle font-medium text-[#fafafa]">Name</th>
                  <th className="h-[39px] w-[120px] whitespace-nowrap px-4 text-left align-middle font-medium text-[#fafafa]">Size</th>
                  <th className="h-[39px] w-[180px] whitespace-nowrap px-4 text-left align-middle font-medium text-[#fafafa]">Modified At</th>
                  <th className="h-[39px] w-[60px] whitespace-nowrap px-4 text-right align-middle font-medium text-[#fafafa]" />
                </tr>
              </thead>
              <tbody className="[&_tr:last-child]:border-0">
                {myDriveItems.map((item) => (
                  <tr
                    className="h-[47px] cursor-pointer select-none border-b border-[#ffffff1a] transition-colors hover:bg-white/[0.04]"
                    key={item.id}
                  >
                    <td className="min-w-[200px] max-w-[300px] px-4 py-2 align-middle">
                      <div className="flex min-w-0 items-center gap-2">
                        <DriveItemIcon item={item} />
                        <span className="min-w-0 truncate font-medium text-[#fafafa]" title={item.name}>
                          {item.name}
                        </span>
                      </div>
                    </td>
                    <td className="w-[120px] px-4 py-2 align-middle">
                      <span className="whitespace-nowrap text-sm text-[#8f8f8f]">{item.size}</span>
                    </td>
                    <td className="w-[180px] px-4 py-2 align-middle">
                      <span className="whitespace-nowrap text-sm text-[#8f8f8f]">{item.modifiedAt}</span>
                    </td>
                    <td className="w-[60px] px-4 py-2 text-right align-middle">
                      <button
                        aria-label="More actions"
                        className="inline-flex h-8 w-8 shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg border-none p-1 text-sm font-medium text-[#fafafa] transition-all hover:bg-white/[0.08] hover:text-[#fafafa]"
                        type="button"
                      >
                        <Icon className="h-4 w-4" name="moreHorizontal" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="shrink-0">
          <div className="flex w-full max-w-[200px] flex-col gap-1.5">
            <div className="flex items-center justify-between text-xs text-[#fafafa]">
              <span>290 KiB used</span>
              <span>10 GB</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#ffffff1a]">
              <div className="h-full rounded-l-full bg-[#22c55e]" style={{ width: "8%" }} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

type SkillSource = "GitHub" | "Library" | "Upload";

type SkillItem = {
  description: string;
  id: string;
  name: string;
  source: SkillSource;
  updatedAt: string;
};

const skillItems: SkillItem[] = [
  {
    id: "invoice-analysis",
    name: "Invoice Analysis",
    description: "Extract supplier, line items, totals, and due dates from invoice files.",
    source: "Library",
    updatedAt: "06/28/2026, 09:20:00 AM",
  },
  {
    id: "meeting-summary",
    name: "Meeting Summary",
    description: "Turn transcripts and notes into concise summaries, decisions, and follow-up tasks.",
    source: "Upload",
    updatedAt: "06/27/2026, 04:12:00 PM",
  },
  {
    id: "salesforce-research",
    name: "Salesforce Research",
    description: "Collect account context and prepare CRM-ready opportunity notes.",
    source: "Library",
    updatedAt: "06/26/2026, 02:35:00 PM",
  },
  {
    id: "approval-email",
    name: "Approval Email Draft",
    description: "Draft approval request emails from quotes, contracts, and internal notes.",
    source: "Upload",
    updatedAt: "06/25/2026, 11:04:00 AM",
  },
  {
    id: "github-pr-review",
    name: "GitHub PR Review",
    description: "Review pull requests, summarize risks, and prepare code review comments from repository context.",
    source: "GitHub",
    updatedAt: "06/24/2026, 05:28:00 PM",
  },
  {
    id: "release-note-writer",
    name: "Release Note Writer",
    description: "Generate release notes from merged issues, commits, and product documentation updates.",
    source: "GitHub",
    updatedAt: "06/23/2026, 03:16:00 PM",
  },
];

function SkillSourceBadgeMock({ source }: { source: SkillSource }) {
  return (
    <span className="inline-flex min-w-0 items-center gap-1 rounded-md border border-[#ffffff1a] bg-[#262626] px-1.5 py-0 text-xs text-[#fafafa]">
      {source === "Library" ? (
        <svg aria-hidden="true" className="size-3" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
          <path d="m16 6 4 14" />
          <path d="M12 6v14" />
          <path d="M8 8v12" />
          <path d="M4 4v16" />
        </svg>
      ) : source === "GitHub" ? (
        <svg aria-hidden="true" className="size-3" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 .5A12 12 0 0 0 8.2 23.9c.6.1.8-.3.8-.6v-2.1c-3.3.7-4-1.4-4-1.4-.5-1.3-1.3-1.7-1.3-1.7-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.6-.3-5.4-1.3-5.4-5.9 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.4 11.4 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.7.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.4 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .5Z" />
        </svg>
      ) : (
        <svg aria-hidden="true" className="size-3" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M12 13v8" />
          <path d="m8 17 4-4 4 4" />
          <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
        </svg>
      )}
      <span>{source}</span>
    </span>
  );
}

function SkillsScreen() {
  return (
    <section className="flex min-w-0 flex-1 flex-col overflow-auto bg-[#171717] px-6 py-6 text-[#fafafa]">
      <div className="flex h-full min-h-0 flex-col gap-6">
        <div className="shrink-0">
          <header className="mb-[30px] flex min-w-0 flex-wrap items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex w-full items-center gap-1">
                <h1 className="text-3xl font-medium leading-9 text-[#fafafa]">Skills</h1>
              </div>
              <p className="mt-1 block max-w-2xl text-sm leading-5 text-[#8f8f8f]">
                Pre-packaged, repeatable best practices and tools.
              </p>
            </div>
            <button
              className="inline-flex h-9 shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg border-none bg-[#2A2A2A] px-3 py-2 text-sm font-medium text-[#fafafa] transition-all hover:bg-[#2A2A2A]/60"
              type="button"
            >
              <Icon className="h-4 w-4" name="plus" />
              Add
              <Icon className="h-4 w-4 rotate-90" name="chevron" />
            </button>
          </header>

          <div className="relative w-full max-w-2xl">
            <Icon
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#8f8f8f]"
              name="search"
            />
            <input
              aria-label="Search skills"
              className="flex h-10 w-full rounded-md border border-[#ffffff1a] bg-[#171717] px-3 py-2 pl-9 text-base text-[#fafafa] outline-none placeholder:text-[#737373] focus-visible:ring-2 focus-visible:ring-[#0090FF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#171717] md:text-sm"
              placeholder="Search skills"
              readOnly
              type="search"
            />
          </div>
        </div>

        <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-auto">
          <div className="grid content-stretch grid-cols-1 gap-3 lg:grid-cols-2">
            {skillItems.map((skill) => (
              <div className="group relative" key={skill.id}>
                <button
                  aria-label={skill.name}
                  className="peer absolute inset-0 z-10 rounded-[10px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0090FF]"
                  type="button"
                />
                <div className="relative h-full rounded-[10px] border border-[#ffffff1a] bg-[#ffffff0d] p-5 transition-colors group-hover:border-[#fafafa]/30">
                  <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-3 gap-y-3">
                    <p className="min-w-0 truncate text-base font-medium text-[#fafafa]">{skill.name}</p>
                    <div className="relative z-20 shrink-0 self-start">
                      <button
                        aria-label="More actions"
                        className="inline-flex size-8 items-center justify-center rounded-lg text-[#fafafa] transition-all hover:bg-white/[0.08]"
                        type="button"
                      >
                        <Icon className="h-4 w-4" name="moreHorizontal" />
                      </button>
                    </div>
                    <p className="col-span-2 line-clamp-2 text-sm text-[#8f8f8f]">{skill.description}</p>
                    <div className="col-span-2 min-w-0">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        <SkillSourceBadgeMock source={skill.source} />
                        <span className="text-xs text-[#8f8f8f]">{skill.updatedAt}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

type AipAppItem = {
  description: string;
  gradient: string;
  iconUrl: string;
  id: string;
  name: string;
  tagline: string;
};

const aipAppItems: AipAppItem[] = [
  {
    id: "lingo",
    name: "Lingo",
    gradient: "linear-gradient(135deg, #0a2e2e 0%, #135e5e 50%, #14b8a6 100%)",
    iconUrl: "/assets/aip-apps/icon-lingo.svg",
    tagline: "Speak freely. Understand instantly.",
    description:
      "Transcribe meeting speech in real time and translate across Korean, English, and Japanese simultaneously.",
  },
  {
    id: "notepie",
    name: "NotePie",
    gradient: "linear-gradient(135deg, #0d1b3e 0%, #1a3a70 50%, #2c74e1 100%)",
    iconUrl: "/assets/aip-apps/icon-notepie.svg",
    tagline: "Turn any source into knowledge.",
    description:
      "Turn documents, URLs, and text into study guides, mind maps, slide decks, podcasts, and cited AI chat.",
  },
];

function ExternalLinkMockIcon({ className = "h-4 w-4" }: { className?: string }) {
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
      <path d="M15 3h6v6" />
      <path d="M10 14 21 3" />
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    </svg>
  );
}

function ChevronButtonIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      aria-hidden="true"
      className="h-3.5 w-3.5"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      {direction === "left" ? <path d="m15 18-6-6 6-6" /> : <path d="m9 18 6-6-6-6" />}
    </svg>
  );
}

function AppsFeaturedBanner() {
  const [index, setIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const hasMultipleApps = aipAppItems.length > 1;

  const prev = () => setIndex((value) => (value - 1 + aipAppItems.length) % aipAppItems.length);
  const next = () => setIndex((value) => (value + 1) % aipAppItems.length);

  useEffect(() => {
    if (hovered || !hasMultipleApps) return;

    const intervalId = window.setInterval(next, 5000);
    return () => window.clearInterval(intervalId);
  }, [hovered, hasMultipleApps]);

  return (
    <div
      className={["relative h-[260px] overflow-hidden rounded-2xl", hasMultipleApps ? "group" : ""].join(" ")}
      onMouseEnter={hasMultipleApps ? () => setHovered(true) : undefined}
      onMouseLeave={hasMultipleApps ? () => setHovered(false) : undefined}
    >
      {aipAppItems.map((app, slideIndex) => (
        <a
          className={[
            "absolute inset-0 flex items-center transition-opacity duration-500",
            slideIndex === index ? "pointer-events-auto z-10 opacity-100" : "pointer-events-none z-0 opacity-0",
          ].join(" ")}
          href="#"
          key={app.id}
          onClick={(event) => event.preventDefault()}
          rel="noopener noreferrer"
          style={{ background: app.gradient }}
          target="_blank"
        >
          <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
          <div className="relative z-10 flex w-full flex-none flex-col gap-4 px-8 py-6 md:w-[52%]">
            <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl bg-white/20">
              <img alt={app.name} className="h-full w-full rounded-[10px] object-contain p-0.5" src={app.iconUrl} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{app.name}</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-white/70">{app.tagline}</p>
            </div>
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-white/60 bg-white/15 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/25">
              Open ↗
            </span>
          </div>

          <div
            className={[
              "relative z-10 hidden flex-1 items-end justify-center pb-4 md:flex",
              app.id === "lingo" ? "-translate-x-8" : "",
            ].join(" ")}
          >
            {app.id === "lingo" ? <LingoAppPreview /> : <NotepieAppPreview />}
          </div>
        </a>
      ))}

      {hasMultipleApps ? (
        <>
          <button
            aria-label="Previous"
            className="absolute left-3 top-1/2 z-20 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full bg-black/20 text-white/80 opacity-0 backdrop-blur-sm transition-opacity hover:bg-black/35 group-hover:opacity-100"
            onClick={prev}
            type="button"
          >
            <ChevronButtonIcon direction="left" />
          </button>
          <button
            aria-label="Next"
            className="absolute right-3 top-1/2 z-20 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full bg-black/20 text-white/80 opacity-0 backdrop-blur-sm transition-opacity hover:bg-black/35 group-hover:opacity-100"
            onClick={next}
            type="button"
          >
            <ChevronButtonIcon direction="right" />
          </button>
          <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-1.5">
            {aipAppItems.map((app, dotIndex) => (
              <button
                aria-label={`Slide ${dotIndex + 1}`}
                className={[
                  "block h-1.5 shrink-0 rounded-full p-0 transition-all duration-300",
                  dotIndex === index ? "w-4 bg-white" : "w-1.5 bg-white hover:bg-white",
                ].join(" ")}
                key={app.id}
                onClick={() => setIndex(dotIndex)}
                type="button"
              />
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}

function NotepieAppPreview() {
  return (
    <div className="flex items-end">
      <div className="z-0 -mr-14 origin-bottom-right rotate-[-7deg]">
        <div className="w-40 overflow-hidden rounded-2xl bg-[#1e3a5f] font-sans shadow-xl will-change-transform">
          <div className="bg-[#1e3a5f] px-3 py-2">
            <p className="text-[9px] font-semibold text-blue-300">Sources</p>
          </div>
          <div className="flex flex-col gap-1.5 bg-white p-3">
            {[
              { icon: "📄", name: "report.pdf", size: "2.4 MB" },
              { icon: "🔗", name: "arxiv.org/abs/...", size: "URL" },
              { icon: "📝", name: "notes.txt", size: "18 KB" },
            ].map(({ icon, name, size }) => (
              <div className="flex items-center justify-between rounded-lg bg-slate-50 px-2 py-1.5" key={name}>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px]">{icon}</span>
                  <span className="max-w-[72px] truncate text-[8px] text-slate-600">{name}</span>
                </div>
                <span className="shrink-0 text-[7px] text-slate-400">{size}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="relative z-[5] -mr-10 origin-bottom rotate-[-2deg]">
        <div className="w-40 overflow-hidden rounded-2xl bg-[#1e3a5f] font-sans shadow-xl will-change-transform">
          <div className="bg-[#1e3a5f] px-3 py-2">
            <p className="text-[9px] font-semibold text-blue-300">Generate as</p>
          </div>
          <div className="grid grid-cols-2 gap-1.5 bg-white p-3">
            {[
              { icon: "📖", label: "Study Guide", active: true },
              { icon: "🗺️", label: "Mind Map", active: false },
              { icon: "📊", label: "Slides", active: false },
              { icon: "🎙️", label: "Podcast", active: false },
            ].map(({ icon, label, active }) => (
              <div
                className={[
                  "flex flex-col items-center gap-1 rounded-xl py-2 text-center",
                  active ? "bg-[#1e3a5f] text-blue-300" : "bg-slate-50 text-slate-400",
                ].join(" ")}
                key={label}
              >
                <span className="text-[12px]">{icon}</span>
                <span className="text-[7px] font-medium leading-tight">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="relative z-10">
        <div className="w-48 overflow-hidden rounded-2xl bg-[#0f172a] font-sans shadow-2xl will-change-transform">
          <div className="bg-gradient-to-br from-[#0f172a] to-[#1e3a5f] px-4 py-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[7px] font-semibold uppercase tracking-widest text-blue-400">Slide 1 / 4</span>
              <div className="flex gap-0.5">
                {[0, 1, 2, 3].map((dot) => (
                  <div className={`h-1 w-1 rounded-full ${dot === 0 ? "bg-blue-400" : "bg-white/20"}`} key={dot} />
                ))}
              </div>
            </div>
            <p className="text-[11px] font-bold leading-tight text-white">
              Introduction to
              <br />
              Transformer Models
            </p>
            <p className="mt-1 text-[7px] text-blue-300">From: report.pdf · arxiv.org</p>
          </div>
          <div className="flex flex-col gap-1.5 bg-white px-4 py-3">
            {["What is self-attention?", "Encoder & Decoder architecture", "Why transformers outperform RNNs"].map(
              (point, pointIndex) => (
                <div className="flex items-center gap-2" key={point}>
                  <div className="flex h-3 w-3 shrink-0 items-center justify-center rounded-full bg-[#1e3a5f] text-[6px] font-bold text-blue-300">
                    {pointIndex + 1}
                  </div>
                  <span className="text-[8px] leading-tight text-slate-600">{point}</span>
                </div>
              ),
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function LingoAppPreview() {
  return (
    <div className="flex items-end">
      <div className="z-0 -mr-14 origin-bottom-right rotate-[-7deg]">
        <div className="w-40 overflow-hidden rounded-2xl bg-[#0a2e2e] font-sans shadow-xl will-change-transform">
          <div className="flex items-center justify-between px-3 py-2">
            <p className="text-[9px] text-teal-100/70">Weekly Sync</p>
            <p className="text-[7px] text-teal-100/30">4</p>
          </div>
          <div className="grid grid-cols-2 gap-0.5 px-2 pb-2">
            {[
              { initials: "AK", name: "Alex Kim", active: true },
              { initials: "SY", name: "Sarah Yoon", active: false },
              { initials: "JL", name: "John Lee", active: false },
              { initials: "MB", name: "Mia Brown", active: false },
            ].map((person) => (
              <div
                className={[
                  "relative flex h-12 items-center justify-center overflow-hidden rounded-lg bg-[#135e5e]/30",
                  person.active ? "border border-teal-400/50" : "border border-white/10",
                ].join(" ")}
                key={person.initials}
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#135e5e]/60 text-[7px] font-bold text-white/90">
                  {person.initials}
                </div>
                <span className="absolute bottom-0.5 left-1 text-[6px] leading-none text-teal-100/60">
                  {person.name}
                </span>
                {person.active ? (
                  <div className="absolute left-0.5 top-0.5 flex items-center gap-0.5 rounded-full bg-black/30 px-1">
                    <div className="h-1 w-1 rounded-full bg-teal-300" />
                    <span className="text-[5px] leading-none text-white/80">Speaking</span>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
          <div className="border-t border-white/10 px-3 py-1.5">
            <p className="text-[7px] text-teal-300/70">Japanese speech detected</p>
          </div>
        </div>
      </div>

      <div className="relative z-[5] -mr-10 origin-bottom rotate-[-2deg]">
        <div className="w-40 overflow-hidden rounded-2xl bg-[#0d4d4d] font-sans shadow-xl will-change-transform">
          <div className="flex items-center gap-1.5 bg-[#0d4d4d] px-3 py-2">
            <div className="h-1.5 w-1.5 rounded-full bg-teal-300" />
            <p className="text-[9px] font-semibold text-teal-50">Transcription (JA)</p>
          </div>
          <div className="flex flex-col gap-2 bg-white p-3">
            <p className="text-[9px] leading-snug text-gray-800">こんにちは、本日の会議を開始します。</p>
            <p className="text-[9px] leading-snug text-gray-800">今四半期の業績について議論してください。</p>
            <div className="flex h-2.5 w-full items-end justify-between">
              {[
                28, 35, 45, 58, 72, 82, 88, 85, 72, 55, 38, 25, 15, 30, 52, 78, 92, 75, 48, 28, 18, 35, 62, 22, 32,
                48, 65, 55, 40, 30, 20, 38, 60, 72, 82, 75, 58, 40, 25, 18,
              ].map((height, barIndex) => (
                <div className="w-[1.5px] rounded-full bg-[#135e5e]/40" key={barIndex} style={{ height: `${height}%` }} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10">
        <div className="w-48 overflow-hidden rounded-2xl bg-[#0d4d4d] font-sans shadow-2xl will-change-transform">
          <div className="bg-[#0d4d4d] px-3 py-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[8px] font-semibold uppercase tracking-widest text-teal-50">Translation</span>
              <div className="flex gap-1">
                {["EN", "KO"].map((lang) => (
                  <span className="rounded bg-teal-200 px-1.5 py-0.5 text-[7px] font-bold text-teal-900" key={lang}>
                    {lang}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2 bg-white px-3 py-2.5">
            <div className="flex items-start gap-2">
              <span className="mt-0.5 shrink-0 text-[8px] font-bold text-teal-700">EN</span>
              <div className="flex flex-col gap-1">
                <p className="text-[9px] leading-snug text-gray-800">Hello, let&apos;s begin today&apos;s meeting.</p>
                <p className="text-[9px] leading-snug text-gray-800">Please discuss this quarter&apos;s performance.</p>
              </div>
            </div>
            <div className="h-px bg-gray-100" />
            <div className="flex items-start gap-2">
              <span className="mt-0.5 shrink-0 text-[8px] font-bold text-teal-700">KO</span>
              <div className="flex flex-col gap-1">
                <p className="text-[9px] leading-snug text-gray-800">안녕하세요, 오늘 회의를 시작하겠습니다.</p>
                <p className="text-[9px] leading-snug text-gray-800">
                  이번 분기 실적에 대해 논의해 주시면 감사하겠습니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AppsScreen() {
  return (
    <section className="flex min-w-0 flex-1 flex-col overflow-auto bg-[#171717] px-6 py-6 text-[#fafafa]">
      <header className="mb-[30px] flex min-w-0 flex-wrap items-start gap-4">
        <div className="w-full">
          <div className="flex w-full items-center gap-1">
            <h1 className="text-3xl font-medium leading-9 text-[#fafafa]">Apps</h1>
          </div>
          <p className="mt-1 text-sm leading-5 text-[#8f8f8f]">Launch apps connected to your AI workspace.</p>
        </div>
      </header>

      <div className="flex flex-col gap-6">
        <AppsFeaturedBanner />

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {aipAppItems.map((app) => (
            <a
              className="group flex flex-col gap-4 rounded-[10px] border border-[#ffffff1a] bg-[#ffffff0d] p-5 text-left no-underline transition-colors hover:border-[#fafafa]/30"
              href="#"
              key={app.id}
              onClick={(event) => event.preventDefault()}
              rel="noopener noreferrer"
              target="_blank"
            >
              <div className="flex items-start justify-between">
                <img alt={app.name} className="h-10 w-10 rounded-lg object-contain" src={app.iconUrl} />
                <ExternalLinkMockIcon className="h-4 w-4 shrink-0 text-[#8f8f8f] opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-baseline gap-x-1.5">
                  <span className="text-sm font-medium text-[#fafafa]">{app.name}</span>
                </div>
                <div className="mt-1 line-clamp-3 break-keep text-xs text-[#8f8f8f]">{app.description}</div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

type AdminSection = {
  action?: ReactNode;
  children: ReactNode;
  description?: string;
  label: ReactNode;
};

const adminByokProviders: {
  description: string;
  icon: LlmGroup["icon"];
  name: string;
  placeholder: string;
  supportedModels: string;
}[] = [
  {
    description: "Add your Anthropic API key to use Claude models",
    icon: "claude",
    name: "Anthropic Claude",
    placeholder: "Enter your Anthropic API key",
    supportedModels: "Claude Sonnet 4.5, Claude Sonnet 4, Claude Haiku 4.5",
  },
  {
    description: "Add your Google AI Studio API key to use Gemini models",
    icon: "gemini",
    name: "Google Gemini",
    placeholder: "Enter your Google AI Studio API key",
    supportedModels: "Gemini 2.5 Flash",
  },
  {
    description: "Add your OpenAI API key to use GPT models",
    icon: "gpt",
    name: "OpenAI GPT",
    placeholder: "Enter your OpenAI API key",
    supportedModels: "GPT-5",
  },
  {
    description: "Add your Upstage API key to use Solar models",
    icon: "solar",
    name: "Upstage Solar",
    placeholder: "Enter your Upstage API key",
    supportedModels: "Solar Pro, Solar Pro 2",
  },
];

function AdminMultiSectionCard({ sections, title }: { sections: AdminSection[]; title: string }) {
  return (
    <div className="space-y-3">
      {title ? <h2 className="text-lg font-semibold text-[#fafafa]">{title}</h2> : null}
      <div className="rounded-[10px] border border-[#ffffff1a] bg-[#212121] text-[#fafafa]">
        {sections.map((section, index) => (
          <div
            className={["p-5 pt-0", index !== sections.length - 1 ? "border-b border-[#ffffff1a]" : ""].join(" ")}
            key={typeof section.label === "string" ? section.label : index}
          >
            <div className="flex flex-row items-center justify-between gap-4 px-0 py-5">
              <div className="flex min-w-0 flex-col gap-1">
                {typeof section.label === "string" ? (
                  <h3 className="font-semibold tracking-tight text-[#fafafa]">{section.label}</h3>
                ) : (
                  section.label
                )}
                {section.description ? <div className="text-sm text-[#8f8f8f]">{section.description}</div> : null}
              </div>
              {section.action ? <div className="shrink-0">{section.action}</div> : null}
            </div>
            {section.children}
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminDangerCard({
  children,
  description,
  label,
  title,
}: {
  children: ReactNode;
  description: string;
  label: string;
  title: string;
}) {
  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold text-[#fafafa]">{title}</h2>
      <div className="rounded-[10px] border border-[#ef4444] bg-[#212121] text-[#fafafa]">
        <div className="flex flex-col gap-1.5 p-5">
          <h3 className="font-semibold tracking-tight text-[#fafafa]">{label}</h3>
          <div className="text-sm text-[#8f8f8f]">{description}</div>
        </div>
        <div className="p-5 pt-0">{children}</div>
      </div>
    </div>
  );
}

function AdminInput({ readOnly, value }: { readOnly?: boolean; value?: string }) {
  return (
    <input
      className={[
        "flex h-10 w-full max-w-md rounded-md border border-[#ffffff1a] bg-[#171717] px-3 py-2 text-base text-[#fafafa] outline-none placeholder:text-[#737373] md:text-sm",
        readOnly ? "cursor-default bg-[#2a2a2a]" : "",
      ].join(" ")}
      placeholder="Enter your organization name"
      readOnly
      value={value ?? ""}
    />
  );
}

function AdminNumberInput({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex-1 space-y-2">
      <label className="text-sm font-medium leading-none text-[#fafafa]">{label}</label>
      <div className="flex h-10 w-full items-center overflow-hidden rounded-md border border-[#ffffff1a] bg-[#171717] p-0 text-[#fafafa] ring-offset-[#171717] focus-within:ring-2 focus-within:ring-[#0090FF] focus-within:ring-offset-2">
        <button
          aria-label="감소"
          className="flex h-full w-8 shrink-0 items-center justify-center border-r border-[#ffffff1a] text-[#8f8f8f] opacity-50"
          disabled
          tabIndex={-1}
          type="button"
        >
          <svg aria-hidden="true" className="size-4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M5 12h14" />
          </svg>
        </button>
        <input
          aria-label={label}
          aria-valuemax={200}
          aria-valuemin={1}
          aria-valuenow={value}
          className="h-full min-w-0 flex-1 appearance-none bg-transparent px-2 text-center text-base text-[#fafafa] outline-none md:text-sm"
          inputMode="numeric"
          readOnly
          role="spinbutton"
          type="text"
          value={value}
        />
        <button
          aria-label="증가"
          className="flex h-full w-8 shrink-0 items-center justify-center border-l border-[#ffffff1a] text-[#8f8f8f]"
          tabIndex={-1}
          type="button"
        >
          <svg aria-hidden="true" className="size-4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </button>
      </div>
    </div>
  );
}

function AdminLogoInput({ dark }: { dark?: boolean }) {
  return (
    <div
      className={[
        "flex h-14 shrink-0 items-center justify-center rounded-lg border-2 border-dashed border-[#ffffff33]",
        dark ? "bg-[#171717]" : "bg-[#fafafa]",
      ].join(" ")}
      style={{ width: "13rem" }}
    >
      <svg aria-hidden="true" className="size-8 text-[#8f8f8f]" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18" />
        <path d="M6 12H4a2 2 0 0 0-2 2v8h20v-8a2 2 0 0 0-2-2h-2" />
        <path d="M10 6h4" />
        <path d="M10 10h4" />
      </svg>
    </div>
  );
}

function AdminIconInput() {
  return (
    <div className="flex h-20 w-20 items-center justify-center rounded-lg border-2 border-dashed border-[#ffffff33] bg-[#171717]">
      <svg aria-hidden="true" className="size-8 text-[#8f8f8f]" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18" />
        <path d="M6 12H4a2 2 0 0 0-2 2v8h20v-8a2 2 0 0 0-2-2h-2" />
        <path d="M10 6h4" />
        <path d="M10 10h4" />
      </svg>
    </div>
  );
}

function AdminUploadButton({ children }: { children: ReactNode }) {
  return (
    <button
      className="inline-flex h-9 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg border-none bg-[#2A2A2A] px-3 py-2 text-sm font-medium text-[#fafafa] transition-all hover:bg-[#2A2A2A]/60"
      type="button"
    >
      {children}
    </button>
  );
}

function AdminAlert({
  children,
  title,
  variant = "info",
}: {
  children: ReactNode;
  title: string;
  variant?: "destructive" | "info";
}) {
  const isDestructive = variant === "destructive";
  return (
    <div
      className={[
        "relative w-full rounded-lg p-3 pl-9 text-xs text-[#8f8f8f]",
        isDestructive ? "bg-[#ef444414]" : "bg-[#0090ff14]",
      ].join(" ")}
      role="alert"
    >
      <svg
        aria-hidden="true"
        className={["absolute left-3 top-3 size-4", isDestructive ? "text-[#ef4444]" : "text-[#0090ff]"].join(" ")}
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        {isDestructive ? (
          <>
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4" />
            <path d="M12 16h.01" />
          </>
        ) : (
          <>
            <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
          </>
        )}
      </svg>
      <h5 className="mb-1 text-xs font-medium tracking-tight text-[#fafafa]">{title}</h5>
      <div>{children}</div>
    </div>
  );
}

function AdminByokProviderCard({ provider }: { provider: (typeof adminByokProviders)[number] }) {
  return (
    <div className="rounded-lg border border-[#ffffff1a] p-4">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="order-1 w-full sm:order-2 sm:w-auto">
          <div className="flex items-center justify-between gap-2 sm:justify-normal">
            <span className="text-sm text-[#8f8f8f]">Inactive</span>
            <MockSwitch checked={false} />
          </div>
        </div>
        <div className="order-2 flex items-center gap-3 sm:order-1">
          <LlmIcon className="size-6" group={provider.icon} />
          <div>
            <h4 className="font-semibold text-[#fafafa]">{provider.name}</h4>
            <p className="text-sm text-[#8f8f8f]">{provider.description}</p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="flex-1">
            <input
              className="flex h-10 w-full rounded-md border border-[#ffffff1a] bg-[#171717] px-3 py-2 text-base text-[#fafafa] outline-none placeholder:text-[#737373] md:text-sm"
              placeholder={provider.placeholder}
              readOnly
            />
          </div>
          <div className="flex gap-2">
            <button className="inline-flex h-9 flex-1 items-center justify-center rounded-lg border border-[#ffffff1a] px-3 text-sm font-medium text-[#fafafa] opacity-50 sm:flex-none" type="button">
              Test
            </button>
            <button className="inline-flex h-9 flex-1 items-center justify-center rounded-lg border-none bg-[#2A2A2A] px-3 text-sm font-medium text-[#fafafa] opacity-50 sm:flex-none" type="button">
              Save
            </button>
          </div>
        </div>
        <div className="text-xs text-[#8f8f8f]">Supported models: {provider.supportedModels}</div>
      </div>
    </div>
  );
}

function DashboardActionCard({
  buttonLabel,
  children,
  description,
  icon,
  title,
  variant = "outline",
}: {
  buttonLabel: string;
  children?: ReactNode;
  description: string;
  icon: ReactNode;
  title: string;
  variant?: "invert" | "outline";
}) {
  return (
    <div className="flex h-full flex-col justify-between rounded-[10px] border border-[#ffffff1a] bg-[#212121] p-5 text-[#fafafa]">
      <div>
        <h2 className="text-lg font-semibold text-[#fafafa]">{title}</h2>
        <p className="mt-1 text-sm leading-5 text-[#8f8f8f]">{description}</p>
      </div>
      <button
        className={[
          "mt-5 inline-flex h-9 w-full items-center justify-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-all",
          variant === "invert"
            ? "border-none bg-[#fafafa] text-[#171717] hover:bg-[#fafafa]/80"
            : "border border-[#ffffff1a] text-[#fafafa] hover:bg-white/[0.08]",
        ].join(" ")}
        type="button"
      >
        {icon}
        {buttonLabel}
      </button>
      {children}
    </div>
  );
}

function DashboardSummaryCard({
  icon,
  title,
  unit,
  value,
}: {
  icon: ReactNode;
  title: string;
  unit: string;
  value: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-[10px] border border-[#ffffff1a] bg-[#171717] p-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-[#8f8f8f]">{title}</h3>
        <span className="text-[#8f8f8f]">{icon}</span>
      </div>
      <div className="mt-5 flex items-baseline gap-1.5">
        <span className="text-3xl font-semibold tracking-tight text-[#fafafa]">{value}</span>
        <span className="text-sm font-normal text-[#8f8f8f]">{unit}</span>
      </div>
    </div>
  );
}

function DashboardTrendChart() {
  const creditPoints = "M8 145 C80 122 126 92 182 100 C244 108 264 58 332 66 C396 74 430 34 488 42 C548 50 590 24 672 20";
  const mcpPoints = "M8 174 C74 160 126 148 186 150 C252 152 278 124 336 130 C396 136 442 110 500 112 C560 114 608 92 672 94";

  return (
    <div className="h-[280px] w-full rounded-lg border border-[#ffffff1a] bg-[#171717] p-2">
      <svg aria-hidden="true" className="h-full w-full" fill="none" preserveAspectRatio="none" viewBox="0 0 680 220">
        <path d="M8 12V188H676" stroke="#ffffff1a" strokeWidth="1" />
        {[44, 78, 112, 146].map((y) => (
          <path d={`M8 ${y}H676`} key={y} stroke="#ffffff1a" strokeDasharray="3 3" strokeWidth="1" />
        ))}
        {["06/22", "06/23", "06/24", "06/25", "06/26", "06/27", "06/28"].map((label, index) => (
          <text fill="#8f8f8f" fontSize="10" key={label} textAnchor="middle" x={28 + index * 106} y="212">
            {label}
          </text>
        ))}
        <path d={creditPoints} stroke="#0090FF" strokeLinecap="round" strokeWidth="3" />
        <path d={mcpPoints} stroke="#22c55e" strokeLinecap="round" strokeWidth="3" />
      </svg>
    </div>
  );
}

function DashboardRecentActivity() {
  const activities = [
    {
      actor: "Mina Park",
      description: "Updated organization general settings.",
      event: "Organization settings updated",
      role: "Owner",
      time: "06/28/2026, 02:16:00 PM",
    },
    {
      actor: "Daniel Kim",
      description: "Invited three new users to the organization.",
      event: "Users invited",
      role: "Admin",
      time: "06/28/2026, 01:42:00 PM",
    },
    {
      actor: "Priya Shah",
      description: "Google Drive MCP connection status changed.",
      event: "Integration status changed",
      role: "Member",
      time: "06/28/2026, 12:08:00 PM",
    },
    {
      actor: "Sarah Lee",
      description: "Created a new organization agent.",
      event: "Agent created",
      role: "Admin",
      time: "06/27/2026, 05:31:00 PM",
    },
    {
      actor: "Alex Chen",
      description: "Downloaded audit log export.",
      event: "Audit logs exported",
      role: "Member",
      time: "06/27/2026, 03:04:00 PM",
    },
  ];

  return (
    <div className="space-y-2">
      {activities.map((activity) => (
        <div className="group relative flex items-start gap-3 rounded-lg border border-[#ffffff1a] bg-[#ffffff0a] p-3 md:gap-5" key={`${activity.event}-${activity.time}`}>
          <div className="min-w-0 flex-1">
            <div className="flex flex-col justify-between gap-2 md:flex-row md:items-end md:gap-3">
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className="break-words text-sm font-medium text-[#fafafa] md:truncate">{activity.event}</span>
                <p className="break-words text-sm text-[#8f8f8f] md:truncate">{activity.description}</p>
              </div>
              <div className="flex shrink-0 flex-col gap-1 text-sm text-[#8f8f8f] md:flex-row md:items-center md:gap-3">
                <div className="flex items-center gap-1.5">
                  <RoleDisplayMock role={activity.role} />
                  <span className="text-xs font-medium text-[#d4d4d8] md:text-sm">{activity.actor}</span>
                </div>
                <div className="text-xs text-[#8f8f8f]">{activity.time}</div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function DashboardScreen() {
  return (
    <section className="flex min-w-0 flex-1 flex-col overflow-auto bg-[#171717] px-6 py-6 text-[#fafafa]">
      <header className="mb-[30px] flex min-w-0 flex-wrap items-start gap-4">
        <div className="w-full">
          <div className="flex w-full items-center gap-1">
            <h1 className="text-3xl font-medium leading-9 text-[#fafafa]">Organization Dashboard</h1>
          </div>
          <p className="mt-1 text-sm leading-5 text-[#8f8f8f]">Manage your organization and monitor recent activities.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-y-6 md:grid-cols-2 md:gap-x-6 md:gap-y-8">
        <DashboardActionCard
          buttonLabel="Manage users"
          description="Manage organization members, invite new users, and set user roles and permissions."
          icon={<AdminMenuIcon className="size-4" name="users" />}
          title="Organization Users"
          variant="invert"
        />
        <DashboardActionCard
          buttonLabel="Manage settings"
          description="Configure your organization settings, manage basic information and preferences."
          icon={<Icon className="size-4" name="settings" />}
          title="Organization Settings"
        />

        <div className="col-span-1 rounded-[10px] border border-[#ffffff1a] bg-[#212121] text-[#fafafa] md:col-span-2">
          <div className="flex flex-col gap-4 p-5 md:flex-row md:items-start md:justify-between">
            <div>
              <h2 className="flex items-center gap-2 text-xl font-medium tracking-tight text-[#fafafa]">
                <svg aria-hidden="true" className="size-4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="m23 6-9.5 9.5-5-5L1 18" />
                  <path d="M17 6h6v6" />
                </svg>
                Daily Usage Trends
              </h2>
              <p className="mt-1 text-sm text-[#8f8f8f]">Credit usage and MCP calls over the last 7 days</p>
            </div>
            <button className="inline-flex h-8 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg border border-[#ffffff1a] px-3 py-2 text-xs font-medium text-[#fafafa] hover:bg-white/[0.08]" type="button">
              View All
              <Icon className="size-4" name="send" />
            </button>
          </div>
          <div className="space-y-6 p-5 pt-0">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <DashboardSummaryCard icon={<AdminMenuIcon className="size-4" name="coins" />} title="Total Credits Used" unit="Credits" value="6,506" />
              <DashboardSummaryCard icon={<AdminMenuIcon className="size-4" name="users" />} title="Active Users" unit="Users" value="18" />
              <DashboardSummaryCard icon={<AdminMenuIcon className="size-4" name="chartColumn" />} title="Avg Credits Per User" unit="Credits" value="361" />
            </div>
            <DashboardTrendChart />
          </div>
        </div>

        <div className="col-span-1 flex h-full flex-col space-y-6 rounded-[10px] border border-[#ffffff1a] bg-[#212121] p-6 text-[#fafafa] md:col-span-2">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center md:gap-2">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <h2 className="flex items-center gap-2 text-2xl font-semibold leading-none">
                  <svg aria-hidden="true" className="size-5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 6v6l4 2" />
                  </svg>
                  Recent Activity
                </h2>
              </div>
              <p className="text-sm text-[#8f8f8f]">Latest 5 activities in your organization.</p>
            </div>
            <button className="inline-flex h-9 w-full items-center justify-center gap-1.5 whitespace-nowrap rounded-lg border border-[#ffffff1a] px-3 py-2 text-sm font-medium text-[#fafafa] hover:bg-white/[0.08] md:w-auto" type="button">
              View all
              <Icon className="size-4" name="send" />
            </button>
          </div>
          <div className="flex flex-1 flex-col">
            <DashboardRecentActivity />
          </div>
        </div>
      </div>
    </section>
  );
}

function AdminPageShell({
  action,
  children,
  contentWidth = "default",
  subtitle,
  title,
}: {
  action?: ReactNode;
  children: ReactNode;
  contentWidth?: "default" | "sm";
  subtitle?: string;
  title: string;
}) {
  return (
    <section className="flex min-w-0 flex-1 flex-col overflow-auto bg-[#171717] px-6 py-6 text-[#fafafa]">
      <header className="mb-[30px] flex min-w-0 flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex w-full items-center gap-1">
            <h1 className="text-3xl font-medium leading-9 text-[#fafafa]">{title}</h1>
          </div>
          {subtitle ? <p className="mt-1 whitespace-pre-line text-sm leading-5 text-[#8f8f8f]">{subtitle}</p> : null}
        </div>
        {action ? <div className="flex shrink-0 items-center gap-2">{action}</div> : null}
      </header>

      <div className={contentWidth === "sm" ? "max-w-[640px]" : "w-full"}>{children}</div>
    </section>
  );
}

function AdminCard({
  action,
  children,
  className = "",
  description,
  title,
}: {
  action?: ReactNode;
  children?: ReactNode;
  className?: string;
  description?: string;
  title?: ReactNode;
}) {
  return (
    <div className={["rounded-[10px] border border-[#ffffff1a] bg-[#212121] text-[#fafafa]", className].join(" ")}>
      {(title || description || action) ? (
        <div className="flex flex-col gap-3 p-5 md:flex-row md:items-start md:justify-between">
          <div>
            {typeof title === "string" ? <h2 className="text-lg font-semibold text-[#fafafa]">{title}</h2> : title}
            {description ? <p className="mt-1 text-sm leading-5 text-[#8f8f8f]">{description}</p> : null}
          </div>
          {action ? <div className="shrink-0">{action}</div> : null}
        </div>
      ) : null}
      {children ? <div className={(title || description || action) ? "p-5 pt-0" : "p-5"}>{children}</div> : null}
    </div>
  );
}

function AdminSearchInput({ placeholder }: { placeholder: string }) {
  return (
    <div className="relative w-64 max-w-full">
      <Icon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#8f8f8f]" name="search" />
      <input
        className="flex h-10 w-full rounded-md border border-[#ffffff1a] bg-[#171717] px-3 py-2 pl-9 text-base text-[#fafafa] outline-none placeholder:text-[#737373] md:text-sm"
        placeholder={placeholder}
        readOnly
      />
    </div>
  );
}

function AdminBadge({ children, variant = "default" }: { children: ReactNode; variant?: "default" | "green" | "muted" | "outline" | "primary" | "red" | "success" | "warning" }) {
  const classes = {
    default: "border-[#ffffff1a] bg-[#2a2a2a] text-[#fafafa]",
    green: "border-[#ffffff26] bg-transparent text-[#fafafa]",
    muted: "border-[#ffffff1a] bg-[#2a2a2a] text-[#fafafa]",
    outline: "border-[#ffffff26] bg-transparent text-[#fafafa]",
    primary: "border-[#0090ff80] bg-[#0090ff1a] text-[#fafafa]",
    red: "border-[#ef444480] bg-[#ef44441a] text-[#fafafa]",
    success: "border-[#03985599] bg-[#22c55e1a] text-[#fafafa]",
    warning: "border-[#f59e0b80] bg-[#f59e0b1a] text-[#fafafa]",
  };

  return <span className={["inline-flex min-w-0 items-center rounded-lg border px-1.5 py-[3px] text-xs transition-colors", classes[variant]].join(" ")}>{children}</span>;
}

function AdminBadgeListWithCount({ items, mono }: { items: string[]; mono?: boolean }) {
  const visibleItems = items.slice(0, 1);
  const hiddenCount = items.length - visibleItems.length;

  return (
    <div className="flex h-6 items-center gap-1 overflow-hidden">
      {visibleItems.map((item) => (
        <AdminBadge key={item} variant="outline">
          <span className={mono ? "font-mono" : ""}>{item}</span>
        </AdminBadge>
      ))}
      {hiddenCount > 0 ? <span className="text-xs text-[#fafafa]">+{hiddenCount}</span> : null}
    </div>
  );
}

function UserTagBadge({ children, color = "#64748b" }: { children: ReactNode; color?: string }) {
  const rgb = hexToRgb(color);
  const style = rgb
    ? { background: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.1)`, borderColor: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.5)` }
    : { background: "transparent", borderColor: "transparent" };

  return (
    <span
      className="inline-flex min-w-0 max-w-[420px] items-center rounded-lg border px-1.5 py-[3px] text-xs font-medium text-[#fafafa]"
      style={style}
      title={typeof children === "string" ? children : undefined}
    >
      <span className="truncate">{children}</span>
    </span>
  );
}

function hexToRgb(hex: string) {
  const match = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!match) return null;
  return {
    b: parseInt(match[3], 16),
    g: parseInt(match[2], 16),
    r: parseInt(match[1], 16),
  };
}

function RoleDisplayMock({ role }: { role: string }) {
  const icon = (() => {
    if (role === "Owner") {
      return (
        <svg aria-hidden="true" className="size-4 text-[#facc15]" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
          <path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7Z" />
          <path d="M5 20h14" />
        </svg>
      );
    }
    if (role === "Admin") {
      return (
        <svg aria-hidden="true" className="size-4 text-[#0090ff]" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
        </svg>
      );
    }
    if (role === "AI Operator") {
      return (
        <svg aria-hidden="true" className="size-4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z" />
          <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z" />
          <path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4" />
        </svg>
      );
    }
    return (
      <svg aria-hidden="true" className="size-4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    );
  })();

  return (
    <span className="inline-flex min-w-max items-center rounded-full border border-[#ffffff26] px-2 py-1 text-xs text-[#fafafa]">
      {icon}
      <span className="ml-1 whitespace-nowrap">{role}</span>
    </span>
  );
}

function AdminDataTable({
  bordered = true,
  columns,
  columnClassNames = [],
  minWidth = 860,
  rowClassName = "",
  rows,
  tableFixed = false,
}: {
  bordered?: boolean;
  columnClassNames?: string[];
  columns: ReactNode[];
  minWidth?: number;
  rowClassName?: string;
  rows: ReactNode[][];
  tableFixed?: boolean;
}) {
  return (
    <div className={bordered ? "overflow-hidden rounded-md border border-[#ffffff1a]" : "overflow-hidden"}>
      <div className="max-w-full overflow-x-auto">
        <table className={["w-full caption-bottom text-sm", tableFixed ? "table-fixed" : ""].join(" ")} style={{ minWidth }}>
          <thead>
            <tr className="border-b border-[#ffffff1a]">
              {columns.map((column, index) => (
                <th className={["h-12 whitespace-nowrap px-4 text-left align-middle font-medium text-[#8f8f8f]", columnClassNames[index] ?? ""].join(" ")} key={`${column}-${index}`}>
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr className={["border-b border-[#ffffff1a] transition-colors last:border-0 hover:bg-white/[0.04]", rowClassName].join(" ")} key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <td className={["p-4 align-middle text-[#d4d4d8]", columnClassNames[cellIndex] ?? ""].join(" ")} key={cellIndex}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const adminUserAvatarByName: Record<string, string> = {
  "Alex Chen": "/assets/mockups/aip/users/alex-chen.png",
  "Daniel Kim": "/assets/mockups/aip/users/daniel-kim.png",
  "Mina Park": "/assets/mockups/aip/users/mina-park.png",
  "Priya Shah": "/assets/mockups/aip/users/priya-shah.png",
  "Sarah Lee": "/assets/mockups/aip/users/sarah-lee.png",
};

function UserAvatarMock({ name }: { name: string }) {
  const avatarSrc = adminUserAvatarByName[name];

  if (avatarSrc) {
    return <img alt="" className="size-8 shrink-0 rounded-full object-cover" src={avatarSrc} />;
  }

  return (
    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#5b6ee1] text-xs font-semibold text-white">
      {name.slice(0, 1)}
    </div>
  );
}

function UserCell({ email, name }: { email: string; name: string }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <UserAvatarMock name={name} />
      <div className="min-w-0">
        <div className="truncate font-medium text-[#fafafa]">{name}</div>
        <div className="truncate text-sm text-[#8f8f8f]">{email}</div>
      </div>
    </div>
  );
}

function AdminSecondaryButton({ children, disabled = false }: { children: ReactNode; disabled?: boolean }) {
  return (
    <button
      className="inline-flex h-9 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg border-none bg-[#2a2a2a] px-3 py-2 text-sm font-medium text-[#fafafa] transition-all hover:bg-[#2a2a2a]/60 disabled:cursor-not-allowed disabled:opacity-50"
      disabled={disabled}
      type="button"
    >
      {children}
    </button>
  );
}

function AdminPrimaryButton({ children, disabled = false }: { children: ReactNode; disabled?: boolean }) {
  return (
    <button
      className="inline-flex h-9 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg border-none bg-[#0090ff] px-3 py-2 text-sm font-medium text-white transition-all hover:bg-[#0090ff]/60 disabled:cursor-not-allowed disabled:opacity-50"
      disabled={disabled}
      type="button"
    >
      {children}
    </button>
  );
}

function AdminOutlineButton({ children }: { children: ReactNode }) {
  return (
    <button
      className="inline-flex h-9 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg border border-[#ffffff1a] bg-[#171717] px-3 py-2 text-sm font-medium text-[#fafafa] transition-colors hover:bg-white/[0.04]"
      type="button"
    >
      {children}
    </button>
  );
}

function ToggleSwitchMock({ checked = true, onClick }: { checked?: boolean; onClick?: () => void }) {
  return (
    <button
      aria-checked={checked}
      className={[
        "inline-flex h-6 w-11 shrink-0 cursor-default items-center rounded-full border-2 border-transparent transition-colors",
        onClick ? "cursor-pointer" : "",
        checked ? "bg-[#0090ff]" : "bg-[#3f3f46]",
      ].join(" ")}
      onClick={onClick}
      role="switch"
      type="button"
    >
      <span
        className={[
          "pointer-events-none block size-5 rounded-full bg-white shadow-lg ring-0 transition-transform",
          checked ? "translate-x-5" : "translate-x-0",
        ].join(" ")}
      />
    </button>
  );
}

function AgentIconMock({
  color = "#0090ff",
  full = false,
  iconUrl,
  name,
}: {
  color?: string;
  full?: boolean;
  iconUrl?: string;
  name: string;
}) {
  return (
    <span className="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full text-white" style={{ backgroundColor: color }}>
      {iconUrl ? (
        <img alt="" className={full ? "h-full w-full object-cover" : "size-5 object-contain"} src={iconUrl} />
      ) : (
        <span className="text-xs font-semibold">{name.slice(0, 1)}</span>
      )}
    </span>
  );
}

function IntegrationNameCellMock({
  description,
  iconId,
  name,
}: {
  description: string;
  iconId?: string;
  name: string;
}) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#f5f5f5]">
        {iconId ? (
          <img alt="" className="size-7 object-contain" src={`/assets/products/aip/integrations/${iconId}.svg`} />
        ) : (
          <AdminMenuIcon className="size-4 text-[#8f8f8f]" name="puzzle" />
        )}
      </div>
      <div className="min-w-0">
        <div className="truncate font-medium text-[#fafafa]">{name}</div>
        <div className="line-clamp-2 text-sm text-[#8f8f8f]">{description}</div>
      </div>
    </div>
  );
}

function IntegrationVisibilityBadgeMock({ visible }: { visible: boolean }) {
  return (
    <AdminBadge variant={visible ? "primary" : "default"}>
      {visible ? (
        <svg aria-hidden="true" className="mr-1 size-3 text-[#0090ff]" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      ) : (
        <svg aria-hidden="true" className="mr-1 size-3 text-[#d4d4d8]" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
          <path d="m2 2 20 20" />
          <path d="M10.584 10.587a2 2 0 0 0 2.828 2.83" />
          <path d="M9.363 5.365A10.56 10.56 0 0 1 12 5c4.478 0 8.268 2.943 9.542 7a10.52 10.52 0 0 1-2.019 3.324" />
          <path d="M6.713 6.709C4.93 7.854 3.5 9.668 2.458 12c1.274 4.057 5.064 7 9.542 7a10.6 10.6 0 0 0 5.286-1.397" />
        </svg>
      )}
      {visible ? "Activated" : "Deactivated"}
    </AdminBadge>
  );
}

function AdminAgentScreen() {
  const agents = [
    { color: "#e8f0fe", createdAt: "06/28/2026", createdBy: "Mina Park", full: true, iconUrl: "/assets/mockups/aip/agents/quotation-assistant.svg", lastUsedAt: "06/28/2026", name: "Quotation Assistant", status: "Enabled", type: "Built-in" },
    { color: "#f3f0ff", createdAt: "06/27/2026", createdBy: "Daniel Kim", full: true, iconUrl: "/assets/mockups/aip/agents/sales-insight.svg", lastUsedAt: "06/28/2026", name: "Sales Insight Agent", status: "Enabled", type: "Custom" },
    { color: "#ecfdf5", createdAt: "06/26/2026", createdBy: "Sarah Lee", full: true, iconUrl: "/assets/mockups/aip/agents/document-review.svg", lastUsedAt: "06/28/2026", name: "Document Review Agent", status: "Enabled", type: "Personal" },
    { color: "#fff7ed", createdAt: "06/25/2026", createdBy: "Alex Chen", full: true, iconUrl: "/assets/mockups/aip/agents/sales-ops.svg", lastUsedAt: "-", name: "Procurement Assistant", status: "Disabled", type: "Custom" },
  ];

  return (
    <AdminPageShell
      action={
        <AdminSecondaryButton>
          <Icon className="size-4" name="plus" />
          Add
          <Icon className="size-4 rotate-90" name="chevron" />
        </AdminSecondaryButton>
      }
      subtitle="Add and manage AI agents for this organization."
      title="Agents"
    >
      <div className="flex flex-1 flex-col">
        <div className="mb-4 flex items-center">
          <AdminSearchInput placeholder="Search agents..." />
        </div>
        <AdminDataTable
          bordered={false}
          columns={["Name", "Type", "Status", "Created By", "Created At", "Last Used", ""]}
          columnClassNames={["w-[260px]", "w-[100px]", "w-[105px]", "w-[120px]", "w-[150px]", "w-[150px]", "w-[44px]"]}
          minWidth={860}
          tableFixed
          rows={agents.map((agent) => [
            <div className="flex min-w-0 items-center gap-3" key="name">
              <AgentIconMock color={agent.color} full={agent.full} iconUrl={agent.iconUrl} name={agent.name} />
              <div className="min-w-0 flex-1 truncate font-medium text-[#fafafa]" title={agent.name}>{agent.name}</div>
            </div>,
            <AdminBadge key="type" variant={agent.type === "Built-in" ? "green" : "muted"}>{agent.type}</AdminBadge>,
            <AdminBadge key="status" variant={agent.status === "Enabled" ? "primary" : "muted"}>{agent.status}</AdminBadge>,
            <span className="block truncate text-sm" key="createdBy">{agent.createdBy}</span>,
            <span className="block truncate whitespace-nowrap text-sm text-[#8f8f8f]" key="createdAt" title={agent.createdAt}>{agent.createdAt}</span>,
            <span className="block truncate whitespace-nowrap text-sm text-[#8f8f8f]" key="lastUsedAt" title={agent.lastUsedAt}>{agent.lastUsedAt}</span>,
            <button aria-label="Open menu" className="inline-flex size-8 items-center justify-center rounded-lg text-[#8f8f8f] hover:bg-white/[0.04]" key="actions" type="button">
              <Icon className="size-4" name="moreHorizontal" />
            </button>,
          ])}
        />
        <span className="ml-4 mt-4 block text-sm text-[#8f8f8f]">1 - 4 of 4</span>
      </div>
    </AdminPageShell>
  );
}

function AdminKnowledgeScreen() {
  const bundles = [
    { createdAt: "06/28/2026, 11:10:00 AM", createdBy: "Mina Park", description: "Official sales collateral, pricing notes, and quotation templates.", name: "Sales Enablement", sources: 18, status: "INDEXED" },
    { createdAt: "06/27/2026, 03:42:00 PM", createdBy: "Daniel Kim", description: "Procurement rules, vendor policies, and approval guidelines.", name: "Procurement Policy", sources: 12, status: "INDEXED" },
    { createdAt: "06/26/2026, 01:05:00 PM", createdBy: "Sarah Lee", description: "Security questionnaires, compliance responses, and audit notes.", name: "Security Responses", sources: 9, status: "UPLOADED" },
    { createdAt: "06/25/2026, 10:18:00 AM", createdBy: "Alex Chen", description: "Product documentation, release notes, and implementation guides.", name: "Product Documentation", sources: 24, status: "INDEXED" },
  ];

  return (
    <AdminPageShell
      action={
        <AdminSecondaryButton>
          <Icon className="size-4" name="plus" />
          Create bundle
        </AdminSecondaryButton>
      }
      subtitle="Create and manage knowledge bundles for RAG. Each bundle can include files, Google Drive, and more."
      title="Knowledge Bundles"
    >
      <div className="mb-4 flex items-center">
        <AdminSearchInput placeholder="Search by name" />
      </div>
      <AdminDataTable
        bordered={false}
        columns={["Name", "Sources", "Status", "Created By", "Created At"]}
        columnClassNames={["min-w-[260px] max-w-[550px]", "w-32 text-center", "w-24 text-center", "min-w-[180px]", "min-w-[220px]"]}
        minWidth={900}
        rows={bundles.map((bundle) => [
          <div className="min-w-0 space-y-1" key="name">
            <span className="block truncate font-medium text-[#fafafa]" title={bundle.name}>{bundle.name}</span>
            <span className="block truncate text-sm text-[#8f8f8f]" title={bundle.description}>{bundle.description}</span>
          </div>,
          <span className="text-sm" key="sources">{bundle.sources}</span>,
          <AdminBadge key="status" variant={bundle.status === "INDEXED" ? "success" : "outline"}>{bundle.status}</AdminBadge>,
          <span className="break-all text-sm" key="createdBy">{bundle.createdBy}</span>,
          <span className="whitespace-nowrap text-sm text-[#8f8f8f]" key="createdAt">{bundle.createdAt}</span>,
        ])}
      />
      <span className="ml-4 mt-4 block text-sm text-[#8f8f8f]">1 - 4 of 4</span>
    </AdminPageShell>
  );
}

function AdminLlmModelsScreen() {
  const models = llmModelGroups.flatMap((group) => group.models.map((model) => ({ group, model })));
  const [enabledModels, setEnabledModels] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(models.map(({ model }, index) => [model.id, index < models.length - 2])),
  );
  const toggleModel = (modelId: string) => {
    setEnabledModels((current) => ({ ...current, [modelId]: !current[modelId] }));
  };

  return (
    <AdminPageShell
      action={
        <AdminPrimaryButton>
          <svg aria-hidden="true" className="size-4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8A2 2 0 0 1 21 8.8V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" />
            <path d="M17 21v-7H7v7" />
            <path d="M7 3v5h8" />
          </svg>
          Save Changes
        </AdminPrimaryButton>
      }
      subtitle="Manage which models this organization can use."
      title="LLM Models"
    >
      <AdminDataTable
        bordered={false}
        columns={["Model", "Use"]}
        columnClassNames={["", "w-[180px] text-right"]}
        minWidth={620}
        rows={models.map(({ group, model }) => {
          const enabled = enabledModels[model.id] ?? false;
          return [
          <div className="flex min-w-0 items-center gap-3" key="model">
            <div className="flex min-w-0 flex-col gap-0.5">
              <span className="truncate font-medium text-[#fafafa]">{model.label}</span>
            </div>
          </div>,
          <div className="flex items-center justify-end gap-3" key="use">
            <span className="text-sm text-[#8f8f8f]">{enabled ? "Enabled" : "Disabled"}</span>
            <ToggleSwitchMock checked={enabled} onClick={() => toggleModel(model.id)} />
          </div>,
          ];
        })}
      />
    </AdminPageShell>
  );
}

function AdminMcpIntegrationsScreen() {
  const [activeType, setActiveType] = useState<"built-in" | "configured">("built-in");
  const builtInIntegrations = [
    { description: "Search Gmail messages and email attachments.", iconId: "google-gmail", name: "Gmail", visible: true },
    { description: "Find and work with files stored in Google Drive.", iconId: "google-drive", name: "Google Drive", visible: true },
    { description: "Read and manage Google Calendar events.", iconId: "google-calendar", name: "Google Calendar", visible: true },
    { description: "Read and update spreadsheet data in Google Sheets.", iconId: "google-sheets", name: "Google Sheets", visible: true },
    { description: "Search channels, messages, and workspace conversations.", iconId: "slack", name: "Slack", visible: true },
    { description: "Access Notion pages, databases, and workspace content.", iconId: "notion", name: "Notion", visible: true },
    { description: "Search and manage Jira issues and project data.", iconId: "jira", name: "Jira", visible: true },
    { description: "Work with GitHub repositories, issues, and pull requests.", iconId: "github", name: "GitHub", visible: false },
    { description: "Access Salesforce CRM records and customer data.", iconId: "salesforce", name: "Salesforce", visible: true },
    { description: "Query MySQL databases.", iconId: "mysql", name: "MySQL", visible: false },
    { description: "Query PostgreSQL databases.", iconId: "postgresql", name: "PostgreSQL", visible: true },
    { description: "Inspect Kubernetes resources and cluster state.", iconId: "kubernetes", name: "Kubernetes", visible: false },
  ];
  const configuredIntegrations = [
    { createdAt: "06/28/2026, 09:40:00 AM", creatorEmail: "platform-team@querypie.com", creatorName: "Platform Team", description: "Internal employee directory and organization chart MCP.", iconId: "mcp", name: "Employee Directory MCP", visible: true },
    { createdAt: "06/27/2026, 04:12:00 PM", creatorEmail: "finance-ops@querypie.com", creatorName: "Finance Ops", description: "Corporate expense approval and vendor payment workflow.", iconId: "mcp", name: "Expense Approval MCP", visible: true },
    { createdAt: "06/26/2026, 02:35:00 PM", creatorEmail: "security@querypie.com", creatorName: "Security Team", description: "Security exception requests, audit evidence, and control status.", iconId: "mcp", name: "Security Control MCP", visible: true },
    { createdAt: "06/25/2026, 11:04:00 AM", creatorEmail: "sales-ops@querypie.com", creatorName: "Sales Ops", description: "Internal quote approval and discount policy lookup.", iconId: "mcp", name: "Quote Desk MCP", visible: false },
    { createdAt: "06/24/2026, 05:18:00 PM", creatorEmail: "it-helpdesk@querypie.com", creatorName: "IT Helpdesk", description: "Device inventory, account provisioning, and ticket escalation.", iconId: "mcp", name: "IT Service Desk MCP", visible: true },
  ];

  return (
    <AdminPageShell
      action={
        <AdminSecondaryButton>
          <Icon className="size-4" name="plus" />
          Configure integration
        </AdminSecondaryButton>
      }
      subtitle="Manage user integrations and configure integration templates for your organization."
      title="MCP Integrations Management"
    >
      <div className="flex min-h-0 flex-1 flex-col">
        <div className="mb-4 inline-flex h-auto items-center justify-center gap-5 self-start rounded-none bg-transparent p-0">
          <button
            className={[
              "inline-flex items-center justify-center whitespace-nowrap rounded-none border-b-2 pb-1.5 text-sm ring-offset-[#171717] transition-all",
              activeType === "built-in"
                ? "border-[#fafafa] text-[#fafafa]"
                : "border-transparent text-[#8f8f8f] hover:text-[#fafafa]",
            ].join(" ")}
            onClick={() => setActiveType("built-in")}
            type="button"
          >
            Built-in
          </button>
          <button
            className={[
              "inline-flex items-center justify-center whitespace-nowrap rounded-none border-b-2 pb-1.5 text-sm ring-offset-[#171717] transition-all",
              activeType === "configured"
                ? "border-[#fafafa] text-[#fafafa]"
                : "border-transparent text-[#8f8f8f] hover:text-[#fafafa]",
            ].join(" ")}
            onClick={() => setActiveType("configured")}
            type="button"
          >
            Configured
          </button>
        </div>
        <div className="mb-4 max-w-full" style={{ width: 256 }}>
          <AdminSearchInput placeholder="Search integrations" />
        </div>
        {activeType === "built-in" ? (
          <>
            <AdminDataTable
              bordered={false}
              columns={["Integration", "Activation Status", ""]}
              columnClassNames={["w-10/12", "w-1/12 whitespace-nowrap", "w-1/12"]}
              minWidth={820}
              rows={builtInIntegrations.map((integration) => [
                <IntegrationNameCellMock description={integration.description} iconId={integration.iconId} key="integration" name={integration.name} />,
                <IntegrationVisibilityBadgeMock key="status" visible={integration.visible} />,
                <button aria-label="Open menu" className="inline-flex size-8 items-center justify-center rounded-lg text-[#8f8f8f] hover:bg-white/[0.04]" key="actions" type="button">
                  <Icon className="size-4" name="moreHorizontal" />
                </button>,
              ])}
            />
            <span className="ml-4 mt-4 block text-sm text-[#8f8f8f]">1 - 12 of 12</span>
          </>
        ) : (
          <>
            <AdminDataTable
              bordered={false}
              columns={["Integration", "Created By", "Created At", "Activation Status", ""]}
              columnClassNames={["w-[360px]", "w-[170px]", "w-[150px]", "w-[130px] whitespace-nowrap", "w-[44px]"]}
              minWidth={854}
              rows={configuredIntegrations.map((integration) => [
                <IntegrationNameCellMock description={integration.description} iconId={integration.iconId} key="integration" name={integration.name} />,
                <div className="flex min-w-0 flex-col" key="createdBy">
                  <span className="truncate font-medium text-[#fafafa]">{integration.creatorName}</span>
                  <span className="truncate text-sm text-[#8f8f8f]">{integration.creatorEmail}</span>
                </div>,
                <span className="whitespace-nowrap text-sm text-[#d4d4d8]" key="createdAt">{integration.createdAt}</span>,
                <IntegrationVisibilityBadgeMock key="status" visible={integration.visible} />,
                <button aria-label="Open menu" className="inline-flex size-8 items-center justify-center rounded-lg text-[#8f8f8f] hover:bg-white/[0.04]" key="actions" type="button">
                  <Icon className="size-4" name="moreHorizontal" />
                </button>,
              ])}
            />
            <span className="ml-4 mt-4 block text-sm text-[#8f8f8f]">1 - 5 of 5</span>
          </>
        )}
      </div>
    </AdminPageShell>
  );
}

function AdminSkillsScreen() {
  return (
    <AdminPageShell
      action={
        <>
          <AdminSecondaryButton>
            <svg aria-hidden="true" className="size-4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z" />
              <circle cx="16.5" cy="7.5" r=".5" fill="currentColor" />
            </svg>
            Secret management
          </AdminSecondaryButton>
          <AdminSecondaryButton>
            <Icon className="size-4" name="plus" />
            Add
            <Icon className="size-4 rotate-90" name="chevron" />
          </AdminSecondaryButton>
        </>
      }
      subtitle={"Add and manage skills to be shared within the organization.\nOnce added and activated, skills will be exposed to the user skills library."}
      title="Skills"
    >
      <div className="flex h-full min-h-0 flex-col gap-6">
        <div className="relative max-w-full" style={{ width: 256 }}>
          <Icon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#8f8f8f]" name="search" />
          <input
            aria-label="Search by name"
            className="flex h-10 w-full rounded-md border border-[#ffffff1a] bg-[#171717] px-3 py-2 pl-9 text-base text-[#fafafa] outline-none placeholder:text-[#737373] md:text-sm"
            placeholder="Search by name"
            readOnly
            type="search"
          />
        </div>
        <div className="grid content-stretch grid-cols-1 gap-3 lg:grid-cols-2">
          {skillItems.map((skill, index) => (
            <div className="group relative" key={skill.id}>
              <button aria-label={skill.name} className="peer absolute inset-0 z-10 rounded-[10px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0090ff]" type="button" />
              <div className="relative h-full rounded-[10px] border border-[#ffffff1a] bg-[#ffffff0d] p-5 transition-colors group-hover:border-[#fafafa]/30">
                <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-3 gap-y-3">
                  <p className="min-w-0 truncate text-base font-medium text-[#fafafa]">{skill.name}</p>
                  <div className="relative z-20 flex shrink-0 items-center gap-2 self-start">
                    <ToggleSwitchMock checked={index !== 3} />
                    <button aria-label="More actions" className="inline-flex size-8 items-center justify-center rounded-lg text-[#fafafa] transition-all hover:bg-white/[0.08]" type="button">
                      <Icon className="h-4 w-4" name="moreHorizontal" />
                    </button>
                  </div>
                  <p className="col-span-2 line-clamp-2 text-sm text-[#8f8f8f]">{skill.description}</p>
                  <div className="col-span-2 min-w-0">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <SkillSourceBadgeMock source={skill.source} />
                      <span className="text-xs text-[#8f8f8f]">{skill.updatedAt}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <UsagePagination label="1 - 6 of 6" />
      </div>
    </AdminPageShell>
  );
}

function UsersScreen() {
  const users: Array<{
    email: string;
    joined: string;
    lastActive: string;
    name: string;
    role: string;
    status: string;
    tags: Array<{ color: string; label: string }>;
  }> = [
    { email: "mina.park@querypie.com", joined: "06/28/2026, 12:00:00 AM", lastActive: "06/28/2026, 12:16:00 PM", name: "Mina Park", role: "Owner", status: "Active", tags: [{ color: "#F59E0B", label: "Department: Executive" }] },
    { email: "daniel.kim@querypie.com", joined: "06/27/2026, 12:00:00 AM", lastActive: "06/28/2026, 02:00:00 PM", name: "Daniel Kim", role: "Admin", status: "Active", tags: [{ color: "#3B82F6", label: "Department: Finance" }, { color: "#14B8A6", label: "Region: US" }] },
    { email: "sarah.lee@querypie.com", joined: "06/26/2026, 12:00:00 AM", lastActive: "06/27/2026, 02:00:00 PM", name: "Sarah Lee", role: "AI Operator", status: "Active", tags: [{ color: "#8B5CF6", label: "Team: Operations" }] },
    { email: "alex.chen@querypie.com", joined: "06/25/2026, 12:00:00 AM", lastActive: "06/25/2026, 02:16:00 PM", name: "Alex Chen", role: "Member", status: "Active", tags: [{ color: "#22C55E", label: "Team: Sales" }] },
    { email: "priya.shah@querypie.com", joined: "-", lastActive: "-", name: "Priya Shah", role: "Member", status: "Pending", tags: [] },
  ];
  const headerAction = (
    <>
      <button className="inline-flex h-9 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg border-none bg-[#2a2a2a] px-3 py-2 text-sm font-medium text-[#fafafa] transition-all hover:bg-[#2a2a2a]/60" type="button">
        <svg aria-hidden="true" className="size-4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M20.59 13.41 13.41 20.59a2 2 0 0 1-2.82 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82Z" />
          <path d="M7 7h.01" />
        </svg>
        Tags
      </button>
      <button className="inline-flex h-9 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg border-none bg-[#2a2a2a] px-3 py-2 text-sm font-medium text-[#fafafa] transition-all hover:bg-[#2a2a2a]/60" type="button">
        <svg aria-hidden="true" className="size-4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <line x1="19" x2="19" y1="8" y2="14" />
          <line x1="22" x2="16" y1="11" y2="11" />
        </svg>
        Invite User
        <svg aria-hidden="true" className="size-4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
    </>
  );

  return (
    <AdminPageShell action={headerAction} subtitle="Manage your organization users and their permissions." title="User Management">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <AdminSearchInput placeholder="Search by name or email..." />
          <button className="flex h-auto min-h-10 w-full min-w-0 items-center justify-between overflow-hidden rounded-md border border-[#ffffff1a] bg-inherit px-3 py-2 font-normal hover:bg-inherit sm:w-[200px]" type="button">
            <span className="truncate">Select tags</span>
            <svg aria-hidden="true" className="ml-2 size-4 shrink-0 text-[#8f8f8f]" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>
        </div>
        <button className="inline-flex h-10 min-h-10 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg border border-[#ffffff1a] bg-[#171717] px-3 py-2 text-sm font-medium text-[#fafafa] transition-colors hover:bg-white/[0.04] disabled:opacity-50" disabled type="button">
          <Icon className="size-4" name="settings" />
          Bulk Actions
          <Icon className="size-4 rotate-90" name="chevron" />
        </button>
      </div>
      <AdminDataTable
        bordered={false}
        columns={[
          <span aria-label="Select all" className="block size-4 rounded-sm border border-[#ffffff33] bg-transparent" key="select-all" role="checkbox" />,
          "User",
          "Role",
          "Status",
          "Tags",
          "Joined At",
          "Last Active",
          "",
        ]}
        minWidth={1040}
        tableFixed
        columnClassNames={["w-8 pr-0", "w-[185px]", "w-[118px]", "w-[78px]", "w-[165px]", "w-[190px]", "w-[190px]", "w-8"]}
        rows={users.map(({ email, joined, lastActive, name, role, status, tags }) => [
          <span aria-label="Select row" className="block size-4 rounded-sm border border-[#ffffff33] bg-transparent" key="select" role="checkbox" />,
          <UserCell email={email} name={name} key="user" />,
          <RoleDisplayMock key="role" role={role} />,
          <AdminBadge key="status" variant={status === "Active" ? "green" : "muted"}>{status}</AdminBadge>,
          <div className="flex min-w-0 items-center gap-1" key="tag">
            <div className="flex min-w-0 flex-1 items-center gap-1">
              {tags.length ? (
                <>
                  <UserTagBadge color={tags[0].color}>{tags[0].label}</UserTagBadge>
                  {tags.length > 1 ? <span className="text-sm text-[#8f8f8f]">+{tags.length - 1}</span> : null}
                </>
              ) : (
                <span className="flex-1 text-xs text-[#8f8f8f]">No tags</span>
              )}
            </div>
            <button className="inline-flex size-8 items-center justify-center rounded-lg text-[#8f8f8f] hover:bg-white/[0.04]" type="button">
              <Icon className="size-4" name="plus" />
            </button>
          </div>,
          <span className="whitespace-nowrap text-sm text-[#8f8f8f]" key="joined">{joined}</span>,
          <span className="whitespace-nowrap text-sm text-[#8f8f8f]" key="lastActive">{lastActive}</span>,
          <button aria-label="Open menu" className="inline-flex size-8 items-center justify-center rounded-lg text-[#8f8f8f] hover:bg-white/[0.04]" key="actions" type="button">
            <Icon className="size-4" name="moreHorizontal" />
          </button>,
        ])}
      />
      <span className="ml-4 mt-4 block text-sm text-[#8f8f8f]">1 - 5 of 5</span>
    </AdminPageShell>
  );
}

function SsoLabel({ children, required }: { children: ReactNode; required?: boolean }) {
  return (
    <label className="text-sm font-medium leading-none text-[#fafafa]">
      {children}
      {required ? <span className="ml-1 text-[#ef4444]">*</span> : null}
    </label>
  );
}

function OidcTextField({ label, placeholder, required }: { label: string; placeholder: string; required?: boolean }) {
  return (
    <div className="space-y-2">
      <SsoLabel required={required}>{label}</SsoLabel>
      <input
        className="flex h-10 w-full rounded-md border border-[#ffffff1a] bg-[#171717] px-3 py-2 text-base text-[#fafafa] outline-none placeholder:text-[#737373] md:text-sm"
        placeholder={placeholder}
        readOnly
        value=""
      />
    </div>
  );
}

function OidcPasswordField({ label, placeholder }: { label: string; placeholder: string }) {
  return (
    <div className="space-y-2">
      <SsoLabel>{label}</SsoLabel>
      <div className="relative">
        <input
          className="flex h-10 w-full rounded-md border border-[#ffffff1a] bg-[#171717] px-3 py-2 pr-10 text-base text-[#fafafa] outline-none placeholder:text-[#737373] md:text-sm"
          placeholder={placeholder}
          readOnly
          type="password"
          value=""
        />
        <svg aria-hidden="true" className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[#8f8f8f]" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      </div>
    </div>
  );
}

function SsoScreen() {
  return (
    <AdminPageShell contentWidth="sm" subtitle="Set up domain-based authentication for your organization." title="SSO Settings">
      <div className="mb-10">
        <section className="space-y-5">
          <div className="space-y-1">
            <h2 className="text-lg font-semibold text-[#fafafa]">OIDC configuration</h2>
          </div>
          <div className="flex flex-col gap-6 items-end">
            <div className="flex w-full flex-col gap-4">
              <OidcTextField label="Issuer URL" placeholder="https://your-idp.com" required />
              <OidcTextField label="Client ID" placeholder="your-client-id" required />
              <OidcPasswordField label="Client secret" placeholder="your-client-secret" />
              <div className="space-y-2">
                <SsoLabel required>Client authentication</SsoLabel>
                <div className="flex flex-col gap-2">
                  <label className="flex items-center space-x-2">
                    <span className="relative flex size-4 shrink-0 items-center justify-center rounded-full border border-[#ffffff33]">
                      <span className="size-2 rounded-full bg-[#fafafa]" />
                    </span>
                    <span className="text-sm font-medium text-[#fafafa]">Basic</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <span className="size-4 shrink-0 rounded-full border border-[#ffffff33]" />
                    <span className="text-sm font-medium text-[#fafafa]">Post</span>
                  </label>
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                className="inline-flex h-9 w-full items-center justify-center gap-1.5 whitespace-nowrap rounded-lg bg-[#0090ff] px-3 py-2 text-sm font-medium text-white opacity-50 disabled:cursor-not-allowed md:w-auto"
                disabled
                type="button"
              >
                Save
                <Icon className="size-4" name="send" />
              </button>
            </div>
          </div>
        </section>
      </div>
    </AdminPageShell>
  );
}

function BillingScreen() {
  return (
    <AdminPageShell subtitle="Manage your subscription plan, monitor usage, and handle billing information." title="Billing & Usage">
      <h2 className="mb-3 text-lg font-semibold text-[#fafafa]">Plan & Credits</h2>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="col-span-1 flex flex-col justify-between rounded-[10px] border border-[#ffffff1a] bg-[#212121]">
          <div className="p-6">
            <div className="mb-2 flex items-center gap-2">
              <svg aria-hidden="true" className="size-5 text-[#facc15]" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
                <path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7Z" />
                <path d="M5 20h14" />
              </svg>
              <h3 className="text-lg font-semibold tracking-tight">Current Plan</h3>
            </div>
            <p className="text-4xl font-bold tracking-tight">Enterprise</p>
          </div>
          <div className="flex justify-end p-6 pt-0" />
        </div>

        <div className="col-span-1 flex flex-col rounded-[10px] border border-[#ffffff1a] bg-[#212121] lg:col-span-2">
          <div className="p-6">
            <h3 className="text-lg font-semibold tracking-tight">Credits</h3>
            <p className="mt-2 text-4xl font-bold tracking-tight">1,000,000.00</p>
          </div>
          <div className="flex-grow space-y-4 px-6 pb-6">
            <div className="space-y-1.5">
              {[
                ["Manual Credits", "50,000.00", "event"],
                ["Additional Credits", "100,000.00", "additional"],
                ["Plan Credits Remaining", "720,000.00", "remaining"],
                ["Plan Credits Used", "130,000.00", "used"],
              ].map(([label, value]) => (
                <div className="flex items-center justify-between text-sm" key={label}>
                  <span className="flex items-center gap-2">
                    <span
                      className={[
                        "size-2 rounded-full",
                        label === "Manual Credits" ? "bg-[#a855f7]" : "",
                        label === "Additional Credits" ? "bg-[#3b82f6]" : "",
                        label === "Plan Credits Remaining" ? "bg-[#22c55e]" : "",
                        label === "Plan Credits Used" ? "bg-[#ef4444]" : "",
                      ].join(" ")}
                    />
                    <span className="text-[#8f8f8f]">{label}</span>
                  </span>
                  <span className="font-medium text-[#fafafa]">{value}</span>
                </div>
              ))}
            </div>
            <div className="flex h-5 w-full overflow-hidden rounded-full bg-[#2a2a2a]">
              <div className="h-full bg-[#a855f7]" style={{ flexGrow: 50000 }} />
              <div className="h-full bg-[#3b82f6]" style={{ flexGrow: 100000 }} />
              <div className="h-full bg-[#22c55e]" style={{ flexGrow: 720000 }} />
              <div className="h-full bg-[#ef4444]" style={{ flexGrow: 130000 }} />
            </div>
            <div className="flex flex-col justify-end gap-2 sm:flex-row">
              <button className="inline-flex h-9 w-full items-center justify-center gap-1.5 whitespace-nowrap rounded-lg border border-[#ffffff1a] px-3 py-2 text-sm font-medium text-[#fafafa] hover:bg-white/[0.04] sm:w-auto" type="button">View Credit History</button>
              <button className="inline-flex h-9 w-full items-center justify-center gap-1.5 whitespace-nowrap rounded-lg border-none bg-[#0090ff] px-3 py-2 text-sm font-medium text-white hover:bg-[#0090ff]/60 sm:w-auto" type="button">
                <Icon className="size-4" name="plus" />
                Add Credits
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminPageShell>
  );
}

function CreditsHistoryScreen() {
  const rows = [
    ["06/28/2026, 02:16:00 PM", "Mina Park", "mina.park@querypie.com", "Use", "-1,240", "31,570", "Plan", "AIP agent run", "Personal Agent", "Quotation Assistant", "agt_quotation_9e2f"],
    ["06/28/2026, 01:42:00 PM", "Daniel Kim", "daniel.kim@querypie.com", "Use", "-860", "32,810", "Plan", "AIP apps execution", "AIP Apps", "Document Converter", "app_document_converter"],
    ["06/27/2026, 05:31:00 PM", "Priya Shah", "priya.shah@querypie.com", "Charge", "+8,000", "33,670", "Additional", "Credit purchase", "-", "-", "-"],
    ["06/27/2026, 04:08:00 PM", "Sarah Lee", "sarah.lee@querypie.com", "Refund", "+520", "25,670", "Plan", "Run cancelled", "Organization Agent", "Sales Insight Agent", "agt_sales_1c4a"],
  ];
  return (
    <AdminPageShell subtitle="View and manage credit transactions for your organization." title="Credits History">
      <div className="space-y-4">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
          <div className="grid w-full grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-2 sm:flex sm:w-auto sm:items-center">
            <button className="inline-flex h-10 min-h-10 w-full items-center justify-between gap-2 rounded-md border border-[#ffffff1a] bg-[#171717] px-3 py-2 text-sm text-[#8f8f8f] hover:bg-white/[0.04] sm:w-48" type="button">
              <span className="truncate">User</span>
              <Icon className="size-4 rotate-90" name="chevron" />
            </button>
            <button className="inline-flex h-10 min-h-10 w-full items-center justify-between gap-2 rounded-md border border-[#ffffff1a] bg-[#171717] px-3 py-2 text-sm text-[#fafafa] hover:bg-white/[0.04] sm:w-48" type="button">
              <span className="truncate">All Transactions</span>
              <Icon className="size-4 rotate-90" name="chevron" />
            </button>
          </div>

          <div className="grid w-full grid-cols-[minmax(0,1fr)_auto] gap-2 sm:flex sm:w-auto sm:items-center">
            <button className="inline-flex h-10 min-h-10 items-center justify-start gap-1.5 rounded-md border border-[#ffffff1a] bg-[#171717] px-3 py-2 text-left text-sm font-medium text-[#fafafa] hover:bg-white/[0.04]" type="button">
              <svg aria-hidden="true" className="mr-1 size-4 text-[#8f8f8f]" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M8 2v4" />
                <path d="M16 2v4" />
                <rect height="18" rx="2" width="18" x="3" y="4" />
                <path d="M3 10h18" />
              </svg>
              <span className="flex-1 text-[#8f8f8f]">Select date range</span>
              <Icon className="ml-1 size-4 rotate-90 text-[#8f8f8f]" name="chevron" />
            </button>
            <button className="inline-flex h-10 min-h-10 items-center justify-center gap-1.5 whitespace-nowrap rounded-md border border-[#ffffff1a] bg-[#171717] px-3 py-2 text-sm font-medium text-[#fafafa] opacity-50" disabled type="button">
              <svg aria-hidden="true" className="hidden size-4 sm:block" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                <path d="M21 3v5h-5" />
                <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                <path d="M8 16H3v5" />
              </svg>
              <span className="hidden sm:inline">Reset</span>
            </button>
          </div>
        </div>

        <div className="overflow-hidden rounded-md border border-[#ffffff1a]">
          <AdminDataTable
            bordered={false}
            columns={["Date", "User", "Event Type", "Credits", "Balance After", "Credit Type", "Usage Reason", "Source Type", "Source Name", "Source ID"]}
            minWidth={1880}
            rowClassName="cursor-pointer"
            rows={rows.map(([date, user, email, type, amount, balance, creditType, reason, sourceType, sourceName, sourceId]) => [
              <span className="whitespace-nowrap text-sm" key="date">{date}</span>,
              <UserCell email={email} key="user" name={user} />,
              <AdminBadge key="type" variant={type === "Use" ? "red" : "default"}>{type}</AdminBadge>,
              <span className={amount.startsWith("+") ? "text-[#22c55e]" : "text-[#ef4444]"} key="amount">{amount}</span>,
              <span className="font-medium text-[#fafafa]" key="balance">{balance}</span>,
              <AdminBadge key="creditType" variant={creditType === "Additional" ? "green" : "default"}>{creditType}</AdminBadge>,
              <span className="block truncate text-sm" key="reason" title={reason}>{reason}</span>,
              <span className="block truncate text-sm" key="sourceType" title={sourceType}>{sourceType}</span>,
              <span className="block truncate text-sm" key="sourceName" title={sourceName}>{sourceName}</span>,
              <div className="flex min-w-0 items-center gap-2" key="sourceId">
                <span className="min-w-0 flex-1 truncate text-sm" title={sourceId}>{sourceId}</span>
                {sourceId !== "-" && (
                  <button aria-label="Copy" className="inline-flex size-7 shrink-0 items-center justify-center rounded-lg text-[#8f8f8f] hover:bg-white/[0.06] hover:text-[#fafafa]" title="Copy" type="button">
                    <svg aria-hidden="true" className="size-3.5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
                      <rect height="14" rx="2" width="14" x="8" y="8" />
                      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                    </svg>
                  </button>
                )}
              </div>,
            ])}
          />
        </div>

        <div className="mt-4 flex items-center justify-between p-4 text-sm text-[#8f8f8f]">
          <span>1 - 4 of 4</span>
          <nav className="flex justify-end">
            <ul className="flex flex-row items-center gap-1">
              <li>
                <button aria-label="Go to previous page" className="inline-flex h-9 items-center justify-center rounded-lg border-none px-2.5 text-sm text-[#8f8f8f] opacity-50" disabled type="button">
                  <svg aria-hidden="true" className="size-4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="m15 18-6-6 6-6" />
                  </svg>
                </button>
              </li>
              <li><button className="inline-flex size-9 items-center justify-center rounded-md border border-[#ffffff1a] bg-[#2a2a2a] text-sm font-medium text-[#fafafa]" type="button">1</button></li>
              <li>
                <button aria-label="Go to next page" className="inline-flex h-9 items-center justify-center rounded-lg border-none px-2.5 text-sm text-[#8f8f8f] opacity-50" disabled type="button">
                  <svg aria-hidden="true" className="size-4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </AdminPageShell>
  );
}

function CreditLimitsScreen() {
  return (
    <AdminPageShell subtitle="Set the default limit for all users, then manage only users who need a custom limit." title="Credit Limits">
      <div className="flex flex-col gap-6 md:gap-8">
        <div className="space-y-3">
          <button aria-label="Edit" className="group flex h-auto w-full items-start justify-between gap-3 rounded-lg px-0 py-1.5 text-left text-sm font-medium text-[#fafafa] hover:bg-white/[0.04]" type="button">
            <span className="flex min-w-0 flex-1 flex-wrap items-center gap-x-2 gap-y-1">
              <span className="inline-flex shrink-0 items-center">
                <span className="text-xs font-medium text-[#fafafa]">Default limit</span>
                <span aria-hidden="true" className="text-xs font-medium text-[#fafafa]">:</span>
              </span>
              <span className="flex min-w-0 flex-1 flex-wrap items-center gap-x-1 gap-y-1">
                <span className="inline-flex max-w-full min-w-0 items-center gap-1.5">
                  <span className="min-w-0 truncate text-xs font-normal text-[#8f8f8f]">Weekly</span>
                </span>
                <span aria-hidden="true" className="text-xs text-[#8f8f8f]">·</span>
                <span className="inline-flex max-w-full min-w-0 items-center gap-1.5">
                  <span className="min-w-0 truncate text-xs font-normal text-[#8f8f8f]">2,000.00</span>
                </span>
              </span>
            </span>
            <svg aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-[#8f8f8f] transition-colors group-hover:text-[#fafafa]" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
            </svg>
          </button>
          <div className="h-px w-full bg-[#ffffff1a]" />
        </div>

        <section className="space-y-4">
          <div>
            <h2 className="text-lg font-medium text-[#fafafa]">Custom limits</h2>
          </div>
          <div className="space-y-4">
            <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
              <div className="grid w-full grid-cols-[minmax(0,1fr)_auto] gap-2 sm:flex sm:w-auto sm:items-center">
                <button className="inline-flex h-10 min-h-10 w-full items-center justify-between gap-2 rounded-md border border-[#ffffff1a] bg-[#171717] px-3 py-2 text-sm text-[#8f8f8f] hover:bg-white/[0.04] sm:w-48" type="button">
                  <span className="truncate">User</span>
                  <Icon className="size-4 rotate-90" name="chevron" />
                </button>
                <button className="inline-flex h-10 min-h-10 items-center justify-between gap-2 rounded-md border border-[#ffffff1a] bg-[#171717] px-3 py-2 text-sm text-[#8f8f8f] hover:bg-white/[0.04]" type="button">
                  <span className="truncate">Select user tags</span>
                  <Icon className="size-4 rotate-90" name="chevron" />
                </button>
                <button className="inline-flex h-10 min-h-10 items-center justify-center gap-1.5 whitespace-nowrap rounded-md border border-[#ffffff1a] bg-[#171717] px-3 py-2 text-sm font-medium text-[#fafafa] opacity-50" disabled type="button">
                  <svg aria-hidden="true" className="hidden size-4 sm:block" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                    <path d="M21 3v5h-5" />
                    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                    <path d="M8 16H3v5" />
                  </svg>
                  <span className="hidden sm:inline">Reset</span>
                </button>
              </div>
              <div className="flex items-center gap-2">
                <button className="inline-flex h-10 min-h-10 items-center justify-center gap-1.5 whitespace-nowrap rounded-md border border-[#ffffff1a] bg-[#171717] px-3 py-2 text-sm font-medium text-[#fafafa] opacity-50" disabled type="button">
                  <svg aria-hidden="true" className="size-4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.09a2 2 0 0 1-1-1.74v-.51a2 2 0 0 1 1-1.72l.15-.1a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2Z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                  Bulk actions
                  <Icon className="size-4 rotate-90" name="chevron" />
                </button>
                <button className="inline-flex h-9 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg border-none bg-[#2a2a2a] px-3 py-2 text-sm font-medium text-[#fafafa] hover:bg-[#2a2a2a]/60" type="button">
                  <Icon className="size-4" name="plus" />
                  Add custom limit
                </button>
              </div>
            </div>
            <div className="overflow-hidden rounded-md border border-[#ffffff1a]">
              <AdminDataTable
                bordered={false}
                columns={[
                  <span aria-label="Select all" className="block size-4 rounded-sm border border-[#ffffff33] bg-transparent" key="select-all" role="checkbox" />,
                  "User",
                  "Usage Limit",
                  "Actions",
                ]}
                columnClassNames={["w-12", "w-[280px]", "w-[320px]", "w-[120px]"]}
                minWidth={770}
                rows={[
                  [
                    <span aria-label="Select row" className="block size-4 rounded-sm border border-[#ffffff33] bg-transparent" key="select" role="checkbox" />,
                    <UserCell email="mina.park@querypie.com" key="u" name="Mina Park" />,
                    <div className="space-y-2 py-1" key="limit"><div className="whitespace-nowrap text-xs font-medium text-[#fafafa]">Daily · 0 / 500.00</div></div>,
                    <button aria-label="Open actions" className="inline-flex size-8 items-center justify-center rounded-lg text-[#fafafa] hover:bg-white/[0.06]" key="actions" type="button"><Icon className="size-4" name="moreHorizontal" /></button>,
                  ],
                  [
                    <span aria-label="Select row" className="block size-4 rounded-sm border border-[#ffffff33] bg-transparent" key="select" role="checkbox" />,
                    <UserCell email="daniel.kim@querypie.com" key="u" name="Daniel Kim" />,
                    <div className="space-y-2 py-1" key="limit"><div className="whitespace-nowrap text-xs font-medium text-[#fafafa]">Weekly · 0 / 3,000.00</div></div>,
                    <button aria-label="Open actions" className="inline-flex size-8 items-center justify-center rounded-lg text-[#fafafa] hover:bg-white/[0.06]" key="actions" type="button"><Icon className="size-4" name="moreHorizontal" /></button>,
                  ],
                ]}
              />
            </div>
            <div className="mt-4 flex items-center justify-between p-4 text-sm text-[#8f8f8f]">
              <span>1 - 2 of 2</span>
              <nav className="flex justify-end">
                <ul className="flex flex-row items-center gap-1">
                  <li>
                    <button aria-label="Go to previous page" className="inline-flex h-9 items-center justify-center rounded-lg border-none px-2.5 text-sm text-[#8f8f8f] opacity-50" disabled type="button">
                      <svg aria-hidden="true" className="size-4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="m15 18-6-6 6-6" />
                      </svg>
                    </button>
                  </li>
                  <li><button className="inline-flex size-9 items-center justify-center rounded-md border border-[#ffffff1a] bg-[#2a2a2a] text-sm font-medium text-[#fafafa]" type="button">1</button></li>
                  <li>
                    <button aria-label="Go to next page" className="inline-flex h-9 items-center justify-center rounded-lg border-none px-2.5 text-sm text-[#8f8f8f] opacity-50" disabled type="button">
                      <svg aria-hidden="true" className="size-4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="m9 18 6-6-6-6" />
                      </svg>
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </section>
      </div>
    </AdminPageShell>
  );
}

function UsageCard({
  children,
  contentClassName = "",
  description,
  title,
}: {
  children: ReactNode;
  contentClassName?: string;
  description?: string;
  title: string;
}) {
  return (
    <div className="rounded-[10px] border border-[#ffffff1a] bg-[#171717] text-[#fafafa]">
      <div className="flex flex-col space-y-1.5 p-5">
        <div className="text-xl font-medium tracking-tight text-[#fafafa]">{title}</div>
        {description ? <div className="text-sm text-[#8f8f8f]">{description}</div> : null}
      </div>
      <div className={["p-5 pt-0", contentClassName].join(" ")}>{children}</div>
    </div>
  );
}

function UsageSummaryItem({
  icon,
  title,
  unit,
  value,
}: {
  icon: ReactNode;
  title: string;
  unit: string;
  value: string | number;
}) {
  return (
    <div className="relative overflow-hidden rounded-[10px] border border-[#ffffff1a] bg-[#171717] text-[#fafafa]">
      <div className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-1.5 p-5">
        <div className="text-sm font-medium text-[#8f8f8f]">{title}</div>
        <div className="col-start-2 row-start-1 flex shrink-0 items-center text-[#8f8f8f]">{icon}</div>
      </div>
      <div className="p-5 pt-0">
        <div className="flex items-baseline gap-1.5">
          <span className="text-3xl font-semibold tracking-tight text-[#fafafa]">{value}</span>
          <span className="text-sm font-normal text-[#8f8f8f]">{unit}</span>
        </div>
      </div>
    </div>
  );
}

function UsageTrendChart() {
  const points = [
    { date: "06/22/2026", credit: 3120, mcp: 48 },
    { date: "06/23/2026", credit: 4280, mcp: 61 },
    { date: "06/24/2026", credit: 3860, mcp: 57 },
    { date: "06/25/2026", credit: 5210, mcp: 73 },
    { date: "06/26/2026", credit: 4920, mcp: 68 },
    { date: "06/27/2026", credit: 5840, mcp: 82 },
    { date: "06/28/2026", credit: 6710, mcp: 91 },
  ];
  const x = (index: number) => 28 + index * 106;
  const y = (value: number, max: number) => 188 - (value / max) * 168;
  const curvePath = (values: number[], max: number) => {
    const coords = values.map((value, index) => ({ x: x(index), y: y(value, max) }));

    return coords
      .map((point, index) => {
        if (index === 0) {
          return `M${point.x} ${point.y}`;
        }

        const previous = coords[index - 1];
        const controlOffset = (point.x - previous.x) * 0.45;

        return `C${previous.x + controlOffset} ${previous.y} ${point.x - controlOffset} ${point.y} ${point.x} ${point.y}`;
      })
      .join(" ");
  };
  const creditPoints = curvePath(points.map((point) => point.credit), 7000);
  const mcpPoints = curvePath(points.map((point) => point.mcp), 100);

  return (
    <div className="h-[280px] w-full rounded-lg border border-[#ffffff1a] bg-[#171717] p-2">
      <svg aria-hidden="true" className="h-full w-full" fill="none" preserveAspectRatio="none" viewBox="0 0 680 220">
        <path d="M8 12V188H676" stroke="#ffffff1a" strokeWidth="1" />
        {[44, 78, 112, 146].map((lineY) => (
          <path d={`M8 ${lineY}H676`} key={lineY} stroke="#ffffff1a" strokeDasharray="3 3" strokeWidth="1" />
        ))}
        {points.map((point, index) => (
          <text fill="#8f8f8f" fontSize="10" key={point.date} textAnchor="middle" x={x(index)} y="212">
            {point.date.slice(0, 5)}
          </text>
        ))}
        <path d={creditPoints} stroke="#0090FF" strokeLinecap="round" strokeWidth="3" />
        <path d={mcpPoints} stroke="#22c55e" strokeLinecap="round" strokeWidth="3" />
      </svg>
    </div>
  );
}

function UsagePagination({ label }: { label: string }) {
  return (
    <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <span className="m-0 shrink-0 text-sm text-[#8f8f8f]">{label}</span>
      <nav className="flex justify-end">
        <ul className="flex flex-row items-center gap-1">
          <li>
            <button aria-label="Go to previous page" className="inline-flex h-9 items-center justify-center rounded-lg border-none px-2.5 text-sm text-[#8f8f8f] opacity-50" disabled type="button">
              <svg aria-hidden="true" className="size-4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24"><path d="m15 18-6-6 6-6" /></svg>
            </button>
          </li>
          <li><button className="inline-flex size-9 items-center justify-center rounded-md border border-[#ffffff1a] bg-[#2a2a2a] text-sm font-medium text-[#fafafa]" type="button">1</button></li>
          <li>
            <button aria-label="Go to next page" className="inline-flex h-9 items-center justify-center rounded-lg border-none px-2.5 text-sm text-[#8f8f8f] opacity-50" disabled type="button">
              <svg aria-hidden="true" className="size-4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24"><path d="m9 18 6-6-6-6" /></svg>
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}

function UsageRankingCard({
  description,
  iconClassName = "bg-[#0090ff1a] text-[#0090ff]",
  items,
  title,
}: {
  description: string;
  iconClassName?: string;
  items: Array<{ name: string; percentage: number; unit: string; value: string }>;
  title: string;
}) {
  return (
    <UsageCard description={description} title={title}>
      <div className="flex flex-col">
        {items.map((item, index) => (
          <div className="flex flex-wrap items-center gap-2.5 rounded-md border border-transparent px-0 py-1 text-sm" key={item.name}>
            <div className="flex shrink-0 items-center justify-center">
              <div className={["flex size-8 items-center justify-center rounded-full text-sm font-semibold", iconClassName].join(" ")}>
                {index + 1}
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-medium text-[#fafafa]">{item.name}</div>
              <div className="text-sm text-[#8f8f8f]">{item.percentage}% of total</div>
            </div>
            <div className="flex flex-col items-end gap-0.5">
              <span className="text-lg font-bold text-[#fafafa]">{item.value}</span>
              <span className="text-xs text-[#8f8f8f]">{item.unit}</span>
            </div>
          </div>
        ))}
      </div>
    </UsageCard>
  );
}

function AgentUsageSummaryCard({
  description,
  items,
  title,
}: {
  description: string;
  items: Array<{ averageCredit: string; consumedCredit: string; lastUsedAt: string; name: string; usageCount: number }>;
  title: string;
}) {
  return (
    <UsageCard description={description} title={title}>
      <div className="flex flex-col">
        {items.map((item, index) => (
          <div className="flex flex-wrap items-center gap-2.5 rounded-md border border-transparent px-0 py-1 text-sm" key={`${item.name}-${index}`}>
            <div className="flex shrink-0 items-center justify-center">
              <div className="flex size-8 items-center justify-center rounded-full bg-[#0090ff1a] text-sm font-semibold text-[#0090ff]">
                {index + 1}
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-medium leading-snug text-[#fafafa]">{item.name}</div>
              <div className="line-clamp-2 text-sm font-normal leading-normal text-[#8f8f8f]">Last used: {item.lastUsedAt}</div>
            </div>
            <div className="flex flex-col items-end gap-0.5">
              <span className="text-lg font-bold text-[#fafafa]">{item.usageCount.toLocaleString()}</span>
              <span className="text-xs text-[#8f8f8f]">Uses</span>
            </div>
          </div>
        ))}
      </div>
    </UsageCard>
  );
}

function UsageShareBar({ percentage }: { percentage: number }) {
  return (
    <div className="flex min-w-[140px] items-center gap-2">
      <div className="h-2 min-w-0 flex-1 overflow-hidden rounded-full bg-[#2a2a2a]">
        <div className="h-full rounded-full bg-[#0090ff]" style={{ width: `${Math.min(percentage, 100)}%` }} />
      </div>
      <span className="w-12 shrink-0 text-right text-xs tabular-nums text-[#8f8f8f]">{percentage.toFixed(1)}%</span>
    </div>
  );
}

function UsageAnalyticsScreen() {
  return (
    <AdminPageShell subtitle="Monitor organization credit usage and MCP tool calls" title="Usage Analytics">
      <div className="flex flex-col gap-4 pb-4">
        <div className="flex items-center justify-between">
          <button className="inline-flex h-10 min-h-10 items-center justify-start gap-1.5 rounded-md border border-[#ffffff1a] bg-[#171717] px-3 py-2 text-left text-sm font-medium text-[#fafafa] hover:bg-white/[0.04]" type="button">
            <svg aria-hidden="true" className="mr-1 size-4 text-[#8f8f8f]" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M8 2v4" /><path d="M16 2v4" /><rect height="18" rx="2" width="18" x="3" y="4" /><path d="M3 10h18" />
            </svg>
            <span className="flex-1 text-[#fafafa]">06/22/2026 - 06/28/2026</span>
            <Icon className="ml-1 size-4 rotate-90 text-[#8f8f8f]" name="chevron" />
          </button>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <UsageSummaryItem icon={<svg aria-hidden="true" className="size-4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" /></svg>} title="Total Credits Used" unit="Credits" value="33,940.00" />
          <UsageSummaryItem icon={<AdminMenuIcon className="size-4" name="users" />} title="Active Users" unit="Users" value={18} />
          <UsageSummaryItem icon={<AdminMenuIcon className="size-4" name="chartColumn" />} title="Avg Credits per Active User" unit="Credits" value="1,885.56" />
        </div>
        <UsageCard description="Credit usage and MCP calls over time" title="Usage Trends">
          <UsageTrendChart />
        </UsageCard>
        <UsageCard contentClassName="p-5 pt-0" description="Detailed breakdown of daily usage by user" title="Daily Usage Details">
          <div className="max-w-full">
            <div className="mb-4 block">
              <div className="mb-4 flex justify-between gap-4">
                <button className="inline-flex h-10 min-h-10 w-full items-center justify-between gap-2 rounded-md border border-[#ffffff1a] bg-[#171717] px-3 py-2 text-sm text-[#8f8f8f] hover:bg-white/[0.04] sm:min-w-[320px]" type="button">
                  <span className="truncate">User</span>
                  <Icon className="size-4 rotate-90" name="chevron" />
                </button>
              </div>
              <div className="text-sm text-[#8f8f8f]"><strong className="font-semibold text-[#fafafa]">18</strong> users used <strong className="font-semibold text-[#fafafa]">33,940.00</strong> credits total (avg. <strong className="font-semibold text-[#fafafa]">1,885.56</strong> credits per user)</div>
            </div>
            <AdminDataTable
              bordered={false}
              columns={["Date", "Credits Used", "User", "Tags"]}
              columnClassNames={["w-[150px]", "w-[150px]", "w-[300px]", ""]}
              minWidth={760}
              rows={[
                ["06/28/2026", "6,710.00", <UserCell email="mina.park@querypie.com" key="u" name="Mina Park" />, <div className="flex flex-wrap gap-1" key="tags"><UserTagBadge color="#2563eb">team: finance</UserTagBadge><UserTagBadge color="#16a34a">region: apac</UserTagBadge></div>],
                ["06/28/2026", "4,920.00", <UserCell email="daniel.kim@querypie.com" key="u" name="Daniel Kim" />, <div className="flex flex-wrap gap-1" key="tags"><UserTagBadge color="#7c3aed">team: sales</UserTagBadge></div>],
                ["06/27/2026", "3,860.00", <UserCell email="sarah.lee@querypie.com" key="u" name="Sarah Lee" />, <div className="flex flex-wrap gap-1" key="tags"><UserTagBadge color="#f97316">team: operations</UserTagBadge></div>],
              ]}
            />
          </div>
          <div className="flex items-center justify-between p-5 pt-0">
            <UsagePagination label="1 - 3 of 3" />
          </div>
        </UsageCard>
        <UsageCard description="Compare credit usage across user tag groups" title="Credit by Tags">
          <div className="space-y-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <button className="inline-flex min-h-9 w-full items-center justify-between rounded-md border border-[#ffffff1a] bg-[#171717] px-3 py-2 text-sm text-[#8f8f8f] hover:bg-white/[0.04] sm:max-w-[360px]" type="button">
                <span>Filter by tag key</span>
                <Icon className="size-4 rotate-90" name="chevron" />
              </button>
            </div>
            <div className="space-y-3">
              <AdminDataTable
                bordered={false}
                columns={["Tag", "Credits Used", "Share", "Users", ""]}
                columnClassNames={["min-w-[220px]", "w-[180px] text-right", "w-[220px]", "w-[130px] text-right", "w-[120px] text-right"]}
                minWidth={860}
                rows={[
                  [<span className="flex min-w-0 items-center gap-2 text-sm" key="tag"><span className="size-2.5 shrink-0 rounded-full border" style={{ backgroundColor: "#2563eb" }} /><span className="truncate"><span className="font-medium">team</span><span className="text-[#8f8f8f]">: </span><span>finance</span></span></span>, "12,840.00", <UsageShareBar key="share" percentage={37.8} />, "7", <button className="inline-flex h-8 items-center justify-center whitespace-nowrap rounded-lg px-3 text-sm font-medium text-[#fafafa] hover:bg-white/[0.06]" key="button" type="button">User Breakdown</button>],
                  [<span className="flex min-w-0 items-center gap-2 text-sm" key="tag"><span className="size-2.5 shrink-0 rounded-full border" style={{ backgroundColor: "#7c3aed" }} /><span className="truncate"><span className="font-medium">team</span><span className="text-[#8f8f8f]">: </span><span>sales</span></span></span>, "9,620.00", <UsageShareBar key="share" percentage={28.3} />, "5", <button className="inline-flex h-8 items-center justify-center whitespace-nowrap rounded-lg px-3 text-sm font-medium text-[#fafafa] hover:bg-white/[0.06]" key="button" type="button">User Breakdown</button>],
                  [<span className="flex min-w-0 items-center gap-2 text-sm" key="tag"><span className="size-2.5 shrink-0 rounded-full border" style={{ backgroundColor: "#f97316" }} /><span className="truncate"><span className="font-medium">team</span><span className="text-[#8f8f8f]">: </span><span>operations</span></span></span>, "6,480.00", <UsageShareBar key="share" percentage={19.1} />, "4", <button className="inline-flex h-8 items-center justify-center whitespace-nowrap rounded-lg px-3 text-sm font-medium text-[#fafafa] hover:bg-white/[0.06]" key="button" type="button">User Breakdown</button>],
                ]}
              />
              <UsagePagination label="1 - 3 of 3" />
            </div>
          </div>
        </UsageCard>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <UsageRankingCard description="Users with highest credit usage" items={[
            { name: "Mina Park", percentage: 21.4, unit: "Credits", value: "7,260.00" },
            { name: "Daniel Kim", percentage: 17.8, unit: "Credits", value: "6,040.00" },
            { name: "Sarah Lee", percentage: 14.6, unit: "Credits", value: "4,960.00" },
            { name: "Alex Chen", percentage: 11.2, unit: "Credits", value: "3,800.00" },
            { name: "Priya Shah", percentage: 8.9, unit: "Credits", value: "3,020.00" },
          ]} title="Top 5 Users by Credits" />
          <UsageRankingCard description="Most frequently used MCP tools" iconClassName="bg-[#22c55e1a] text-[#22c55e]" items={[
            { name: "Google Drive", percentage: 31.2, unit: "Calls", value: "186" },
            { name: "Slack", percentage: 22.7, unit: "Calls", value: "135" },
            { name: "Jira", percentage: 18.1, unit: "Calls", value: "108" },
            { name: "Notion", percentage: 13.6, unit: "Calls", value: "81" },
            { name: "Salesforce", percentage: 8.9, unit: "Calls", value: "53" },
          ]} title="Top 5 MCP Tools" />
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <AgentUsageSummaryCard description="Most frequently used deployed agents" items={[
            { name: "Quotation Assistant", usageCount: 84, consumedCredit: "7,840.00", averageCredit: "93.33", lastUsedAt: "06/28/2026, 02:16:00 PM" },
            { name: "Sales Insight Agent", usageCount: 67, consumedCredit: "6,280.00", averageCredit: "93.73", lastUsedAt: "06/28/2026, 01:44:00 PM" },
            { name: "Document Review Agent", usageCount: 52, consumedCredit: "4,910.00", averageCredit: "94.42", lastUsedAt: "06/28/2026, 12:18:00 PM" },
            { name: "Finance Reconciliation Agent", usageCount: 39, consumedCredit: "3,420.00", averageCredit: "87.69", lastUsedAt: "06/27/2026, 06:03:00 PM" },
            { name: "Customer Support Agent", usageCount: 31, consumedCredit: "2,760.00", averageCredit: "89.03", lastUsedAt: "06/27/2026, 04:31:00 PM" },
          ]} title="Top 5 Agents" />
          <AgentUsageSummaryCard description="Most recently used deployed agents" items={[
            { name: "Quotation Assistant", usageCount: 84, consumedCredit: "7,840.00", averageCredit: "93.33", lastUsedAt: "06/28/2026, 02:16:00 PM" },
            { name: "Contract Draft Agent", usageCount: 24, consumedCredit: "2,140.00", averageCredit: "89.17", lastUsedAt: "06/28/2026, 02:02:00 PM" },
            { name: "Sales Insight Agent", usageCount: 67, consumedCredit: "6,280.00", averageCredit: "93.73", lastUsedAt: "06/28/2026, 01:44:00 PM" },
            { name: "Procurement Assistant", usageCount: 19, consumedCredit: "1,620.00", averageCredit: "85.26", lastUsedAt: "06/28/2026, 01:05:00 PM" },
            { name: "Document Review Agent", usageCount: 52, consumedCredit: "4,910.00", averageCredit: "94.42", lastUsedAt: "06/28/2026, 12:18:00 PM" },
          ]} title="5 Recently Used Agents" />
        </div>
        <UsageCard description="Usage count and credit consumption by deployed agent" title="Agent Usage Details">
          <div className="mb-4">
            <button className="inline-flex h-10 min-h-10 w-full items-center justify-between gap-2 rounded-md border border-[#ffffff1a] bg-[#171717] px-3 py-2 text-sm text-[#8f8f8f] hover:bg-white/[0.04] sm:w-72" type="button">
              <span className="truncate">Search agent</span>
              <Icon className="size-4 rotate-90" name="chevron" />
            </button>
          </div>
          <AdminDataTable
            bordered={false}
            columns={["Agent", "Usage Count", "Total Credits", "Avg Credits", "Last Used"]}
            columnClassNames={["min-w-[260px] max-w-[320px]", "w-[140px] text-right", "w-[180px] text-right", "w-[180px] text-right", "w-[220px]"]}
            minWidth={960}
            rows={[
              ["Quotation Assistant", "84", <span className="font-medium tabular-nums" key="credit">7,840.00</span>, "93.33", <span className="whitespace-nowrap" key="date">06/28/2026, 02:16:00 PM</span>],
              ["Sales Insight Agent", "67", <span className="font-medium tabular-nums" key="credit">6,280.00</span>, "93.73", <span className="whitespace-nowrap" key="date">06/28/2026, 01:44:00 PM</span>],
              ["Document Review Agent", "52", <span className="font-medium tabular-nums" key="credit">4,910.00</span>, "94.42", <span className="whitespace-nowrap" key="date">06/28/2026, 12:18:00 PM</span>],
              ["Finance Reconciliation Agent", "39", <span className="font-medium tabular-nums" key="credit">3,420.00</span>, "87.69", <span className="whitespace-nowrap" key="date">06/27/2026, 06:03:00 PM</span>],
              ["Customer Support Agent", "31", <span className="font-medium tabular-nums" key="credit">2,760.00</span>, "89.03", <span className="whitespace-nowrap" key="date">06/27/2026, 04:31:00 PM</span>],
            ]}
          />
          <div className="mt-4">
            <UsagePagination label="1 - 5 of 5" />
          </div>
        </UsageCard>
      </div>
    </AdminPageShell>
  );
}

function AdminFilterButton({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <button
      className={[
        "inline-flex h-10 min-h-10 items-center justify-between gap-2 rounded-md border border-[#ffffff1a] bg-[#171717] px-3 py-2 text-sm text-[#8f8f8f] hover:bg-white/[0.04]",
        className,
      ].join(" ")}
      type="button"
    >
      <span className="truncate">{children}</span>
      <Icon className="size-4 rotate-90" name="chevron" />
    </button>
  );
}

function AdminExportButton({ children = "Export" }: { children?: ReactNode }) {
  return (
    <button className="inline-flex h-9 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg border border-[#ffffff1a] px-3 py-2 text-sm font-medium text-[#fafafa] hover:bg-white/[0.04]" type="button">
      <svg aria-hidden="true" className="size-4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <path d="M7 10l5 5 5-5" />
        <path d="M12 15V3" />
      </svg>
      {children}
    </button>
  );
}

function AdminCheckboxMock({ checked = false, indeterminate = false }: { checked?: boolean; indeterminate?: boolean }) {
  return (
    <span className="flex size-4 shrink-0 items-center justify-center rounded-sm border border-[#ffffff33] bg-transparent">
      {checked ? (
        <svg aria-hidden="true" className="size-3 text-[#fafafa]" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24">
          <path d="M20 6 9 17l-5-5" />
        </svg>
      ) : indeterminate ? (
        <span className="h-0.5 w-2.5 rounded-full bg-[#fafafa]" />
      ) : null}
    </span>
  );
}

function DlpCategoryGridMock({
  category,
  defaultOpen = false,
  description,
  infoTypes,
  selectedCount,
}: {
  category: string;
  defaultOpen?: boolean;
  description: string;
  infoTypes: string[];
  selectedCount: number;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const selected = new Set(infoTypes.slice(0, selectedCount));

  return (
    <div className="rounded-lg border border-[#ffffff1a] bg-[#171717]">
      <button
        className="flex w-full cursor-pointer items-center justify-between gap-4 p-4 text-left hover:bg-white/[0.04]"
        onClick={() => setOpen((current) => !current)}
        type="button"
      >
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-4">
            <h4 className="font-medium text-[#fafafa]">{category}</h4>
            <span className="text-sm text-[#8f8f8f]">
              {selectedCount}/{infoTypes.length}
            </span>
          </div>
          <p className="mt-1 text-sm text-[#8f8f8f]">{description}</p>
        </div>
        <Icon className={["size-4 text-[#8f8f8f] transition-transform", open ? "rotate-90" : ""].join(" ")} name="chevron" />
      </button>
      {open ? (
        <div className="px-4 pb-4">
          <div className="space-y-4 pt-2">
            <div className="flex items-center space-x-2 border-b border-[#ffffff1a] pb-2">
              <AdminCheckboxMock checked={selectedCount === infoTypes.length} indeterminate={selectedCount > 0 && selectedCount < infoTypes.length} />
              <span className="text-base font-medium text-[#fafafa]">Select All</span>
            </div>
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2 2xl:grid-cols-3">
              {infoTypes.map((infoType) => (
                <div className="flex min-w-0 flex-row items-center space-x-2" key={infoType}>
                  <AdminCheckboxMock checked={selected.has(infoType)} />
                  <span className="block max-w-[250px] truncate text-sm font-normal text-[#fafafa]" title={infoType}>
                    {infoType}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function DlpCustomRegexPatternMock({
  description,
  index,
  name,
  pattern,
}: {
  description: string;
  index: number;
  name: string;
  pattern: string;
}) {
  return (
    <div className="space-y-4 rounded-lg border border-[#ffffff1a] bg-[#171717] p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-[#fafafa]">Pattern #{index + 1}</span>
          {name ? <span className="text-xs text-[#8f8f8f]">{name}</span> : null}
        </div>
        <button className="inline-flex h-8 items-center justify-center rounded-lg px-3 text-sm text-[#fafafa] hover:bg-white/[0.08]" type="button">
          <svg aria-hidden="true" className="size-4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>
      </div>

      <div className="grid gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium leading-none text-[#fafafa]">
            InfoType name <span className="text-[#ef4444]">*</span>
          </label>
          <input
            className="flex h-10 w-full rounded-md border border-[#ffffff1a] bg-[#171717] px-3 py-2 text-base text-[#fafafa] outline-none placeholder:text-[#737373] md:text-sm"
            placeholder="EMPLOYEE_ID"
            readOnly
            value={name}
          />
          <p className="text-sm text-[#8f8f8f]">Unique identifier for this pattern (use UPPERCASE_WITH_UNDERSCORES)</p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium leading-none text-[#fafafa]">
            Regular expression pattern <span className="text-[#ef4444]">*</span>
          </label>
          <input
            className="flex h-10 w-full rounded-md border border-[#ffffff1a] bg-[#171717] px-3 py-2 font-mono text-base text-[#fafafa] outline-none placeholder:text-[#737373] md:text-sm"
            placeholder="EMP-[0-9]{6}"
            readOnly
            value={pattern}
          />
          <p className="text-sm text-[#8f8f8f]">Standard JavaScript regex pattern (avoid capture groups for performance)</p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium leading-none text-[#fafafa]">Description (optional)</label>
          <textarea
            className="flex min-h-16 w-full resize-none rounded-md border border-[#ffffff1a] bg-[#171717] px-3 py-2 text-base text-[#fafafa] outline-none placeholder:text-[#737373] md:text-sm"
            placeholder="Employee ID pattern (e.g., EMP-123456)"
            readOnly
            rows={2}
            value={description}
          />
        </div>
      </div>
    </div>
  );
}

function SecuritySettingsScreen() {
  const ipAcl = `# Office Network
192.168.1.0/24
10.0.0.0/8

# VPN Gateway
203.0.113.0/24

# Specific Allowed IPs
198.51.100.42
203.0.113.15`;

  const dlpSections: AdminSection[] = [
    {
      children: (
        <div className="space-y-4">
          <div className="flex justify-end gap-2">
            <button className="inline-flex h-8 items-center justify-center rounded-lg px-3 text-sm text-[#fafafa] hover:bg-white/[0.08]" type="button">
              Expand All
            </button>
            <button className="inline-flex h-8 items-center justify-center rounded-lg px-3 text-sm text-[#fafafa] hover:bg-white/[0.08]" type="button">
              Collapse All
            </button>
          </div>
          <div className="space-y-2">
            <DlpCategoryGridMock
              category="Credentials"
              defaultOpen
              description="Passwords, API keys, tokens, certificates, etc."
              infoTypes={["AUTH_TOKEN", "AWS_CREDENTIALS", "BASIC_AUTH_HEADER", "ENCRYPTION_KEY", "GCP_API_KEY", "HTTP_COOKIE", "JSON_WEB_TOKEN", "PASSWORD", "PRIVATE_KEY", "OAUTH_CLIENT_SECRET", "SSL_CERTIFICATE"]}
              selectedCount={7}
            />
            <DlpCategoryGridMock
              category="Government ID"
              description="Government-issued IDs, passports, driver licenses, social security numbers, etc."
              infoTypes={["PASSPORT", "DRIVER_LICENSE_NUMBER", "US_SOCIAL_SECURITY_NUMBER", "KOREA_RRN", "JAPAN_INDIVIDUAL_NUMBER", "NATIONAL_ID_NUMBER"]}
              selectedCount={2}
            />
            <DlpCategoryGridMock
              category="Sensitive Personal Information (SPII)"
              description="Financial accounts, credit cards, medical records, etc."
              infoTypes={["CREDIT_CARD_NUMBER", "CREDIT_CARD_TRACK_NUMBER", "IBAN_CODE", "MEDICAL_RECORD_NUMBER", "SWIFT_CODE", "BANK_ACCOUNT_NUMBER", "INSURANCE_POLICY_NUMBER", "TAXPAYER_IDENTIFICATION_NUMBER"]}
              selectedCount={5}
            />
            <DlpCategoryGridMock
              category="Demographic Information"
              description="Age, date of birth, person images, etc."
              infoTypes={["AGE", "DATE_OF_BIRTH", "GENDER", "ETHNIC_GROUP", "PERSON_IMAGE"]}
              selectedCount={1}
            />
            <DlpCategoryGridMock
              category="Personal Identifiable Information (PII)"
              description="Names, email addresses, phone numbers, IP addresses, etc."
              infoTypes={["PERSON_NAME", "EMAIL_ADDRESS", "PHONE_NUMBER", "IP_ADDRESS", "LOCATION", "STREET_ADDRESS", "MAC_ADDRESS", "URL", "USERNAME"]}
              selectedCount={6}
            />
            <DlpCategoryGridMock
              category="Other Information"
              description="Blood type, toll-free phone numbers, etc."
              infoTypes={["BLOOD_TYPE", "ORGANIZATION_NAME", "VEHICLE_IDENTIFICATION_NUMBER", "TOLL_FREE_PHONE_NUMBER"]}
              selectedCount={0}
            />
          </div>
          <div className="pt-4">
            <AdminSecondaryButton>Update DLP detection settings</AdminSecondaryButton>
          </div>
        </div>
      ),
      description: "Configure which types of sensitive data should be detected and protected by the DLP system.",
      label: "Sensitive data type detection",
    },
    {
      children: (
        <form className="space-y-6">
          <div className="space-y-6">
            <DlpCustomRegexPatternMock
              description="Employee ID pattern (e.g., EMP-123456)"
              index={0}
              name="EMPLOYEE_ID"
              pattern="EMP-[0-9]{6}"
            />
            <DlpCustomRegexPatternMock
              description="Internal contract number"
              index={1}
              name="CONTRACT_NUMBER"
              pattern="CTR-[A-Z]{2}-[0-9]{8}"
            />
          </div>

          <div className="flex flex-wrap justify-between gap-2 pt-4">
            <button className="inline-flex h-9 w-full items-center justify-center gap-1.5 whitespace-nowrap rounded-lg border border-[#ffffff1a] px-3 py-2 text-sm font-medium text-[#fafafa] hover:bg-white/[0.04] sm:w-auto" type="button">
              <Icon className="size-4" name="plus" />
              Add Custom Pattern
            </button>
            <button className="inline-flex h-9 w-full items-center justify-center gap-1.5 whitespace-nowrap rounded-lg border-none bg-[#2A2A2A] px-3 py-2 text-sm font-medium text-[#fafafa] opacity-50 sm:w-auto" disabled type="button">
              Update DLP Settings
            </button>
          </div>
        </form>
      ),
      description: "Configure custom regular expression patterns to detect specific sensitive data types in user inputs and AI outputs.",
      label: "Custom regex patterns",
    },
  ];

  return (
    <AdminPageShell subtitle="Manage security policies and access controls for your organization." title="Security Settings">
      <div className="space-y-8">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-[#fafafa]">Login and Authentication Security</h2>
          <AdminMultiSectionCard
            sections={[
              {
                children: (
                  <div className="space-y-4">
                    <textarea
                      className="min-h-[132px] w-full resize-none rounded-md border border-[#ffffff1a] bg-[#171717] px-3 py-2 font-mono text-sm text-[#d4d4d8] outline-none"
                      readOnly
                      value={ipAcl}
                    />
                    <AdminSecondaryButton>Update login IP ACL</AdminSecondaryButton>
                  </div>
                ),
                description: "Define IP address ranges that are allowed to access your organization login. Leave empty to allow all IPs.",
                label: "Login IP access control list (ACL)",
              },
            ]}
            title=""
          />
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-[#fafafa]">Data Loss Prevention (DLP)</h2>
          <AdminMultiSectionCard sections={dlpSections} title="" />
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-[#fafafa]">Chat History Management</h2>
          <AdminMultiSectionCard
            sections={[
              {
                children: (
                  <div className="flex flex-wrap items-center gap-2">
                    <AdminFilterButton className="w-56 text-[#fafafa]">3 Years (1,095 days)</AdminFilterButton>
                    <AdminSecondaryButton>Update</AdminSecondaryButton>
                  </div>
                ),
                description: "Set the period for retaining chat history in your organization. Chat history older than the retention period will be automatically deleted.",
                label: "Retention period",
              },
            ]}
            title=""
          />
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-[#fafafa]">Chat Execution Policy</h2>
          <AdminMultiSectionCard
            sections={[
              {
                children: (
                  <form className="space-y-4">
                    <div className="flex flex-col gap-4 sm:flex-row">
                      <AdminNumberInput label="Default limit" value={80} />
                      <AdminNumberInput label="Maximum limit" value={160} />
                    </div>
                    <button
                      className="inline-flex h-9 w-full items-center justify-center gap-1.5 whitespace-nowrap rounded-lg border-none bg-[#2A2A2A] px-3 py-2 text-sm font-medium text-[#fafafa] opacity-50 sm:w-auto"
                      disabled
                      type="button"
                    >
                      Update
                    </button>
                  </form>
                ),
                description: "Set the organization default and maximum recursion limit for chat. Users can override their personal value up to the organization maximum.",
                label: "Recursion limit policy",
              },
            ]}
            title=""
          />
        </div>
      </div>
    </AdminPageShell>
  );
}

function SandboxScreen() {
  return (
    <AdminPageShell subtitle="Manage sandbox environment settings for your organization." title="Sandbox">
      <form className="w-full">
        <div className="w-full">
          <AdminMultiSectionCard
            sections={[
              {
                children: (
                  <textarea
                    className="min-h-[160px] w-full resize-none rounded-md border border-[#ffffff1a] bg-[#171717] px-3 py-2 font-mono text-sm text-[#d4d4d8] outline-none placeholder:text-[#737373]"
                    readOnly
                    value={`api.openai.com
*.googleapis.com
slack.com:443
github.com
*.atlassian.net`}
                  />
                ),
                description: "Specify external hosts that are allowed to be accessed from the sandbox.",
                label: (
                  <h3 className="flex items-center gap-1.5 font-semibold tracking-tight text-[#fafafa]">
                    Allowed outbound hosts
                    <svg aria-hidden="true" className="size-4 text-[#8f8f8f]" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 16v-4" />
                      <path d="M12 8h.01" />
                    </svg>
                  </h3>
                ),
              },
              {
                children: null,
                description: "Enables users to instantly allow blocked hosts while using the sandbox.",
                label: "Dynamic host allow",
                action: <ToggleSwitchMock checked />,
              },
            ]}
            title=""
          />
        </div>
        <div className="pt-4">
          <button className="inline-flex h-9 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg border-none bg-[#2A2A2A] px-3 py-2 text-sm font-medium text-[#fafafa] transition-all hover:bg-[#2A2A2A]/60" type="button">
            Update sandbox settings
          </button>
        </div>
      </form>
    </AdminPageShell>
  );
}

function EdgeTunnelScreen() {
  const [activeTunnelTab, setActiveTunnelTab] = useState<"organization" | "personal">("organization");
  const organizationTunnels = [
    {
      created: "06/20/2026, 12:00:00 AM",
      key: "qp-org-****-8f2c",
      name: "Production Services",
      servers: [
        ["aip-prod-gateway-01", "10.24.1.18", "Ubuntu 22.04", "06/24/2026, 12:00:00 AM"],
        ["aip-prod-worker-02", "10.24.1.42", "Amazon Linux 2023", "06/25/2026, 12:00:00 AM"],
      ],
    },
    {
      created: "06/18/2026, 12:00:00 AM",
      key: "qp-org-****-41bd",
      name: "Development Environment",
      servers: [["dev-mcp-host-01", "10.33.0.17", "macOS 15.5", "06/26/2026, 12:00:00 AM"]],
    },
  ];
  const personalTunnels = [
    { created: "06/28/2026, 12:00:00 AM", hostname: "mina-macbook-pro", ip: "192.168.10.24", os: "macOS 15.5", username: "mina.park" },
    { created: "06/27/2026, 12:00:00 AM", hostname: "finance-workstation-02", ip: "10.12.4.82", os: "Windows 11 Pro", username: "daniel.kim" },
    { created: "06/26/2026, 12:00:00 AM", hostname: "analytics-dev-laptop", ip: "172.16.8.31", os: "Ubuntu 22.04", username: "sarah.lee" },
  ];

  return (
    <AdminPageShell
      action={
        <button
          className={[
            "inline-flex h-9 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg border-none bg-[#2A2A2A] px-3 py-2 text-sm font-medium text-[#fafafa] hover:bg-[#2A2A2A]/60",
            activeTunnelTab === "personal" ? "cursor-not-allowed opacity-50 hover:bg-[#2A2A2A]" : "",
          ].join(" ")}
          disabled={activeTunnelTab === "personal"}
          type="button"
        >
          <Icon className="size-4" name="plus" />
          Create Organization Tunnel
        </button>
      }
      subtitle="Manage your organization's edge tunnels for secure connectivity"
      title="Edge Tunnel"
    >
      <div className="mt-4 w-full">
        <div className="mb-4 inline-flex h-auto items-center justify-center gap-5 rounded-none bg-transparent p-0">
          {[
            ["organization", "Organization Tunnels"],
            ["personal", "Personal Tunnels"],
          ].map(([tab, label]) => {
            const active = activeTunnelTab === tab;
            return (
              <button
                className={[
                  "inline-flex items-center justify-center whitespace-nowrap rounded-none border-b-2 pb-1.5 text-sm ring-offset-[#171717] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0090FF] focus-visible:ring-offset-2",
                  active ? "border-[#fafafa] text-[#fafafa]" : "border-transparent text-[#8f8f8f] hover:text-[#fafafa]",
                ].join(" ")}
                key={tab}
                onClick={() => setActiveTunnelTab(tab as "organization" | "personal")}
                type="button"
              >
                {label}
              </button>
            );
          })}
        </div>
        {activeTunnelTab === "organization" ? (
          <div className="mt-4 space-y-6">
            {organizationTunnels.map((group) => (
              <div className="rounded-lg border border-[#ffffff1a] bg-[#212121] p-6" key={group.name}>
                <div className="border-b border-[#ffffff1a] pb-4">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-medium text-[#fafafa]">{group.name}</h3>
                      <AdminBadge variant="success">{group.servers.length} server(s) connected</AdminBadge>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="inline-flex h-8 items-center rounded-lg border border-[#ffffff1a] px-3 text-sm text-[#fafafa] hover:bg-white/[0.04]" type="button">Install Edge Tunnel</button>
                      <button className="inline-flex size-8 items-center justify-center rounded-lg bg-[#ef4444] text-white hover:bg-[#ef4444]/80" type="button">
                        <svg aria-hidden="true" className="size-4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
                          <path d="M3 6h18" />
                          <path d="M8 6V4h8v2" />
                          <path d="M19 6l-1 14H6L5 6" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-8">
                    <div>
                      <div className="text-sm font-medium text-[#8f8f8f]">Authentication Key</div>
                      <div className="mt-1 font-mono text-sm text-[#fafafa]">{group.key}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-[#8f8f8f]">Created</div>
                      <div className="mt-1 text-sm text-[#fafafa]">{group.created}</div>
                    </div>
                  </div>
                </div>
                <div className="space-y-3 pt-4">
                  <p className="text-sm font-medium text-[#8f8f8f]">Connected Servers</p>
                  {group.servers.map(([host, ip, os, created]) => (
                    <div className="rounded-lg bg-[#2a2a2a]/60 p-3 hover:bg-[#2a2a2a]" key={host}>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-5">
                          <span className="size-3 shrink-0 rounded-full bg-[#22c55e]" />
                          <div>
                            <h4 className="font-medium text-[#fafafa]">{host}</h4>
                            <div className="mt-1 flex flex-wrap items-center gap-x-6 gap-y-1 text-sm text-[#8f8f8f]">
                              <p><span className="font-medium">IP:</span> {ip}</p>
                              <p><span className="font-medium">OS:</span> {os}</p>
                              <p><span className="font-medium">Created:</span> {created}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-4 space-y-4">
            {personalTunnels.map((tunnel) => (
              <div className="rounded-lg border border-[#ffffff1a] bg-[#212121] p-6" key={tunnel.hostname}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="size-3 rounded-full bg-[#22c55e]" />
                    <div>
                      <h3 className="text-lg font-medium text-[#fafafa]">{tunnel.hostname}</h3>
                    </div>
                  </div>
                  <button className="inline-flex size-9 items-center justify-center rounded-lg bg-[#ef4444] text-white hover:bg-[#ef4444]/80" type="button">
                    <svg aria-hidden="true" className="size-4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M3 6h18" />
                      <path d="M8 6V4h8v2" />
                      <path d="M19 6l-1 14H6L5 6" />
                    </svg>
                  </button>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-8">
                  <div>
                    <div className="text-sm font-medium text-[#8f8f8f]">Username</div>
                    <div className="mt-1 text-sm text-[#fafafa]">{tunnel.username}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-[#8f8f8f]">IP</div>
                    <div className="mt-1 text-sm text-[#fafafa]">{tunnel.ip}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-[#8f8f8f]">OS</div>
                    <div className="mt-1 text-sm text-[#fafafa]">{tunnel.os}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-[#8f8f8f]">Created</div>
                    <div className="mt-1 text-sm text-[#fafafa]">{tunnel.created}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminPageShell>
  );
}

function DlpLogsScreen() {
  const rows = [
    ["06/28/2026, 02:16:00 PM", "mina.park@querypie.com", "attempt", "Organization DLP policy violation detected", ["CREDIT_CARD_NUMBER", "EMAIL_ADDRESS"], ["FINANCIAL", "PII"], "VERY LIKELY", "Agent Chat"],
    ["06/28/2026, 01:22:00 PM", "daniel.kim@querypie.com", "sent", "-", ["PHONE_NUMBER"], ["PII"], "LIKELY", "General Chat"],
    ["06/27/2026, 05:08:00 PM", "sarah.lee@querypie.com", "attempt", "Customer record detected in prompt", ["PERSON_NAME", "LOCATION"], ["PII"], "POSSIBLE", "Agent Chat"],
    ["06/27/2026, 03:41:00 PM", "alex.chen@querypie.com", "sent", "-", ["US_SOCIAL_SECURITY_NUMBER"], ["SENSITIVE"], "LIKELY", "Agent Chat"],
    ["06/26/2026, 06:12:00 PM", "yuna.kim@querypie.com", "attempt", "Financial account number found in chat output", ["IBAN_CODE", "CREDIT_CARD_NUMBER"], ["FINANCIAL"], "VERY LIKELY", "General Chat"],
  ];

  return (
    <AdminPageShell
      subtitle="Monitor and prevent sensitive data breaches. Please refer to official documentation for more details. · Logs are retained for 12 months."
      title="Data Loss Prevention Logs"
    >
      <div className="space-y-4">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-col gap-2">
            <div className="grid w-full grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-2 sm:flex sm:w-auto sm:items-center">
              <AdminFilterButton className="w-full sm:w-44">User</AdminFilterButton>
              <AdminFilterButton className="w-full sm:w-[7.5rem]">All Actions</AdminFilterButton>
              <AdminFilterButton className="w-full sm:w-48">Categories / types</AdminFilterButton>
              <AdminFilterButton className="w-full sm:w-40">Likelihood</AdminFilterButton>
            </div>
            <div className="grid w-full grid-cols-[minmax(0,1fr)_auto] gap-2 sm:flex sm:w-auto sm:items-center">
              <button className="inline-flex h-10 min-h-10 items-center justify-start gap-1.5 rounded-md border border-[#ffffff1a] bg-[#171717] px-3 py-2 text-left text-sm font-medium text-[#fafafa] hover:bg-white/[0.04]" type="button">
                <svg aria-hidden="true" className="mr-1 size-4 text-[#8f8f8f]" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M8 2v4" /><path d="M16 2v4" /><rect height="18" rx="2" width="18" x="3" y="4" /><path d="M3 10h18" />
                </svg>
                <span className="text-[#8f8f8f]">Select date range</span>
                <Icon className="ml-1 size-4 rotate-90 text-[#8f8f8f]" name="chevron" />
              </button>
              <button className="inline-flex h-10 min-h-10 items-center justify-center gap-1.5 whitespace-nowrap rounded-md border border-[#ffffff1a] bg-[#171717] px-3 py-2 text-sm font-medium text-[#fafafa] opacity-50" disabled type="button">
                <span className="hidden sm:inline">Reset</span>
              </button>
            </div>
          </div>
          <AdminExportButton />
        </div>
        <AdminDataTable
          columns={["Timestamp", "User", "Action", "Reason", "Data Types", "Categories", "Max Likelihood", "Chat Type"]}
          columnClassNames={["w-48", "w-64", "w-[400px]", "min-w-[180px]", "w-56", "min-w-[160px]", "min-w-[150px]", "min-w-[180px]"]}
          minWidth={1580}
          rows={rows.map(([time, email, action, reason, types, categories, likelihood, chatType]) => [
            <span className="whitespace-nowrap text-sm" key="time">{time as string}</span>,
            <span className="whitespace-nowrap text-sm" key="email">{email as string}</span>,
            <span className="flex items-center gap-2 whitespace-nowrap text-sm text-[#fafafa]" key="action">
              {(action as string) === "attempt" ? (
                <>
                  <svg aria-hidden="true" className="size-4 text-[#ef4444]" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.68-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
                  </svg>
                  <span>Sensitive Data Blocked</span>
                </>
              ) : (
                <>
                  <svg aria-hidden="true" className="size-4 text-[#f97316]" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
                    <path d="M12 9v4" />
                    <path d="M12 17h.01" />
                  </svg>
                  <span>Sensitive Data Sent</span>
                </>
              )}
            </span>,
            <span className="block max-w-[200px] truncate text-sm" key="reason">{reason as string}</span>,
            <AdminBadgeListWithCount items={types as string[]} key="types" mono />,
            <AdminBadgeListWithCount items={categories as string[]} key="cat" />,
            <AdminBadge
              key="likelihood"
              variant={(likelihood as string).includes("LIKELY") ? "red" : likelihood === "POSSIBLE" ? "warning" : "success"}
            >
              {likelihood as string}
            </AdminBadge>,
            <AdminBadge key="chat" variant="outline">{chatType as string}</AdminBadge>,
          ])}
        />
        <UsagePagination label="1 - 5 of 5" />
      </div>
    </AdminPageShell>
  );
}

function AuditLogsScreen() {
  const rows = [
    ["06/28/2026, 02:16:00 PM", "Mina Park", "Owner", "203.0.113.42", [{ color: "#3B82F6", label: "dept: finance" }], "Login Success", "Mina Park successfully logged in"],
    ["06/28/2026, 01:42:00 PM", "Daniel Kim", "Admin", "198.51.100.15", [{ color: "#F59E0B", label: "dept: sales" }], "MCP Integration Updated", "Daniel Kim updated integration configuration"],
    ["06/27/2026, 03:04:00 PM", "Alex Chen", "Member", "192.0.2.24", [{ color: "#8B5CF6", label: "region: apac" }], "Organization User Added", "Alex Chen added a new team member"],
    ["06/27/2026, 05:31:00 PM", "Sarah Lee", "AI Operator", "203.0.113.88", [{ color: "#10B981", label: "team: operations" }], "LLM Tool Call Success", "LLM tool execution completed successfully"],
  ];

  return (
    <AdminPageShell subtitle="Monitor and track all organization activities. · Logs are retained for 12 months." title="Audit Logs">
      <div className="space-y-4">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-col gap-2">
            <div className="grid w-full grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-2 sm:flex sm:w-auto sm:items-center">
              <AdminFilterButton className="w-full sm:w-44">User</AdminFilterButton>
              <AdminFilterButton className="w-full sm:w-44">Select tags</AdminFilterButton>
              <AdminFilterButton className="w-full sm:w-48">Select event type</AdminFilterButton>
            </div>
            <div className="grid w-full grid-cols-[minmax(0,1fr)_auto] gap-2 sm:flex sm:w-auto sm:items-center">
              <button className="inline-flex h-10 min-h-10 items-center justify-start gap-1.5 rounded-md border border-[#ffffff1a] bg-[#171717] px-3 py-2 text-left text-sm font-medium text-[#fafafa] hover:bg-white/[0.04]" type="button">
                <svg aria-hidden="true" className="mr-1 size-4 text-[#8f8f8f]" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M8 2v4" /><path d="M16 2v4" /><rect height="18" rx="2" width="18" x="3" y="4" /><path d="M3 10h18" />
                </svg>
                <span className="text-[#8f8f8f]">Select date range</span>
                <Icon className="ml-1 size-4 rotate-90 text-[#8f8f8f]" name="chevron" />
              </button>
              <button className="inline-flex h-10 min-h-10 items-center justify-center gap-1.5 whitespace-nowrap rounded-md border border-[#ffffff1a] bg-[#171717] px-3 py-2 text-sm font-medium text-[#fafafa] opacity-50" disabled type="button">
                <span className="hidden sm:inline">Reset</span>
              </button>
            </div>
          </div>
          <AdminExportButton />
        </div>
        <AdminDataTable
          columns={["Time", "User", "Tags", "Event Information"]}
          columnClassNames={["w-[230px]", "w-[210px]", "w-[150px]", "w-[426px]"]}
          minWidth={1016}
          tableFixed
          rows={rows.map(([time, name, role, ip, tags, event, description]) => [
            <span className="whitespace-nowrap text-sm" key="time">{time as string}</span>,
            <div className="flex flex-row items-center gap-2" key="user">
              <RoleDisplayMock role={role as string} />
              <div className="flex min-w-0 flex-col gap-0.5">
                <span className="whitespace-nowrap text-sm font-medium text-[#fafafa]">{name as string}</span>
                <span className="whitespace-nowrap text-xs text-[#8f8f8f]">{ip as string}</span>
              </div>
            </div>,
            <div className="flex h-6 items-center gap-1 overflow-hidden" key="tags">
              {(tags as Array<{ color: string; label: string }>).length
                ? (tags as Array<{ color: string; label: string }>).map((tag) => (
                  <UserTagBadge color={tag.color} key={tag.label}>{tag.label}</UserTagBadge>
                ))
                : "-"}
            </div>,
            <div className="flex w-full flex-col gap-0.5 truncate" key="event">
              <span className="truncate text-sm font-medium text-[#fafafa]">{event as string}</span>
              <span className="truncate text-sm text-[#8f8f8f]" title={description as string}>{description as string}</span>
            </div>,
          ])}
        />
        <UsagePagination label="1 - 4 of 4" />
      </div>
    </AdminPageShell>
  );
}

function AdminContent({ activeAdminPage }: { activeAdminPage: string }) {
  if (activeAdminPage === "agent") return <AdminAgentScreen />;
  if (activeAdminPage === "knowledge") return <AdminKnowledgeScreen />;
  if (activeAdminPage === "llm-models") return <AdminLlmModelsScreen />;
  if (activeAdminPage === "mcp") return <AdminMcpIntegrationsScreen />;
  if (activeAdminPage === "skills") return <AdminSkillsScreen />;
  if (activeAdminPage === "users") return <UsersScreen />;
  if (activeAdminPage === "sso") return <SsoScreen />;
  if (activeAdminPage === "billing") return <BillingScreen />;
  if (activeAdminPage === "credits-history") return <CreditsHistoryScreen />;
  if (activeAdminPage === "credit-quota") return <CreditLimitsScreen />;
  if (activeAdminPage === "usage-analytics") return <UsageAnalyticsScreen />;
  if (activeAdminPage === "access-control") return <SecuritySettingsScreen />;
  if (activeAdminPage === "sandbox") return <SandboxScreen />;
  if (activeAdminPage === "edge-tunnel") return <EdgeTunnelScreen />;
  if (activeAdminPage === "dlp-logs") return <DlpLogsScreen />;
  if (activeAdminPage === "audit-logs") return <AuditLogsScreen />;
  if (activeAdminPage === "general") return <AdminScreen />;
  return <DashboardScreen />;
}

function AdminScreen() {
  const organizationSections: AdminSection[] = [
    {
      children: <AdminInput value="QueryPie Demo Workspace" />,
      description: "Update your organization's display name.",
      label: "Organization Name",
    },
    {
      children: (
        <div className="space-y-2">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#fafafa]">Light Mode Logo</label>
              <div className="flex items-center gap-2">
                <AdminLogoInput />
                <AdminUploadButton>Upload Logo</AdminUploadButton>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#fafafa]">Dark Mode Logo</label>
              <div className="flex items-center gap-2">
                <AdminLogoInput dark />
                <AdminUploadButton>Upload Logo</AdminUploadButton>
              </div>
            </div>
          </div>
          <button className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg px-3 text-sm font-medium text-[#fafafa] hover:bg-white/[0.08]" type="button">
            <Icon className="size-4 rotate-90" name="chevron" />
            Logo Guidelines
          </button>
        </div>
      ),
      description: "Upload logo images for your organization. These will be displayed in the top navigation bar.",
      label: (
        <div className="flex items-center gap-2">
          <h3 className="font-semibold tracking-tight text-[#fafafa]">Organization logos</h3>
        </div>
      ),
    },
    {
      children: (
        <div className="flex items-center gap-4">
          <AdminIconInput />
          <div className="flex flex-col items-start gap-2">
            <AdminUploadButton>Upload Icon</AdminUploadButton>
            <span className="text-sm text-[#8f8f8f]">PNG only, max 128KB, 1:1 aspect ratio (square)</span>
          </div>
        </div>
      ),
      description: "Upload a square icon for your organization. Used for mobile web, collapsed sidebar, and favicon.",
      label: (
        <div className="flex items-center gap-2">
          <h3 className="font-semibold tracking-tight text-[#fafafa]">Organization icon</h3>
        </div>
      ),
    },
    {
      children: (
        <div className="flex max-w-md items-center gap-2">
          <AdminInput readOnly value="8b02834242c04254a5a04ed2c5fcb3b3" />
          <button
            aria-label="Copy organization ID"
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center gap-1.5 rounded-lg border border-[#ffffff1a] p-1.5 text-sm font-medium text-[#fafafa] opacity-50"
            type="button"
          >
            <svg aria-hidden="true" className="size-4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
              <rect height="14" rx="2" ry="2" width="14" x="8" y="8" />
              <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
            </svg>
          </button>
        </div>
      ),
      description: "Used to identify your organization. This cannot be changed.",
      label: "Organization ID",
    },
  ];

  return (
    <section className="flex min-w-0 flex-1 flex-col overflow-auto bg-[#171717] px-6 py-6 text-[#fafafa]">
      <header className="mb-[30px] flex min-w-0 flex-wrap items-start gap-4">
        <div className="w-full">
          <div className="flex w-full items-center gap-1">
            <h1 className="text-3xl font-medium leading-9 text-[#fafafa]">General Settings</h1>
          </div>
          <p className="mt-1 text-sm leading-5 text-[#8f8f8f]">Manage your organization settings and preferences.</p>
        </div>
      </header>

      <div className="flex max-w-[920px] flex-col gap-6 md:gap-8">
        <form>
          <div className="flex flex-col items-end gap-2">
            <div className="w-full">
              <AdminMultiSectionCard sections={organizationSections} title="Organization Basic Information" />
            </div>
            <button
              className="inline-flex h-9 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg border-none bg-[#2A2A2A] px-3 py-2 text-sm font-medium text-[#fafafa] opacity-50"
              type="button"
            >
              Save Changes
            </button>
          </div>
        </form>

        <AdminDangerCard
          description="Transfer the ownership of this organization to another user."
          label="Transfer organization ownership"
          title="Danger Zone"
        >
          <div className="space-y-6">
            <AdminAlert title="Important information before transferring ownership" variant="destructive">
              <ul className="list-inside list-disc space-y-1">
                <li>
                  When you transfer ownership to another user, billing management permissions will also be transferred,
                  and you will lose access to billing.
                </li>
                <li>
                  If you need to update your card information or schedule a subscription cancellation, please do so
                  before transferring ownership.
                </li>
              </ul>
            </AdminAlert>
            <form className="flex max-w-md gap-2">
              <input
                className="flex h-10 w-full rounded-md border border-[#ffffff1a] bg-[#171717] px-3 py-2 text-base text-[#fafafa] outline-none placeholder:text-[#737373] md:text-sm"
                placeholder="Enter new owner's email"
                readOnly
              />
              <button
                className="inline-flex h-9 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg border-none bg-[#ef4444] px-3 py-2 text-sm font-medium text-white opacity-50"
                type="button"
              >
                Transfer
              </button>
            </form>
          </div>
        </AdminDangerCard>
      </div>
    </section>
  );
}

function McpScreen() {
  const [activeTab, setActiveTab] = useState<"all" | "installed">("all");
  const [installedViewMode, setInstalledViewMode] = useState<"cards" | "table">("cards");

  return (
    <section className="flex min-w-0 flex-1 flex-col overflow-auto bg-[#171717] px-6 py-6 text-[#fafafa]">
      <header className="mb-[30px] flex min-w-0 items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex w-full items-center gap-1">
            <h1 className="text-3xl font-medium leading-9 text-[#fafafa]">MCP</h1>
          </div>
          <p className="mt-1 text-sm leading-5 text-[#8f8f8f]">Connect apps and APIs to share context.</p>
        </div>
        <button
          className="inline-flex h-9 shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg border border-[#ffffff1a] bg-[#2a2a2a] px-3 py-2 text-sm font-medium text-[#fafafa] transition-colors hover:bg-[#343434]"
          type="button"
        >
          <Icon className="size-4" name="plus" />
          Custom MCP
        </button>
      </header>

      <div className="mb-5 inline-flex h-auto items-center justify-center gap-5 self-start rounded-none bg-transparent p-0 text-[#8f8f8f]">
        <button
          className={[
            "inline-flex items-center justify-center whitespace-nowrap rounded-none border-b-2 pb-1.5 text-sm transition-all",
            activeTab === "all"
              ? "border-[#e5e5e5] text-[#e5e5e5]"
              : "border-transparent text-[#8f8f8f] hover:text-[#fafafa]",
          ].join(" ")}
          onClick={() => setActiveTab("all")}
          type="button"
        >
          All Integrations
        </button>
        <button
          className={[
            "inline-flex items-center justify-center whitespace-nowrap rounded-none border-b-2 pb-1.5 text-sm transition-all",
            activeTab === "installed"
              ? "border-[#e5e5e5] text-[#e5e5e5]"
              : "border-transparent text-[#8f8f8f] hover:text-[#fafafa]",
          ].join(" ")}
          onClick={() => setActiveTab("installed")}
          type="button"
        >
          Installed Integrations
        </button>
      </div>

      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="relative w-64 shrink-0">
          <Icon
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#8f8f8f]"
            name="search"
          />
          <input
            className="flex h-10 w-full rounded-md border border-[#ffffff1a] bg-[#171717] px-3 py-2 pl-9 text-base text-[#fafafa] outline-none placeholder:text-[#737373] focus-visible:ring-2 focus-visible:ring-[#0090FF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#171717] md:text-sm"
            placeholder="Search integrations"
            readOnly
            type="search"
          />
        </div>
        {activeTab === "installed" ? (
          <div
            aria-label="View mode"
            className="inline-flex h-9 items-center rounded-lg border border-[#ffffff1a] bg-[#1f1f1f] p-1"
            role="group"
          >
            <button
              aria-label="Table view"
              className={[
                "inline-flex size-7 items-center justify-center rounded-md text-[#8f8f8f] transition-colors",
                installedViewMode === "table" ? "bg-[#333333] text-[#fafafa]" : "hover:bg-white/[0.06] hover:text-[#fafafa]",
              ].join(" ")}
              onClick={() => setInstalledViewMode("table")}
              type="button"
            >
              <Icon className="size-4" name="list" />
            </button>
            <button
              aria-label="Card view"
              className={[
                "inline-flex size-7 items-center justify-center rounded-md text-[#8f8f8f] transition-colors",
                installedViewMode === "cards" ? "bg-[#333333] text-[#fafafa]" : "hover:bg-white/[0.06] hover:text-[#fafafa]",
              ].join(" ")}
              onClick={() => setInstalledViewMode("cards")}
              type="button"
            >
              <Icon className="size-4" name="grid" />
            </button>
          </div>
        ) : (
          <span />
        )}
      </div>

      <div className="mt-5 flex min-h-0 flex-1 gap-x-10 gap-y-[30px]">
        {activeTab === "all" ? (
        <aside className="hidden w-60 shrink-0 self-start xl:block">
          <nav className="flex flex-col gap-1 text-sm">
            {managedMcpGroups.map((group) => (
              <a
                className="block rounded-lg px-3 py-2.5 text-left text-sm text-[#fafafa] no-underline transition-colors hover:bg-white/[0.08]"
                href={`#${group.id}`}
                key={group.id}
              >
                {group.name}
              </a>
            ))}
          </nav>
        </aside>
        ) : null}

        <div className="min-w-0 flex-1 space-y-5">
          {activeTab === "installed" ? (
            installedViewMode === "cards" ? (
              <div className="grid auto-rows-max grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                {installedMcpItems.map((item) => (
                  <div
                    className="flex min-h-[136px] cursor-pointer flex-col rounded-[10px] border border-[#ffffff1a] bg-[#ffffff0d] p-0 text-left text-[#fafafa] transition-colors duration-150 hover:bg-[#ffffff17]"
                    key={item.id}
                  >
                    <div className="flex flex-col space-y-[unset] px-5 pb-1.5 pt-2.5">
                      <div className="flex h-[46px] w-full items-center justify-between gap-2.5">
                        <div className="flex min-w-0 items-center space-x-2">
                          <div className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#f5f5f5]">
                            <img
                              alt=""
                              className="size-7 object-contain"
                              loading="lazy"
                              src={`/assets/products/aip/integrations/${item.id}.svg`}
                            />
                          </div>
                          <div className="min-w-0 flex-1 overflow-hidden">
                            <h3 className="truncate text-[18px] font-medium tracking-tight text-[#fafafa]">
                              {item.name}
                            </h3>
                          </div>
                        </div>
                        <ToggleSwitchMock checked={item.enabled ?? true} />
                      </div>
                    </div>
                    <div className="flex h-auto w-full flex-col px-5 py-0">
                      <p className="line-clamp-2 h-8 text-xs leading-4 text-[#8f8f8f]">{item.description}</p>
                    </div>
                    <div className="mt-auto flex h-7 items-end px-5 pb-[18px] pt-0" />
                  </div>
                ))}
              </div>
            ) : (
              <AdminDataTable
                bordered={false}
                columns={["Name", "Description", "Enabled", "Installed At", "Uninstall"]}
                columnClassNames={["w-[220px]", "w-[360px]", "w-[90px]", "w-[150px]", "w-[90px]"]}
                minWidth={910}
                rows={installedMcpItems.map((item, index) => [
                  <div className="flex min-w-0 items-center gap-3" key="name">
                    <div className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#f5f5f5]">
                      <img alt="" className="size-7 object-contain" src={`/assets/products/aip/integrations/${item.id}.svg`} />
                    </div>
                    <span className="line-clamp-2 font-medium text-[#fafafa]">{item.name}</span>
                  </div>,
                  <span className="line-clamp-2 text-sm text-[#8f8f8f]" key="description">{item.description}</span>,
                  <ToggleSwitchMock checked={item.enabled ?? true} key="enabled" />,
                  <span className="whitespace-nowrap text-sm text-[#d4d4d8]" key="installedAt">
                    {[
                      "06/28/2026, 10:14:00 AM",
                      "06/27/2026, 04:32:00 PM",
                      "06/26/2026, 02:35:00 PM",
                      "06/25/2026, 11:04:00 AM",
                      "06/24/2026, 05:18:00 PM",
                    ][index % 5]}
                  </span>,
                  <button aria-label="Uninstall" className="inline-flex size-8 items-center justify-center rounded-lg text-[#8f8f8f] hover:bg-white/[0.04]" key="uninstall" type="button">
                    <Icon className="size-4" name="trash" />
                  </button>,
                ])}
              />
            )
          ) : managedMcpGroups.map((group) => (
            <section className="scroll-mt-[56px]" id={group.id} key={group.id}>
              <h2 className="mb-2.5 text-base font-medium text-[#fafafa]">{group.name}</h2>
              <div className="grid auto-rows-max grid-cols-1 gap-2.5 lg:grid-cols-2">
                {group.items.map((item) => (
                  <button
                    className="flex min-h-[136px] flex-col rounded-[10px] border border-[#ffffff1a] bg-[#ffffff0d] p-0 text-left text-[#fafafa] transition-colors duration-150 hover:bg-[#ffffff17]"
                    key={item.id}
                    type="button"
                  >
                    <div className="flex flex-col space-y-[unset] px-5 pb-1.5 pt-2.5">
                      <div className="flex h-[46px] w-full items-center justify-between gap-2.5">
                        <div className="flex min-w-0 items-center space-x-2">
                          <div className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#f5f5f5]">
                            <img
                              alt=""
                              className="size-7 object-contain"
                              loading="lazy"
                              src={`/assets/products/aip/integrations/${item.id}.svg`}
                            />
                          </div>
                          <div className="min-w-0 flex-1 overflow-hidden">
                            <h3 className="truncate text-[18px] font-medium tracking-tight text-[#fafafa]">
                              {item.name}
                            </h3>
                          </div>
                        </div>
                        {installedMcpItemIds.has(item.id) ? (
                          <span className="inline-flex min-w-0 shrink-0 items-center whitespace-nowrap rounded-lg border border-[#0090ff80] bg-[#0090ff1a] px-1.5 py-[3px] text-xs text-[#fafafa]">
                            Installed
                          </span>
                        ) : null}
                      </div>
                    </div>
                    <div className="flex h-auto w-full flex-col px-5 py-0">
                      <p className="line-clamp-2 h-8 text-xs leading-4 text-[#8f8f8f]">{item.description}</p>
                    </div>
                    <div className="mt-auto flex items-center px-5 pb-[18px] pt-0">
                      <div className="flex h-7 items-end" />
                    </div>
                  </button>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </section>
  );
}

function NewChatScreen({ activeAgentId, activeChatTitle }: { activeAgentId: string | null; activeChatTitle: string | null }) {
  if (activeAgentId) {
    return (
      <section className="flex h-full min-h-0 flex-col bg-[#121212]">
        <div className="min-h-0 flex-1">
          <div className="relative h-full w-full flex-1 grow overflow-hidden">
            <div className="flex h-full w-full flex-col">
              <div className="flex min-h-0 flex-1 flex-col">
                <AgentChatStartScreen agentId={activeAgentId} />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (activeChatTitle === "Revenue dashboard analysis") {
    return <RevenueArtifactChatScreen />;
  }

  if (activeChatTitle === "Support operations widgets") {
    return (
      <section className="flex h-full min-h-0 flex-col bg-[#121212]">
        <div className="min-h-0 flex-1">
          <div className="relative h-full w-full flex-1 grow overflow-hidden">
            <div className="flex h-full w-full flex-col">
              <div className="flex min-h-0 flex-1 flex-col">
                <SupportWidgetsChatConversation />
                <PresetChatForm />
                <div aria-hidden="true" className="h-5" />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="flex h-full min-h-0 flex-col bg-[#121212]">
      <div className="min-h-0 flex-1">
        <div className="relative h-full w-full flex-1 grow overflow-hidden">
          <div className="flex h-full w-full flex-col">
            <div className="flex min-h-0 flex-1 flex-col">
              {activeChatTitle ? (
                <VisualizationChatConversation chatTitle={activeChatTitle} />
              ) : (
                <ExampleChatConversation />
              )}
              <PresetChatForm />
              <div aria-hidden="true" className="h-5" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function AipMockupShell({
  className,
  frameHeight,
  withShadow = true,
}: {
  className?: string;
  frameHeight?: number;
  withShadow?: boolean;
}) {
  const [activeMenu, setActiveMenu] = useState("chat");
  const [activeAdminPage, setActiveAdminPage] = useState("dashboard");
  const [activeAgentId, setActiveAgentId] = useState<string | null>(null);
  const [activeChatTitle, setActiveChatTitle] = useState<string | null>(null);

  const openMenu = (menu: string) => {
    if (menu === "admin") {
      setActiveAdminPage("dashboard");
    }
    setActiveAgentId(null);
    setActiveChatTitle(null);
    setActiveMenu(menu);
  };

  const openAdminPage = (page: string) => {
    setActiveAdminPage(page);
    setActiveMenu("admin");
  };

  const openNewChat = () => {
    setActiveAgentId(null);
    setActiveChatTitle(null);
    setActiveMenu("chat");
  };

  const openChat = (chatTitle: string) => {
    setActiveAgentId(null);
    setActiveChatTitle(chatTitle);
    setActiveMenu("chat");
  };

  const openAgentChat = (agentId: string) => {
    setActiveAgentId(agentId);
    setActiveChatTitle(null);
    setActiveMenu("chat");
  };

  return (
    <div className={["w-full", className].filter(Boolean).join(" ")} data-aip-mockup onWheelCapture={handleMockupWheel}>
      <div
        className={[
          "mx-auto flex h-[700px] w-full max-w-[1200px] overflow-hidden rounded-[22px] border border-[#2f2f2f] bg-[#121212] text-[#f4f4f5] md:h-[760px]",
          withShadow ? "shadow-[0_32px_100px_rgba(16,24,40,0.18)]" : "",
        ]
          .filter(Boolean)
          .join(" ")}
        style={frameHeight ? { height: frameHeight } : undefined}
      >
        <Sidebar
          activeAdminPage={activeAdminPage}
          activeChatTitle={activeChatTitle}
          activeMenu={activeMenu}
          onAdminMenuClick={openAdminPage}
          onAgentClick={openAgentChat}
          onChatClick={openChat}
          onMenuClick={openMenu}
          onNewChatClick={openNewChat}
        />
        {activeMenu === "agents" ? (
          <AgentsScreen onAgentClick={openAgentChat} />
        ) : activeMenu === "admin" ? (
          <AdminContent activeAdminPage={activeAdminPage} key={activeAdminPage} />
        ) : activeMenu === "automation" ? (
          <AutomationScreen />
        ) : activeMenu === "apps" ? (
          <AppsScreen />
        ) : activeMenu === "mcp" ? (
          <McpScreen />
        ) : activeMenu === "my-drive" ? (
          <MyDriveScreen />
        ) : activeMenu === "skills" ? (
          <SkillsScreen />
        ) : (
          <div className="flex min-w-0 flex-1 flex-col">
            {activeAgentId ? null : <AppHeader />}
            <NewChatScreen activeAgentId={activeAgentId} activeChatTitle={activeChatTitle} />
          </div>
        )}
      </div>
    </div>
  );
}
