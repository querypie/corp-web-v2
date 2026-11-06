import { render, screen, cleanup } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import AiProductPage from "./AiProductPage";
import PenetrationTestingPage from "@/components/pages/services/penetration-testing/PenetrationTestingPage";
import { aiProductsCopy, aiProductAction } from "@/copy/aiProducts";
import { aiGatewayManualLabel } from "@/copy/aiGatewayLocalized";

describe("영어·한국어 AI 솔루션", () => {
  it.each(["en", "ko", "ja"] as const)("%s AIG 문의 CTA는 AI 상담과 AIG를 전달하며 현재 탭에서 열린다", (locale) => {
    render(<AiProductPage id="ai-gateway" locale={locale} />);
    const link = screen.getByRole("link", { name: aiProductAction[locale] });
    expect(link).toHaveAttribute("href", `/${locale}/contact-us?inquiry=ai-consulting&product=aig`);
    expect(link).not.toHaveAttribute("target");
    const manual = screen.getByRole("link", { name: aiGatewayManualLabel[locale] });
    expect(manual).toHaveAttribute("href", `https://ai-gateway.dev.querypie.io/manual/${locale === "en" ? "" : `${locale}/`}`);
    expect(manual).toHaveAttribute("target", "_blank");
    expect(screen.getAllByRole("link")).toEqual([link, manual]);
  });

  it.each(["en", "ko", "ja"] as const)("%s QEV·QLM은 구성도 없이 같은 더미 레이아웃을 사용한다", (locale) => {
    for (const id of ["qev", "qlm"] as const) {
      const { container } = render(<AiProductPage id={id} locale={locale} />);
      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(id.toUpperCase());
      expect(container.querySelectorAll("section")).toHaveLength(4);
      expect(screen.getAllByRole("article")).toHaveLength(6);
      expect(screen.getByText(aiProductsCopy[locale][id].hero.imageLabel)).toBeInTheDocument();
      expect(screen.queryByRole("figure")).not.toBeInTheDocument();
      expect(container.querySelector("section svg")).toBeNull();
      expect(screen.getByText(aiProductsCopy[locale][id].cta.title)).toBeInTheDocument();
      expect(screen.getByRole("link")).toHaveAttribute("href", `/${locale}/contact-us`);
      cleanup();
    }
  });

  it.each(["en", "ko"] as const)("%s 본문·시각화·문의 링크에서 일본어 사이트로 넘어가지 않는다", (locale) => {
    for (const id of ["ai-gateway", "qlm", "qev"] as const) {
      const { container } = render(<AiProductPage id={id} locale={locale} />);
      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(aiProductsCopy[locale][id].hero.title);
      if (id === "ai-gateway") expect(screen.getAllByRole("figure").length).toBeGreaterThan(0);
      else expect(screen.queryByRole("figure")).not.toBeInTheDocument();
      expect(container.textContent).not.toMatch(/[\u3040-\u30ff]/);
      for (const link of screen.queryAllByRole("link")) {
        if (id === "ai-gateway" && link.textContent === aiGatewayManualLabel[locale]) continue;
        expect(link).toHaveAttribute("href", id === "ai-gateway" ? `/${locale}/contact-us?inquiry=ai-consulting&product=aig` : `/${locale}/contact-us`);
      }
      cleanup();
    }
    const { container } = render(<PenetrationTestingPage locale={locale} />);
    expect(screen.getAllByRole("button")).toHaveLength(30);
    expect(screen.getByRole("link")).toHaveAttribute("href", `/${locale}/contact-us?inquiry=ai-consulting&product=penetrationtest`);
    expect(container.textContent).not.toMatch(/[\u3040-\u30ff]/);
  });
});
