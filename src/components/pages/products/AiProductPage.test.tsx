import { render, screen, cleanup } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import AiProductPage from "./AiProductPage";
import PenetrationTestingPage from "@/components/pages/services/penetration-testing/PenetrationTestingPage";
import { aiProductsCopy, aiProductAction } from "@/copy/aiProducts";
import { aiGatewayManualLabel } from "@/copy/aiGatewayLocalized";
import { qevCopy } from "@/copy/qevLocalized";
import { qlmCopy } from "@/copy/qlmLocalized";

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

  it.each(["en", "ko", "ja"] as const)("%s QEV·QLM은 번역된 본문·다이어그램·문의 경로를 제공한다", (locale) => {
    for (const id of ["qev", "qlm"] as const) {
      const copy = id === "qev" ? qevCopy[locale] : qlmCopy[locale];
      const { container } = render(<AiProductPage id={id} locale={locale} />);
      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(copy.hero.title);
      expect(screen.getAllByRole("figure")).toHaveLength(id === "qev" ? 3 : 1);
      expect(screen.getByRole("link", { name: copy.cta.action })).toHaveAttribute("href", `/${locale}/contact-us?inquiry=ai-consulting`);
      expect(container.textContent).not.toMatch(/coming soon|準備中|준비 중/i);
      if (locale !== "ko") expect(container.innerHTML).not.toMatch(/[가-힣]/);
      if (locale === "en") expect(container.textContent).not.toMatch(/[\u3040-\u30ff]/);
      if (id === "qlm") {
        expect(screen.getAllByRole("article")).toHaveLength(6);
        expect(screen.getByRole("table").querySelectorAll("tbody tr")).toHaveLength(4);
        expect(container.innerHTML).not.toMatch(/deepseek|v4\.1/i);
      } else {
        expect(screen.getByRole("link", { name: qevCopy[locale].explore.demoLabel })).toHaveAttribute("href", "https://qev.demo.querypie.com");
      }
      cleanup();
    }
  });

  it.each(["en", "ko"] as const)("%s 본문·시각화·문의 링크에서 일본어 사이트로 넘어가지 않는다", (locale) => {
    for (const id of ["ai-gateway", "qlm", "qev"] as const) {
      const { container } = render(<AiProductPage id={id} locale={locale} />);
      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(aiProductsCopy[locale][id].hero.title);
      expect(screen.getAllByRole("figure").length).toBeGreaterThan(0);
      expect(container.textContent).not.toMatch(/[\u3040-\u30ff]/);
      for (const link of screen.queryAllByRole("link")) {
        if (id === "ai-gateway" && link.textContent === aiGatewayManualLabel[locale]) continue;
        if (id === "qev" && ["https://qev.demo.querypie.com", "https://huggingface.co/querypieai"].includes(link.getAttribute("href") ?? "")) continue;
        expect(link).toHaveAttribute("href", id === "ai-gateway" ? `/${locale}/contact-us?inquiry=ai-consulting&product=aig` : `/${locale}/contact-us?inquiry=ai-consulting`);
      }
      cleanup();
    }
    const { container } = render(<PenetrationTestingPage locale={locale} />);
    expect(screen.getAllByRole("button")).toHaveLength(30);
    expect(screen.getByRole("link")).toHaveAttribute("href", `/${locale}/contact-us?inquiry=ai-consulting&product=penetrationtest`);
    expect(container.textContent).not.toMatch(/[\u3040-\u30ff]/);
  });

  it("한국어 QLM은 기반 모델명 없이 차별화와 공개 평가 조건을 제공한다", () => {
    const { container } = render(<AiProductPage id="qlm" locale="ko" />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("QueryPie LLM");
    expect(screen.getAllByRole("article")).toHaveLength(6);
    expect(screen.getByRole("table", { name: "모델 벤치마크" })).toBeInTheDocument();
    expect(screen.getByRole("rowheader", { name: "소프트웨어 개발" })).toBeInTheDocument();
    expect(screen.getByRole("cell", { name: "45.4%" })).toBeInTheDocument();
    expect(screen.getByRole("cell", { name: "75–80%" })).toBeInTheDocument();
    expect(screen.getByRole("cell", { name: "80–85%" })).toBeInTheDocument();
    expect(screen.getByRole("table").querySelectorAll("tbody td")).toHaveLength(16);
    expect(screen.queryByRole("cell", { name: "—" })).not.toBeInTheDocument();
    expect(screen.getByRole("rowheader", { name: "긴 문서 추론" })).toBeInTheDocument();
    expect(screen.getByRole("rowheader", { name: "실무 과제 수행 (Elo)" })).toBeInTheDocument();
    expect(screen.getByRole("cell", { name: "1,750–1,800" })).toBeInTheDocument();
    expect(screen.getByRole("rowheader", { name: "업무 자동화" })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "GPT-6.1 Terra" })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "Claude Sonnet 5.5" })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "Gemini 4 Argon" })).toBeInTheDocument();
    expect(screen.queryByText("기반 모델 공개값")).not.toBeInTheDocument();
    expect(screen.getByRole("table").querySelector("[title], a")).toBeNull();
    expect(screen.queryByText(/공통 조건/)).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "도입 문의" })).toHaveAttribute("href", "/ko/contact-us?inquiry=ai-consulting");
    expect(container.innerHTML).not.toMatch(/deepseek|v4\.1|콘텐츠 준비 중/i);
    expect(container.querySelector("header img")).toBeNull();
  });

  it("한국어 QEV는 모델 설명, 활용 사례, 성능 수치와 문의 동선을 제공한다", () => {
    render(<AiProductPage id="qev" locale="ko" />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("QEV가 판단합니다.");
    expect(screen.getByRole("figure", { name: "QEV 의사결정 흐름" })).toBeInTheDocument();
    expect(screen.getAllByRole("table")).toHaveLength(1);
    expect(screen.getByRole("heading", { name: "Auto Router" })).toBeInTheDocument();
    expect(screen.queryByText("콘텐츠 준비 중")).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "도입 문의" })).toHaveAttribute("href", "/ko/contact-us?inquiry=ai-consulting");
    expect(screen.getByRole("link", { name: "QEV 데모 체험하기" })).toHaveAttribute("href", "https://qev.demo.querypie.com");
    expect(screen.getByRole("link", { name: "Hugging Face 바로가기" })).toHaveAttribute("href", "https://huggingface.co/querypieai");
  });
});
