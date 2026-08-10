"use client";

import Button from "@/components/ui/Button";
import ButtonGroup from "@/components/ui/ButtonGroup";
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
    <ButtonGroup className="flex-col sm:flex-row sm:items-center">
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
    </ButtonGroup>
  );
}
