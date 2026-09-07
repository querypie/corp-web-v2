import Link from "next/link";
import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  MouseEvent,
  ReactNode,
} from "react";

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
  disabled,
  state,
}: Pick<TabProps, "className" | "disabled" | "state">) {
  return cx(
    "inline-flex h-10 items-center justify-center rounded-full px-5 text-center transition-colors duration-200",
    "text-[14px] leading-5 font-normal",
    state === "on" && "cursor-default bg-secondary text-fg",
    state === "hover" && "cursor-pointer bg-transparent text-fg",
    state === "off" && !disabled && "cursor-pointer bg-transparent text-mute hover:text-fg",
    state === "off" && disabled && "cursor-not-allowed bg-transparent text-mute",
    className,
  );
}

export default function Tab({
  children = "Tab",
  className,
  disabled,
  onClick,
  state = "on",
  type = "button",
  ...props
}: TabProps) {
  // disabled면 항상 off 스타일로 처리
  const resolvedState = disabled ? "off" : state;
  const isSelected = resolvedState === "on";

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (isSelected) {
      event.preventDefault();
      return;
    }

    onClick?.(event);
  };

  return (
    <button
      className={getTabClassName({ className, disabled, state: resolvedState })}
      disabled={disabled}
      onClick={handleClick}
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
  onClick,
  scroll,
  state = "on",
  tabIndex,
  ...props
}: TabLinkProps) {
  const isSelected = state === "on";

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (isSelected) {
      event.preventDefault();
      return;
    }

    onClick?.(event);
  };

  return (
    <Link
      {...props}
      aria-disabled={isSelected ? true : props["aria-disabled"]}
      className={cx(
        getTabClassName({ className, disabled: isSelected, state }),
        isSelected && "pointer-events-none",
      )}
      href={href}
      onClick={handleClick}
      scroll={scroll}
      tabIndex={isSelected ? -1 : tabIndex}
    >
      <span className="inline-flex items-center justify-center">{children}</span>
    </Link>
  );
}
