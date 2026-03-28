import TermsOfServiceBody from "./TermsOfServiceBody";

type TermsOfServicePageProps = {
  bodyHtml: string;
  title: string;
};

export default function TermsOfServicePage({
  bodyHtml,
  title,
}: TermsOfServicePageProps) {
  return (
    <div className="flex w-full justify-center px-5 pb-10 md:px-10">
      <section className="flex w-full max-w-[900px] flex-col gap-10 sm:gap-8 md:gap-10 lg:gap-[60px]">
        <header className="grid gap-4 sm:gap-5 md:gap-[30px]">
          <h1 className="m-0 type-h1 text-fg">{title}</h1>
        </header>

        <div className="flex flex-col gap-5 text-fg">
          <TermsOfServiceBody bodyHtml={bodyHtml} />
        </div>
      </section>
    </div>
  );
}
