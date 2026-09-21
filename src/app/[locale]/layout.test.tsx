import { Children, isValidElement } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("@/components/site/ai-chat/AiChatWidget", () => ({ default: () => null }));

import AiChatWidget from "@/components/site/ai-chat/AiChatWidget";
import LocaleLayout from "./layout";

afterEach(() => vi.unstubAllEnvs());

describe("공개 레이아웃 챗봇 표시", () => {
  it.each(["en", "ko", "ja"])("%s에서 활성화 설정에 따라 챗봇을 포함한다", async (locale) => {
    for (const enabled of ["false", undefined, "true"]) {
      vi.stubEnv("AI_CHAT_ENABLED", enabled);
      const layout = await LocaleLayout({ children: null, params: Promise.resolve({ locale }) });
      const hasWidget = Children.toArray(layout.props.children).some(
        (child) => isValidElement(child) && child.type === AiChatWidget,
      );
      expect(hasWidget).toBe(enabled === "true");
    }
  });
});
