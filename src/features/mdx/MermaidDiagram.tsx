"use client";

import { useEffect, useId, useRef, useState } from "react";

type MermaidDiagramProps = {
  code: string;
};

export default function MermaidDiagram({ code }: MermaidDiagramProps) {
  const id = useId().replace(/:/g, "-");
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function renderDiagram() {
      try {
        const mermaid = (await import("mermaid")).default;
        mermaid.initialize({ startOnLoad: false });

        if (cancelled) return;

        const { svg } = await mermaid.render(`mermaid-${id}`, code);

        if (cancelled || !containerRef.current) return;

        containerRef.current.innerHTML = svg;
        setError(null);
        setLoading(false);
      } catch (renderError) {
        if (cancelled) return;
        setError(renderError instanceof Error ? renderError.message : "Failed to render diagram");
        setLoading(false);
      }
    }

    setLoading(true);
    setError(null);
    renderDiagram();

    return () => {
      cancelled = true;
    };
  }, [code, id]);

  if (error) {
    return (
      <div className="w-full overflow-x-auto rounded-[10px] border border-destructive px-4 py-3 type-content-mono text-sm text-destructive whitespace-pre-wrap">
        {error}
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto rounded-[10px] bg-bg-content px-4 py-4">
      {loading && <div className="text-center text-sm text-mute-fg">Loading diagram...</div>}
      <div ref={containerRef} className={loading ? "hidden min-w-max" : "block min-w-max [&_svg]:max-w-none"} />
    </div>
  );
}
