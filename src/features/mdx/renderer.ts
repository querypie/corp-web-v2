import { evaluate } from "next-mdx-remote-client/rsc";
import remarkGfm from "remark-gfm";
import type { MDXComponents } from "mdx/types";
import type { MdxFrontmatter } from "./types";

export async function renderMdx(source: string, components: MDXComponents) {
  return evaluate<MdxFrontmatter>({
    source,
    components,
    options: {
      parseFrontmatter: true,
      mdxOptions: { remarkPlugins: [remarkGfm] },
    },
  });
}
