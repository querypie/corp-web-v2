type ClientSectionProps = {
  caption?: string;
  className?: string;
};

const clientLogos = [
  { alt: "Client logo 01", className: "h-8 md:h-10", src: "/images/home/clients/01.png" },
  { alt: "Client logo 02", className: "h-8 md:h-10", src: "/images/home/clients/02.png" },
  { alt: "Client logo 03", className: "h-8 md:h-10", src: "/images/home/clients/03.png" },
  { alt: "Client logo 04", className: "h-8 md:h-10", src: "/images/home/clients/04.png" },
  { alt: "Client logo 05", className: "h-8 md:h-10", src: "/images/home/clients/05.png" },
  { alt: "Client logo 06", className: "h-8 md:h-10", src: "/images/home/clients/06.png" },
  { alt: "Client logo 07", className: "h-8 md:h-10", src: "/images/home/clients/07.png" },
  { alt: "Client logo 08", className: "h-8 md:h-10", src: "/images/home/clients/08.png" },
] as const;

function cx(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

export default function ClientSection({
  caption = "Trusted every day by teams that build world-class software",
  className,
}: ClientSectionProps) {
  return (
    /* 고객사 로고와 짧은 설명을 보여주는 섹션 */
    <section className={cx("flex w-full flex-col items-center", className)}>
      <div className="flex w-full max-w-[1200px] flex-col items-center gap-5">
        <p className="m-0 w-full text-center type-body-lg text-mute-fg">
          {caption}
        </p>
        {/* 로고를 좌우로 반복 이동시키는 marquee 영역 */}
        <div className="relative h-10 w-full overflow-hidden">
          <div
            className="flex w-max items-center will-change-transform"
            style={{ animation: "marquee 30s linear infinite" }}
          >
            {[0, 1].map((groupIndex) => (
              <div
                key={groupIndex}
                aria-hidden={groupIndex === 1}
                className="flex shrink-0 items-center gap-8 pr-8 md:gap-[60px] md:pr-[60px]"
              >
                {clientLogos.map((logo) => (
                  <img
                    key={`${groupIndex}-${logo.alt}`}
                    alt={logo.alt}
                    className={`${logo.className} block w-auto shrink-0`}
                    src={logo.src}
                  />
                ))}
              </div>
            ))}
          </div>
          {/* 양 끝 fade 처리로 루프 경계가 덜 보이게 함 */}
          <div className="pointer-events-none absolute inset-y-0 right-0 w-[120px] bg-gradient-to-r from-[rgba(8,9,10,0)] to-bg" />
          <div className="pointer-events-none absolute inset-y-0 left-0 w-[120px] bg-gradient-to-r from-bg to-[rgba(8,9,10,0)]" />
        </div>
      </div>
    </section>
  );
}
