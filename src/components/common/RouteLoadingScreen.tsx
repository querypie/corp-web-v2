import LoadingText from "./LoadingText";

type RouteLoadingScreenProps = {
  description?: string;
  title: string;
};

export default function RouteLoadingScreen({
  description,
  title,
}: RouteLoadingScreenProps) {
  return (
    <div className="flex min-h-[calc(100vh-180px)] w-full items-center justify-center px-5 py-16 md:px-10">
      <div className="flex w-full max-w-[420px] flex-col items-center gap-4 text-center">
        <div className="h-px w-16 bg-border" />
        <LoadingText className="type-h3" text={title} tone="light" />
        {description ? (
          <p className="m-0 type-body-md text-mute-fg">{description}</p>
        ) : null}
      </div>
    </div>
  );
}
