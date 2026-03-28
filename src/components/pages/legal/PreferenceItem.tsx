"use client";

import { useState } from "react";
import Switch from "../../common/Switch";
import type { CookieCategory } from "../../../constants/legal";

type PreferenceItemProps = Pick<CookieCategory, "description" | "detail" | "status" | "title">;

export default function PreferenceItem({
  description,
  detail,
  status,
  title,
}: PreferenceItemProps) {
  const isRequired = status === "required";
  const [checked, setChecked] = useState(isRequired);

  return (
    <article className="border-b border-border pb-5 last:border-b-0 md:pb-6">
      <div className="flex items-start gap-4">
        <Switch
          checked={checked}
          className="mt-0.5 shrink-0"
          disabled={isRequired}
          onChange={() => {
            if (isRequired) {
              return;
            }

            setChecked((current) => !current);
          }}
          size="compact"
        />
        <div className="flex flex-col gap-2">
          <h2 className="m-0 type-body-lg text-fg">{title}</h2>
          <p className="m-0 type-body-md text-mute-fg">{`${description} ${detail}`}</p>
        </div>
      </div>
    </article>
  );
}
