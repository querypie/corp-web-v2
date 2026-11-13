"use client";

import { useState, type SelectHTMLAttributes } from "react";
import { ChevronDown } from "lucide-react";

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
  "ui-field-shell inline-flex h-10 w-full items-center overflow-hidden rounded-button bg-bg-content px-3 transition-colors hover:bg-bg-hover";

const fieldTextClassName =
  "min-w-0 flex-1 border-0 bg-transparent type-body-md text-fg outline-none";

export default function Select({
  className,
  defaultValue = "",
  options,
  placeholder,
  onChange,
  value,
  ...props
}: SelectProps) {
  const [selectedValue, setSelectedValue] = useState(String(value ?? defaultValue));
  const resolvedValue = value ?? selectedValue;
  const selectedOption = options.find((option) => option.value === String(resolvedValue));
  const selectedLabel = selectedOption?.label ?? placeholder ?? options[0]?.label;

  return (
    <div className={cx(fieldShellClassName, "relative", className)}>
      <span
        aria-hidden="true"
        className={cx(
          fieldTextClassName,
          "pointer-events-none truncate pr-7",
          resolvedValue ? "text-fg" : "text-placeholder",
        )}
      >
        {selectedLabel}
      </span>
      <select
        className="absolute inset-0 h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
        onChange={(event) => {
          setSelectedValue(event.target.value);
          onChange?.(event);
        }}
        value={resolvedValue}
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
      <ChevronDown
        aria-hidden="true"
        className="pointer-events-none absolute right-3 top-1/2 h-[14px] w-[14px] -translate-y-1/2"
      />
    </div>
  );
}
