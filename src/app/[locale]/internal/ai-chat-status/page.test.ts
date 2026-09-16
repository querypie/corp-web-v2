import { describe, expect, it, vi } from "vitest";
import type { ReactElement } from "react";

vi.mock("@/features/ai-chat/status.server", () => ({
  getAiChatStatusConfig: vi.fn(),
}));

import * as route from "./page";

type RouteCopy = Record<"en" | "ko" | "ja", {
  metadataTitle: string;
  title: string;
  description: string;
  action: string;
  notices: { rateLimit: string };
  errors: { albForbidden: string };
}>;

function collectStrings(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (!value || typeof value !== "object") return [];
  return Object.values(value).flatMap(collectStrings);
}

describe("locale별 AI Chat 상태 진단 문구", () => {
  async function getCopy(locale: "en" | "ko" | "ja") {
    const renderRoute = route.default as (props: {
      params: Promise<{ locale: string }>;
    }) => Promise<ReactElement<{ copy: RouteCopy[typeof locale] }>>;
    const element = await renderRoute({ params: Promise.resolve({ locale }) });
    return element.props.copy;
  }

  it("route-local copy를 영어, 한국어, 일본어로 제공한다", async () => {
    const [en, ko, ja] = await Promise.all([getCopy("en"), getCopy("ko"), getCopy("ja")]);

    expect(en).toMatchObject({
      metadataTitle: "AI Chat Status",
      title: "AI Chat Status",
      action: "Run basic request",
    });
    expect(en.description).toContain("The browser is not used as a proxy.");
    expect(en.notices.rateLimit).toContain("30 requests per minute");
    expect(en.errors.albForbidden).toContain("ALB/WAF");

    expect(ko).toMatchObject({
      metadataTitle: "AI Chat 상태 진단",
      title: "AI Chat 상태 진단",
      action: "기본 요청 테스트",
    });
    expect(ko.notices.rateLimit).toContain("분당 30회");
    expect(ja).toMatchObject({
      metadataTitle: "AI Chat ステータス診断",
      title: "AI Chat ステータス診断",
      action: "基本リクエストをテスト",
    });
    expect(ja.notices.rateLimit).toContain("1分あたり30回");
    expect(collectStrings(en).join(" ")).not.toMatch(/[가-힣]/);
    expect(collectStrings(ja).join(" ")).not.toMatch(/[가-힣]/);
  });

  it("locale에 맞는 metadata를 생성한다", async () => {
    const generateMetadata = (route as typeof route & {
      generateMetadata?: (props: { params: Promise<{ locale: string }> }) => Promise<{ title?: string; description?: string }>;
    }).generateMetadata;

    expect(generateMetadata).toBeTypeOf("function");
    await expect(generateMetadata?.({ params: Promise.resolve({ locale: "en" }) })).resolves.toMatchObject({
      title: "AI Chat Status",
      description: expect.stringContaining("The browser is not used as a proxy."),
    });
    await expect(generateMetadata?.({ params: Promise.resolve({ locale: "ja" }) })).resolves.toMatchObject({
      title: "AI Chat ステータス診断",
      description: expect.stringContaining("ブラウザをプロキシとして使用しません"),
    });
  });
});
