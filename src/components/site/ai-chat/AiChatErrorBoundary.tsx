"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";
import { RefreshCw, X } from "lucide-react";
import Button from "@/components/ui/Button";
import type { Locale } from "@/constants/i18n";
import { aiChatCopy } from "@/copy/aiChat";
import { reportChatClientError } from "@/features/ai-chat/clientDiagnostics";
import styles from "./AiChat.module.css";

type Props = { children: ReactNode; locale: Locale; open: boolean; onClose: () => void };

// Keep this in the launcher bundle so lazy import failures are also caught.
export default class AiChatErrorBoundary extends Component<Props, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    reportChatClientError(error, info.componentStack, this.props.locale);
  }

  render() {
    if (!this.state.failed) return this.props.children;
    if (!this.props.open) return null;
    const copy = aiChatCopy[this.props.locale];
    return (
      <aside aria-label={copy.title} className={`${styles.panel} z-50 !h-auto !p-5`} lang={this.props.locale}>
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="type-body-lg !font-medium">{copy.title}</h2>
          <Button aria-label={copy.close} arrow={false} onClick={this.props.onClose} size="small" style="full">
            <X aria-hidden="true" className="h-4 w-4" />
          </Button>
        </div>
        <p className="type-body-md mb-4" role="alert">{copy.openError}</p>
        <Button arrow={false} onClick={() => window.location.reload()}>
          <RefreshCw aria-hidden="true" className="h-4 w-4" />
          {copy.reload}
        </Button>
      </aside>
    );
  }
}
