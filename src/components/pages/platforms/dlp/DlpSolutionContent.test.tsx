import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import DlpSolutionContent, { type DlpCopy } from "./DlpSolutionContent";

vi.mock("@/components/sections/Cta", () => ({
  default: () => <div>CTA</div>,
}));

vi.mock("@/components/sections/FeatureMediaList", () => ({
  default: () => <div>Feature media</div>,
}));

const copy: DlpCopy = {
  benefitItems: [{ body: "Benefit body", title: "Benefit title" }],
  description: "Description",
  featureBody: "Feature body",
  featureImageAlt: "Architecture",
  featureImageSrc: "/architecture.png",
  featureTitle: "Feature title",
  heading: "Data Loss Prevention",
  huggingFaceDescription: "Use the published models.",
  huggingFaceLabel: "Open Hugging Face",
  huggingFaceTitle: "Use the DLP models on Hugging Face",
  label: "QueryPie DLP Research",
  tutorialTitle: "DLP demo video",
};

describe("DlpSolutionContent", () => {
  it("라이브 데모 대신 Hugging Face 모델 링크를 제공한다", () => {
    const { container } = render(<DlpSolutionContent copy={copy} locale="en" />);

    expect(screen.getByRole("link", { name: "Open Hugging Face" })).toHaveAttribute(
      "href",
      "https://huggingface.co/querypieai",
    );
    expect(screen.getByRole("link", { name: "DLP demo video" })).toHaveAttribute(
      "href",
      "https://youtu.be/8iZmadjxmP4",
    );
    expect(container.querySelector("iframe")).not.toBeInTheDocument();
  });
});
