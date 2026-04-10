const MERMAID_BLOCK_PREFIXES = [
  "flowchart ",
  "graph ",
  "sequenceDiagram",
  "classDiagram",
  "stateDiagram",
  "stateDiagram-v2",
  "erDiagram",
  "journey",
  "gantt",
  "pie",
  "mindmap",
  "timeline",
];

export function isMermaidLanguage(language?: string) {
  return (language ?? "").trim().toLowerCase() === "mermaid";
}

export function isMermaidCode(code: string) {
  const normalized = code.trimStart();
  return MERMAID_BLOCK_PREFIXES.some((prefix) => normalized.startsWith(prefix));
}

export function shouldRenderMermaid(code: string, language?: string) {
  return isMermaidLanguage(language) || isMermaidCode(code);
}
