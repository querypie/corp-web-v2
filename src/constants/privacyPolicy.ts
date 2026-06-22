import { promises as fs } from "fs";
import path from "path";
import { renderLegalMarkdownFile } from "@/features/legal/legalMarkdown.server";
import { getLocalePath, type Locale } from "./i18n";

type PrivacyPolicySourceLocale = "en" | "ko";

type PrivacyPolicyContent = {
  bodyHtml: string;
  title: string;
};
const privacyPolicyBaseDir = path.join(process.cwd(), "src/content/legal/privacy-policy");

export function getPrivacyPolicySourceLocale(locale: Locale): PrivacyPolicySourceLocale {
  return locale === "ko" ? "ko" : "en";
}

export async function getPrivacyPolicyVersions(locale: Locale) {
  const sourceLocale = getPrivacyPolicySourceLocale(locale);
  const dir = path.join(privacyPolicyBaseDir, sourceLocale);
  const files = await fs.readdir(dir);

  return files
    .filter((fileName) => fileName.endsWith(".md"))
    .map((fileName) => fileName.replace(/\.md$/, ""))
    .sort()
    .reverse();
}

export async function getPrivacyPolicyContent(locale: Locale, version: string): Promise<PrivacyPolicyContent> {
  const sourceLocale = getPrivacyPolicySourceLocale(locale);
  const bodyHtml = await renderLegalMarkdownFile(path.join(privacyPolicyBaseDir, sourceLocale, `${toFullPrivacyPolicyVersion(version)}.md`));

  return {
    bodyHtml,
    title: sourceLocale === "ko" ? "개인정보처리방침" : "Privacy Policy",
  };
}

export async function getPrivacyPolicyVersionOptions(locale: Locale) {
  const versions = await getPrivacyPolicyVersions(locale);

  return versions.map((version) => ({
    href: getLocalePath(locale, `/privacy-policy/${version}`),
    label: version,
    value: version,
  }));
}

export function toFullPrivacyPolicyVersion(version: string) {
  return version.replace(/^(\d{2})-(\d{2})-(\d{2})$/, "20$1-$2-$3");
}
