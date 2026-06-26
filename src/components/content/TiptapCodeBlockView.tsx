"use client";

import type { NodeViewProps } from "@tiptap/react";
import { NodeViewContent, NodeViewWrapper } from "@tiptap/react";

export default function TiptapCodeBlockView({ node }: NodeViewProps) {
  const lineCount = Math.max(1, node.textContent.split("\n").length);

  return (
    <NodeViewWrapper className="editor-code-block-shell code-block-shell type-content-mono">
      <div className="code-block-gutter type-content-mono">
        {Array.from({ length: lineCount }).map((_, index) => (
          <span className="code-line-number type-content-mono" key={index}>
            {index + 1}
          </span>
        ))}
      </div>
      <pre className="type-content-mono">
        <code className="type-content-mono">
          <NodeViewContent
            className="block whitespace-pre outline-none"
            spellCheck={false}
          />
        </code>
      </pre>
    </NodeViewWrapper>
  );
}
