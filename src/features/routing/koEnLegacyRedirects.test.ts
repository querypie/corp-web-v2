import { describe, expect, it } from "vitest";
import nextConfig from "../../../next.config";

async function getRedirects() {
  if (!nextConfig.redirects) {
    throw new Error("next.config redirects are not configured");
  }

  return nextConfig.redirects();
}

describe("Korean and English legacy content redirects", () => {
  it("routes localized legacy detail URLs directly to ID-less canonical pages", async () => {
    const redirects = await getRedirects();

    expect(redirects).toContainEqual({
      source: "/:locale(en|ko)/:legacyRoot(features|resources)/:legacySection(documentation|discover)/white-paper/:legacyId/:legacySlug",
      destination: "/:locale/whitepapers/:legacySlug",
      permanent: true,
    });
    expect(redirects).toContainEqual({
      source: "/:locale(en|ko)/:legacyRoot(features|resources)/:legacySection(documentation|discover)/blog/:legacyId/:legacySlug",
      destination: "/:locale/blog/:legacySlug",
      permanent: true,
    });
  });

  it("uses the existing explicit-English redirect as the first hop for unprefixed URLs", async () => {
    const redirects = await getRedirects();

    expect(redirects).toContainEqual(expect.objectContaining({
      destination: "/en/:path",
      permanent: true,
    }));
  });

  it("keeps known slug aliases and cross-family moves ahead of generic ID mappings", async () => {
    const redirects = await getRedirects();
    const aliasSource = "/:locale(en|ko)/:legacyRoot(features|resources)/:legacySection(documentation|discover)/white-paper/17/mcp-security-threats";
    const genericSource = "/:locale(en|ko)/:legacyRoot(features|resources)/:legacySection(documentation|discover)/white-paper/:legacyId/:legacySlug";

    expect(redirects).toContainEqual({
      source: aliasSource,
      destination: "/:locale/whitepapers/uncovering-mcp-security",
      permanent: true,
    });
    expect(redirects).toContainEqual({
      source: "/:locale(en|ko)/:legacyRoot(features|resources)/:legacySection(documentation|discover)/white-paper/2/shell-native-command-control",
      destination: "/:locale/whitepapers/shell-native-command-control-ssh-proxy-architecture",
      permanent: true,
    });
    expect(redirects).toContainEqual({
      source: "/:locale(en|ko)/:legacyRoot(features|resources)/:legacySection(documentation|discover)/blog/23/:legacySlug",
      destination: "/:locale/news/payroll-partners-with-querypie-on-ai-security-solutions",
      permanent: true,
    });
    expect(redirects.findIndex((redirect) => redirect.source === aliasSource)).toBeLessThan(
      redirects.findIndex((redirect) => redirect.source === genericSource),
    );
  });

  it("keeps legacy content recovery ahead of generic legacy-folder and bare-locale rules", async () => {
    const redirects = await getRedirects();
    const localizedRecoveryIndex = redirects.findIndex(
      (redirect) => redirect.source === "/:locale(en|ko)/:legacyRoot(features|resources)/:legacySection(documentation|discover)/blog/:legacyId/:legacySlug",
    );
    const genericLegacyIndex = redirects.findIndex(
      (redirect) => redirect.source === "/:locale(en|ko|ja)/blog/:legacyFolder/:slug",
    );
    const bareLocaleIndex = redirects.findIndex((redirect) => redirect.destination === "/en/:path");

    expect(localizedRecoveryIndex).toBeGreaterThanOrEqual(0);
    expect(localizedRecoveryIndex).toBeLessThan(genericLegacyIndex);
    expect(localizedRecoveryIndex).toBeLessThan(bareLocaleIndex);
    expect(redirects.length).toBeLessThan(1_000);
  });
});
