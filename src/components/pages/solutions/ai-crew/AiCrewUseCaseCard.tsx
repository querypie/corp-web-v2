import Link from "next/link";
import ContentPreviewImage from "@/components/content/ContentPreviewImage";
import Badge from "@/components/ui/Badge";

type Props = {
  body: string;
  href: string;
  imageSrc: string;
  tags: readonly string[];
  title: string;
};

export default function AiCrewUseCaseCard({ body, href, imageSrc, tags, title }: Props) {
  return (
    <Link className="group flex h-full w-full cursor-pointer flex-col overflow-hidden rounded-box bg-bg-content" href={href}>
      <ContentPreviewImage
        alt={title}
        className="card-media-motion block h-full w-full object-cover"
        containerClassName="content-thumbnail-frame w-full overflow-hidden bg-bg-content"
        src={imageSrc}
        useThumbnailFallback
      />
      <div className="flex min-w-0 flex-1 flex-col gap-[10px] bg-bg-content p-6">
        <div className="flex items-start justify-between gap-3">
          <h3 className="content-hover-title m-0 min-w-0 type-h3 text-fg"><span>{title}</span></h3>
          <div className="flex shrink-0 flex-wrap justify-end gap-1">
            {tags.map((tag) => <Badge key={tag} variant="outline">{tag}</Badge>)}
          </div>
        </div>
        <p className="m-0 type-body-md text-mute">{body}</p>
      </div>
    </Link>
  );
}
