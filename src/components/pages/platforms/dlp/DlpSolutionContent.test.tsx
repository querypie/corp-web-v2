import { render, screen, within } from "@testing-library/react";
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
  it("영어와 한국어 페이지에서 SLM 예시와 탐지 결과를 해당 언어로 보여준다", () => {
    const { unmount } = render(<DlpENSolutionContent locale="en" />);
    expect(screen.getByRole("heading", { name: "SLM-based DLP" })).toBeInTheDocument();
    expect(screen.getByText("Detection results")).toBeInTheDocument();
    expect(screen.getByText("Kim Minsu", { selector: "span" })).toBeInTheDocument();
    expect(screen.getByText("Test sentence")).toBeInTheDocument();
    expect(screen.getByText("Risk screening result")).toBeInTheDocument();
    expect(screen.getByText("Block decision")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "From rule checks to risk screening and sensitive-data extraction", level: 2 })).toHaveClass("type-h2");
    expect(screen.getByText("Checks input with regular expressions, screens risk with an ELECTRA-based model, and extracts sensitive data with an SLM-based model.")).toBeInTheDocument();

    unmount();
    render(<DlpKOSolutionContent locale="ko" />);
    expect(screen.getByRole("heading", { name: "SLM 기반 DLP" })).toBeInTheDocument();
    expect(screen.getByText("탐지 결과")).toBeInTheDocument();
    expect(screen.getByText("김민수", { selector: "span" })).toBeInTheDocument();
    expect(screen.getByText("검증 문장")).toBeInTheDocument();
    expect(screen.getByText("위험 선별 결과")).toBeInTheDocument();
    expect(screen.getByText("차단 판정")).toBeInTheDocument();
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
    const electraHeading = screen.getByRole("heading", { name: "ELECTRA risk screening demo" });
    const slmHeading = screen.getByRole("heading", { name: "Precise sensitive-data extraction DLP" });
    const huggingFaceHeading = screen.getByRole("heading", { name: "Use the DLP models on Hugging Face" });
    expect(electraHeading.compareDocumentPosition(slmHeading) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(slmHeading.compareDocumentPosition(huggingFaceHeading) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(container.querySelector("iframe")).toBeNull();
  });

  it("제품 기능을 번호 없는 독립된 섹션으로 설명한다", () => {
    const { container } = render(<DlpSolutionContent copy={copy} demoUrl="about:blank" locale="en" />);

    expect(screen.getByRole("heading", { name: "Fast risk screening", level: 2 })).toHaveClass("type-h2");
    expect(screen.getByRole("heading", { name: "Precise sensitive-data extraction", level: 2 })).toHaveClass("type-h2");
    expect(screen.getByRole("heading", { name: "ELECTRA-based DLP", level: 3 })).toHaveClass("type-h3");
    expect(screen.getByRole("heading", { name: "Precise sensitive-data extraction DLP", level: 3 })).toHaveClass("type-h3");
    expect(screen.getByText("Filters risk signals.")).toBeInTheDocument();
    expect(screen.getByText("QueryPie DLP screens risk quickly.")).toBeInTheDocument();
    expect(screen.getByText("QueryPie DLP extracts sensitive phrases.")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "What the risk screener does" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Precise sensitive-data extraction DLP" })).toBeInTheDocument();
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

  it("SLM 탐지 결과에서 이름, 이메일, 전화번호에 각각 민감정보 유형을 표시한다", () => {
    render(<DlpSolutionContent copy={copy} demoUrl="about:blank" locale="ko" />);

    const results = screen.getByText("탐지 결과").parentElement;
    expect(results).not.toBeNull();
    const rows = within(results!).getAllByRole("listitem");
    expect(rows).toHaveLength(3);
    expect(within(rows[0]).getByText("김민수")).toBeInTheDocument();
    expect(within(rows[0]).getByText("PERSON NAME")).toBeInTheDocument();
    expect(within(rows[1]).getByText("minsu.kim@example.com")).toBeInTheDocument();
    expect(within(rows[1]).getByText("EMAIL ADDRESS")).toBeInTheDocument();
    expect(within(rows[2]).getByText("010-1234-5678")).toBeInTheDocument();
    expect(within(rows[2]).getByText("PHONE NUMBER")).toBeInTheDocument();
  });
});
