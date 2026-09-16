"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { RotateCcw, Send, X } from "lucide-react";
import Button from "@/components/ui/Button";
import type { Locale } from "@/constants/i18n";
import { getSameSiteHref } from "@/features/routing/siteLinks";
import { aiChatCopy } from "@/copy/aiChat";
import { isChatReply, type ChatMessage } from "@/features/ai-chat/types";
import {
  MAX_MESSAGE_LENGTH,
  MAX_PREVIEW_MESSAGES,
  readPreviewSession,
  savePreviewSession,
} from "@/features/ai-chat/previewSession";
import styles from "./AiChat.module.css";

type AiChatPanelProps = { locale: Locale; open: boolean; onClose: () => void };

export default function AiChatPanel({ locale, open, onClose }: AiChatPanelProps) {
  const copy = aiChatCopy[locale];
  const titleId = useId();
  const inputId = useId();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const threadRef = useRef<HTMLDivElement>(null);
  const [session, setSession] = useState(readPreviewSession);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<"unavailable" | "error" | null>(null);
  const requestRef = useRef<AbortController | null>(null);
  const generationRef = useRef(0);

  useEffect(() => {
    if (!pending) savePreviewSession(session);
  }, [session, pending]);

  useEffect(() => () => {
    generationRef.current++;
    requestRef.current?.abort();
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!open || !dialog) return;
    dialog.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const viewport = window.visualViewport;
    const resize = () => {
      if (!viewport) return;
      dialog.style.setProperty("--chat-viewport-height", `${viewport.height}px`);
      dialog.style.setProperty("--chat-keyboard-offset", `${Math.max(0, window.innerHeight - viewport.height - viewport.offsetTop)}px`);
    };
    resize();
    viewport?.addEventListener("resize", resize);
    viewport?.addEventListener("scroll", resize);
    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
      viewport?.removeEventListener("resize", resize);
      viewport?.removeEventListener("scroll", resize);
    };
  }, [open]);

  useEffect(() => {
    const input = inputRef.current;
    if (!input || !open) return;
    input.style.height = "auto";
    input.style.height = `${Math.min(input.scrollHeight, 120)}px`;
  }, [session.draft, open]);

  useEffect(() => {
    const thread = threadRef.current;
    if (thread && open) thread.scrollTop = thread.scrollHeight;
  }, [session.messages, open]);

  function reset() {
    generationRef.current++;
    requestRef.current?.abort();
    requestRef.current = null;
    setPending(false);
    setError(null);
    setSession({ draft: "", messages: [] });
    inputRef.current?.focus();
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = session.draft.trim();
    if (!text || requestRef.current) return;
    const generation = ++generationRef.current;
    const controller = new AbortController();
    requestRef.current = controller;
    const userMessage: ChatMessage = { id: `${Date.now()}-${generation}-user`, role: "user", text, locale };
    const messages = [...session.messages, userMessage].slice(-MAX_PREVIEW_MESSAGES);
    // If navigation interrupts the request, restore the draft rather than an orphaned turn.
    savePreviewSession({ ...session, draft: text });
    setSession({ draft: "", messages });
    setPending(true);
    setError(null);
    const signal = AbortSignal.any([controller.signal, AbortSignal.timeout(60000)]);
    try {
      const response = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locale, messages: messages.slice(-8).map((message) => ({ role: message.role, content: message.text })) }),
        signal,
      });
      let result: unknown = await response.json();
      if (generation !== generationRef.current) return;
      if (!response.ok || !isChatReply(result)) {
        const code = result && typeof result === "object" && "code" in result ? result.code : null;
        throw new Error(code === "NOT_CONFIGURED" ? "unavailable" : "error");
      }
      setSession((current) => ({
        ...current,
        messages: [...current.messages, {
          id: `${Date.now()}-${generation}-assistant`, role: "assistant" as const,
          text: result.answer, locale, sources: result.sources, answered: result.answered,
        }].slice(-MAX_PREVIEW_MESSAGES),
      }));
    } catch (cause) {
      if (generation !== generationRef.current) return;
      setError(cause instanceof Error && cause.message === "unavailable" ? "unavailable" : "error");
      setSession((current) => ({ draft: text, messages: current.messages.filter((message) => message.id !== userMessage.id) }));
    } finally {
      if (generation === generationRef.current) {
        requestRef.current = null;
        setPending(false);
      }
    }
  }

  return (
    <dialog
      aria-labelledby={titleId}
      autoFocus
      className={styles.panel}
      lang={locale}
      onCancel={(event) => { event.preventDefault(); onClose(); }}
      onClick={(event) => {
        if (event.target !== event.currentTarget) return;
        const rect = event.currentTarget.getBoundingClientRect();
        if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) onClose();
      }}
      ref={dialogRef}
      tabIndex={-1}
    >
      <header className="flex shrink-0 items-center justify-between gap-3 border-b border-border px-5 py-2">
        <h2 className="type-body-lg min-w-0 !font-medium" id={titleId}>{copy.title}</h2>
        <div className="flex shrink-0 items-center gap-0">
          <Button
            aria-label={copy.reset}
            arrow={false}
            className="!h-11 !w-11 !bg-transparent !p-0 hover:!bg-bg-hover"
            onClick={reset}
            style="full"
            title={copy.reset}
          >
            <RotateCcw aria-hidden="true" className="h-[18px] w-[18px]" />
          </Button>
          <Button aria-label={copy.close} arrow={false} className="!h-11 !w-11 shrink-0 !bg-transparent !p-0 hover:!bg-bg-hover" onClick={onClose} style="full">
            <X aria-hidden="true" className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <div aria-label={copy.conversation} className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-6" ref={threadRef} role="log" aria-live="polite" aria-relevant="additions">
        {session.messages.length === 0 ? (
          <div className="flex min-h-full flex-col items-center justify-center pb-6 text-center">
            <img alt="" aria-hidden="true" className="mb-6 h-14 w-14" height={56} src="/assets/brand/icons/BotFaceBowing.svg" width={56} />
            <h3 className="type-h2 max-w-full text-balance">{copy.heading}</h3>
            <p className={`${styles.muted} type-body-sm mt-3 whitespace-pre-line`}>{copy.description}</p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {session.messages.map((message) => (
              <div className={`flex flex-col gap-3 ${message.role === "user" ? "items-end" : "items-start"}`} key={message.id}>
                <p className={`type-body-md whitespace-pre-wrap [overflow-wrap:anywhere] ${message.role === "user" ? "max-w-[88%] rounded-box bg-bg-content px-4 py-3" : "w-full"}`} lang={message.locale}>{message.text}</p>
                {message.role === "assistant" && message.sources?.length ? (
                  <div className="flex w-full flex-col gap-1.5 border-t border-border pt-3">
                    <span className={`${styles.muted} type-body-sm`}>{copy.sources}</span>
                    {message.sources.map((source) => (
                      <a className="type-body-sm text-link underline decoration-border-strong underline-offset-4 hover:decoration-current [overflow-wrap:anywhere]" href={getSameSiteHref(source.url, locale)} key={source.url} rel="noopener noreferrer" target="_blank">{source.title}</a>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
            {pending ? <p className={`${styles.muted} type-body-sm`} role="status">{copy.loading}</p> : null}
          </div>
        )}
      </div>

      {error ? <p className="type-body-sm shrink-0 px-4 pb-2 text-destructive" role="alert">{copy[error]}</p> : null}
      <form className="flex shrink-0 items-end gap-3 border-t border-border bg-bg-modal px-4 py-3" onSubmit={submit}>
        <div className={`${styles.composer} flex min-w-0 flex-1 items-center rounded-[28px] border border-transparent bg-bg-content px-4 py-2.5 transition-colors`}>
          <label className="sr-only" htmlFor={inputId}>{copy.placeholder}</label>
          <textarea
            className="block max-h-[120px] min-h-6 w-full resize-none bg-transparent text-base leading-6 text-fg sm:text-sm"
            id={inputId}
            maxLength={MAX_MESSAGE_LENGTH}
            onChange={(event) => setSession((current) => ({ ...current, draft: event.target.value }))}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing && event.keyCode !== 229) {
                event.preventDefault();
                event.currentTarget.form?.requestSubmit();
              }
            }}
            placeholder={copy.placeholder}
            ref={inputRef}
            readOnly={pending}
            rows={1}
            value={session.draft}
          />
        </div>
        <Button
          aria-label={copy.send}
          arrow={false}
          className="!h-11 !w-11 shrink-0 !bg-brand !p-0 !text-on-brand hover:opacity-90 disabled:cursor-not-allowed"
          disabled={pending || !session.draft.trim()}
          size="large"
          style="full"
          type="submit"
        >
          <Send aria-hidden="true" className="h-6 w-6" />
        </Button>
      </form>
      <footer className="flex shrink-0 flex-col items-center gap-2 bg-bg-content px-4 py-3 text-center">
        <p className={`${styles.muted} type-body-sm !text-[11px] opacity-70`}>{copy.disclaimer}</p>
        <p className={`${styles.muted} type-body-sm flex items-center gap-2`}>
          <span>By</span>
          <img alt="QueryPie AI" className="theme-icon h-4 w-auto" height={20} src="/assets/brand/logos/querypie-ai-logo.svg" width={117} />
        </p>
      </footer>
    </dialog>
  );
}
