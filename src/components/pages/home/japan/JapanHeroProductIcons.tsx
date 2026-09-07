import Image from "next/image";

const productIcons = [
  { alt: "AIP", src: "/assets/pages/home/features/icon-aip.png" },
  { alt: "ACP", src: "/assets/pages/home/features/icon-acp.png" },
  { alt: "Lingo", iconSurface: true, src: "/assets/pages/home/features/icon-lingo.png" },
  { alt: "NotePie", iconSurface: true, src: "/assets/pages/home/features/icon-notepie.png" },
] as const;

function cx(...values: Array<string | false | undefined>) {
  return values.filter(Boolean).join(" ");
}

export default function JapanHeroProductIcons() {
  return (
    <ul aria-label="QueryPie AI製品" className="m-0 hidden shrink-0 list-none items-center gap-3 p-0 lg:flex">
      {productIcons.map((icon) => (
        <li
          className={cx(
            "overflow-hidden rounded-[14px] bg-bg-content",
            "iconSurface" in icon && icon.iconSurface && "home-feature-icon-surface bg-secondary",
          )}
          key={icon.alt}
        >
          <Image
            alt={icon.alt}
            className="block h-10 w-10 object-cover xl:h-12 xl:w-12"
            height={48}
            src={icon.src}
            width={48}
          />
        </li>
      ))}
    </ul>
  );
}
