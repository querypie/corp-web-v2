import PreferenceItem from "./PreferenceItem";
import type { CookieCategory } from "../../../constants/legal";

type CookiePreferencePageProps = {
  intro: string[];
  preferences: CookieCategory[];
  title: string;
};

export default function CookiePreferencePage({
  intro,
  preferences,
  title,
}: CookiePreferencePageProps) {
  return (
    <div className="flex w-full justify-center px-5 pb-10 md:px-10">
      <section className="flex w-full max-w-[900px] flex-col gap-10 sm:gap-8 md:gap-10 lg:gap-[60px]">
        <header className="grid gap-4 sm:gap-5 md:grid-cols-2 md:gap-[30px]">
          <h1 className="m-0 type-h1 text-fg">{title}</h1>
          <div className="flex flex-col gap-4 sm:gap-5">
            {intro.map((paragraph) => (
              <p key={paragraph} className="m-0 type-body-lg text-fg">
                {paragraph}
              </p>
            ))}
          </div>
        </header>

        <section className="flex flex-col gap-0">
          <div className="flex flex-col">
            {preferences.map((item) => (
              <div key={item.title}>
                <PreferenceItem {...item} />
              </div>
            ))}
          </div>
        </section>
      </section>
    </div>
  );
}
