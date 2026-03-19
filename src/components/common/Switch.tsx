import type { ButtonHTMLAttributes } from "react";

type SwitchSize = "default" | "compact";

export type SwitchProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onChange"> & {
  checked: boolean;
  label?: string;
  onChange: () => void;
  size?: SwitchSize;
};

function cx(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

const switchSizeStyles: Record<
  SwitchSize,
  {
    knob: string;
    knobOffsetOff: string;
    knobOffsetOn: string;
    shell: string;
    text: string;
  }
> = {
  compact: {
    knob: "h-5 w-5",
    knobOffsetOff: "translate-x-[3px]",
    knobOffsetOn: "translate-x-[22px]",
    shell: "h-7 w-[46px]",
    text: "type-body-sm",
  },
  default: {
    knob: "h-4 w-4",
    knobOffsetOff: "translate-x-[4px]",
    knobOffsetOn: "translate-x-5",
    shell: "h-6 w-10",
    text: "type-body-sm",
  },
};

export default function Switch({
  checked,
  className,
  disabled,
  label,
  onChange,
  size = "default",
  type = "button",
  ...props
}: SwitchProps) {
  const styles = switchSizeStyles[size];

  return (
    <button
      aria-checked={checked}
      aria-label={label}
      className={cx(
        "inline-flex items-center gap-3 self-start sm:self-auto disabled:cursor-not-allowed",
        disabled && "cursor-not-allowed opacity-40",
        className,
      )}
      disabled={disabled}
      onClick={onChange}
      role="switch"
      type={type}
      {...props}
    >
      {label ? <span className={cx(styles.text, "text-mute-fg")}>{label}</span> : null}
      <span
        className={cx(
          "relative inline-flex items-center rounded-full border border-border bg-bg transition-colors",
          styles.shell,
        )}
      >
        <span
          className={cx(
            "inline-block rounded-full transition-transform",
            styles.knob,
            checked ? styles.knobOffsetOn : styles.knobOffsetOff,
            checked ? "bg-success" : "bg-mute-fg",
          )}
        />
      </span>
    </button>
  );
}
