import type { TextareaHTMLAttributes } from "react";

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

function cx(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

const textareaClassName =
  "ui-field w-full rounded-button px-4 py-3 type-body-md text-fg outline-none";

export default function Textarea({
  className,
  ...props
}: TextareaProps) {
  return (
    <textarea
      className={cx(textareaClassName, className)}
      {...props}
    />
  );
}
