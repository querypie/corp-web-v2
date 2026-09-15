import { Check, X } from "lucide-react";

export default function ComparisonAvailabilityIcon({ available }: { available: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={available
        ? "inline-flex h-7 w-7 items-center justify-center rounded-full border border-border bg-bg text-brand"
        : "inline-flex h-7 w-7 items-center justify-center rounded-full border border-border bg-bg text-primary"}
    >
      {available ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
    </span>
  );
}
