import path from "path";
import { promises as fs } from "fs";
import type { Locale } from "@/constants/i18n";

const SOLUTIONS_ROOT = path.join(process.cwd(), "src", "content", "solutions");

export type SolutionMeta = {
  title: string;
  description: string;
  keywords?: string[];
};

function isMissingFileError(error: unknown): error is NodeJS.ErrnoException {
  return error instanceof Error && "code" in error && (error as NodeJS.ErrnoException).code === "ENOENT";
}

async function readLocaleFile(
  slug: string,
  locale: Locale,
  filename: string,
): Promise<string | null> {
  const primaryPath = path.join(SOLUTIONS_ROOT, slug, locale, filename);

  try {
    return await fs.readFile(primaryPath, "utf-8");
  } catch (error) {
    if (!isMissingFileError(error)) {
      throw error;
    }

    if (locale === "en") return null;
    const fallbackPath = path.join(SOLUTIONS_ROOT, slug, "en", filename);

    try {
      return await fs.readFile(fallbackPath, "utf-8");
    } catch (fallbackError) {
      if (isMissingFileError(fallbackError)) {
        return null;
      }

      throw fallbackError;
    }
  }
}

export async function loadSolutionMdxSource(
  slug: string,
  locale: Locale,
): Promise<string | null> {
  return readLocaleFile(slug, locale, "content.mdx");
}

export async function loadSolutionMeta(
  slug: string,
  locale: Locale,
): Promise<SolutionMeta | null> {
  const raw = await readLocaleFile(slug, locale, "meta.json");
  if (!raw) return null;
  return JSON.parse(raw) as SolutionMeta;
}
