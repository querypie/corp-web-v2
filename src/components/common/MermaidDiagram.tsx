"use client";

import { useEffect, useId, useState } from "react";
import mermaid from "mermaid";
import { CONTENT_PREVIEW_CODEBLOCK_CLASS } from "@/features/content/previewStyles";
import { renderLineNumberedCodeBlock } from "@/features/content/codeHighlight";

let isMermaidInitialized = false;

type MermaidDiagramProps = {
  code: string;
};

export default function MermaidDiagram({ code }: MermaidDiagramProps) {
  const renderId = useId().replace(/:/g, "-");
  const [svg, setSvg] = useState<string | null>(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function renderDiagram() {
      if (!isMermaidInitialized) {
        mermaid.initialize({
          securityLevel: "loose",
          startOnLoad: false,
          theme: "dark",
        });
        isMermaidInitialized = true;
      }

      try {
        const { svg: nextSvg } = await mermaid.render(`mermaid-${renderId}`, code);

        if (cancelled) {
          return;
        }

        setSvg(nextSvg);
        setHasError(false);
      } catch {
        if (cancelled) {
          return;
        }

        setSvg(null);
        setHasError(true);
      }
    }

    void renderDiagram();

    return () => {
      cancelled = true;
    };
  }, [code, renderId]);

  if (hasError || !svg) {
    return (
      <div
        className={CONTENT_PREVIEW_CODEBLOCK_CLASS}
        dangerouslySetInnerHTML={{ __html: renderLineNumberedCodeBlock(code, "mermaid") }}
      />
    );
  }

  return (
    <div className="overflow-x-auto bg-bg-content p-4 md:p-5">
      <div
        className="[&_svg]:mx-auto [&_svg]:block [&_svg]:h-auto [&_svg]:max-w-full"
        dangerouslySetInnerHTML={{ __html: svg }}
      />
    </div>
  );
}
