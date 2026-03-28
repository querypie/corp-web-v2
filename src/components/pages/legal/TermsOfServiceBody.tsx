"use client";

import { useEffect, useState } from "react";

type TermsOfServiceBodyProps = {
  bodyHtml: string;
};

export default function TermsOfServiceBody({
  bodyHtml,
}: TermsOfServiceBodyProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div
      className={[
        "flex flex-col gap-6 text-fg",
        "[&_h2]:m-0 [&_h2]:mt-12 [&_h2:first-of-type]:mt-0 [&_h2]:type-h2 [&_h2]:leading-[30px] [&_h2]:text-fg",
        "[&_h3]:m-0 [&_h3]:mt-7 [&_h3:first-of-type]:mt-0 [&_h3]:type-h3 [&_h3]:text-fg",
        "[&_p]:m-0 [&_p]:mt-4 [&_p:first-child]:mt-0 [&_p]:type-body-lg [&_p]:leading-8 [&_p]:whitespace-pre-wrap [&_p]:text-fg",
        "[&_strong]:font-semibold [&_strong]:text-fg",
        "[&_a]:text-brand [&_a]:underline [&_a]:decoration-border [&_a]:underline-offset-4 [&_a]:transition-colors hover:[&_a]:text-fg",
        "[&_ul]:m-0 [&_ul]:mt-4 [&_ul]:flex [&_ul]:list-disc [&_ul]:flex-col [&_ul]:gap-2 [&_ul]:pl-6",
        "[&_ol]:m-0 [&_ol]:mt-4 [&_ol]:flex [&_ol]:list-decimal [&_ol]:flex-col [&_ol]:gap-2 [&_ol]:pl-6",
        "[&_li]:type-body-lg [&_li]:leading-8 [&_li]:text-fg",
        "[&_li>p]:mt-0",
        "[&_li>ul]:mt-2 [&_li>ol]:mt-2",
        "[&_table]:my-8 [&_table]:w-full [&_table]:min-w-[720px] [&_table]:border-collapse",
        "[&_thead]:bg-bg-content",
        "[&_th]:border [&_th]:border-border [&_th]:px-4 [&_th]:py-3 [&_th]:text-left [&_th]:align-top [&_th]:type-body-lg [&_th]:font-semibold [&_th]:text-fg",
        "[&_td]:border [&_td]:border-border [&_td]:px-4 [&_td]:py-3 [&_td]:align-top [&_td]:type-body-lg [&_td]:leading-7 [&_td]:text-fg",
        "[&_td>p]:mt-0 [&_td>ul]:mt-0 [&_td>ol]:mt-0",
        "[&_div:has(>table)]:w-full [&_div:has(>table)]:overflow-x-auto [&_div:has(>table)]:pb-2",
        "[&_br]:block [&_br]:content-[''] [&_br]:mb-2",
      ].join(" ")}
      dangerouslySetInnerHTML={{ __html: bodyHtml }}
    />
  );
}
