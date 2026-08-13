import type { HTMLAttributes } from "react";

type ButtonGroupProps = HTMLAttributes<HTMLDivElement>;

function cx(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

export default function ButtonGroup({ className, ...props }: ButtonGroupProps) {
  return <div {...props} className={cx("flex gap-2.5", className)} />;
}
