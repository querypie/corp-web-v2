import { promises as fs } from "fs";
import path from "path";
import type { Locale } from "./i18n";

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
    .filter((fileName) => fileName.endsWith(".html") && !fileName.endsWith(".raw.html"))
    .map((fileName) => fileName.replace(/\.html$/, ""))
    .sort()
    .reverse();
}

export async function getPrivacyPolicyContent(locale: Locale, version: string): Promise<PrivacyPolicyContent> {
  const sourceLocale = getPrivacyPolicySourceLocale(locale);
  const bodyHtml = await fs.readFile(
    path.join(privacyPolicyBaseDir, sourceLocale, `${version}.html`),
    "utf8",
  );

  return {
    bodyHtml,
    title: sourceLocale === "ko" ? "개인정보처리방침" : "Privacy Policy",
  };
}

export async function getPrivacyPolicyVersionOptions(locale: Locale) {
  const versions = await getPrivacyPolicyVersions(locale);

  return versions.map((version, index) => ({
    href: index === 0 ? `/${locale}/privacy-policy` : `/${locale}/privacy-policy/${version}`,
    label: version,
    value: version,
  }));
}
