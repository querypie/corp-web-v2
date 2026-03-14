"use client";

import { useEffect, useState } from "react";

type PromptTyperProps = {
  prompts: string[];
};

const TYPING_INTERVAL_MS = 45;
const HOLD_INTERVAL_MS = 1400;
const DELETING_INTERVAL_MS = 22;

export default function PromptTyper({ prompts }: PromptTyperProps) {
  // 현재 화면에 보이는 문자열 / 프롬프트 인덱스 / 타이핑 단계
  const [displayText, setDisplayText] = useState("");
  const [promptIndex, setPromptIndex] = useState(0);
  const [phase, setPhase] = useState<"typing" | "holding" | "deleting">("typing");

  useEffect(() => {
    // 현재 선택된 프롬프트를 기준으로 typing -> holding -> deleting 순서로 반복
    const currentPrompt = prompts[promptIndex] ?? "";

    if (phase === "holding") {
      const timeoutId = window.setTimeout(() => {
        setPhase("deleting");
      }, HOLD_INTERVAL_MS);

      return () => window.clearTimeout(timeoutId);
    }

    const intervalMs = phase === "typing" ? TYPING_INTERVAL_MS : DELETING_INTERVAL_MS;

    const timeoutId = window.setTimeout(() => {
      if (phase === "typing") {
        const nextText = currentPrompt.slice(0, displayText.length + 1);
        setDisplayText(nextText);

        if (nextText === currentPrompt) {
          setPhase("holding");
        }

        return;
      }

      const nextText = currentPrompt.slice(0, Math.max(displayText.length - 1, 0));
      setDisplayText(nextText);

      if (nextText.length === 0) {
        setPromptIndex((current) => (current + 1) % prompts.length);
        setPhase("typing");
      }
    }, intervalMs);

    return () => window.clearTimeout(timeoutId);
  }, [displayText, phase, promptIndex, prompts]);

  return (
    /* 타이핑 텍스트 + 커서 */
    <span className="inline-flex items-center">
      <span>{displayText}</span>
      <span className="ml-0.5 h-5 w-px animate-pulse bg-fg/70" />
    </span>
  );
}
