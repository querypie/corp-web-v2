import { promises as fs } from "node:fs";
import path from "node:path";

const root = path.resolve("src/content/resources/acp-lab-notes");
let migrated = 0;
for (const directory of await fs.readdir(root)) {
  const file = path.join(root, directory, "meta.json");
  const meta = JSON.parse(await fs.readFile(file, "utf8"));
  const match = /^(\d+)\s*편(?=\s|[·,|]|$)/.exec(meta.authorName.trim());
  const episode = meta.labNote?.episode ?? (match ? Number(match[1]) : meta.sortOrder);
  const previousTopics = match ? meta.authorName.trim().slice(match[0].length) : meta.authorName;
  const topics = meta.labNote?.topics ?? (previousTopics.trim() ? previousTopics.split(/[·,|]/).map((topic) => topic.trim()).filter(Boolean) : meta.authorRole.split(/[·,|]/).map((topic) => topic.trim()).filter((topic) => topic && !/^ACP Community\b/.test(topic)));
  meta.authorName = topics.join(" · ");
  meta.authorRole = "";
  meta.sortOrder = episode;
  for (const locale of ["ko", "en", "ja"]) {
    if (!meta.title[locale]) continue;
    const prefix = { ko: `[${episode}편]`, en: `[Part ${episode}]`, ja: `[第${episode}回]` }[locale];
    meta.title[locale] = `${prefix} ${meta.title[locale].replace(/^\[(?:\d+편|Part \d+|第\d+回)\]\s*/, "")}`;
  }
  delete meta.labNote;
  await fs.writeFile(file, JSON.stringify(meta, null, 2) + "\n");
  migrated++;
}
console.log({ migrated });
