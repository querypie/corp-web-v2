import type { HTMLAttributes, ReactNode } from "react";

export type BadgeVariant = "primary" | "brand" | "secondary" | "outline";

export type BadgeProps = Omit<HTMLAttributes<HTMLSpanElement>, "children"> & {
  children: ReactNode;
  variant?: BadgeVariant;
};

function cx(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

export default function Badge({
  children,
  className,
  variant = "secondary",
  ...props
}: BadgeProps) {
  return (
    <span
      className={cx(
        "inline-flex items-center justify-center whitespace-nowrap rounded-full",
        "h-[26px] px-[10px] type-body-sm",
        variant === "primary" && "bg-primary text-bg",
        variant === "brand" && "bg-brand text-on-brand",
        variant === "secondary" && "bg-secondary text-fg",
        variant === "outline" && "border border-border bg-bg text-fg",
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
