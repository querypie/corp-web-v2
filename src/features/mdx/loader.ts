import path from "path";
import { promises as fs } from "fs";
import type { Locale } from "@/constants/i18n";
import type { MdxCategory } from "./types";

const MDX_ROOT = path.join(process.cwd(), "src", "content", "mdx");

function getMdxCategoryDirectory(category: MdxCategory) {
  return category === "white-paper" ? "white-papers" : category;
}

export async function loadMdxSource(
  category: MdxCategory,
  slug: string,
  locale: Locale,
): Promise<string | null> {
  const primaryPath = path.join(MDX_ROOT, getMdxCategoryDirectory(category), slug, `${locale}.mdx`);
  try {
    return await fs.readFile(primaryPath, "utf-8");
  } catch {
    if (locale === "en") return null;
    const fallbackPath = path.join(MDX_ROOT, getMdxCategoryDirectory(category), slug, "en.mdx");
    return fs.readFile(fallbackPath, "utf-8").catch(() => null);
  }
}
