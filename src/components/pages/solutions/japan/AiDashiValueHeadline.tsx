type Props = {
  accent: string;
  headline: string;
};

export default function AiDashiValueHeadline({ accent, headline }: Props) {
  const [before, after] = headline.split(accent);

  return (
    <>
      {before}<span className="text-brand">{accent}</span>{after}
    </>
  );
}
