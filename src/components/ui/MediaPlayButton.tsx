type MediaPlayButtonProps = {
  className?: string;
};

function cx(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

export default function MediaPlayButton({ className }: MediaPlayButtonProps) {
  return (
    <span className={cx("absolute inset-0 flex items-center justify-center", className)} aria-hidden="true">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-black/25 backdrop-blur-sm transition duration-200 group-hover:scale-[1.04] group-hover:bg-black/35 md:h-16 md:w-16">
        <span className="ml-1 h-0 w-0 border-y-[8px] border-l-[14px] border-y-transparent border-l-white md:border-y-[10px] md:border-l-[17px]" />
      </span>
    </span>
  );
}
