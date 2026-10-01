import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { localLlmCopy as copy } from "@/copy/localLlm";
import LocalLlmPage from "./LocalLlmPage";

describe("LocalLlmPage", () => {
  it("일본어 핵심 섹션과 문의 동선을 렌더링한다", () => {
    render(<LocalLlmPage />);

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Local LLMとAI Agent");
    for (const title of [copy.environment.title, copy.development.title, copy.agents.title, copy.platform.title]) {
      expect(screen.getByRole("heading", { level: 2, name: title })).toBeInTheDocument();
    }
    expect(screen.getByRole("img", { name: copy.hero.imageAlt })).toBeInTheDocument();
    const contactLinks = screen.getAllByRole("link", { name: copy.action });
    expect(contactLinks).toHaveLength(2);
    for (const link of contactLinks) {
      expect(link).toHaveAttribute("href", "/ja/contact-us");
    }
  });
});
