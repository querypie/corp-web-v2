import Link from "next/link";
import { BookOpen } from "lucide-react";
import { getButtonStyle } from "@/components/ui/Button";
import { getAcpLabNotesCopy } from "@/copy/acpLabNotes";
import type { Locale } from "@/constants/i18n";
import { getPublicListHref } from "@/features/content/data";

export default function AcpLabNotesLink({ locale = "ko" }: { locale?: Locale }) {
  const copy = getAcpLabNotesCopy(locale);
  const buttonStyle = getButtonStyle("secondary", "full", "default", "default");

  return (
    <section className="mx-auto w-full max-w-[1200px]">
      <div className="flex flex-col gap-5 rounded-box border border-border p-6 md:flex-row md:items-center md:p-8">
        <BookOpen aria-hidden="true" className="h-10 w-10 shrink-0 text-fg" strokeWidth={1.5} />
        <div className="min-w-0 flex-1 space-y-2">
          <h2 className="m-0 text-pretty type-h2 text-fg">{copy.title}</h2>
          <p className="m-0 type-body-md text-mute">{copy.description}</p>
        </div>
        <Link
          className={`${buttonStyle.container} ${buttonStyle.text} self-start shrink-0 md:self-center`}
          href={getPublicListHref("resources", locale, "acp-lab-notes")}
        >
          {copy.label}
        </Link>
      </div>
    </section>
  );
}
