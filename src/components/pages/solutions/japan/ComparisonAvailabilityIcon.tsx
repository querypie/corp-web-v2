export default function ComparisonAvailabilityIcon({ available }: { available: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={available
        ? "inline-flex h-7 w-7 items-center justify-center rounded-full border border-border bg-bg text-brand"
        : "inline-flex h-7 w-7 items-center justify-center rounded-full border border-border bg-bg text-primary"}
    >
      {available ? (
        <svg fill="none" height="14" viewBox="0 0 24 24" width="14">
          <path d="m5 12.5 4.25 4.25L19 7" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.25" />
        </svg>
      ) : (
        <svg fill="none" height="14" viewBox="0 0 24 24" width="14">
          <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
        </svg>
      )}
    </span>
  );
}
