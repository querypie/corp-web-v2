"use client";

import { useMemo, useState } from "react";
import {
  aipMockupAgents,
  aipMockupMcpTools,
  aipMockupMenuItems,
  aipMockupMessages,
  type AipMockupMessage,
} from "./mockData";

type IconName =
  | "agent"
  | "automation"
  | "bell"
  | "chevron"
  | "grid"
  | "hardDrive"
  | "message"
  | "mic"
  | "mcp"
  | "plus"
  | "preset"
  | "send"
  | "settings"
  | "sparkle";

const iconPaths: Record<IconName, string> = {
  agent: "M12 4a4 4 0 014 4v1a4 4 0 01-8 0V8a4 4 0 014-4z M5 20a7 7 0 0114 0",
  automation: "M12 3v4m0 10v4M4.9 5.6l2.8 2.8m8.6 8.6l2.8 2.8M3 12h4m10 0h4M4.9 18.4l2.8-2.8m8.6-8.6l2.8-2.8",
  bell: "M18 8a6 6 0 00-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4",
  chevron: "M9 6l6 6-6 6",
  grid: "M4 4h6v6H4z M14 4h6v6h-6z M4 14h6v6H4z M14 14h6v6h-6z",
  hardDrive: "M4 6h16l2 10H2L4 6z M6 18h12",
  message: "M5 5h14v10H8l-4 4V5z",
  mic: "M12 4a3 3 0 00-3 3v5a3 3 0 006 0V7a3 3 0 00-3-3z M5 11a7 7 0 0014 0 M12 18v3",
  mcp: "M8 12a4 4 0 018 0 4 4 0 01-8 0z M3 12h2m14 0h2M12 3v2m0 14v2",
  plus: "M12 5v14M5 12h14",
  preset: "M5 7h14v10H5z M8 10h8 M8 14h5",
  send: "M5 12h13M12 5l7 7-7 7",
  settings: "M12 8a4 4 0 100 8 4 4 0 000-8z M12 2v3m0 14v3M4.9 4.9l2.1 2.1m10 10l2.1 2.1M2 12h3m14 0h3M4.9 19.1l2.1-2.1m10-10l2.1-2.1",
  sparkle: "M12 3l2 5 5 2-5 2-2 5-2-5-5-2 5-2 2-5z",
};

const menuIconById: Record<string, IconName> = {
  agents: "agent",
  automation: "automation",
  chat: "message",
  mcp: "mcp",
  "my-drive": "hardDrive",
  presets: "preset",
  skills: "sparkle",
  widgets: "grid",
};

