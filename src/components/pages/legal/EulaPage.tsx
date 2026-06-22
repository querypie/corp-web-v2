import { pageXPaddingClassName } from "@/constants/layout";
import LegalContentBody from "./LegalContentBody";

type EulaPageProps = {
  bodyHtml: string;
  title: string;
};

export default function EulaPage({
  bodyHtml,
  title,
}: EulaPageProps) {
  return (
    <div className={`flex w-full justify-center ${pageXPaddingClassName} pb-10`}>
      <section className="flex w-full max-w-[900px] flex-col gap-10 sm:gap-8 md:gap-10 lg:gap-[60px]">
        <header className="grid gap-4 sm:gap-5 md:gap-[30px]">
          <h1 className="m-0 type-h1 text-fg">{title}</h1>
        </header>

        <div className="flex flex-col gap-6 text-fg">
          <LegalContentBody bodyHtml={bodyHtml} />
        </div>
      </section>
    </div>
  );
}
