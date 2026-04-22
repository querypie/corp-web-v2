import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import MermaidDiagram from "./MermaidDiagram";

const initialize = vi.fn();
const renderDiagram = vi.fn();

vi.mock("mermaid", () => ({
  default: {
    initialize,
    render: renderDiagram,
  },
}));

describe("MermaidDiagram", () => {
  beforeEach(() => {
    initialize.mockReset();
    renderDiagram.mockReset();
  });

  it("Mermaid 코드를 SVG로 렌더링한다", async () => {
    renderDiagram.mockResolvedValue({ svg: "<svg><text>Rendered Mermaid</text></svg>" });

    const { container } = render(<MermaidDiagram code={"graph TD\nA-->B"} />);

    expect(screen.getByText("Loading diagram...")).toBeInTheDocument();

    await waitFor(() => {
      expect(container.querySelector("svg")).toBeInTheDocument();
    });

    expect(initialize).toHaveBeenCalledWith({ startOnLoad: false });
    expect(renderDiagram).toHaveBeenCalled();
  });

  it("렌더링 실패 시 에러 메시지를 보여준다", async () => {
    renderDiagram.mockRejectedValue(new Error("Invalid mermaid syntax"));

    render(<MermaidDiagram code={"graph TD\nA-->"} />);

    await waitFor(() => {
      expect(screen.getByText("Invalid mermaid syntax")).toBeInTheDocument();
    });
  });
});
