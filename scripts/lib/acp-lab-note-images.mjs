export function getLabNoteThumbnailSrc(slug, episode) {
  // The opening essay has no screenshots; use the installation article's admin screen.
  if (episode === 1 || episode === 2) {
    return `/assets/content/acp-lab-notes/community-edition-installation/${episode === 1 ? "14.webp" : "13.webp"}`;
  }
  return `/assets/content/acp-lab-notes/${slug}/01.webp`;
}
