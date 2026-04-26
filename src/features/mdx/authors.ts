import type { Locale } from "@/constants/i18n";
import type { MdxFrontmatter } from "./types";
import enAuthors from "./author-data/en.json";
import koAuthors from "./author-data/ko.json";
import jaAuthors from "./author-data/ja.json";

type AuthorLinkType = "linkedin" | string;

type AuthorLink = {
  type: AuthorLinkType;
  url: string;
};

type AuthorRecord = {
  id: string;
  name: string;
  position?: string;
  description?: string;
  urls?: AuthorLink[];
  profileImage?: string;
};

export type ResolvedArticleAuthor = {
  id: string;
  isRegistered: boolean;
  name: string;
  position?: string;
  description?: string;
  profileImageSrc?: string;
  links: AuthorLink[];
};

const AUTHOR_RECORDS_BY_LOCALE: Record<Locale, AuthorRecord[]> = {
  en: enAuthors,
  ko: koAuthors,
  ja: jaAuthors,
};

const AUTHOR_INTRO_HEADINGS: Record<Locale, string> = {
  en: "About the author",
  ko: "작성자 소개",
  ja: "著者紹介",
};

function toAuthorIds(author: MdxFrontmatter["author"]): string[] {
  if (!author) {
    return [];
  }

  const ids = Array.isArray(author) ? author : [author];

  return ids
    .map((value) => value.trim())
    .filter(Boolean);
}

function normalizeProfileImageSrc(profileImage?: string): string | undefined {
  if (!profileImage) {
    return undefined;
  }

  const normalized = profileImage.replace(/^public\//, "").replace(/^\/+/, "");

  return normalized ? `/${normalized}` : undefined;
}

export function resolveArticleAuthors(author: MdxFrontmatter["author"], locale: Locale): ResolvedArticleAuthor[] {
  const authorsById = new Map(AUTHOR_RECORDS_BY_LOCALE[locale].map((entry) => [entry.id, entry]));

  return toAuthorIds(author).map((id) => {
    const registeredAuthor = authorsById.get(id);

    if (!registeredAuthor) {
      return {
        id,
        isRegistered: false,
        name: id,
        position: undefined,
        description: undefined,
        profileImageSrc: undefined,
        links: [],
      } satisfies ResolvedArticleAuthor;
    }

    return {
      id: registeredAuthor.id,
      isRegistered: true,
      name: registeredAuthor.name,
      position: registeredAuthor.position,
      description: registeredAuthor.description,
      profileImageSrc: normalizeProfileImageSrc(registeredAuthor.profileImage),
      links: registeredAuthor.urls ?? [],
    } satisfies ResolvedArticleAuthor;
  });
}

export function formatResolvedAuthorNames(authors: ResolvedArticleAuthor[]): string | undefined {
  if (authors.length === 0) {
    return undefined;
  }

  return authors.map((author) => author.name).join(", ");
}

export function getDetailedArticleAuthors(authors: ResolvedArticleAuthor[]): ResolvedArticleAuthor[] {
  return authors.filter((author) => author.isRegistered);
}

export function getAuthorIntroHeading(locale: Locale): string {
  return AUTHOR_INTRO_HEADINGS[locale];
}
