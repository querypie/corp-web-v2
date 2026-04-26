export type MdxCategory = "blog" | "white-paper" | "demo";
export type MdxListCategory = Extract<MdxCategory, "blog" | "white-paper">;

export type MdxFrontmatter = {
  layout: "Article";
  category: string;
  title: string;
  description?: string;
  date: string;
  author?: string | string[];
  ogImage?: string;
  keywords?: string[];
  relatedPosts?: string[];
  hideHeroImage?: boolean;
  hideTableOfContents?: boolean;
};

export type MdxHeading = {
  targetId: string;
  text: string;
  list?: MdxHeading[];
};

export type RelatedPost = {
  title: string;
  href: string;
  summary?: string;
  category?: "blog" | "whitepaper" | "external";
};