function Icon({ name, className = "h-4 w-4" }: { className?: string; name: IconName }) {
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

function AgentAvatar({ name, shortName }: { name: string; shortName: string }) {
  return (
    <span
      aria-label={name}
      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#ff8a5c] via-[#b987d4] to-[#5177ff] text-[12px] font-semibold text-white"
    >
      {shortName}
    </span>
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
    <aside className="hidden w-[260px] shrink-0 border-r border-[#e5e7eb] bg-[#f8fafc] text-[#101828] md:flex md:flex-col">
      <div className="flex h-14 items-center justify-between px-3">
        <button className="flex min-w-0 items-center gap-2 rounded-md p-2 text-left hover:bg-[#eef2f7]" type="button">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#111827] text-[12px] font-bold text-white">
            Q
          </div>
          <span className="min-w-0 truncate text-[14px] font-semibold">QueryPie AI</span>
          <Icon className="h-3.5 w-3.5 text-[#667085]" name="chevron" />
        </button>
      </div>

      <nav className="flex flex-1 flex-col gap-0.5 px-2 py-2">
        {aipMockupMenuItems.map((item) => {
          const isActive = activeMenu === item.id;
          return (
            <button
              className={`group flex h-9 items-center gap-2 rounded-md px-2.5 text-left text-[13px] transition-colors ${
                isActive
                  ? "bg-white font-medium text-[#111827] shadow-[0_1px_2px_rgba(16,24,40,0.08)]"
                  : "text-[#344054] hover:bg-[#eef2f7]"
              }`}
              key={item.id}
              onClick={() => onMenuClick(item.id)}
              type="button"
            >
              <Icon className="h-4 w-4 text-[#667085]" name={menuIconById[item.id]} />
              <span className="min-w-0 truncate">{item.label}</span>
              {item.id === "widgets" ? (
                <span className="ml-auto rounded-full border border-[#d0d5dd] px-1.5 py-0.5 text-[10px] text-[#667085]">
                  Deprecated
                </span>
              ) : null}
            </button>
          );
        })}

        <div className="mt-4 px-2">
          <div className="mb-1 flex items-center justify-between">
            <p className="m-0 text-[11px] font-medium uppercase tracking-[0.08em] text-[#98a2b3]">Agents</p>
            <button className="text-[12px] text-[#475467] hover:underline" onClick={() => onMenuClick("agents")} type="button">
              View all
            </button>
          </div>
          <div className="flex flex-col gap-0.5">
            {aipMockupAgents.slice(0, 3).map((agent) => (
              <button
                className="flex h-9 items-center gap-2 rounded-md px-2 text-left text-[13px] text-[#344054] hover:bg-[#eef2f7]"
                key={agent.id}
                onClick={() => onMenuClick("agents")}
                type="button"
              >
                <AgentAvatar name={agent.name} shortName={agent.shortName} />
                <span className="min-w-0 truncate">{agent.name}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      <div className="border-t border-[#e5e7eb] p-2">
        <div className="mb-2 flex items-center gap-1.5">
          <button className="flex h-8 items-center gap-1.5 rounded-md px-2 text-[12px] text-[#344054] hover:bg-[#eef2f7]" type="button">
            <span className="h-2 w-2 rounded-full bg-[#12b76a]" />
            Edge Tunnel
          </button>
          <button aria-label="Notifications" className="flex h-8 w-8 items-center justify-center rounded-md text-[#475467] hover:bg-[#eef2f7]" type="button">
            <Icon name="bell" />
          </button>
        </div>
        <button className="flex w-full items-center gap-2 rounded-md p-2 text-left hover:bg-[#eef2f7]" type="button">
          <div className="h-8 w-8 rounded-full bg-[#e0e7ff]" />
          <div className="min-w-0 flex-1">
            <p className="m-0 truncate text-[13px] font-medium text-[#101828]">Jane Lee</p>
            <p className="m-0 truncate text-[11px] text-[#667085]">jane@querypie.com</p>
          </div>
          <Icon className="h-4 w-4 text-[#667085]" name="settings" />
        </button>
      </div>
    </aside>
  );
}

function TopBar({ activeMenu }: { activeMenu: string }) {
  const activeLabel = aipMockupMenuItems.find((item) => item.id === activeMenu)?.label ?? "New chat";

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-[#eaecf0] bg-white px-4 text-[#101828]">
      <div className="flex min-w-0 items-center gap-2">
        <h2 className="m-0 truncate text-[15px] font-semibold">{activeLabel}</h2>
        <span className="hidden rounded-full bg-[#f2f4f7] px-2 py-1 text-[11px] text-[#667085] sm:inline">
          Local mock
        </span>
      </div>
      <div className="flex items-center gap-2">
        <button className="hidden h-8 rounded-md border border-[#d0d5dd] bg-white px-3 text-[13px] font-medium text-[#344054] hover:bg-[#f9fafb] sm:block" type="button">
          Share
        </button>
        <button className="h-8 rounded-md bg-[#111827] px-3 text-[13px] font-medium text-white hover:bg-[#1f2937]" type="button">
          Publish
        </button>
      </div>
    </header>
  );
}

function AgentsPanel({
  selectedAgentId,
  onSelectAgent,
}: {
  selectedAgentId: string;
  onSelectAgent: (agentId: string) => void;
}) {
  return (
    <aside className="hidden w-[280px] shrink-0 border-r border-[#eaecf0] bg-white p-4 lg:block">
      <div className="mb-4 flex items-center justify-between">
        <p className="m-0 text-[12px] font-semibold uppercase tracking-[0.08em] text-[#98a2b3]">Agents</p>
        <button className="rounded-md border border-[#d0d5dd] px-2 py-1 text-[12px] text-[#344054] hover:bg-[#f9fafb]" type="button">
          Add
        </button>
      </div>
      <div className="flex flex-col gap-1.5">
        {aipMockupAgents.map((agent) => {
          const isSelected = selectedAgentId === agent.id;
          return (
            <button
              className={`flex items-center gap-3 rounded-lg p-2.5 text-left transition-colors ${
                isSelected ? "bg-[#f2f4f7]" : "hover:bg-[#f9fafb]"
              }`}
              key={agent.id}
              onClick={() => onSelectAgent(agent.id)}
              type="button"
            >
              <AgentAvatar name={agent.name} shortName={agent.shortName} />
              <span className="min-w-0">
                <span className="block truncate text-[13px] font-medium text-[#101828]">{agent.name}</span>
                <span className="block truncate text-[11px] text-[#667085]">{agent.owner}</span>
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-7">
        <p className="m-0 mb-3 text-[12px] font-semibold uppercase tracking-[0.08em] text-[#98a2b3]">MCP</p>
        <div className="flex flex-wrap gap-2">
          {aipMockupMcpTools.map((name) => (
            <button
              className="rounded-full border border-[#d0d5dd] bg-white px-3 py-1.5 text-[12px] text-[#344054] hover:bg-[#f9fafb]"
              key={name}
              type="button"
            >
              {name}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}

function ResultCard({ card }: { card: Extract<AipMockupMessage, { role: "assistant" }>["card"] }) {
  if (!card) return null;

  return (
    <div className="mt-4 w-full max-w-[560px] overflow-hidden rounded-xl border border-[#d0d5dd] bg-white shadow-[0_8px_24px_rgba(16,24,40,0.08)]">
      <div className="flex items-start gap-3 border-b border-[#eaecf0] p-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#f2f4f7] text-[#344054]">
          <Icon name="grid" />
        </div>
        <div>
          <p className="m-0 text-[14px] font-semibold text-[#101828]">{card.title}</p>
          <p className="m-0 mt-1 text-[12px] text-[#667085]">{card.description}</p>
        </div>
      </div>
      <table className="w-full border-collapse text-left text-[12px]">
        <thead className="bg-[#f9fafb] text-[#667085]">
          <tr>
            <th className="px-4 py-2 font-medium">Customer</th>
            <th className="px-4 py-2 font-medium">Segment</th>
            <th className="px-4 py-2 font-medium">Spend</th>
          </tr>
        </thead>
        <tbody className="text-[#344054]">
          {card.rows.map(([customer, segment, spend]) => (
            <tr className="border-t border-[#eaecf0]" key={customer}>
              <td className="px-4 py-2">{customer}</td>
              <td className="px-4 py-2">{segment}</td>
              <td className="px-4 py-2">{spend}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ChatMessage({ message }: { message: AipMockupMessage }) {
  if (message.role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[620px] rounded-[18px] bg-[#f2f4f7] px-5 py-3.5 text-[#101828]">
          <p className="m-0 text-[14px] leading-6">{message.body}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-3">
      <AgentAvatar name={message.title} shortName="D" />
      <div className="min-w-0">
        <p className="m-0 text-[14px] font-semibold text-[#101828]">{message.title}</p>
        <div className="mt-2 flex flex-col gap-2 text-[14px] leading-6 text-[#344054]">
          {message.body.map((line) => (
            <p className="m-0" key={line}>
              {line}
            </p>
          ))}
        </div>
        <ResultCard card={message.card} />
      </div>
    </div>
  );
}

function ChatComposer({
  agentName,
  onSend,
}: {
  agentName: string;
  onSend: (text: string) => void;
}) {
  const [text, setText] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const canSubmit = text.trim().length > 0;

  const send = () => {
    if (!canSubmit) return;
    onSend(text.trim());
    setText("");
  };

  return (
    <div className="relative mx-auto w-full max-w-[780px]">
      {isMenuOpen ? (
        <div className="absolute bottom-[104px] left-3 w-[220px] rounded-xl border border-[#d0d5dd] bg-white p-1.5 text-[13px] shadow-[0_16px_40px_rgba(16,24,40,0.14)]">
          {["Upload file", "Select from My Drive", "Use widget", "Use artifact"].map((item) => (
            <button className="block w-full rounded-lg px-3 py-2 text-left text-[#344054] hover:bg-[#f9fafb]" key={item} type="button">
              {item}
            </button>
          ))}
        </div>
      ) : null}

      <div className="rounded-[30px] border border-[#d0d5dd] bg-white shadow-[0_10px_30px_rgba(16,24,40,0.08)]">
        <div className="px-5 pb-3.5 pt-4.5">
          <textarea
            className="m-0 max-h-[120px] min-h-[34px] w-full resize-none bg-transparent text-[14px] leading-6 text-[#101828] outline-none placeholder:text-[#667085]"
            onChange={(event) => setText(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                send();
              }
            }}
            placeholder={`Message ${agentName}`}
            rows={1}
            value={text}
          />
        </div>

        <div className="flex items-center gap-1.5 px-3 pb-3">
          <button
            aria-label="Open attachment menu"
            className="flex h-9 w-9 items-center justify-center rounded-full text-[#344054] hover:bg-[#f2f4f7]"
            onClick={() => setIsMenuOpen((value) => !value)}
            type="button"
          >
            <Icon name="plus" />
          </button>
          <button className="flex min-w-0 items-center gap-2 rounded-full px-2.5 py-1.5 text-[13px] font-medium text-[#344054] hover:bg-[#f2f4f7]" type="button">
            <AgentAvatar name={agentName} shortName={agentName.slice(0, 1)} />
            <span className="max-w-[180px] truncate">{agentName}</span>
          </button>
          <span className="hidden rounded-full bg-[#f2f4f7] px-3 py-1.5 text-[12px] text-[#344054] sm:inline">
            Automation
          </span>
          <div className="mx-auto flex" />
          <span className="hidden text-[12px] text-[#667085] md:inline">12%</span>
          <button
            aria-label="Voice input"
            className={`flex h-9 w-9 items-center justify-center rounded-full ${
              canSubmit ? "bg-[#f2f4f7] text-[#98a2b3]" : "bg-[#111827] text-white"
            }`}
            type="button"
          >
            <Icon name="mic" />
          </button>
          <button
            aria-label="Send message"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#111827] text-white disabled:pointer-events-none disabled:opacity-40"
            disabled={!canSubmit}
            onClick={send}
            type="button"
          >
            <Icon name="send" />
          </button>
        </div>
      </div>
    </div>
  );
}

function ChatCanvas({ agentName }: { agentName: string }) {
  const [extraMessages, setExtraMessages] = useState<AipMockupMessage[]>([]);
  const messages = useMemo(() => [...aipMockupMessages, ...extraMessages], [extraMessages]);

  return (
    <section className="flex min-h-0 flex-1 flex-col bg-[#fcfcfd]">
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden px-5 py-8 md:px-8">
        <div className="mx-auto w-full max-w-[780px]">
          <p className="m-0 text-[12px] font-medium uppercase tracking-[0.08em] text-[#98a2b3]">Agent Chat</p>
          <h3 className="m-0 mt-1 text-[24px] font-semibold tracking-[-0.01em] text-[#101828]">{agentName}</h3>
        </div>

        <div className="mx-auto mt-6 flex w-full max-w-[780px] flex-1 flex-col justify-start gap-5 overflow-hidden">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
        </div>
      </div>

      <div className="shrink-0 px-4 pb-5">
        <ChatComposer
          agentName={agentName}
          onSend={(body) =>
            setExtraMessages((current) => [
              ...current,
              {
                id: `user-${current.length + 2}`,
                role: "user",
                body,
              },
            ])
          }
        />
      </div>
    </section>
  );
}

export default function AipMockupShell({ className }: { className?: string }) {
  const [activeMenu, setActiveMenu] = useState("chat");
  const [selectedAgentId, setSelectedAgentId] = useState("data-analysis");
  const selectedAgent = aipMockupAgents.find((agent) => agent.id === selectedAgentId) ?? aipMockupAgents[0];

  return (
    <div className={["w-full", className].filter(Boolean).join(" ")} data-aip-mockup>
      <div className="mx-auto flex h-[700px] w-full max-w-[1180px] overflow-hidden rounded-[22px] border border-[#d0d5dd] bg-white text-[#101828] shadow-[0_32px_100px_rgba(16,24,40,0.18)] md:h-[760px]">
        <Sidebar activeMenu={activeMenu} onMenuClick={setActiveMenu} />
        <div className="flex min-w-0 flex-1 flex-col">
          <TopBar activeMenu={activeMenu} />
          <div className="flex min-h-0 flex-1">
            <AgentsPanel selectedAgentId={selectedAgentId} onSelectAgent={setSelectedAgentId} />
            <ChatCanvas agentName={selectedAgent.name} />
          </div>
        </div>
      </div>
    </div>
  );
}
