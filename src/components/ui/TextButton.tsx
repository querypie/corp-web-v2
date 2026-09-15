import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { ArrowRight } from "lucide-react";

type TextButtonState = "default" | "hover" | "disable";

type TextButtonBaseProps = {
  children?: ReactNode;
  className?: string;
  disabled?: boolean;
  state?: TextButtonState;
};

type TextButtonAnchorProps = TextButtonBaseProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof TextButtonBaseProps | "href"> & {
    href: string;
  };

type TextButtonButtonProps = TextButtonBaseProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof TextButtonBaseProps> & {
    href?: undefined;
  };

export type TextButtonProps = TextButtonAnchorProps | TextButtonButtonProps;

function cx(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

export default function TextButton({
  children = "Button",
  className,
  disabled,
  href,
  state = "default",
  ...props
}: TextButtonProps) {
  const resolvedState = disabled ? "disable" : state;
  const classes = cx(
    "pressable group inline-flex items-center justify-center gap-1.5 bg-transparent p-0 text-brand",
    !className?.includes("type-") && "type-body-md",
    resolvedState === "disable" && "cursor-not-allowed opacity-40",
    !disabled && "cursor-pointer",
    className,
  );
  const content = (
    <>
      <span
        className={cx(
          "decoration-1 underline-offset-4",
          resolvedState !== "disable" && "group-hover:underline",
          resolvedState === "hover" && "underline",
        )}
      >
        {children}
      </span>
      <ArrowRight aria-hidden="true" className="h-4 w-4 text-mute group-hover:animate-[button-arrow-nudge_220ms_ease-out_forwards]" />
    </>
  );

  if (href) {
    const anchorProps = props as Omit<
      AnchorHTMLAttributes<HTMLAnchorElement>,
      keyof TextButtonBaseProps | "href"
    >;

    return (
      <a
        {...anchorProps}
        aria-disabled={disabled ? true : undefined}
        className={classes}
        href={disabled ? undefined : href}
        tabIndex={disabled ? -1 : anchorProps.tabIndex}
      >
        {content}
      </a>
    );
  }

  const buttonProps = props as Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    keyof TextButtonBaseProps
  >;

  return (
    <button
      {...buttonProps}
      className={classes}
      disabled={resolvedState === "disable"}
      type={buttonProps.type ?? "button"}
    >
      {content}
    </button>
  );
}
