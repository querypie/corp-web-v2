"use client";

import Button from "@/components/common/Button";
import {
  acceptAllCookiePreferences,
  declineAllCookiePreferences,
} from "@/features/cookie-preferences/preferences";

type CookiePreferenceActionsProps = {
  acceptLabel: string;
  declineLabel: string;
};

export default function CookiePreferenceActions({
  acceptLabel,
  declineLabel,
}: CookiePreferenceActionsProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <Button
        arrow={false}
        onClick={acceptAllCookiePreferences}
        size="default"
        style="full"
        variant="primary"
      >
        {acceptLabel}
      </Button>
      <Button
        arrow={false}
        onClick={declineAllCookiePreferences}
        size="default"
        style="full"
        variant="secondary"
      >
        {declineLabel}
      </Button>
    </div>
  );
}
