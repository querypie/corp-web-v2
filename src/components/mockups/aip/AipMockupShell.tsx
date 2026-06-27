"use client";

import { useEffect, useMemo, useState } from "react";
import {
  aipMockupAgents,
  aipMockupIntegrations,
  aipMockupMessages,
  type AipMockupMessage,
} from "./mockData";

const menuItems = [
  { icon: "M4 5h16M4 12h10M4 19h16", label: "New chat" },
  { icon: "M12 3l7 4v10l-7 4-7-4V7l7-4z", label: "Agent" },
  { icon: "M5 7h14v10H5z M8 10h8 M8 14h5", label: "Preset" },
  { icon: "M8 12a4 4 0 018 0 4 4 0 01-8 0z M3 12h2m14 0h2", label: "MCP" },
  { icon: "M4 4h6v6H4z M14 4h6v6h-6z M4 14h6v6H4z M14 14h6v6h-6z", label: "Widgets" },
  { icon: "M12 3v5l4 2-4 2v9 M4 12h4m8 0h4", label: "Automation" },
  { icon: "M4 8h16v10H4z M7 8V5h10v3", label: "My Drive" },
  { icon: "M12 3l2.2 5.2L20 10l-5.1 2.8L12 18l-2.9-5.2L4 10l5.8-1.8L12 3z", label: "Skills" },
] as const;

function Icon({ path }: { path: string }) {
  return (
    <svg aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24">
      <path d={path} />
    </svg>
  );
}

