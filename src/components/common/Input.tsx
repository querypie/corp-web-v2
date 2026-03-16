import type { InputHTMLAttributes } from "react";

type InputVariant = "input" | "dropdown";
type InputState = "default" | "focus" | "disable";

export type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "size"> & {
  label?: string;
  state?: InputState;
  variant?: InputVariant;
};

function cx(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    // 드롭다운용 화살표 아이콘
    <svg
      aria-hidden="true"
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5 8.5L12 15.5L19 8.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Input({
  className,
  disabled,
  label,
  placeholder = "placeholder",
  readOnly,
  state = "default",
  value,
  variant = "input",
  ...props
}: InputProps) {
  // disabled가 우선이고, dropdown 여부에 따라 내부 구조를 분기
  const resolvedState = disabled ? "disable" : state;
  const isDropdown = variant === "dropdown";
  const hasBorder = resolvedState !== "default";

  return (
    <div
      className={cx(
        "ui-field-shell inline-flex w-[240px] items-center overflow-hidden rounded-button bg-bg-content px-3 py-2.5",
        hasBorder && "border border-border",
        resolvedState === "disable" && "opacity-50",
        isDropdown && "gap-1.5",
        className,
      )}
      data-state={resolvedState}
      data-variant={variant}
    >
      {/* dropdown은 텍스트 + 아이콘 조합으로 렌더 */}
      {isDropdown ? (
        <>
          <span className="min-w-0 flex-1 type-body-md text-fg">
            {label ?? "dropdown"}
          </span>
          <ChevronDownIcon className="h-4 w-4 shrink-0 text-mute-fg" />
        </>
      ) : (
        /* 일반 input은 실제 input 요소를 렌더 */
        <input
          className={cx(
            "min-w-0 flex-1 border-0 bg-transparent type-body-md outline-none",
            "type-body-md",
            resolvedState === "default" ? "text-mute-fg" : "text-fg",
            "placeholder:text-mute-fg",
          )}
          disabled={resolvedState === "disable"}
          placeholder={placeholder}
          readOnly={readOnly ?? resolvedState !== "default"}
          value={value}
          {...props}
        />
      )}
    </div>
  );
}
