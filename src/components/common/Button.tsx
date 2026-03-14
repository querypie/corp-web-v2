import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "outline" | "gnb" | "text";
type ButtonSize = "small" | "default" | "large";
type ButtonState = "default" | "hover" | "disable";

export type ButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
  arrow?: boolean;
  children?: ReactNode;
  size?: ButtonSize;
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
  size: ButtonSize,
  state: ButtonState,
): ButtonStyleConfig {
  // 텍스트 링크형 버튼
  if (variant === "text") {
    return {
      container: cx(
        "inline-flex items-center justify-center gap-1.5 rounded-button bg-transparent p-0 transition-colors",
        state === "disable" && "opacity-40",
      ),
      text: cx(
        "type-body-md hover:text-mute-fg transition-colors",
        state === "hover" ? "text-mute-fg" : "text-fg",
      ),
      iconSize: "h-4 w-4",
    };
  }

  // GNB 전용 버튼
  if (variant === "gnb") {
    return {
      container: cx(
        "inline-flex items-center justify-center gap-1.5 rounded-button px-4 py-2 transition-colors",
        state === "hover" ? "bg-[#434346]" : "bg-secondary",
        "hover:bg-[#434346]",
        state === "disable" && "opacity-40",
      ),
      text: cx(
        "type-body-md transition-colors",
        state === "hover" ? "text-fg" : "text-fg",
        "hover:text-fg",
      ),
      iconSize: "h-4 w-4",
    };
  }

  const isLarge = size === "large";

  return {
    // 일반 버튼 (primary / secondary / outline)
    container: cx(
      "inline-flex items-center justify-center rounded-button transition-colors",
      isLarge ? "gap-2 px-7 py-3" : "gap-1.5 px-5 py-2.5",
      variant === "outline" &&
        cx(
          state === "hover" ? "border border-primary bg-transparent" : "border border-secondary bg-transparent",
          "hover:border-primary",
        ),
      variant === "primary" &&
        cx(state === "hover" ? "bg-brand" : "bg-primary", "hover:bg-brand"),
      variant === "secondary" &&
        cx(state === "hover" ? "bg-[#434346]" : "bg-secondary", "hover:bg-[#434346]"),
      state === "disable" && "opacity-40",
    ),
    text: cx(
      "type-button transition-colors",
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
  size = "small",
  state = "default",
  type = "button",
  variant = "gnb",
  ...props
}: ButtonProps) {
  // disabled가 true면 외부 state와 관계없이 disable 우선 적용
  const resolvedState = disabled ? "disable" : state;
  const styles = getButtonStyle(variant, size, resolvedState);

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
