type Props = {
  description?: string | readonly string[];
  title: string | readonly string[];
  layout?: "center" | "split";
};

export default function SolutionSectionHeading({ description, title, layout = "center" }: Props) {
  const descriptionLines = typeof description === "string" ? [description] : description;
  const titleText = typeof title === "string" ? title : title.join(" ");

  if (layout === "split") {
    return (
      <header className="grid w-full items-start gap-4 text-left sm:gap-5 md:grid-cols-2 md:gap-7.5">
        <h2 className="m-0 min-w-0 text-pretty type-h1 text-fg">{titleText}</h2>
        {descriptionLines ? <p className="m-0 min-w-0 whitespace-pre-line text-pretty type-body-lg leading-relaxed text-mute">{descriptionLines.join("\n")}</p> : null}
      </header>
    );
  }

  return (
    <header className="flex w-full flex-col items-center gap-4 text-center">
      <h2 className="m-0 text-pretty type-h1 text-fg">{titleText}</h2>
      {descriptionLines ? <p className="m-0 text-pretty type-body-lg text-mute">{descriptionLines.map((line) => <span className="block" key={line}>{line}</span>)}</p> : null}
    </header>
  );
}
