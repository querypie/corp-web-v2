"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Select from "../../common/Select";

type LegalVersionOption = {
  href: string;
  label: string;
  value: string;
};

type LegalVersionSelectProps = {
  options: LegalVersionOption[];
  value: string;
};

export default function LegalVersionSelect({
  options,
  value,
}: LegalVersionSelectProps) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    const selected = options.find((option) => option.value === value);

    return (
      <div className="ui-field-shell inline-flex h-10 w-full max-w-[280px] items-center overflow-hidden rounded-button bg-bg-content px-3">
        <span className="min-w-0 flex-1 type-body-md text-fg">
          {selected?.label ?? value}
        </span>
        <img
          alt=""
          aria-hidden="true"
          className="pointer-events-none h-[14px] w-[14px] object-contain"
          src="/icons/chevron-down.svg"
        />
      </div>
    );
  }

  return (
    <Select
      className="max-w-[280px]"
      defaultValue={value}
      onChange={(event) => {
        const nextHref = options.find((option) => option.value === event.target.value)?.href;

        if (nextHref) {
          router.push(nextHref);
        }
      }}
      options={options.map((option) => ({
        label: option.label,
        value: option.value,
      }))}
    />
  );
}
