import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import DlpSolutionContent, { type DlpCopy } from "./DlpSolutionContent";
import DlpENSolutionContent from "./content.en";
import DlpKOSolutionContent from "./content.ko";

vi.mock("@/components/sections/Cta", () => ({
  default: () => <div>CTA</div>,
}));

const copy: DlpCopy = {
  demoItems: [
    { description: "See risk scoring.", imageSrc: "/demo/dlp-electra-thumbnail.png", title: "ELECTRA risk screening demo" },
    { description: "See sensitive data.", imageSrc: "/demo/dlp-demo-thumbnail.png", title: "SLM extraction demo" },
  ],
  demoLinkLabel: "Try the external demo",
  demoTitle: "DLP detection demo",
  description: "Description",
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
  it("영어 페이지는 영어 데모 이미지를, 한국어 페이지는 한국어 데모 이미지를 보여준다", () => {
    const { unmount } = render(<DlpENSolutionContent locale="en" />);
    expect(screen.getByRole("img", { name: "ELECTRA-based risk screening demo" }))
      .toHaveAttribute("src", "/demo/dlp-electra-thumbnail-en.png");
    expect(screen.getByRole("img", { name: "SLM-based sensitive-data extraction demo" }))
      .toHaveAttribute("src", "/demo/dlp-demo-thumbnail-en.png");

    unmount();
    render(<DlpKOSolutionContent locale="ko" />);
    expect(screen.getByRole("img", { name: "ELECTRA 기반 위험 선별 데모" }))
      .toHaveAttribute("src", "/demo/dlp-electra-thumbnail.png");
    expect(screen.getByRole("img", { name: "SLM 기반 민감정보 추출 데모" }))
      .toHaveAttribute("src", "/demo/dlp-demo-thumbnail.png");
  });

  it("Hugging Face 링크와 외부 데모 콘텐츠 카드를 제공하고 임베드는 사용하지 않는다", () => {
    const { container } = render(<DlpSolutionContent copy={copy} demoUrl="https://example.com/?lang=en" locale="en" />);

    expect(screen.getByRole("link", { name: "Open Hugging Face" })).toHaveAttribute(
      "href",
      "https://huggingface.co/querypieai",
    );
    const demoLinks = screen.getAllByRole("link", { name: /Try the external demo/ });
    expect(demoLinks).toHaveLength(2);
    for (const link of demoLinks) {
      expect(link).toHaveAttribute("href", "https://example.com/?lang=en");
      expect(link).toHaveAttribute("target", "_blank");
    }
    expect(screen.getByRole("img", { name: "ELECTRA risk screening demo" }))
      .toHaveAttribute("src", "/demo/dlp-electra-thumbnail.png");
    expect(screen.getByRole("img", { name: "SLM extraction demo" }))
      .toHaveAttribute("src", "/demo/dlp-demo-thumbnail.png");
    const electraHeading = screen.getByRole("heading", { name: "ELECTRA risk screening demo" });
    const slmHeading = screen.getByRole("heading", { name: "SLM extraction demo" });
    const huggingFaceHeading = screen.getByRole("heading", { name: "Use the DLP models on Hugging Face" });
    expect(electraHeading.compareDocumentPosition(slmHeading) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(slmHeading.compareDocumentPosition(huggingFaceHeading) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(container.querySelector("iframe")).toBeNull();
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
