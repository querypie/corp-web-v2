"use client";

import { useEffect, useState } from "react";
import {
  COOKIE_PREFERENCE_CHANGE_EVENT,
  isOptionalCookiePreferenceId,
  readCookiePreference,
  writeCookiePreference,
} from "@/features/cookie-preferences/preferences";
import Switch from "@/components/ui/Switch";
import type { CookieCategory } from "@/constants/legal";

type PreferenceItemProps = Pick<CookieCategory, "description" | "detail" | "id" | "status" | "title">;

export default function PreferenceItem({
  description,
  detail,
  id,
  status,
  title,
}: PreferenceItemProps) {
  const isRequired = status === "required";
  const [checked, setChecked] = useState(isRequired);

  useEffect(() => {
    const syncPreference = () => {
      setChecked(readCookiePreference(id));
    };

    syncPreference();
    window.addEventListener(COOKIE_PREFERENCE_CHANGE_EVENT, syncPreference);

    return () => {
      window.removeEventListener(COOKIE_PREFERENCE_CHANGE_EVENT, syncPreference);
    };
  }, [id]);

  return (
    <article className="border-b border-border pb-5 last:border-b-0 md:pb-6">
      <div className="flex items-start gap-4">
        <Switch
          checked={checked}
          className="mt-0.5 shrink-0"
          disabled={isRequired}
          aria-label={title}
          onChange={() => {
            if (!isOptionalCookiePreferenceId(id)) {
              return;
            }

            setChecked((current) => {
              const next = !current;
              writeCookiePreference(id, next);
              return next;
            });
          }}
          size="compact"
        />
        <div className="flex flex-col gap-2">
          <h2 className="m-0 type-body-lg text-fg">{title}</h2>
          <p className="m-0 type-body-md text-mute">{`${description} ${detail}`}</p>
        </div>
      </div>
    </article>
  );
}
