import type { ReactNode } from "react";
import { pageContentWidthClassName, pageXPaddingClassName } from "@/constants/layout";

type Props = {
  id: string;
  title: string;
  description: string;
  shaded?: boolean;
  children: ReactNode;
};

export default function FdeSection({ id, title, description, shaded, children }: Props) {
  return (
    <section aria-labelledby={`${id}-title`} className={shaded ? `-mx-5 bg-bg-deep py-16 md:-mx-10 md:py-[100px] ${pageXPaddingClassName}` : undefined}>
      <div className={`${pageContentWidthClassName} space-y-10`}>
        <header className="grid w-full items-start gap-4 text-left sm:gap-5 md:grid-cols-2 md:gap-7.5">
          <h2 className="m-0 min-w-0 text-pretty type-h1 text-fg" id={`${id}-title`}>{title}</h2>
          <p className="m-0 min-w-0 whitespace-pre-line text-pretty type-body-lg leading-relaxed text-mute">{description}</p>
        </header>
        {children}
      </div>
    </section>
  );
}
