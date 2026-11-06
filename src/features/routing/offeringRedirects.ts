import { offeringEntries } from "../../constants/offerings";

/** Exact legacy routes avoid swallowing unrelated content and go directly to the canonical path. */
export const offeringRedirects = offeringEntries.flatMap(entry => entry.legacyPaths.flatMap(source => [
  { source, destination: entry.path, permanent: true },
  { source: `/:locale(en|ko|ja)${source}`, destination: `/:locale${entry.path}`, permanent: true },
]));