function Sidebar() {
  return (
    <aside className="hidden w-[220px] shrink-0 border-r border-[#2c2d30] bg-[#18191b] text-[#e9e9ea] md:flex md:flex-col">
      <div className="flex h-14 items-center gap-2 border-b border-[#2c2d30] px-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-[9px] bg-white text-[15px] font-semibold text-[#111214]">Q</div>
        <span className="text-[16px] font-semibold">AIP</span>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-3 py-4">
        {menuItems.map((item) => (
          <button className="flex h-10 items-center gap-3 rounded-[10px] px-3 text-left text-[14px] text-[#d7d7d9] transition-colors hover:bg-[#242529]" key={item.label} type="button">
            <Icon path={item.icon} />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="border-t border-[#2c2d30] p-3">
        <div className="flex items-center gap-3 rounded-[12px] bg-[#222326] p-2">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#f08a4b] to-[#6e7bf2]" />
          <div className="min-w-0">
            <p className="m-0 truncate text-[12px] font-medium">Jane Lee</p>
            <p className="m-0 truncate text-[11px] text-[#9b9ca3]">Edge Tunnel connected</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

function TopBar() {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-[#2c2d30] bg-[#151618] px-4 text-[#ececef]">
      <div className="flex min-w-0 items-center gap-3">
        <button className="flex h-9 items-center gap-2 rounded-[10px] bg-[#222326] px-3 text-[13px] font-medium" type="button">
          <span className="h-2 w-2 rounded-full bg-[#f05f38]" />
          Claude Opus 4.6
        </button>
        <span className="hidden text-[12px] text-[#9698a0] sm:inline">Enterprise AI workspace</span>
      </div>

      <div className="flex items-center gap-2">
        <button className="hidden h-9 rounded-[10px] bg-[#242529] px-3 text-[13px] font-medium sm:block" type="button">Share</button>
        <button className="h-9 rounded-[10px] bg-[#eeeeee] px-3 text-[13px] font-semibold text-[#111214]" type="button">Publish</button>
      </div>
    </header>
  );
}

function AgentRail() {
  return (
    <div className="hidden w-[210px] shrink-0 border-r border-[#2c2d30] bg-[#131416] p-4 lg:block">
      <p className="m-0 mb-3 text-[12px] font-medium uppercase tracking-[0.08em] text-[#8f9199]">Agents</p>
      <div className="flex flex-col gap-2">
        {aipMockupAgents.map((agent, index) => (
          <button className={`flex items-center gap-3 rounded-[12px] p-3 text-left ${index === 2 ? "bg-[#25262a]" : "bg-transparent"}`} key={agent.id} type="button">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#eeeeee] text-[12px] font-semibold text-[#161719]">{agent.shortName}</span>
            <span className="min-w-0 truncate text-[13px] text-[#e5e5e7]">{agent.name}</span>
          </button>
        ))}
      </div>

      <div className="mt-7">
        <p className="m-0 mb-3 text-[12px] font-medium uppercase tracking-[0.08em] text-[#8f9199]">Connected MCP</p>
        <div className="grid grid-cols-2 gap-2">
          {aipMockupIntegrations.map((name) => (
            <div className="rounded-[10px] border border-[#2c2d30] bg-[#1b1c1f] px-2 py-2 text-[11px] text-[#cacbd0]" key={name}>{name}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ToolCard({ card }: { card: Extract<AipMockupMessage, { role: "assistant" }>["card"] }) {
  if (!card) return null;

  return (
    <div className="mt-4 w-full max-w-[520px] rounded-[16px] border border-[#3a3b40] bg-[#27282c] p-4 shadow-[0_20px_50px_rgba(0,0,0,0.24)]">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-[#141517] text-[#f0f0f2]">
          <Icon path="M4 7h16M4 12h16M4 17h16" />
        </div>
        <div>
          <p className="m-0 text-[14px] font-semibold text-[#f3f3f4]">{card.title}</p>
          <p className="m-0 mt-1 text-[12px] text-[#9b9ca3]">{card.description}</p>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2 text-[11px]">
        {["Customer", "Segment", "Spend"].map((label) => (
          <span className="rounded-[8px] bg-[#1b1c1f] px-2 py-2 text-[#b9bac0]" key={label}>{label}</span>
        ))}
      </div>
    </div>
  );
}

function ChatMessage({ message, visible }: { message: AipMockupMessage; visible: boolean }) {
  const className = `transition-all duration-700 ${visible ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"}`;

  if (message.role === "user") {
    return (
      <div className={className}>
        <div className="ml-auto max-w-[620px] rounded-[20px] bg-[#eeeeee] px-5 py-4 text-[#17181a]">
          <p className="m-0 text-[15px] leading-6">{message.body}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="flex max-w-[720px] gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#323338] text-[13px] font-semibold text-[#eeeeee]">AI</div>
        <div className="min-w-0">
          <p className="m-0 text-[15px] font-semibold text-[#f0f0f2]">{message.title}</p>
          <div className="mt-2 flex flex-col gap-2 text-[14px] leading-6 text-[#d8d9de]">
            {message.body.map((line) => (
              <p className="m-0" key={line}>{line}</p>
            ))}
          </div>
          <ToolCard card={message.card} />
        </div>
      </div>
    </div>
  );
}

function Composer() {
  return (
    <div className="mx-auto w-full max-w-[760px] rounded-[28px] border border-[#33343a] bg-[#202125] p-3 shadow-[0_24px_70px_rgba(0,0,0,0.32)]">
      <p className="m-0 px-3 py-2 text-[14px] text-[#858791]">Message Data Analysis Agent</p>
      <div className="mt-6 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button className="flex h-9 w-9 items-center justify-center rounded-full text-[#d9d9dd] hover:bg-[#2b2c31]" type="button">+</button>
          <button className="rounded-full bg-[#303137] px-4 py-2 text-[13px] text-[#ededf0]" type="button">Agent</button>
          <button className="rounded-full bg-[#303137] px-4 py-2 text-[13px] text-[#ededf0]" type="button">Skills</button>
        </div>
        <button className="flex h-10 w-10 items-center justify-center rounded-full bg-[#eeeeee] text-[#111214]" type="button">
          <Icon path="M12 19V5m0 0l-6 6m6-6l6 6" />
        </button>
      </div>
    </div>
  );
}

function ChatCanvas() {
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    const timers = aipMockupMessages.map((_, index) =>
      window.setTimeout(() => setVisibleCount((current) => Math.max(current, index + 1)), 450 + index * 800),
    );

    return () => timers.forEach(window.clearTimeout);
  }, []);

  const statusText = useMemo(() => (visibleCount < aipMockupMessages.length ? "Analyzing customer data..." : "Ready"), [visibleCount]);

  return (
    <section className="flex min-h-0 flex-1 flex-col bg-[#101113]">
      <div className="flex min-h-0 flex-1 flex-col gap-8 overflow-hidden px-5 py-8 md:px-8">
        <div className="mx-auto flex w-full max-w-[760px] items-center justify-between">
          <div>
            <p className="m-0 text-[12px] uppercase tracking-[0.08em] text-[#8c8e96]">Workspace</p>
            <h3 className="m-0 mt-1 text-[20px] font-semibold text-[#f3f3f5]">Data Analysis Agent</h3>
          </div>
          <span className="rounded-full border border-[#313239] bg-[#191a1d] px-3 py-1.5 text-[12px] text-[#a9abb3]">{statusText}</span>
        </div>

        <div className="mx-auto flex w-full max-w-[760px] flex-1 flex-col justify-center gap-7">
          {aipMockupMessages.map((message, index) => (
            <ChatMessage key={message.id} message={message} visible={visibleCount > index} />
          ))}
        </div>
      </div>

      <div className="shrink-0 px-4 pb-5">
        <Composer />
      </div>
    </section>
  );
}

export default function AipMockupShell({ className }: { className?: string }) {
  return (
    <div className={["w-full", className].filter(Boolean).join(" ")} data-aip-mockup>
      <div className="mx-auto flex h-[660px] w-full max-w-[1180px] overflow-hidden rounded-[24px] border border-[#303137] bg-[#101113] shadow-[0_40px_120px_rgba(0,0,0,0.45)] md:h-[720px]">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <TopBar />
          <div className="flex min-h-0 flex-1">
            <AgentRail />
            <ChatCanvas />
          </div>
        </div>
      </div>
    </div>
  );
}
