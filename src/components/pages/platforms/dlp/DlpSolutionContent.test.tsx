import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import DlpSolutionContent, { type DlpCopy } from "./DlpSolutionContent";

vi.mock("@/components/sections/Cta", () => ({
  default: () => <div>CTA</div>,
}));

const copy: DlpCopy = {
  benefitItems: [{ body: "Benefit body", title: "Benefit title" }],
  demoEmbedTitle: "DLP detection demo",
  description: "Description",
  fullScreenDemoLabel: "Launch full-screen demo",
  heading: "Data Loss Prevention",
  huggingFaceDescription: "Use the published models.",
  huggingFaceLabel: "Open Hugging Face",
  huggingFaceTitle: "Use the DLP models on Hugging Face",
  label: "QueryPie DLP",
  modelSections: [
    {
      role: "Fast risk screening",
      description: "QueryPie DLP screens risk quickly.",
      flow: [
        { label: "Input", value: "Receives text." },
        { label: "Screen", value: "Calculates risk." },
        { label: "Route", value: "Routes input." },
      ],
      flowTitle: "What the risk screener does",
      title: "Filters risk signals.",
    },
    {
      role: "Precise sensitive-data extraction",
      description: "QueryPie DLP extracts sensitive phrases.",
      flow: [
        { label: "Input", value: "Receives selected text." },
        { label: "Extract", value: "Finds sensitive phrases." },
        { label: "Context", value: "Checks meaning in surrounding text." },
      ],
      flowTitle: "What the PII detector does",
      title: "Pinpoints sensitive data.",
    },
  ],
  processDescription: "Rules, ELECTRA-based screening, and SLM-based extraction.",
  processSteps: [
    { body: "Find predictable data.", title: "Check with rules" },
    { body: "An ELECTRA-based model calculates a risk score.", title: "Screen with ELECTRA-based AI" },
    { body: "An SLM-based model finds exact phrases.", title: "Extract with SLM-based AI" },
  ],
  processTitle: "From rules to screening and extraction.",
};

describe("DlpSolutionContent", () => {
  it("Hugging Face 모델 링크와 하단 라이브 데모를 함께 제공한다", () => {
    const { container } = render(<DlpSolutionContent copy={copy} demoUrl="about:blank" locale="en" />);

    expect(screen.getByRole("link", { name: "Open Hugging Face" })).toHaveAttribute(
      "href",
      "https://huggingface.co/querypieai",
    );
    expect(screen.getByRole("link", { name: "Launch full-screen demo" })).toHaveAttribute(
      "href",
      "/en/platforms/dlp/demo",
    );
    expect(screen.queryByRole("link", { name: "DLP demo video" })).not.toBeInTheDocument();
    expect(container.querySelector("iframe")).toHaveAttribute(
      "src",
      "about:blank",
    );
  });

  it("제품 기능을 번호 없는 독립된 섹션으로 설명한다", () => {
    const { container } = render(<DlpSolutionContent copy={copy} demoUrl="about:blank" locale="en" />);

    expect(screen.getByRole("heading", { name: "Fast risk screening" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Precise sensitive-data extraction" })).toBeInTheDocument();
    expect(screen.getByText("Filters risk signals.")).toBeInTheDocument();
    expect(screen.getByText("Pinpoints sensitive data.")).toBeInTheDocument();
    expect(screen.getByText("QueryPie DLP screens risk quickly.")).toBeInTheDocument();
    expect(screen.getByText("QueryPie DLP extracts sensitive phrases.")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "What the risk screener does" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "What the PII detector does" })).toBeInTheDocument();
    expect(container.querySelectorAll("ol")).toHaveLength(0);
  });

  it("제품 설명 다음에 화살표로 연결된 3단계 흐름을 표시한다", () => {
    render(<DlpSolutionContent copy={copy} demoUrl="about:blank" locale="en" />);

    expect(screen.getByRole("heading", { name: "From rules to screening and extraction." })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Check with rules" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Screen with ELECTRA-based AI" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Extract with SLM-based AI" })).toBeInTheDocument();
    expect(screen.getAllByText(/^0[1-3]$/)).toHaveLength(3);
  });
});
