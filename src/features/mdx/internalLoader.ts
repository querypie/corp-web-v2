import path from "path";
import { promises as fs } from "fs";
import type { Locale } from "@/constants/i18n";

const INTERNAL_MDX_ROOT = path.join(process.cwd(), "src", "content", "internal");

export async function loadInternalMdxSource(
  segments: string[],
  locale: Locale,
): Promise<string | null> {
  const primaryPath = path.join(INTERNAL_MDX_ROOT, ...segments, `${locale}.mdx`);

  try {
    return await fs.readFile(primaryPath, "utf-8");
  } catch {
    if (locale === "en") return null;

    const fallbackPath = path.join(INTERNAL_MDX_ROOT, ...segments, "en.mdx");
    return fs.readFile(fallbackPath, "utf-8").catch(() => null);
  }
}
