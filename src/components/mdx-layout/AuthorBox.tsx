import type { Locale } from "@/constants/i18n";
import { getAuthorIntroHeading, type ResolvedArticleAuthor } from "@/features/mdx/authors";

type Props = {
  authors: ResolvedArticleAuthor[];
  locale: Locale;
};

function getLinkedInUrl(author: ResolvedArticleAuthor): string | undefined {
  return author.links.find((link) => link.type === "linkedin")?.url;
}

export default function AuthorBox({ authors, locale }: Props) {
  if (authors.length === 0) {
    return null;
  }

  return (
    <section className="flex flex-col gap-5 rounded-box bg-bg-content px-6 py-6 md:px-8" aria-label={getAuthorIntroHeading(locale)}>
      <h2 className="m-0 type-h3 text-fg">{getAuthorIntroHeading(locale)}</h2>
      <ul className="m-0 flex list-none flex-col gap-5 p-0">
        {authors.map((author) => {
          const linkedInUrl = getLinkedInUrl(author);

          return (
            <li key={author.id} className="flex flex-col gap-4 border-t border-border pt-5 first:border-t-0 first:pt-0">
              <div className="flex items-center gap-4">
                {author.profileImageSrc && (
                  <img
                    alt={author.name}
                    className="h-[60px] w-[60px] rounded-full object-cover"
                    src={author.profileImageSrc}
                  />
                )}
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <div className="flex items-center gap-3">
                    <strong className="type-body-lg text-fg">{author.name}</strong>
                    {linkedInUrl && (
                      <a
                        aria-label={`${author.name} LinkedIn`}
                        className="inline-flex h-10 w-10 items-center justify-center"
                        href={linkedInUrl}
                        rel="noreferrer noopener"
                        target="_blank"
                      >
                        <img alt="LinkedIn" className="h-6 w-6 object-contain" src="/icons/linkedin.svg" />
                      </a>
                    )}
                  </div>
                  {author.position && <p className="m-0 type-body-md text-mute-fg">{author.position}</p>}
                </div>
              </div>
              {author.description && (
                <div className="flex flex-col gap-3">
                  {author.description.split("\n").filter(Boolean).map((paragraph) => (
                    <p key={`${author.id}-${paragraph.slice(0, 24)}`} className="m-0 type-body-md text-fg">
                      {paragraph}
                    </p>
                  ))}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
