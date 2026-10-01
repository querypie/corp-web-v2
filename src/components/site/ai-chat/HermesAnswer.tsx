import { findHermesLinks } from "@/features/ai-chat/reply";

export default function HermesAnswer({ children }: { children: string }) {
  const links = findHermesLinks(children);
  if (!links.length) return children;
  const parts: React.ReactNode[] = [];
  let cursor = 0;
  for (const link of links) {
    if (link.start > cursor) parts.push(children.slice(cursor, link.start));
    parts.push(
      <a
        className="text-link underline decoration-border-strong underline-offset-4 hover:decoration-current"
        href={link.url}
        key={`${link.start}-${link.url}`}
        rel="noopener noreferrer"
        target="_blank"
      >
        {link.title}
      </a>,
    );
    cursor = link.end;
  }
  if (cursor < children.length) parts.push(children.slice(cursor));
  return parts;
}
