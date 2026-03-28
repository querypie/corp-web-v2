import LegalVersionSelect from "./LegalVersionSelect";
import PrivacyPolicyBody from "./PrivacyPolicyBody";

type PrivacyPolicyPageProps = {
  bodyHtml: string;
  title: string;
  versionOptions: Array<{
    href: string;
    label: string;
    value: string;
  }>;
  versionValue: string;
};

export default function PrivacyPolicyPage({
  bodyHtml,
  title,
  versionOptions,
  versionValue,
}: PrivacyPolicyPageProps) {
  return (
    <div className="flex w-full justify-center px-5 pb-10 md:px-10">
      <section className="flex w-full max-w-[900px] flex-col gap-10 sm:gap-8 md:gap-10 lg:gap-[60px]">
        <header className="grid gap-4 sm:gap-5 md:grid-cols-2 md:gap-[30px]">
          <h1 className="m-0 type-h1 text-fg">{title}</h1>
          <div className="flex items-start md:justify-end">
            <LegalVersionSelect options={versionOptions} value={versionValue} />
          </div>
        </header>

        <div className="flex flex-col gap-5 md:gap-6">
          <PrivacyPolicyBody bodyHtml={bodyHtml} />
        </div>
      </section>
    </div>
  );
}
