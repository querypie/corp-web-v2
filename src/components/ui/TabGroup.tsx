import type { ReactNode } from "react";

type TabGroupProps = {
  children: ReactNode;
  className?: string;
};

function cx(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

export default function TabGroup({
  children,
  className,
}: TabGroupProps) {
  return (
    <div className={cx("inline-flex rounded-full bg-bg-deep p-0.5", className)}>
      <div className="inline-flex items-center rounded-full">
        {children}
      </div>
    </div>
  );
}
