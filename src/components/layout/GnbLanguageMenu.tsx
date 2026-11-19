import type { ReactNode } from "react";

export const gnbLanguageOptionClassName =
  "flex items-center whitespace-nowrap py-1 type-body-md";

export function GnbLanguageIcon({ className }: { className: string }) {
  return (
    <img
      alt=""
      aria-hidden="true"
      className={`theme-icon object-contain transition-[filter,opacity] duration-300 group-hover:opacity-50 ${className}`}
      src="/assets/ui/icons/global.svg"
    />
  );
}

export function GnbLanguagePopover({ children }: { children: ReactNode }) {
  return (
    <div className="gnb-popover-surface relative overflow-hidden rounded-[8px] px-6 pb-[14px] pt-3 backdrop-blur-[18px]">
      {children}
    </div>
  );
}
