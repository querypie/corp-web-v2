import type { EulaSection } from "../../../constants/legal";

type EulaPageProps = {
  intro: string[];
  sections: EulaSection[];
  title: string;
};

export default function EulaPage({
  intro,
  sections,
  title,
}: EulaPageProps) {
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

        <div className="flex flex-col gap-6 text-fg">
          {sections.map((section, sectionIndex) => (
            <section
              key={section.title}
              className="flex flex-col gap-6"
            >
              <div className="flex flex-col gap-6">
                <h2 className="m-0 type-h2 leading-[30px] text-fg" style={{ marginTop: sectionIndex > 0 ? "3rem" : 0 }}>
                  {section.title}
                </h2>
                {section.body?.map((paragraph) => (
                  <p key={paragraph} className="m-0 type-body-lg leading-8 text-fg">
                    {paragraph}
                  </p>
                ))}
              </div>

              {section.subsections ? (
                <div className="flex flex-col gap-6">
                  {section.subsections.map((subsection, subsectionIndex) => (
                    <div key={subsection.title} className="flex flex-col gap-6">
                      <h3 className="m-0 type-h3 text-fg" style={{ marginTop: subsectionIndex > 0 || section.body?.length ? "1.75rem" : 0 }}>
                        {subsection.title}
                      </h3>
                      <div className="flex flex-col gap-6">
                        {subsection.body.map((paragraph) => (
                          <p key={paragraph} className="m-0 type-body-lg leading-8 text-fg">
                            {paragraph}
                          </p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}
            </section>
          ))}
        </div>
      </section>
    </div>
  );
}
