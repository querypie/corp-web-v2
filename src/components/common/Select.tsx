"use client";

import { useState, type SelectHTMLAttributes } from "react";

type SelectOption = {
  label: string;
  value: string;
};

export type SelectProps = Omit<SelectHTMLAttributes<HTMLSelectElement>, "children"> & {
  options: SelectOption[];
  placeholder?: string;
};

function cx(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

const fieldShellClassName =
  "ui-field-shell inline-flex h-10 w-full items-center overflow-hidden rounded-button bg-bg-content px-3 transition-colors hover:bg-[#242426]";

const fieldTextClassName =
  "min-w-0 flex-1 border-0 bg-transparent type-body-md text-fg outline-none";

export default function Select({
  className,
  defaultValue = "",
  options,
  placeholder,
  onChange,
  ...props
}: SelectProps) {
  const [selectedValue, setSelectedValue] = useState(String(defaultValue));

  return (
    <div className={cx(fieldShellClassName, "relative", className)}>
      <select
        className={cx(
          fieldTextClassName,
          "h-full w-full appearance-none px-0 pr-7",
          selectedValue ? "text-fg" : "text-mute-fg",
        )}
        defaultValue={defaultValue}
        onChange={(event) => {
          setSelectedValue(event.target.value);
          onChange?.(event);
        }}
        {...props}
      >
        {placeholder ? (
          <option disabled value="">
            {placeholder}
          </option>
        ) : null}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <img
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute right-3 top-1/2 h-[14px] w-[14px] -translate-y-1/2 object-contain"
        src="/icons/chevron-down.svg"
      />
    </div>
  );
}
