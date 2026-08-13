import type { ReactNode } from "react";

type IconName = "analysis" | "brain" | "calendar" | "check" | "connect" | "document" | "folder" | "knowledge" | "layers" | "message" | "people" | "search" | "shield" | "spark";

type Props = {
  className?: string;
  name: IconName;
};

const paths: Record<IconName, ReactNode> = {
  analysis: <><path d="M4 19V9m5 10V5m5 14v-7m5 7V3" /><path d="M2 21h20" /></>,
  brain: <><path d="M9.5 5.2A3.2 3.2 0 0 0 4 7.4a3.8 3.8 0 0 0 .8 6.8A3.3 3.3 0 0 0 9.5 19V5.2Z" /><path d="M14.5 5.2A3.2 3.2 0 0 1 20 7.4a3.8 3.8 0 0 1-.8 6.8 3.3 3.3 0 0 1-4.7 4.8V5.2ZM9.5 8.5H7.8m1.7 4.2H7.4m7.1-4.2h1.7m-1.7 4.2h2.1M12 4v16" /></>,
  calendar: <><path d="M8 2v4M16 2v4" /><rect height="18" rx="2" width="18" x="3" y="4" /><path d="M3 10h18M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01" /></>,
  check: <path d="m5 12 4 4L19 6" />,
  connect: <><path d="M8 12h8M12 8v8" /><circle cx="5" cy="12" r="3" /><circle cx="19" cy="12" r="3" /></>,
  document: <><path d="M6 3h8l4 4v14H6z" /><path d="M14 3v5h5M9 12h6M9 16h6" /></>,
  folder: <><path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.7-.9l-.8-1.2A2 2 0 0 0 7.9 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" /><path d="M8 10v4M12 10v2M16 10v6" /></>,
  knowledge: <><path d="M4 9V5a1 1 0 0 1 1-1h4m6 0h4a1 1 0 0 1 1 1v4M4 15v4a1 1 0 0 0 1 1h4m6 0h4a1 1 0 0 0 1-1v-4" /><circle cx="11" cy="11" r="3.5" /><path d="m13.5 13.5 3 3" /></>,
  layers: <><path d="m12 3 9 5-9 5-9-5z" /><path d="m3 12 9 5 9-5M3 16l9 5 9-5" /></>,
  message: <><path d="M22 17a2 2 0 0 1-2 2H6.8a2 2 0 0 0-1.4.6l-2.2 2.2A.7.7 0 0 1 2 21.3V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2Z" /><path d="M7 7h10M7 11h10M7 15h6" /></>,
  people: <><circle cx="9" cy="8" r="3" /><path d="M3 20c0-4 2-7 6-7s6 3 6 7" /><path d="M16 5a3 3 0 0 1 0 6M18 14c2 .8 3 2.8 3 6" /></>,
  search: <><path d="m21 21-4.3-4.3" /><circle cx="11" cy="11" r="8" /></>,
  shield: <><path d="M12 3 20 6v5c0 5-3.2 8.3-8 10-4.8-1.7-8-5-8-10V6z" /><path d="m8.5 12 2.2 2.2 4.8-5" /></>,
  spark: <><path d="m12 3 1.4 4.6L18 9l-4.6 1.4L12 15l-1.4-4.6L6 9l4.6-1.4z" /><path d="m18.5 15 .7 2.3 2.3.7-2.3.7-.7 2.3-.7-2.3-2.3-.7 2.3-.7z" /></>,
};

export default function SolutionIcon({ className = "h-5 w-5", name }: Props) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5">
        {paths[name]}
      </g>
    </svg>
  );
}
