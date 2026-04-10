import type { InputHTMLAttributes } from "react";

type InputVariant = "input" | "dropdown";
type InputState = "default" | "focus" | "disable";

export type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "size"> & {
  inputClassName?: string;
  label?: string;
  state?: InputState;
  variant?: InputVariant;
};

function cx(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

const fieldShellClassName =
  "ui-field-shell inline-flex h-10 w-[240px] items-center overflow-hidden rounded-button bg-bg-content px-4";

const fieldTextClassName =
  "min-w-0 flex-1 border-0 bg-transparent type-body-md outline-none";

export default function Input({
  className,
  disabled,
  inputClassName,
  label,
  placeholder,
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
        fieldShellClassName,
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
          <img
            alt=""
            aria-hidden="true"
            className="h-[14px] w-[14px] shrink-0 object-contain"
            src="/icons/chevron-down.svg"
          />
        </>
      ) : (
        /* 일반 input은 실제 input 요소를 렌더 */
        <input
          className={cx(
            fieldTextClassName,
            "text-fg",
            "placeholder:text-placeholder",
            inputClassName,
          )}
          disabled={resolvedState === "disable"}
          placeholder={placeholder}
          readOnly={readOnly}
          value={value}
          {...props}
        />
      )}
    </div>
  );
}
