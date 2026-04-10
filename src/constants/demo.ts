export type DemoListItem = {
  category: string;
  href: string;
  imageSrc: string;
  title: string;
};

export const demoItems: DemoListItem[] = [
  {
    category: "Demo",
    href: "/features/demo",
    imageSrc: "/images/common/fallback-contents.jpg",
    title: "Sample demo item",
  },
];
