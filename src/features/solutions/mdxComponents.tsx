import { Children, Fragment, isValidElement } from "react";
import type { CSSProperties, ElementType, ReactNode } from "react";
import type { MDXComponents } from "mdx/types";
import { getLocalePath, type Locale } from "@/constants/i18n";

function joinClasses(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function renderWithLineBreaks(text: string) {
  return text.split("\n").map((line, index, lines) => (
    <Fragment key={`${line}-${index}`}>
      {line}
      {index < lines.length - 1 ? <br /> : null}
    </Fragment>
  ));
}

function toPublicSrc(filepath?: string) {
  if (!filepath) return "";
  return filepath.replace(/^public\//, "/");
}

function resolveHref(locale: Locale, href?: string) {
  if (!href) return undefined;
  if (/^(?:https?:)?\/\//.test(href) || href.startsWith("mailto:") || href.startsWith("tel:") || href.startsWith("#")) {
    return href;
  }
  return getLocalePath(locale, href);
}

function isExternalHref(href?: string) {
  return Boolean(href && /^(?:https?:)?\/\//.test(href));
}

function maybeOpenInNewTab(href?: string, external?: boolean) {
  if (!isExternalHref(href) && !external) return {};
  return { rel: "noreferrer", target: "_blank" };
}

function localizedTextColor(color?: string): CSSProperties | undefined {
  return color ? { color } : undefined;
}

type MarkerCategoryProps = { label: string; children?: ReactNode };
type MarkerFeatureProps = {
  title: string;
  description: string;
  image: string;
  children?: ReactNode;
};

function KillerFeatureCategoryMarker(_props: MarkerCategoryProps) {
  return null;
}

function KillerFeatureMarker(_props: MarkerFeatureProps) {
  return null;
}

const SplitView = Object.assign(
  ({
    children,
    reverse,
  }: {
    children?: ReactNode;
    reverse?: boolean;
  }) => (
    <div className={joinClasses("grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12", reverse && "lg:[&>*:first-child]:order-2 lg:[&>*:last-child]:order-1")}>
      {children}
    </div>
  ),
  {
    View: ({
      children,
      fixWidth,
      verticalCenter,
    }: {
      children?: ReactNode;
      fixWidth?: string;
      verticalCenter?: boolean;
    }) => (
      <div
        className={joinClasses("min-w-0", verticalCenter && "flex flex-col justify-center")}
        style={fixWidth ? { width: fixWidth, maxWidth: "100%" } : undefined}
      >
        {children}
      </div>
    ),
  },
);

export function buildSolutionMdxComponents({
  locale,
  searchParams,
}: {
  locale: Locale;
  searchParams?: { category?: string };
}): MDXComponents {
  const currentCategory = typeof searchParams?.category === "string" ? searchParams.category : "all";

  return {
    Box: ({
      as,
      background,
      center,
      children,
      className,
      direction,
      id,
      style,
    }: {
      as?: ElementType;
      background?: string;
      center?: boolean;
      children?: ReactNode;
      className?: string;
      direction?: "row" | "column";
      id?: string;
      style?: CSSProperties;
    }) => {
      const Component = as ?? "div";
      return (
        <Component
          id={id}
          style={style}
          className={joinClasses(
            background === "gray" && "bg-[#f7f8fa]",
            background === "dac" && "bg-[#eef5ff]",
            direction === "column" && "flex flex-col",
            center && "items-center justify-center",
            className,
          )}
        >
          {children}
        </Component>
      );
    },

    CenterSection: ({
      center,
      children,
      className,
    }: {
      center?: boolean;
      children?: ReactNode;
      className?: string;
    }) => (
      <div
        className={joinClasses(
          "mx-auto flex w-full max-w-[1200px] flex-col gap-8 px-6 py-16 md:px-10 md:py-20",
          center && "items-center text-center",
          className,
        )}
      >
        {children}
      </div>
    ),

    StaticH1: ({ children }: { children?: ReactNode }) => (
      <h1 className="text-balance text-4xl font-semibold tracking-tight text-[#111827] md:text-5xl">
        {children}
      </h1>
    ),
    StaticH2: ({ children }: { children?: ReactNode }) => (
      <h2 className="text-balance text-3xl font-semibold tracking-tight text-[#111827] md:text-4xl">
        {children}
      </h2>
    ),
    StaticH4: ({ children }: { children?: ReactNode }) => (
      <h3 className="text-balance text-2xl font-semibold tracking-tight text-[#111827] md:text-3xl">
        {children}
      </h3>
    ),

    StaticHeader: ({
      children,
      color,
    }: {
      children?: ReactNode;
      color?: string;
    }) => (
      <div className="max-w-4xl text-lg leading-8 text-[#4b5563]" style={localizedTextColor(color)}>
        {children}
      </div>
    ),

    StaticBody: ({
      children,
      className,
      color,
    }: {
      children?: ReactNode;
      className?: string;
      color?: string;
    }) => (
      <div className={joinClasses("text-base leading-7 text-[#4b5563]", className)} style={localizedTextColor(color)}>
        {children}
      </div>
    ),

    FileImage: ({
      alt,
      filepath,
      src,
      style,
    }: {
      alt?: string;
      filepath?: string;
      src?: string;
      style?: CSSProperties;
    }) => {
      const resolvedSrc = toPublicSrc(filepath ?? src);
      if (!resolvedSrc) return null;
      return (
        <img
          alt={alt ?? ""}
          src={resolvedSrc}
          style={style}
          className="mx-auto block h-auto max-w-full rounded-2xl"
        />
      );
    },

    ThumbnailYoutube: ({
      thumbnailImg,
      videoId,
    }: {
      thumbnailImg: string;
      videoId: string;
    }) => (
      <a
        href={`https://www.youtube.com/watch?v=${videoId}`}
        target="_blank"
        rel="noreferrer"
        className="group relative block overflow-hidden rounded-3xl border border-black/10 bg-black shadow-sm"
      >
        <img
          alt="YouTube video thumbnail"
          src={toPublicSrc(thumbnailImg)}
          className="block h-auto w-full transition-opacity duration-200 group-hover:opacity-90"
        />
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="rounded-full bg-white/90 px-5 py-3 text-sm font-semibold text-black shadow-sm">
            Play video
          </span>
        </span>
      </a>
    ),

    Youtube: ({ src, title }: { src?: string; title?: string }) => (
      <div className="aspect-video overflow-hidden rounded-3xl border border-black/10 shadow-sm">
        <iframe
          src={src}
          title={title ?? "YouTube video"}
          className="h-full w-full border-0"
          allowFullScreen
        />
      </div>
    ),

    MainFeatureDescription: ({
      checkList = [],
      description,
      image,
      imagePosition,
      imageShadow,
      learnMoreButton,
      title,
    }: {
      checkList?: string[];
      description: string;
      image: string;
      imagePosition?: "left" | "right";
      imageShadow?: boolean;
      learnMoreButton?: { href: string; label: string; external?: boolean };
      title: string;
    }) => {
      const media = (
        <div className={joinClasses("overflow-hidden rounded-3xl border border-black/10 bg-white", imageShadow && "shadow-xl shadow-black/10")}>
          <img alt={title} src={toPublicSrc(image)} className="block h-auto w-full" />
        </div>
      );
      const text = (
        <div className="flex flex-col gap-5">
          <h3 className="text-2xl font-semibold tracking-tight text-[#111827] md:text-3xl">
            {renderWithLineBreaks(title)}
          </h3>
          <div className="text-base leading-7 text-[#4b5563]">{renderWithLineBreaks(description)}</div>
          {checkList.length > 0 ? (
            <ul className="flex flex-col gap-3">
              {checkList.map((item) => (
                <li key={item} className="flex items-start gap-3 text-base leading-7 text-[#4b5563]">
                  <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#111827] text-xs text-white">
                    ✓
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          ) : null}
          {learnMoreButton ? (
            <a
              href={resolveHref(locale, learnMoreButton.href)}
              className="inline-flex w-fit items-center text-sm font-semibold text-[#2563eb] hover:text-[#1d4ed8]"
              {...maybeOpenInNewTab(learnMoreButton.href, learnMoreButton.external)}
            >
              {learnMoreButton.label}
            </a>
          ) : null}
        </div>
      );

      return (
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-14">
          {imagePosition === "left" ? (
            <>
              {media}
              {text}
            </>
          ) : (
            <>
              {text}
              {media}
            </>
          )}
        </div>
      );
    },

    IntroducingQueryPie: ({
      description,
      items,
      title,
    }: {
      description: string;
      items: Array<{
        title: string;
        titleImage: string;
        subTitle?: string;
        description: string;
        learnMoreButton?: { href: string; label: string; external?: boolean };
      }>;
      title: string;
    }) => (
      <section className="bg-[#111827] text-white">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-10 px-6 py-16 md:px-10 md:py-20">
          <div className="flex max-w-3xl flex-col gap-4">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{renderWithLineBreaks(title)}</h2>
            <p className="text-base leading-7 text-white/75">{renderWithLineBreaks(description)}</p>
          </div>
          <ul className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {items.map((item) => (
              <li key={item.title} className="flex h-full flex-col gap-5 rounded-3xl border border-white/10 bg-white/5 p-6">
                <img alt={item.title} src={toPublicSrc(item.titleImage)} className="h-auto w-full rounded-2xl" />
                <div className="flex flex-1 flex-col gap-4">
                  <h3 className="text-2xl font-semibold tracking-tight">{renderWithLineBreaks(item.title)}</h3>
                  {item.subTitle ? (
                    <span className="inline-flex w-fit rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white/80">
                      {renderWithLineBreaks(item.subTitle)}
                    </span>
                  ) : null}
                  <p className="text-sm leading-7 text-white/75">{renderWithLineBreaks(item.description)}</p>
                </div>
                {item.learnMoreButton ? (
                  <a
                    href={resolveHref(locale, item.learnMoreButton.href)}
                    className="inline-flex w-fit items-center text-sm font-semibold text-white hover:text-white/80"
                    {...maybeOpenInNewTab(item.learnMoreButton.href, item.learnMoreButton.external)}
                  >
                    {item.learnMoreButton.label}
                  </a>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      </section>
    ),

    Integrations: ({
      allLabel,
      basePath,
      categories,
      products,
    }: {
      allLabel: string;
      basePath?: string;
      categories: Array<{ id: string; label: string }>;
      products: Array<{ categoryIds: string[]; label: string; svgFilename: string }>;
    }) => {
      const resolvedBasePath = resolveHref(locale, basePath ?? "/") ?? "/";
      const visibleProducts = products
        .filter((product) => currentCategory === "all" || product.categoryIds.includes(currentCategory))
        .sort((a, b) => a.label.localeCompare(b.label));

      return (
        <div className="flex flex-col gap-8">
          <ul className="flex flex-wrap gap-3">
            <li>
              <a
                href={`${resolvedBasePath}?category=all`}
                className={joinClasses(
                  "inline-flex rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                  currentCategory === "all"
                    ? "border-[#111827] bg-[#111827] text-white"
                    : "border-black/10 bg-white text-[#111827] hover:border-black/20 hover:bg-black/[0.03]",
                )}
              >
                {allLabel} ({products.length})
              </a>
            </li>
            {categories.map((category) => {
              const count = products.filter((product) => product.categoryIds.includes(category.id)).length;
              return (
                <li key={category.id}>
                  <a
                    href={`${resolvedBasePath}?category=${category.id}`}
                    className={joinClasses(
                      "inline-flex rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                      currentCategory === category.id
                        ? "border-[#111827] bg-[#111827] text-white"
                        : "border-black/10 bg-white text-[#111827] hover:border-black/20 hover:bg-black/[0.03]",
                    )}
                  >
                    {category.label} ({count})
                  </a>
                </li>
              );
            })}
          </ul>
          <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {visibleProducts.map((product) => (
              <li key={product.label} className="flex min-h-[148px] flex-col items-center justify-center gap-4 rounded-3xl border border-black/10 bg-white px-5 py-6 text-center shadow-sm">
                <img
                  alt={product.label}
                  src={`/integration-icon/${product.svgFilename}.svg`}
                  className="h-16 w-16 object-contain"
                />
                <span className="text-sm font-medium leading-6 text-[#111827]">{product.label}</span>
              </li>
            ))}
          </ul>
        </div>
      );
    },

    KeyFeature: ({
      description,
      iconFilepath,
      label,
    }: {
      description: string;
      iconFilepath: string;
      label: string;
    }) => (
      <li className="flex h-full flex-col gap-4 rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
        <img alt={label} src={toPublicSrc(iconFilepath)} className="h-10 w-10" />
        <h4 className="text-lg font-semibold text-[#111827]">{renderWithLineBreaks(label)}</h4>
        <p className="text-sm leading-7 text-[#4b5563]">{renderWithLineBreaks(description)}</p>
      </li>
    ),

    ThreeColumnList: ({ children }: { children?: ReactNode }) => (
      <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">{children}</ul>
    ),

    DarkBadge: ({ children }: { children?: ReactNode }) => (
      <span className="inline-flex rounded-full bg-[#111827] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
        {children}
      </span>
    ),

    LottiePlayer: ({ children }: { children?: ReactNode }) => <>{children}</>,

    LearnMoreLink: ({
      children,
      external,
      href,
      style,
    }: {
      children?: ReactNode;
      external?: boolean;
      href: string;
      style?: CSSProperties;
    }) => (
      <a
        href={resolveHref(locale, href)}
        style={style}
        className="inline-flex items-center text-sm font-semibold text-[#2563eb] hover:text-[#1d4ed8]"
        {...maybeOpenInNewTab(href, external)}
      >
        {children}
      </a>
    ),

    Link: ({
      children,
      external,
      href,
    }: {
      children?: ReactNode;
      external?: boolean;
      href?: string;
    }) => (
      <a
        href={resolveHref(locale, href)}
        className="font-medium text-[#2563eb] underline underline-offset-4 hover:text-[#1d4ed8]"
        {...maybeOpenInNewTab(href, external)}
      >
        {children}
      </a>
    ),

    SplitView,

    KillerFeatureCategory: KillerFeatureCategoryMarker,
    KillerFeature: KillerFeatureMarker,

    KillerFeatures: ({
      children,
      title,
    }: {
      children?: ReactNode;
      title: string;
    }) => {
      const categories = Children.toArray(children).flatMap((child) => {
        if (!isValidElement(child) || child.type !== KillerFeatureCategoryMarker) {
          return [];
        }

        const categoryProps = child.props as MarkerCategoryProps;
        const features = Children.toArray(categoryProps.children).flatMap((featureChild) => {
          if (!isValidElement(featureChild) || featureChild.type !== KillerFeatureMarker) {
            return [];
          }

          const featureProps = featureChild.props as MarkerFeatureProps;
          return [featureProps];
        });

        return features.length > 0
          ? [
              {
                label: categoryProps.label,
                features,
              },
            ]
          : [];
      });

      if (categories.length === 0) return null;

      return (
        <section className="bg-[#f7f8fa]">
          <div className="mx-auto flex max-w-[1200px] flex-col gap-10 px-6 py-16 md:px-10 md:py-20">
            <h2 className="text-3xl font-semibold tracking-tight text-[#111827] md:text-4xl">
              {renderWithLineBreaks(title)}
            </h2>
            <div className="flex flex-col gap-12">
              {categories.map((category) => (
                <section key={category.label} className="flex flex-col gap-5">
                  <h3 className="text-xl font-semibold text-[#111827] md:text-2xl">{category.label}</h3>
                  <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                    {category.features.map((feature) => (
                      <article
                        key={`${category.label}-${feature.title}`}
                        className="flex h-full flex-col gap-5 overflow-hidden rounded-3xl border border-black/10 bg-white p-6 shadow-sm"
                      >
                        <img alt={feature.title} src={toPublicSrc(feature.image)} className="h-auto w-full rounded-2xl" />
                        <div className="flex flex-1 flex-col gap-4">
                          <h4 className="text-2xl font-semibold tracking-tight text-[#111827]">
                            {renderWithLineBreaks(feature.title)}
                          </h4>
                          <p className="text-base leading-7 text-[#4b5563]">
                            {renderWithLineBreaks(feature.description)}
                          </p>
                        </div>
                        {feature.children ? <div className="pt-1">{feature.children}</div> : null}
                      </article>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </section>
      );
    },

    p: ({ children }: { children?: ReactNode }) => (
      <p className="text-base leading-7 text-[#4b5563]">{children}</p>
    ),
  };
}
