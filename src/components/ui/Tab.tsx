import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

type TabState = "on" | "off" | "hover";

export type TabProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
  children?: ReactNode;
  state?: TabState;
};

export type TabLinkProps = Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  "children" | "className" | "href"
> & {
  children?: ReactNode;
  className?: string;
  href: string;
  scroll?: boolean;
  state?: TabState;
};

function cx(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

function getTabClassName({
  className,
  state,
}: Pick<TabProps, "className" | "state">) {
  return cx(
    "inline-flex h-10 items-center justify-center rounded-full px-5 text-center transition-colors duration-200",
    "text-[14px] leading-5 font-normal",
    state === "on" && "bg-secondary text-fg",
    state === "hover" && "bg-transparent text-fg",
    state === "off" && "bg-transparent text-mute hover:text-fg",
    "cursor-pointer disabled:cursor-not-allowed",
    className,
  );
}

export default function Tab({
  children = "Tab",
  className,
  disabled,
  state = "on",
  type = "button",
  ...props
}: TabProps) {
  // disabled면 항상 off 스타일로 처리
  const resolvedState = disabled ? "off" : state;

  return (
    <button
      className={getTabClassName({ className, state: resolvedState })}
      disabled={disabled}
      type={type}
      {...props}
    >
      <span className="inline-flex items-center justify-center">{children}</span>
    </button>
  );
}

export function TabLink({
  children = "Tab",
  className,
  href,
  scroll,
  state = "on",
  ...props
}: TabLinkProps) {
  return (
    <Link
      {...props}
      className={getTabClassName({ className, state })}
      href={href}
      scroll={scroll}
    >
      <span className="inline-flex items-center justify-center">{children}</span>
    </Link>
  );
}
