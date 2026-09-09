"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import type { Locale } from "@/constants/i18n";
import { aiChatCopy } from "@/copy/aiChat";
import {
  COOKIE_PREFERENCE_CHANGE_EVENT,
  hasCookiePreferenceSet,
} from "@/features/cookie-preferences/preferences";
import styles from "./AiChat.module.css";

const AiChatPanel = dynamic(() => import("./AiChatPanel"), { ssr: false });

export default function AiChatWidget({ locale }: { locale: Locale }) {
  const [visible, setVisible] = useState(false);
  const [activated, setActivated] = useState(false);
  const [open, setOpen] = useState(false);
  const copy = aiChatCopy[locale];

  useEffect(() => {
    // Both accepting and declining dismiss the cookie banner and reveal the launcher.
    const sync = () => setVisible(hasCookiePreferenceSet());
    sync();
    window.addEventListener(COOKIE_PREFERENCE_CHANGE_EVENT, sync);
    return () => window.removeEventListener(COOKIE_PREFERENCE_CHANGE_EVENT, sync);
  }, []);

  return (
    <>
      {visible ? (
        <Button
          aria-label={copy.open}
          aria-haspopup="dialog"
          aria-expanded={open}
          arrow={false}
          className={`${styles.launcher} !h-18 !w-18 !bg-transparent !p-0`}
          onClick={() => { setActivated(true); setOpen(true); }}
          size="large"
          style="full"
        >
          <svg aria-hidden="true" className={styles.launcherSurface} viewBox="0 0 64 64">
            <path d="M32 3C16 3 3 15.3 3 30.5C3 38.2 6.3 45.4 11.5 50.4L8.6 59.2Q8 61 9.8 60.4L22 56C25.2 57.3 28.5 58 32 58C48 58 61 45.7 61 30.5C61 15.3 48 3 32 3Z" />
          </svg>
          <img alt="" aria-hidden="true" className="relative h-10 w-10 -translate-y-px" height={40} src="/assets/brand/icons/BotFace.svg" width={40} />
        </Button>
      ) : null}
      {activated ? <AiChatPanel locale={locale} onClose={() => setOpen(false)} open={open} /> : null}
    </>
  );
}
