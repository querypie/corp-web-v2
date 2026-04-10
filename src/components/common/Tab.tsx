import type { ButtonHTMLAttributes, ReactNode } from "react";

type TabState = "on" | "off" | "hover";

export type TabProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
  children?: ReactNode;
  state?: TabState;
};

function cx(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
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
      className={cx(
        "inline-flex h-10 items-center justify-center rounded-full px-5 text-center transition-colors duration-200",
        "text-[14px] leading-5 font-normal",
        // 활성 탭
        resolvedState === "on" && "bg-secondary text-fg",
        // 호버 상태 미리보기
        resolvedState === "hover" && "bg-transparent text-fg",
        // 비활성 탭
        resolvedState === "off" && "bg-transparent text-mute-fg hover:text-fg",
        "cursor-pointer disabled:cursor-not-allowed",
        className,
      )}
      disabled={disabled}
      type={type}
      {...props}
    >
      <span>{children}</span>
    </button>
  );
}
