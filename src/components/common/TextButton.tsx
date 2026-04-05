import type { ButtonHTMLAttributes, ReactNode } from "react";

type TextButtonState = "default" | "hover" | "disable";

export type TextButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
  arrow?: boolean;
  children?: ReactNode;
  state?: TextButtonState;
};

function cx(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M15.5 6.5L21.5 12.5M21.5 12.5L15.5 18.5M21.5 12.5H3.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function TextButton({
  arrow = true,
  children = "Button",
  className,
  disabled,
  state = "default",
  type = "button",
  ...props
}: TextButtonProps) {
  const resolvedState = disabled ? "disable" : state;

  return (
    <button
      className={cx(
        "group inline-flex items-center justify-center gap-1.5 bg-transparent p-0 type-body-md text-fg transition-colors hover:text-mute-fg",
        resolvedState === "hover" && "text-mute-fg",
        resolvedState === "disable" && "cursor-not-allowed opacity-40",
        !disabled && "cursor-pointer",
        className,
      )}
      disabled={resolvedState === "disable"}
      type={type}
      {...props}
    >
      <span>{children}</span>
      {arrow ? (
        <ArrowRightIcon
          className="h-4 w-4 group-hover:animate-[button-arrow-nudge_220ms_ease-out_forwards]"
        />
      ) : null}
    </button>
  );
}
