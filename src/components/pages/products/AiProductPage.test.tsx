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

  it.each(["en", "ko", "ja"] as const)("%s 미작업 QEV·QLM은 더미 레이아웃을 유지한다", (locale) => {
    for (const id of ["qev", "qlm"] as const) {
      if (id === "qev" && locale === "ko") continue;
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
      if (id === "ai-gateway" || (id === "qev" && locale === "ko")) expect(screen.getAllByRole("figure").length).toBeGreaterThan(0);
      else expect(screen.queryByRole("figure")).not.toBeInTheDocument();
      expect(container.textContent).not.toMatch(/[\u3040-\u30ff]/);
      for (const link of screen.queryAllByRole("link")) {
        if (id === "ai-gateway" && link.textContent === aiGatewayManualLabel[locale]) continue;
        if (id === "qev" && ["https://qev.demo.querypie.com", "https://huggingface.co/querypieai"].includes(link.getAttribute("href") ?? "")) continue;
        expect(link).toHaveAttribute("href", id === "ai-gateway" ? `/${locale}/contact-us?inquiry=ai-consulting&product=aig` : `/${locale}/contact-us`);
      }
      cleanup();
    }
    const { container } = render(<PenetrationTestingPage locale={locale} />);
    expect(screen.getAllByRole("button")).toHaveLength(30);
    expect(screen.getByRole("link")).toHaveAttribute("href", `/${locale}/contact-us?inquiry=ai-consulting&product=penetrationtest`);
    expect(container.textContent).not.toMatch(/[\u3040-\u30ff]/);
  });

  it("한국어 QEV는 모델 설명, 활용 사례, 성능 수치와 문의 동선을 제공한다", () => {
    render(<AiProductPage id="qev" locale="ko" />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("QEV가 판단합니다.");
    expect(screen.getByRole("figure", { name: "QEV 의사결정 흐름" })).toBeInTheDocument();
    expect(screen.getAllByRole("table")).toHaveLength(1);
    expect(screen.getByRole("heading", { name: "Auto Router" })).toBeInTheDocument();
    expect(screen.queryByText("콘텐츠 준비 중")).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "도입 문의" })).toHaveAttribute("href", "/ko/contact-us");
    expect(screen.getByRole("link", { name: "QEV 데모 체험하기" })).toHaveAttribute("href", "https://qev.demo.querypie.com");
    expect(screen.getByRole("link", { name: "Hugging Face 바로가기" })).toHaveAttribute("href", "https://huggingface.co/querypieai");
  });
});
