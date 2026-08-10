import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

export type ButtonVariant = "primary" | "secondary" | "outline";
export type ButtonStyle = "round" | "full";
export type ButtonSize = "xsmall" | "small" | "default" | "large";
export type ButtonState = "default" | "hover" | "disable";

type ButtonBaseProps = {
  arrow?: boolean;
  children?: ReactNode;
  className?: string;
  disabled?: boolean;
  size?: ButtonSize;
  style?: ButtonStyle;
  state?: ButtonState;
  variant?: ButtonVariant;
};

type ButtonElementProps = ButtonBaseProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "className" | "disabled" | "style"> & {
    href?: undefined;
  };

type ButtonLinkProps = ButtonBaseProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "children" | "className" | "href" | "style"> & {
    href: string;
  };

export type ButtonProps = ButtonElementProps | ButtonLinkProps;

type ButtonStyleConfig = {
  container: string;
  text: string;
  iconSize: string;
};

function cx(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

// variant / size / state 조합에 따라 버튼의 배경/텍스트/아이콘 크기를 계산
export function getButtonStyle(
  variant: ButtonVariant,
  shape: ButtonStyle,
  size: ButtonSize,
  state: ButtonState,
): ButtonStyleConfig {
  return {
    container: cx(
      "pressable inline-flex items-center justify-center rounded-button",
      shape === "full" ? "rounded-full" : "rounded-button",
      size === "xsmall" && cx("h-[26px] gap-1.5", shape === "round" ? "px-2" : "px-3"),
      size === "small" && cx("h-[34px] gap-1.5", shape === "round" ? "px-3" : "px-4"),
      size === "default" && cx("h-10 gap-1.5", shape === "round" ? "px-4" : "px-5"),
      size === "large" && cx("h-12 gap-2", shape === "round" ? "px-5" : "px-6"),
      variant === "outline" &&
        cx(
          "border border-border",
          state === "hover" ? "bg-secondary" : "bg-transparent",
          "hover:bg-secondary",
        ),
      variant === "primary" &&
        cx(state === "hover" ? "bg-primary-hover" : "bg-primary", "hover:bg-primary-hover"),
      variant === "secondary" &&
        cx(state === "hover" ? "bg-secondary-hover" : "bg-secondary", "hover:bg-secondary-hover"),
      state === "disable" && "opacity-40",
    ),
    text: cx(
      size === "xsmall" ? "type-body-sm" : "type-body-md",
      "transition-colors duration-300",
      variant === "primary"
        ? state === "hover"
          ? "text-bg"
          : "text-bg"
        : variant === "secondary" && state === "hover"
          ? "text-fg"
          : "text-fg",
      variant === "secondary" && "hover:text-fg",
      variant === "primary" && "hover:text-bg",
    ),
    iconSize: "h-4 w-4",
  };
}

function ArrowRightIcon({ className }: { className?: string }) {
  return (
    // 공통 버튼 화살표 아이콘
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

export default function Button({
  arrow = true,
  children = "Button",
  className,
  disabled,
  href,
  size = "default",
  style = "round",
  state = "default",
  variant = "secondary",
  ...props
}: ButtonProps) {
  // disabled가 true면 외부 state와 관계없이 disable 우선 적용
  const resolvedState = disabled ? "disable" : state;
  const styles = getButtonStyle(variant, style, size, resolvedState);

  const content = (
    <>
      {/* 버튼 텍스트 */}
      <span className="inline-flex items-center justify-center gap-2 text-center">{children}</span>
      {/* arrow가 켜진 경우만 아이콘 노출 */}
      {arrow ? (
        <ArrowRightIcon
          className={cx(
            styles.iconSize,
            "group-hover:animate-[button-arrow-nudge_220ms_ease-out_forwards]",
          )}
        />
      ) : null}
    </>
  );

  const buttonClassName = cx(
    styles.container,
    styles.text,
    "group cursor-pointer disabled:cursor-not-allowed",
    className,
  );

  if (href) {
    const anchorProps = props as AnchorHTMLAttributes<HTMLAnchorElement>;
    return (
      <a
        {...anchorProps}
        aria-disabled={resolvedState === "disable" || undefined}
        className={buttonClassName}
        href={resolvedState === "disable" ? undefined : href}
      >
        {content}
      </a>
    );
  }

  const { type = "button", ...buttonProps } = props as ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button
      {...buttonProps}
      className={buttonClassName}
      disabled={resolvedState === "disable"}
      type={type}
    >
      {content}
    </button>
  );
}
