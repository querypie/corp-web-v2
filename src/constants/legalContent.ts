import { promises as fs } from "fs";
import path from "path";
import { renderLegalMarkdownFile } from "@/features/legal/legalMarkdown.server";
import type { Locale } from "./i18n";

type LegalMarkdownContent = {
  bodyHtml: string;
  title: string;
};

const legalContentBaseDir = path.join(process.cwd(), "src/content/legal");

export async function getTermsOfServiceContent(locale: Locale): Promise<LegalMarkdownContent> {
  const sourceLocale = await getLegalMarkdownSourceLocale("terms-of-service", locale);

  return {
    bodyHtml: await renderLegalMarkdownFile(path.join(legalContentBaseDir, "terms-of-service", sourceLocale, "index.md")),
    title: sourceLocale === "ko" ? "서비스 이용약관" : "Terms of Service",
  };
}

export async function getEulaContent(locale: Locale): Promise<LegalMarkdownContent> {
  const sourceLocale = await getLegalMarkdownSourceLocale("eula", locale);

  return {
    bodyHtml: await renderLegalMarkdownFile(path.join(legalContentBaseDir, "eula", sourceLocale, "index.md")),
    title: "EULA",
  };
}

async function getLegalMarkdownSourceLocale(documentSlug: string, locale: Locale) {
  try {
    await fs.access(path.join(legalContentBaseDir, documentSlug, locale, "index.md"));
    return locale;
  } catch (error) {
    if (isFileReadError(error)) {
      return "en";
    }

    throw error;
  }
}

function isFileReadError(error: unknown) {
  return (
    typeof error === "object"
    && error !== null
    && "code" in error
    && (error.code === "ENOENT" || error.code === "ENOTDIR")
  );
}
