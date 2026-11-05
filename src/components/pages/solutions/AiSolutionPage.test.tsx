import { render, screen, cleanup } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import AiSolutionPage from "./AiSolutionPage";
import PenetrationTestingPage from "./japan/PenetrationTestingPage";
import { aiSolutionsCopy } from "@/copy/aiSolutions";

describe("영어·한국어 AI 솔루션", () => {
  it.each(["en", "ko", "ja"] as const)("%s QEV·QLM은 구성도 없이 같은 더미 레이아웃을 사용한다", (locale) => {
    for (const id of ["qev", "qlm"] as const) {
      const { container } = render(<AiSolutionPage id={id} locale={locale} />);
      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(id.toUpperCase());
      expect(container.querySelectorAll("section")).toHaveLength(4);
      expect(screen.getAllByRole("article")).toHaveLength(6);
      expect(screen.getByText(aiSolutionsCopy[locale][id].hero.imageLabel)).toBeInTheDocument();
      expect(screen.queryByRole("figure")).not.toBeInTheDocument();
      expect(container.querySelector("section svg")).toBeNull();
      expect(screen.getByText(aiSolutionsCopy[locale][id].cta.title)).toBeInTheDocument();
      expect(screen.getByRole("link")).toHaveAttribute("href", `/${locale}/contact-us`);
      cleanup();
    }
  });

  it.each(["en", "ko"] as const)("%s 본문·시각화·문의 링크에서 일본어 사이트로 넘어가지 않는다", (locale) => {
    for (const id of ["ai-gateway", "qlm", "qev"] as const) {
      const { container } = render(<AiSolutionPage id={id} locale={locale} />);
      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(aiSolutionsCopy[locale][id].hero.title);
      if (id === "ai-gateway") expect(screen.getAllByRole("figure").length).toBeGreaterThan(0);
      else expect(screen.queryByRole("figure")).not.toBeInTheDocument();
      expect(container.textContent).not.toMatch(/[\u3040-\u30ff]/);
      for (const link of screen.queryAllByRole("link")) {
        expect(link).toHaveAttribute("href", `/${locale}/contact-us`);
      }
      cleanup();
    }
    const { container } = render(<PenetrationTestingPage locale={locale} />);
    expect(screen.getAllByRole("button")).toHaveLength(30);
    expect(screen.getByRole("link")).toHaveAttribute("href", `/${locale}/contact-us`);
    expect(container.textContent).not.toMatch(/[\u3040-\u30ff]/);
  });
});
