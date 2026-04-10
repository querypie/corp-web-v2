import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "outline";
type ButtonStyle = "round" | "full";
type ButtonSize = "small" | "default" | "large";
type ButtonState = "default" | "hover" | "disable";

export type ButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "style"> & {
  arrow?: boolean;
  children?: ReactNode;
  size?: ButtonSize;
  style?: ButtonStyle;
  state?: ButtonState;
  variant?: ButtonVariant;
};

type ButtonStyleConfig = {
  container: string;
  text: string;
  iconSize: string;
};

function cx(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

// variant / size / state 조합에 따라 버튼의 배경/텍스트/아이콘 크기를 계산
function getButtonStyle(
  variant: ButtonVariant,
  shape: ButtonStyle,
  size: ButtonSize,
  state: ButtonState,
): ButtonStyleConfig {
  return {
    container: cx(
      "inline-flex items-center justify-center rounded-button transition-colors duration-300",
      shape === "full" ? "rounded-full" : "rounded-button",
      size === "small" && "h-8 gap-1.5 px-4",
      size === "default" && "h-10 gap-1.5 px-5",
      size === "large" && "h-14 gap-2 px-6",
      variant === "outline" &&
        cx(
          "border border-secondary",
          state === "hover" ? "bg-[#242426]" : "bg-transparent",
          "hover:bg-[#242426]",
        ),
      variant === "primary" &&
        cx(state === "hover" ? "bg-[#ABABAB]" : "bg-primary", "hover:bg-[#ABABAB]"),
      variant === "secondary" &&
        cx(state === "hover" ? "bg-[#343434]" : "bg-secondary", "hover:bg-[#343434]"),
      state === "disable" && "opacity-40",
    ),
    text: cx(
      "type-body-md transition-colors duration-300",
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
  size = "default",
  style = "round",
  state = "default",
  type = "button",
  variant = "secondary",
  ...props
}: ButtonProps) {
  // disabled가 true면 외부 state와 관계없이 disable 우선 적용
  const resolvedState = disabled ? "disable" : state;
  const styles = getButtonStyle(variant, style, size, resolvedState);

  return (
    <button
      className={cx(
        styles.container,
        styles.text,
        "group cursor-pointer disabled:cursor-not-allowed",
        className,
      )}
      disabled={resolvedState === "disable"}
      type={type}
      {...props}
    >
      {/* 버튼 텍스트 */}
      <span>{children}</span>
      {/* arrow가 켜진 경우만 아이콘 노출 */}
      {arrow ? (
        <ArrowRightIcon
          className={cx(
            styles.iconSize,
            "group-hover:animate-[button-arrow-nudge_220ms_ease-out_forwards]",
          )}
        />
      ) : null}
    </button>
  );
}
