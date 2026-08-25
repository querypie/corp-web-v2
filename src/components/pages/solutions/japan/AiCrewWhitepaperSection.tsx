import Image from "next/image";
import Badge from "@/components/ui/Badge";

type Props = {
  action: string;
  badges: readonly string[];
  description: string;
  href: string;
  imageAlt: string;
  imageSrc?: string;
  title: string;
};

export default function AiCrewWhitepaperSection({
  action,
  badges,
  description,
  href,
  imageAlt,
  imageSrc = "/documentation/white-papers/thumbnail-25.webp",
  title,
}: Props) {
  return (
    <section className="mx-auto w-full max-w-[1200px]">
      <a
        aria-label={title}
        className="group grid w-full grid-cols-1 overflow-hidden rounded-box border border-border bg-bg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fg focus-visible:ring-offset-2 md:grid-cols-[500px_minmax(0,1fr)]"
        href={href}
      >
        <div className="relative aspect-video overflow-hidden md:aspect-auto md:min-h-[280px]">
          <Image
            alt={imageAlt}
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04] group-focus-visible:scale-[1.04]"
            fill
            sizes="(min-width: 768px) 500px, calc(100vw - 40px)"
            src={imageSrc}
          />
        </div>

        <div className="flex min-w-0 flex-col items-start justify-center p-6">
          <div className="flex flex-wrap gap-1">
            {badges.map((badge) => <Badge key={badge} variant="outline">{badge}</Badge>)}
          </div>
          <h2 className="mb-3 mt-5 max-w-[760px] break-keep text-pretty type-h2 text-fg">{title}</h2>
          <p className="m-0 max-w-[760px] type-body-md text-mute">{description}</p>
          <span className="mt-6 inline-flex items-center justify-center gap-1.5 type-body-md text-link transition-colors group-hover:text-link-hover">
            <span>{action}</span>
            <svg aria-hidden="true" className="h-4 w-4 text-mute group-hover:animate-[button-arrow-nudge_220ms_ease-out_forwards]" fill="none" viewBox="0 0 24 24">
              <path d="M15.5 6.5L21.5 12.5M21.5 12.5L15.5 18.5M21.5 12.5H3.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            </svg>
          </span>
        </div>
      </a>
    </section>
  );
}
