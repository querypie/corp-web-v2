import Badge from "@/components/ui/Badge";
import SolutionSectionHeading from "./SolutionSectionHeading";

type RolloutStep = readonly [number: string, duration: string, title: string, body: string];

type Props = {
  description: string | readonly string[];
  steps: readonly RolloutStep[];
  title: string;
  titleAccent?: string;
  titleEyebrow?: string;
};

export default function AiDashiRolloutSection({ description, steps, title, titleAccent, titleEyebrow }: Props) {
  const descriptionLines = typeof description === "string" ? [description] : description;

  return (
    <section className="mx-auto w-full max-w-[1200px] space-y-10">
      {titleAccent && titleEyebrow ? (
        <header className="flex w-full flex-col items-center gap-4 text-center">
          <h2 className="m-0 text-pretty type-h1 text-fg">
            <span className="block">{titleEyebrow}</span>
            <span className="block">
              {title} <span className="text-brand">{titleAccent}</span>
            </span>
          </h2>
          <p className="m-0 max-w-[1120px] text-pretty type-body-lg text-mute">
            {descriptionLines.map((line) => <span className="block" key={line}>{line}</span>)}
          </p>
        </header>
      ) : (
        <SolutionSectionHeading description={description} title={title} />
      )}
      <ol className="grid gap-4 md:grid-cols-4">
        {steps.map(([number, duration, stepTitle, body]) => (
          <li className="flex min-h-[280px] flex-col rounded-box border border-border bg-bg p-6" key={number}>
            <div className="flex items-center justify-between gap-4">
              <Badge variant="primary">Step {number}</Badge>
              <Badge variant="secondary">{duration}</Badge>
            </div>
            <h3 className="mb-0 mt-8 type-h3 text-fg">{stepTitle}</h3>
            <div className="my-5 h-px bg-border" />
            <p className="m-0 type-body-md text-mute">{body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
