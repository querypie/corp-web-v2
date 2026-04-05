import Button from "../../common/Button";

type HomePageHeroProps = {
  activeVideoIndex: number;
  heroHeadingMuted: string;
  heroHeadingPrimary: string;
  locale: string;
  onSelectVideo: (index: number) => void;
};

function cx(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

export default function HomePageHero({
  activeVideoIndex,
  heroHeadingMuted,
  heroHeadingPrimary,
  locale,
  onSelectVideo,
}: HomePageHeroProps) {
  const heroVideos = [1, 2, 3, 4] as const;

  return (
    <section className="relative overflow-hidden bg-transparent text-fg">
      <div className="relative flex w-full justify-center px-5 pb-5 pt-[120px] sm:pb-6 md:px-10 md:pb-8 md:pt-[160px] xl:pb-[36px]">
        <div className="flex w-full max-w-[1200px] flex-col items-start gap-6 sm:gap-8 md:gap-10 xl:gap-12">
          <div className="w-full">
            <div className="mx-auto mb-2 flex w-full max-w-[1000px] flex-col items-start gap-4 sm:gap-5">
                <div className="w-full">
                  <p className="m-0 type-h1 text-bg">AI That Gets How You Work</p>
                  <p className="mt-[10px] m-0 type-body-md text-bg">
                    QueryPie AI is here to help you achieve successful AI transformation in your life and business.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <a href={`/${locale}/contact-us`}>
                    <Button size="default" style="full" variant="primary">
                      Experience it now
                    </Button>
                  </a>
                  <div className="flex items-center gap-2">
                    {heroVideos.map((video, index) => {
                      const isActive = index === activeVideoIndex;
                      return (
                        <button
                          key={video}
                          aria-label={`Switch background video to ${video}`}
                          aria-pressed={isActive}
                          className={cx(
                            "inline-flex h-7 w-7 items-center justify-center bg-transparent p-0 type-body-md transition-colors",
                            isActive
                              ? "text-bg/45"
                              : "text-bg/45 hover:text-bg/70",
                          )}
                          onClick={() => onSelectVideo(index)}
                          type="button"
                        >
                          {video}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex w-full justify-center md:-mt-1 xl:-mt-2">
            <div className="relative w-full max-w-[1000px] aspect-[1000/660]">
                <img
                  alt="QueryPie AI workspace preview"
                  className="absolute inset-0 block h-full w-full object-cover"
                  src="/images/home/hero/home-hero.png"
                />
              </div>
            </div>
          </div>
        </div>
    </section>
  );
}
