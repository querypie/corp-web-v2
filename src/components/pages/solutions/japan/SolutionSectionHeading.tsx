type Props = {
  description?: string | readonly string[];
  title: string | readonly string[];
};

export default function SolutionSectionHeading({ description, title }: Props) {
  const descriptionLines = typeof description === "string" ? [description] : description;
  const titleText = typeof title === "string" ? title : title.join(" ");

  return (
    <header className="flex w-full flex-col items-center gap-4 text-center">
      <h2 className="m-0 text-pretty type-h1 text-fg">{titleText}</h2>
      {descriptionLines ? <p className="m-0 text-pretty type-body-lg text-mute">{descriptionLines.map((line) => <span className="block" key={line}>{line}</span>)}</p> : null}
    </header>
  );
}
