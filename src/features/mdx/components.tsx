import { isValidElement } from "react";
import type { MDXComponents } from "mdx/types";
import type { Locale } from "@/constants/i18n";
import type { ContactPageCopy } from "@/features/contact/copy";
import ArticleGatingFormOverlay from "@/components/mdx-layout/ArticleGatingFormOverlay";

// heading children → plain text (for id generation matching headings.ts slugify)
function childrenToText(children: React.ReactNode): string {
  if (typeof children === "string") return children;
  if (typeof children === "number") return String(children);
  if (Array.isArray(children)) return children.map(childrenToText).join("");
  if (isValidElement(children)) {
    const props = children.props as { children?: React.ReactNode };
    return childrenToText(props.children);
  }
  return "";
}

function slugifyHeading(children: React.ReactNode): string {
  return childrenToText(children)
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export type MdxComponentContext = {
  locale: Locale;
  isUnlocked: boolean;
  unlockCookieName: string;
  title: string;
  contactCopy: ContactPageCopy;
};

export function buildMdxComponents(ctx: MdxComponentContext): MDXComponents {
  return {
    // ── 헤딩 (TOC 앵커 id 주입) ───────────────────────────────
    h1: ({ children }: { children?: React.ReactNode }) => (
      <h1 id={slugifyHeading(children)}>{children}</h1>
    ),
    h2: ({ children }: { children?: React.ReactNode }) => (
      <h2 id={slugifyHeading(children)}>{children}</h2>
    ),
    h3: ({ children }: { children?: React.ReactNode }) => (
      <h3 id={slugifyHeading(children)}>{children}</h3>
    ),

    // ── 레이아웃 ──────────────────────────────────────────────
    Box: ({ center, children }: { center?: boolean; children?: React.ReactNode }) => (
      <div className={center ? "flex justify-center" : undefined}>{children}</div>
    ),

    SplitView: ({ children }: { children?: React.ReactNode }) => (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">{children}</div>
    ),

    // ── 미디어 ───────────────────────────────────────────────
    ArticleFileImage: ({
      filepath,
      src,
      alt,
      caption,
    }: {
      filepath?: string;
      src?: string;
      alt?: string;
      caption?: string;
    }) => {
      // filepath="public/blog/foo.png" → "/blog/foo.png"
      const resolvedSrc = (filepath ?? src ?? "").replace(/^public\//, "/");
      return (
        <figure className="mx-auto my-0 flex max-w-full flex-col gap-3">
          <img
            src={resolvedSrc}
            alt={alt ?? ""}
            className="mx-auto block h-auto max-w-full rounded-box bg-bg-content"
          />
          {caption && (
            <figcaption className="m-0 text-center type-content-caption text-[var(--color-content-image-caption-fg)]">
              {caption}
            </figcaption>
          )}
        </figure>
      );
    },

    Youtube: ({ src, title: videoTitle }: { src?: string; title?: string }) => (
      <div className="aspect-video w-full overflow-hidden rounded-box">
        <iframe
          src={src}
          title={videoTitle ?? "YouTube video"}
          className="h-full w-full border-0"
          allowFullScreen
        />
      </div>
    ),

    // ── UI 요소 ──────────────────────────────────────────────
    State: ({
      children,
      color,
    }: {
      children?: React.ReactNode;
      color?: string;
    }) => (
      <span
        className={[
          "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
          color === "blue"
            ? "bg-blue-100 text-blue-700"
            : color === "green"
              ? "bg-green-100 text-green-700"
              : color === "red"
                ? "bg-red-100 text-red-700"
                : "bg-fg/10 text-fg",
        ].join(" ")}
      >
        {children}
      </span>
    ),

    InfoNote: ({ children }: { children?: React.ReactNode }) => (
      <div className="rounded-box border border-blue-200 bg-blue-50 p-4 text-blue-800 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-200">
        {children}
      </div>
    ),

    Link: ({ href, children }: { href?: string; children?: React.ReactNode }) => (
      <a
        href={href}
        className="text-brand underline underline-offset-4 transition-colors hover:text-fg"
      >
        {children}
      </a>
    ),

    ButtonLink: ({
      href,
      children,
    }: {
      href?: string;
      children?: React.ReactNode;
    }) => (
      <a
        href={href}
        className="inline-flex items-center rounded-button bg-primary px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
      >
        {children}
      </a>
    ),

    // ── 게이팅 ───────────────────────────────────────────────
    ArticleGatingForm: ({ children }: { children?: React.ReactNode }) => {
      if (ctx.isUnlocked) return <>{children}</>;
      return (
        <ArticleGatingFormOverlay
          contactCopy={ctx.contactCopy}
          locale={ctx.locale}
          title={ctx.title}
          unlockCookieName={ctx.unlockCookieName}
        />
      );
    },
  };
}
