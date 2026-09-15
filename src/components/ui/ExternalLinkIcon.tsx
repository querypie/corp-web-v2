import { ExternalLink } from "lucide-react";

export default function ExternalLinkIcon({ className = "h-4 w-4" }: { className?: string }) {
  return <ExternalLink aria-hidden="true" className={className} />;
}
