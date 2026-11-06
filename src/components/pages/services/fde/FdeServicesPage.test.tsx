import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { Locale } from "@/constants/i18n";
import FdeServicesPage from "./FdeServicesPage";

const cases: { locale: Locale; title: string; topics: string[]; cta: string }[] = [
  { locale: "ko", title: "AI 전환 전문가가 함께하는 FDE 서비스", topics: ["문제 발굴", "계획 수립", "맞춤형 AI 에이전트 구축", "작동하는 AI 구현"], cta: "이제 전환하세요." },
  { locale: "en", title: "AI Transformation Expert at Your Service", topics: ["Find Problems", "Make Plans", "Build Custom AI Agents", "Make AI Work"], cta: "Start Transforming." },
  { locale: "ja", title: "AI変革の専門家が伴走する FDEサービス", topics: ["課題の発見", "計画の策定", "カスタムAIエージェント構築", "機能するAIの実現"], cta: "変革を始めよう。" },
];

describe("FdeServicesPage", () => {
  it.each(cases)("$locale의 히어로·4개 주제·기존 CTA를 유지한다", ({ locale, title, topics, cta }) => {
    render(<FdeServicesPage locale={locale} />);

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(title);
    expect(screen.getAllByRole("heading", { level: 2 }).map((heading) => heading.textContent)).toEqual(topics);
    for (const topic of topics) {
      expect(within(screen.getByRole("region", { name: topic })).getAllByRole("heading", { level: 3 }).length).toBeGreaterThan(1);
    }
    expect(screen.getByText(cta)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Agentic AI Platform" })).toHaveAttribute("href", "https://app.querypie.com/");
    expect(screen.getByRole("link", { name: "ACP Community Edition" })).toHaveAttribute("href", `https://docs.querypie.com/${locale}/installation/querypie-acp-community-edition`);

    const image = screen.getByRole("img");
    expect(decodeURIComponent(image.getAttribute("src") ?? "")).toContain("/assets/pages/platforms/aip/fde-services/field-collaboration.webp");
    expect(image.parentElement).toContainElement(screen.getByText(/^(조직에 밀착한|Forward Deployed Engineers \(FDE\)|組織に入り込む)/));
  });
});
